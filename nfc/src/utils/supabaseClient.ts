import {createClient, PostgrestResponse, PostgrestSingleResponse} from '@supabase/supabase-js';
import type { DataFetchOptions } from '@/types';
import type {
  ExpirableTableMapping,
  DeletableTableMapping,
  TableMapping,
  EntityState,
} from '@/types/tables'

const url = 'https://xowegfmkiindptpnsscg.supabase.co';
const anon_key = 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvd2VnZm1raWluZHB0cG5zc2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0OTE0MzksImV4cCI6MjA0NDA2NzQzOX0._rrgcRNIZYDMqdQaqEWgrHNvFp4jGkk-dFF4ohxroq0'

export const supabase = createClient(url, anon_key);

export const readExpirableDataFromTable = async <T extends keyof ExpirableTableMapping>(table: T, options: DataFetchOptions) => {
  const data: EntityState<ExpirableTableMapping[T]> = {
    loading: true,
    error: null,
    current: { data: [], count: 0 },
    deleted: { data: [], count: 0 },
    expired: { data: [], count: 0 },
  };

  try {
    const current: PostgrestResponse<ExpirableTableMapping[T]> = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .order("id", { ascending: true })
      .is("crew_member_id", null)
      .gte("expiry_date", new Date().toISOString())
      .range(
        options.itemsPerPage * (options.page - 1),
        options.itemsPerPage * options.page - 1
      )

    const deleted: PostgrestResponse<ExpirableTableMapping[T]>  = await supabase
      .from(table)
      .select('*', {count: 'exact'})
      .order('id', {ascending: true})
      .not('crew_member_id', 'is', null)
      .range(
        options.itemsPerPage * (options.page - 1),
        options.itemsPerPage * options.page - 1,
      );

    const expired: PostgrestResponse<ExpirableTableMapping[T]>  = await supabase
      .from(table)
      .select('*', {count: 'exact'})
      .order('id', {ascending: true})
      .is('crew_member_id', null)
      .lt('expiry_date', new Date().toISOString())
      .range(
        options.itemsPerPage * (options.page - 1),
        options.itemsPerPage * options.page - 1,
      )

    if (current.error) {
      data.error = current.error;
    } else {
      data.current.data = current.data || [];
      data.current.count = current.count || 0;
    }

    if (deleted.error) {
      data.error = deleted.error;
    } else if (data.deleted) {
      data.deleted.data = deleted.data || [];
      data.deleted.count = deleted.count || 0;
    }

    if (expired.error) {
      data.error = expired.error;
    } else if (data.expired) {
      data.expired.data = expired.data || [];
      data.expired.count = expired.count || 0;
    }
  }

  catch (error: any) {
    console.error(`${table} had issue fetching data: ${error}`);
  }

  finally {
    return data
  }
}

export const readDeletableDataFromTable = async <T extends keyof DeletableTableMapping>(table: T, options: DataFetchOptions) => {

  console.log('Fetching data from table:', table);

  const data: EntityState<DeletableTableMapping[T]> = {
    loading: true,
    error: null,
    current: {data: [], count: 0},
  }

  try {
    const current: PostgrestResponse<DeletableTableMapping[T]> = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .order("id", { ascending: true })
      .is("is_deleted", false)
      .range(
        options.itemsPerPage * (options.page - 1),
        options.itemsPerPage * options.page - 1
      )

      if (current.error) {
        console.log(current.error)
        data.error = current.error;
      } else {
        data.current.data = current.data || [];
        data.current.count = current.count || 0;
      }
  }

  catch (error: any) {
    data.error = error
    console.error(`${table} had issue fetching data: ${error}`)
  }

  finally {
    return data
  }
}

export const readDataFromTable = async <T extends keyof TableMapping>(table: T, options: DataFetchOptions) => {

  const data: EntityState<TableMapping[T]> = {
    loading: true,
    error: null,
    current: {data: [], count: 0},
  }

  try {
    const current: PostgrestResponse<TableMapping[T]> = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .order("id", { ascending: true })
      .range(
        options.itemsPerPage * (options.page - 1),
        options.itemsPerPage * options.page - 1
      )

      if (current.error) {
        data.error = current.error;
      } else {
        data.current.data = current.data || [];
        data.current.count = current.count || 0;
      }
  }

  catch (error: any) {
    data.error = error
    console.error(`${table} had issue fetching data: ${error}`)
  }

  finally {
    return data
  }
}