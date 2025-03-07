import Constants from 'expo-constants';
import { createClient, PostgrestSingleResponse } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExtraConfig } from "@/types";
import type {
  DataFetchOptions,
  EntityState,
  ExpirableTableMapping,
  DeletableTableMapping,
  TableMapping,
  InteractionTableMapping,
  ExpirableEntityState
} from "@/types/tables";

// Load environment variables from expo config
const config = Constants.expoConfig?.extra as ExtraConfig;
const supabaseURL = config.SUPABASE_URL;
const supabaseAnonKey = config.SUPABASE_ANON_KEY;

if (!supabaseURL || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided");
}

// C;ass to centralize functions dealing with supabase database
class SupabaseController {
  public client: SupabaseClient;
  private static instance: SupabaseController | null = null;
  public isAuthenticated: boolean = false;

  constructor(apiKey: string, supabaseUrl: string) {
    this.client = createClient(apiKey as string, supabaseUrl as string);
    this.checkSession();
  }

  checkSession = async () => {
    const {
      data: { session },
    } = await this.client.auth.getSession();
    this.isAuthenticated = !!session; // Set authenticated based on session
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
   * Fetches a single row from a specified Supabase table by its ID.
   *
   * @template T - The type of the table name.
   * @param {T} table - The name of the table to fetch from, which must be a key of TableMapping.
   * @param {number} id - The ID of the row to fetch.
   * @returns {Promise<TableMapping[T] | null>} A promise that resolves to the row data of type TableMapping[T] if found, or null if the row does not exist or an error occurs.
   * @throws {Error} If there is an issue with the Supabase request, it logs the error and throws an exception.
   */
  public readRowFromTable = async <T extends keyof TableMapping>(
    table: T,
    id: number
  ): Promise<TableMapping[T] | null> => {
    try {
      const response = await this.client
        .from(table)
        .select("*")
        .eq("id", id)
        .single();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data || null;
    } catch (error: any) {
      console.error(`Error fetching row from ${table}:`, error.message);
      return null;
    }
  };

  /**
   * Fetches data from a specified table with pagination and filtering options.
   *
   * @template T - The type of the table name.
   * @param {T} table - The name of the table to fetch data from.
   * @param {DataFetchOptions} options - The options for data fetching, including pagination.
   * @param {(query: any) => any} filters - A function to apply filters to the query.
   * @returns {Promise<{ data: any[]; count: number }>} A promise that resolves to an object containing the fetched data and the total count.
   * @throws Will throw an error if the data fetching fails.
   */
  private fetchTableData = async <T extends string>(
    table: T,
    options: DataFetchOptions,
    filters: (query: any) => any
  ): Promise<{ data: any[]; count: number }> => {
    const startRange = options.itemsPerPage * (options.page - 1);
    const endRange = options.itemsPerPage * options.page - 1;

    try {
      const query = this.client
        .from<T, any>(table)
        .select("*", { count: "exact" });
      filters(query);
      const response = await query
        .order("id", { ascending: true })
        .range(startRange, endRange);
      return this.handleResponse<T>(response);
    } catch (error: any) {
      console.error(`Error fetching data from ${table}:`, error.message);
      throw error;
    }
  };

  /**
   * Reads expirable data from a specified table and categorizes it into current, deleted, and expired data.
   *
   * @template T - The type of the table, which extends the keys of ExpirableTableMapping.
   * @param {T} table - The name of the table to read data from.
   * @param {DataFetchOptions} options - The options for fetching data.
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
    options: DataFetchOptions
  ): Promise<ExpirableEntityState<ExpirableTableMapping[T]>> => {
    const data: ExpirableEntityState<ExpirableTableMapping[T]> = {
      loading: true,
      error: null,
      current: { data: [], count: 0 },
      personal: { data: [], count: 0 },
      expired: { data: [], count: 0 },
    };

    try {
      data.current = await this.fetchTableData(table, options, (query) =>
        query.is("user_id", null).gte("expiry_date", new Date().toISOString())
      );

      data.personal = await this.fetchTableData(table, options, (query) =>
        query.not("user_id", "is", null)
      );

      data.expired = await this.fetchTableData(table, options, (query) =>
        query.is("user_id", null).lt("expiry_date", new Date().toISOString())
      );
    } catch (error: any) {
      data.error = error.message || "An error occurred";
    } finally {
      data.loading = false;
      return data;
    }
  };

  /**
   * Reads deletable data from a specified table and returns the data in an EntityState format.
   *
   * @template T - The key of the TableMapping which represents the table name.
   * @param {T} table - The name of the table to read data from.
   * @param {DataFetchOptions} options - The options to use when fetching data from the table.
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
  public readDeletableDataFromTable = async <
    T extends keyof DeletableTableMapping
  >(
    table: T,
    options: DataFetchOptions
  ): Promise<EntityState<DeletableTableMapping[T]>> => {
    const data: EntityState<DeletableTableMapping[T]> = {
      loading: true,
      error: null,
      current: { data: [], count: 0 },
    };

    try {
      data.current = await this.fetchTableData(table, options, () => {});
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
   * @template T - The key of the TableMapping which represents the table name.
   * @param {T} table - The name of the table to read data from.
   * @param {DataFetchOptions} options - The options to use when fetching data from the table.
   * @returns {Promise<EntityState<TableMapping[T]>>} - A promise that resolves to an EntityState object containing the fetched data.
   *
   * The returned EntityState object has the following structure:
   * - loading: A boolean indicating if the data is still being loaded.
   * - error: An error message if an error occurred, otherwise null.
   * - current: An object containing the fetched data and its count.
   *
   * If an error occurs during data fetching, the error message is set in the `error` property of the returned EntityState object.
   * The `loading` property is set to false once the data fetching is complete, regardless of success or failure.
   */
  public readDataFromTable = async <T extends keyof TableMapping>(
    table: T,
    options: DataFetchOptions
  ): Promise<EntityState<TableMapping[T]>> => {
    const data: EntityState<TableMapping[T]> = {
      loading: true,
      error: null,
      current: { data: [], count: 0 },
    };

    const hasCrewMemberColumn = [
      "table_with_crew_member_1",
      "table_with_crew_member_2",
    ].includes(table as string);

    try {
      data.current = await this.fetchTableData(table, options, (query) => {
        if (hasCrewMemberColumn) {
          return query.is("crew_member_id", null);
        }
        return query;
      });
    } catch (error: any) {
      data.error = error.message || "An error occurred";
    } finally {
      data.loading = false;
      return data;
    }
  };

  public AddRowInTable = async <T extends keyof TableMapping>(
    table: T,
    data: InteractionTableMapping[T]
  ): Promise<number | string> => {
    // Promise will resolve to either number (id) or string (error message)
    try {
      console.log("Data being inserted:", data);
      const response = await this.client.from(table).insert(data).select(); // .select() to fetch inserted data

      console.log("Insert response:", response);

      if (response.error) {
        throw new Error(response.error.message); // If there is an error, throw it
      }

      const insertedRecord = response.data
        ? (response.data[0] as { id: number })
        : null; // Get the first inserted record
      if (!insertedRecord) {
        throw new Error("No data returned from insert operation");
      }

      return insertedRecord.id; // Return the id of the inserted record
    } catch (error: any) {
      console.error(`Error adding data to ${table}:`, error.message);
      return error.message; // Return the error message if the insertion fails
    }
  };

  public updateRowInTable = async <T extends keyof TableMapping>(
    table: T,
    id: number,
    data: Partial<InteractionTableMapping[T]>
  ): Promise<boolean> => {
    try {
      const response = await this.client.from(table).upsert(data).eq("id", id);

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