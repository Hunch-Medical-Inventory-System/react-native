import { createClient, PostgrestSingleResponse } from "@supabase/supabase-js";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type {
  DataFetchOptions,
  PersonalTableMapping,
  ExpirableTableMapping,
  DeletableTableMapping,
  PersonalEntityState,
  ExpirableEntityState,
  EntityState,
} from "@/types/tables";

// Load environment variables
import Constants from "expo-constants";
import type { ExtraConfig } from "@/types";

const config = Constants.expoConfig?.extra as ExtraConfig;
const supabaseURL = config.SUPABASE_URL;
const supabaseAnonKey = config.SUPABASE_ANON_KEY;


if (!supabaseURL || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided");
}

// Class to centralize functions dealing with supabase database
class SupabaseController {
  public client: SupabaseClient;
  private static instance: SupabaseController | null = null;
  public isAuthenticated: boolean = false;
  public userId: User["id"] | null = null;

  constructor(apiKey: string, supabaseUrl: string) {
    this.client = createClient(apiKey as string, supabaseUrl as string);
    this.checkSession().then((isAuthenticated) => {
      if (isAuthenticated) {
        this.getUserId();
      }
    });
  }

  private checkSession = async () => {
    const { data: { session } } = await this.client.auth.getSession();
    this.isAuthenticated = !!session;
    return this.isAuthenticated;
  };

  private getUserId = async (): Promise<User["id"] | null> => {
    try {
      const { data: { session }, error: sessionError } = await this.client.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError.message);
        this.userId = null;
        return null;
      }

      if (!session) {
        console.warn("No active session found.");
        this.userId = null;
        return null;
      }

      const { data: { user }, error: userError } = await this.client.auth.getUser();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        this.userId = null;
        return null;
      }

      this.userId = user ? user.id : null;
      return this.userId;
    } catch (error: any) {
      console.error("Unexpected error fetching user:", error.message);
      this.userId = null;
      return null;
    }
  };

  public reCheckAuth = async () => {
    await this.checkSession();
    await this.getUserId();
  };

  /**
   * Handles the response from a Supabase query.
   *
   * @template T - The type of the data expected in the response.
   * @param {PostgrestSingleResponse<T[]>} response - The response object from Supabase.
   * @returns {Promise<{ data: T[]; count: number }>} A promise that resolves to an object containing the data and count.
   * @throws {Error} If there is an error in the response, it logs the error and throws an exception.
   */
  private handleResponse = async <T>(
    response: PostgrestSingleResponse<T[]>
  ): Promise<{ data: T[]; count: number }> => {
    if (response.error) {
      console.error("Supabase Error:", response.error.message);
      throw new Error(response.error.message);
    }
    return {
      data: response.data || [],
      count: response.count || 0,
    };
  };

  /**
   * Reads rows from a specified table in the database.
   *
   * @template T - The key of the Deletable Table Mapping.
   * @param {T} table - The name of the table to read from.
   * @param {string} seperator - The column name to filter by.
   * @param {Array<any>} seperatorValue - The value to filter the column by.
   * @param {Array<string | keyof DeletableTableMapping[T]>} [columns=["*"]] - The columns to select from the table. Defaults to all columns.
   * @returns {Promise<Partial<DeletableTableMapping[T]>[]>} A promise that resolves to an array of partial rows from the table.
   * @throws Will throw an error if the database query fails.
   */
  public readRowsFromTable = async <T extends keyof DeletableTableMapping>(
    table: T,
    seperator: string,
    seperatorValue: Array<any>,
    columns: Array<string | keyof DeletableTableMapping[T]> = ["*"] as const
  ): Promise<Partial<DeletableTableMapping[T]>[]> => {
    try {
      const response = await this.client
        .from(table)
        .select(columns.join(","))
        .eq(seperator, seperatorValue.join(","));
      if (response.error || !response.data) {
        throw new Error(response.error?.message ?? "Unknown error");
      }
      return response.data as unknown as Partial<DeletableTableMapping[T]>[];
    } catch (error: any) {
      console.error(`Error fetching row from ${table}:`, error.message);
      return [];
    }
  };

  /**
   * Fetches deleted data from a specified table with pagination and filtering options.
   *
   * @template T - The type of the table name.
   * @param {T} table - The name of the table to fetch data from.
   * @param {DataFetchOptions} options - The options for data fetching, including pagination.
   * @param {Array<string | keyof DeletableTableMapping[T]>} [columns=["*"]] - The columns to select.
   * @param {(query: any) => any} filters - A function to apply filters to the query.
   * @returns {Promise<{ data: any[]; count: number }>} A promise that resolves to an object containing the fetched data and the total count.
   * @throws Will throw an error if the data fetching fails.
   */
  private fetchTableData = async <T extends keyof DeletableTableMapping>(
    table: T,
    options: DataFetchOptions,
    columns: Array<string | keyof DeletableTableMapping[T]> = ["*"] as const,
    filters: (query: any) => any = () => {}
  ): Promise<{ data: any[]; count: number }> => {
    const startRange = options.itemsPerPage * (options.page - 1);
    const endRange = options.itemsPerPage * options.page - 1;

    try {
      const query = this.client
        .from<T, any>(table)
        .select(columns.join(","), { count: "exact" })
        .eq("is_deleted", false);
      filters(query);
      const response = await query
        .order("id", { ascending: true })
        .range(startRange, endRange);
      return this.handleResponse(response);
    } catch (error: any) {
      console.error(`Error fetching data from ${table}:`, error.message);
      throw error;
    }
  };

  public readPersonalDataFromTable = async <
    T extends keyof PersonalTableMapping
  >(
    table: T,
    options: DataFetchOptions,
    columns: Array<string | keyof PersonalTableMapping[T]> = ["*"] as const
  ): Promise<PersonalEntityState<PersonalTableMapping[T]>> => {
    const data: PersonalEntityState<PersonalTableMapping[T]> = {
      loading: true,
      error: null,
      active: { data: [], count: 0 },
      personal: { data: [], count: 0 },
    };

    const userId = await this.getUserId();
    if (!userId) {
      console.error("Invalid userId:", userId);
      return data;
    }

    try {

      data.active = await this.fetchTableData(table, options, columns);

      data.personal = await this.fetchTableData(
        table,
        options,
        columns,
        async (query) => query.eq("user_id", userId)
      );
    } catch (error: any) {
      data.error = error.message || "An error occurred";
    } finally {
      data.loading = false;
      return data;
    }
  };

  /**
   * Reads expirable data from a specified table and categorizes it into current, deleted, and expired data.
   *
   * @template T - The type of the table, which extends the keys of ExpirableTableMapping.
   * @param {T} table - The name of the table to read data from.
   * @param {DataFetchOptions} options - The options for fetching data.
   * @param {Array<string | keyof ExpirableTableMapping[T]>} [columns=["*"]] - The columns to select.
   * @returns {Promise<EntityState<ExpirableTableMapping[T]>>} - A promise that resolves to an EntityState object containing the categorized data.
   *
   * The returned EntityState object has the following structure:
   * - loading: A boolean indicating if the data is still being loaded.
   * - error: An error message if an error occurred, otherwise null.
   * - current: An object containing the current data and its count.
   * - deleted: An object containing the deleted data and its count.
   * - expired: An object containing the expired data and its count.
   *
   * The function fetches data in three categories:
   * - Current data: Records where `user_id` is null and `expiry_date` is greater than or equal to the current date.
   * - Deleted data: Records where `user_id` is not null.
   * - Expired data: Records where `user_id` is null and `expiry_date` is less than the current date.
   *
   * If an error occurs during data fetching, the error message is set in the `error` property of the returned EntityState object.
   * The `loading` property is set to false once the data fetching is complete, regardless of success or failure.
   */
  public readExpirableDataFromTable = async <
    T extends keyof ExpirableTableMapping
  >(
    table: T,
    options: DataFetchOptions,
    columns: Array<string | keyof ExpirableTableMapping[T]> = ["*"] as const
  ): Promise<ExpirableEntityState<ExpirableTableMapping[T]>> => {
    const data: ExpirableEntityState<ExpirableTableMapping[T]> = {
      loading: true,
      error: null,
      active: { data: [], count: 0 },
      expired: { data: [], count: 0 },
    };

    try {
      data.active = await this.fetchTableData(
        table,
        options,
        columns,
        (query) => query.gte("expiry_date", new Date().toISOString())
      );

      data.expired = await this.fetchTableData(
        table,
        options,
        columns,
        (query) => query.lt("expiry_date", new Date().toISOString())
      );
    } catch (error: any) {
      data.error = error.message || "An error occurred";
    } finally {
      data.loading = false;
      return data;
    }
  };

  /**
   * Reads data from a specified table and returns the data in an EntityState format.
   *
   * @template T - The key of the DeletableTableMapping which represents the table name.
   * @param {T} table - The name of the table to read data from.
   * @param {DataFetchOptions} options - The options to use when fetching data from the table.
   * @param {Array<string | keyof DeletableTableMapping[T]>} [columns=["*"]] - The columns to select.
   * @returns {Promise<EntityState<DeletableTableMapping[T]>>} - A promise that resolves to an EntityState object containing the fetched data.
   *
   * The returned EntityState object has the following structure:
   * - loading: A boolean indicating if the data is still being loaded.
   * - error: An error message if an error occurred, otherwise null.
   * - current: An object containing the fetched data and its count.
   *
   * If an error occurs during data fetching, the error message is set in the `error` property of the returned EntityState object.
   * The `loading` property is set to false once the data fetching is complete, regardless of success or failure.
   */
  public readDataFromTable = async <T extends keyof DeletableTableMapping>(
    table: T,
    options: DataFetchOptions,
    columns: Array<string | keyof DeletableTableMapping[T]> = ["*"] as const
  ): Promise<EntityState<DeletableTableMapping[T]>> => {
    const data: EntityState<DeletableTableMapping[T]> = {
      loading: true,
      error: null,
      active: { data: [], count: 0 },
    };

    try {
      data.active = await this.fetchTableData(table, options, columns);
    } catch (error: any) {
      data.error = error.message || "An error occurred";
    } finally {
      data.loading = false;
      return data;
    }
  };

  /**
   * Adds a new row to the specified table in the database.
   *
   * @template T - The key of the table in the DeletableTableMapping.
   * @param {T} table - The name of the table to insert the data into.
   * @param {Partial<DeletableTableMapping[T]>} data - The data to be inserted into the table. It should be a partial object of the table's type.
   * @returns {Promise<number | string>} - A promise that resolves to either the id of the inserted record (number) or an error message (string).
   *
   * @throws {Error} - Throws an error if the insertion fails or no data is returned from the insert operation.
   */
  public AddRowInTable = async <T extends keyof DeletableTableMapping>(
    table: T,
    data: Partial<DeletableTableMapping[T]>
  ): Promise<number | string> => {
    // Promise will resolve to either number (id) or string (error message)
    try {
      const response = await this.client
        .from(table)
        .insert(data)
        .select()
        .single(); // .select() to fetch inserted data

      if (response.error) {
        throw new Error(response.error.message); // If there is an error, throw it
      }

      const insertedRecord = response.data
        ? (response.data as { id: number })
        : null; // Get the inserted record
      if (!insertedRecord) {
        throw new Error("No data returned from insert operation");
      }

      return insertedRecord.id; // Return the id of the inserted record
    } catch (error: any) {
      console.error(`Error adding data to ${table}:`, error.message);
      return error.message; // Return the error message if the insertion fails
    }
  };

  /**
   * Updates a row in the specified table with the given data.
   *
   * @template T - The type of the table, which must be a key of DeletableTableMapping.
   * @param {T} table - The name of the table to update.
   * @param {Partial<DeletableTableMapping[T]>} data - The data to update the row with.
   * @returns {Promise<boolean>} - A promise that resolves to true if the update was successful, or false if there was an error.
   *
   * @throws {Error} - Throws an error if the update operation fails.
   */
  public updateRowInTable = async <T extends keyof DeletableTableMapping>(
    table: T,
    data: Partial<DeletableTableMapping[T]>
  ): Promise<boolean> => {
    try {
      const response = await this.client
        .from(table)
        .update(data)
        .eq("id", data.id);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return true;
    } catch (error: any) {
      console.error(`Error updating row in ${table}:`, error.message);
      return false;
    }
  };

  /**
   * Upserts a row in the specified table with the given data.
   *
   * @template T - The type of the table, which must be a key of DeletableTableMapping.
   * @param {T} table - The name of the table to upsert.
   * @param {Partial<DeletableTableMapping[T]>} data - The data to upsert the row with.
   * @returns {Promise<boolean>} - A promise that resolves to true if the upsert was successful, or false if there was an error.
   *
   * @throws {Error} - Throws an error if the upsert operation fails.
   */
  public upsertRowInTable = async <T extends keyof DeletableTableMapping>(
    table: T,
    data: Partial<DeletableTableMapping[T]>
  ): Promise<boolean> => {
    try {
      const response = await this.client
        .from(table)
        .upsert(data)
        .eq("id", data.id);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return true;
    } catch (error: any) {
      console.error(`Error updating row in ${table}:`, error.message);
      return false;
    }
  };

  /**
   * Deletes a row in the specified table by marking it as deleted.
   *
   * @template T - The type of the table, which extends the keys of DeletableTableMapping.
   * @param {T} table - The name of the table from which the row should be deleted.
   * @param {number} id - The ID of the row to be deleted.
   * @returns {Promise<boolean>} - A promise that resolves to true if the row was successfully marked as deleted, or false if an error occurred.
   *
   * @throws {Error} - Throws an error if the deletion operation fails.
   */
  public deleteRowInTable = async <T extends keyof DeletableTableMapping>(
    table: T,
    id: number
  ): Promise<boolean> => {
    try {
      const response = await this.client
        .from(table)
        .update({ is_deleted: true })
        .eq("id", id);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return true;
    } catch (error: any) {
      console.error(`Error deleting row in ${table}:`, error.message);
      return false;
    }
  };

  /**
   * Calls the `take_inventory` RPC function, which updates the quantity of an inventory item.
   * @param quantityDiff The difference to apply to the quantity of the inventory item.
   * @param inventoryId The ID of the inventory item to update.
   * @returns `true` if the RPC call was successful, `false` if an error occurred.
   * @throws An error if the RPC call fails.
   */
  public takeInventory = async (
    quantityDiff: number,
    inventoryId: number,
  ): Promise<boolean> => {
    try {
      const { data, error } = await this.client.rpc("take_inventory", {
        p_inventory_id: inventoryId,
        p_quantity: quantityDiff,
        p_user_id: await this.getUserId(),
      });

      if (error || !data) {
        throw new Error(error?.message ?? "Unknown error");
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Sends a message to the Gemini function and returns the response data.
   *
   * @param {string} message - The message to be sent to the Gemini function.
   * @returns {Promise<any>} - A promise that resolves to the response data from the Gemini function, or false if an error occurs.
   * @throws {Error} - Throws an error if the invocation of the Gemini function fails.
   */
  public chatWithGemini = async (message: string): Promise<any> => {
    try {
      console.log("message", message)
      const { data, error } = await this.client.functions.invoke("gemini", {
        method: "POST",  // ✅ Ensure method is explicitly set
        body: { question: message },
      });
  
      if (error) {
        throw new Error(error.message);
      }
  
      return data?.message || data; // ✅ Ensure correct response handling
    } catch (error: any) {
      console.error("Error invoking Gemini function:", error.message);
      return false;
    }
  };
  

  /**
   * Returns a singleton instance of the SupabaseController class.
   *
   * @param {string} supabaseUrl - The URL of the Supabase instance.
   * @param {string} supabaseAnonKey - The anonymous key of the Supabase instance.
   * @returns {SupabaseController} - The singleton instance of the SupabaseController class.
   *
   * The singleton instance is created only once, on the first call to getInstance.
   * Subsequent calls return the same instance.
   */
  public static getInstance(
    supabaseUrl: string,
    supabaseAnonKey: string
  ): SupabaseController {
    if (!SupabaseController.instance) {
      SupabaseController.instance = new SupabaseController(
        supabaseUrl,
        supabaseAnonKey
      );
    }
    return SupabaseController.instance;
  }
}

const supabaseController = SupabaseController.getInstance(
  supabaseURL,
  supabaseAnonKey
);

export default supabaseController;