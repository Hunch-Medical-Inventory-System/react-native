export type ExtraConfig = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

export type DataFetchOptions = {
  itemsPerPage: number;
  page: number;
  keywords: string;
};

export type ExpirableTableMapping = {
  inventory: InventoryData;
}

export type DeletableTableMapping  = {
  supplies: SuppliesData;
} & ExpirableTableMapping;

export type TableMapping = {
  crew: CrewData;
  logs: LogsData;
} & DeletableTableMapping;

export type EntityState<T> = {
  loading: boolean;
  error: string | null;
  current: { data: T[]; count: number };
  deleted?: { data: T[]; count: number };
  expired?: { data: T[]; count: number };
};

export type InventoryData = {
  id: number;
  card_id: number;
  supply_id: number;
  crew_member_id: number;
  quantity: number;
  created_at: string;
  expiry_date: string;
};
export type SuppliesData = {
  id: number;
  type: string;
  item: string;
  strength_or_volume: string;
  route_of_use: string;
  quantity_in_pack: number;
  possible_side_effects: string;
  location: string;
  created_at: string;
  is_deleted: boolean;
};

export type CrewData = {
  id: number;
  first_name: string;
  last_name: string;
  created_at: string;
};

export type LogsData = {
  id: number;
  created_at: string;
  crew_member_id: number;
};