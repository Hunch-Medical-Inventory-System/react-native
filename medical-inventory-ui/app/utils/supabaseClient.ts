import { createClient } from "@supabase/supabase-js";

// Use Expo constants to fetch the environment variables
const SUPABASE_URL = "https://xowegfmkiindptpnsscg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvd2VnZm1raWluZHB0cG5zc2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0OTE0MzksImV4cCI6MjA0NDA2NzQzOX0._rrgcRNIZYDMqdQaqEWgrHNvFp4jGkk-dFF4ohxroq0";




export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const readDataFromTable = async (
  table: string,
  options = { itemsPerPage: 100, page: 1, keywords: "" }
) => {
  let data = [];

  try {
    const { data: responseData, error } = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .order("id", { ascending: true })
      .range(
        options.itemsPerPage * (options.page - 1),
        options.itemsPerPage * options.page - 1
      );

    if (error) throw error;
    data = responseData;
  } catch (error: any) {
    console.error("Error fetching data:", error.message);
  }

  return data;
};


export const readDeletableDataFromTable = async (
  table: string,
  options = { itemsPerPage: 100, page: 1, keywords: "" }
) => {
  let currentData = [];
  let deletedData = [];

  try {
    const { data: currentResponse, error: currentError } = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .order("id", { ascending: true })
      .eq("is_deleted", false)
      .range(
        options.itemsPerPage * (options.page - 1),
        options.itemsPerPage * options.page - 1
      );

    const { data: deletedResponse, error: deletedError } = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .order("id", { ascending: true })
      .eq("is_deleted", true)
      .range(
        options.itemsPerPage * (options.page - 1),
        options.itemsPerPage * options.page - 1
      );

    if (currentError || deletedError)
      throw new Error("Error fetching deletable data");

    currentData = currentResponse;
    deletedData = deletedResponse;
  } catch (error: any) {
    console.error("Error fetching deletable data:", error.message);
  }

  return { currentData, deletedData };
};


/**
 * Reads data from a table with the following filters:
 * - `is_deleted` is `false` for current data
 * - `is_deleted` is `true` for deleted data
 * - `expiry_date` is less than the current UTC time for expired data
 *
 * @param {string} table The name of the table
 * @param {object} options Options to filter the data
 * @param {number} options.itemsPerPage The number of items to fetch per page
 * @param {number} options.page The page to fetch
 * @param {string} options.keywords Keywords to search for
 * @returns {Promise<object>} An object with the following properties: `currentData`, `deletedData`, `expiredData`
 */
export const readExpirableDataFromTable = async (
  table: string,
  options = { itemsPerPage: 100, page: 1, keywords: "" }
) => {
  let currentData = [];
  let deletedData = [];
  let expiredData = [];

  const nowUtc = new Date().toISOString();

  try {
    const { data: currentResponse, error: currentError } = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .order("id", { ascending: true })
      .eq("is_deleted", false)
      .range(
        options.itemsPerPage * (options.page - 1),
        options.itemsPerPage * options.page - 1
      );

    const { data: deletedResponse, error: deletedError } = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .order("id", { ascending: true })
      .eq("is_deleted", true)
      .range(
        options.itemsPerPage * (options.page - 1),
        options.itemsPerPage * options.page - 1
      );

    const { data: expiredResponse, error: expiredError } = await supabase
      .from(table)
      .select("*")
      .order("id", { ascending: true })
      .eq("is_deleted", false)
      .lt("expiry_date", nowUtc);

    if (currentError || deletedError || expiredError)
      throw new Error("Error fetching expirable data");

    currentData = currentResponse;
    deletedData = deletedResponse;
    expiredData = expiredResponse;
  } catch (error: any) {
    console.error("Error fetching expirable data:", error.message);
  }

  return { currentData, deletedData, expiredData };
};

// Same pattern applies for readRowFromTable, editRowFromTable, createRowFromTable, deleteRowFromTable
