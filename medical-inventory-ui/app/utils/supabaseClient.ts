import Constants from "expo-constants";
import { createClient, PostgrestSingleResponse } from "@supabase/supabase-js";
import type {
  ExtraConfig,
  DataFetchOptions,
  ExpirableTableMapping,
  DeletableTableMapping,
  TableMapping,
  EntityState,
} from "@/app/utils/types";

const config = Constants.expoConfig?.extra as ExtraConfig;

export const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

const handleResponse = async <T>(
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

const fetchTableData = async <T extends string>(
  table: T,
  options: DataFetchOptions,
  filters: (query: any) => any
): Promise<{ data: any[]; count: number }> => {
  const startRange = options.itemsPerPage * (options.page - 1);
  const endRange = options.itemsPerPage * options.page - 1;

  try {
    const query = supabase.from<T, null>(table).select("*", { count: "exact" });
    filters(query);
    const response = await query
      .order("id", { ascending: true })
      .range(startRange, endRange);
    return handleResponse<T>(response);
  } catch (error: any) {
    console.error(`Error fetching data from ${table}:`, error.message);
    throw error;
  }
};

export const readExpirableDataFromTable = async <
  T extends keyof ExpirableTableMapping
>(
  table: T,
  options: DataFetchOptions
): Promise<EntityState<ExpirableTableMapping[T]>> => {
  const data: EntityState<ExpirableTableMapping[T]> = {
    loading: true,
    error: null,
    current: { data: [], count: 0 },
    deleted: { data: [], count: 0 },
    expired: { data: [], count: 0 },
  };

  try {
    data.current = await fetchTableData(table, options, (query) =>
      query
        .is("crew_member_id", null)
        .gte("expiry_date", new Date().toISOString())
    );

    data.deleted = await fetchTableData(table, options, (query) =>
      query.not("crew_member_id", "is", null)
    );

    data.expired = await fetchTableData(table, options, (query) =>
      query
        .is("crew_member_id", null)
        .lt("expiry_date", new Date().toISOString())
    );
  } catch (error: any) {
    data.error = error.message || "An error occurred";
  } finally {
    data.loading = false;
    return data;
  }
};

export const readDeletableDataFromTable = async <
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
    data.current = await fetchTableData(table, options, () => {});
  } catch (error: any) {
    data.error = error.message || "An error occurred";
  } finally {
    data.loading = false;
    return data;
  }
};

export const readDataFromTable = async <T extends keyof TableMapping>(
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
    data.current = await fetchTableData(table, options, (query) => {
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
