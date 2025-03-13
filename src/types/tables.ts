export type DataFetchOptions = {
  itemsPerPage: number;
  page: number;
  keywords: string;
};

export type ExpirableTableMapping = {
  inventory: InventoryData;
};
export type DeletableTableMapping = {
  supplies: SuppliesData;
  logs: LogsData;
} & ExpirableTableMapping;
export type TableMapping = {
} & DeletableTableMapping;

export type EntityState<T> = {
  loading: boolean;
  error: string | null;
  active: { data: T[]; count: number };
};
export type ExpirableEntityState<T> = EntityState<T> & {
  expired: { data: T[]; count: number };
};
export type PersonalEntityState<T> = EntityState<T> & {
  personal: { data: T[]; count: number };
}

export type SuppliesData = {
  id: number;
  type: string;
  name: string;
  strength_or_volume: string;
  route_of_use: string;
  quantity_in_pack: number;
  possible_side_effects: string;
  location: string;
  created_at: string;
  is_deleted: boolean;
};
export type InventoryData = {
  id: number;
  supply_id: SuppliesData["id"];
  quantity: number;
  expiry_date?: string;
  created_at: string;
  is_deleted: boolean;
};
export type LogsData = {
  id: number;
  created_at: string;
  inventory_id: InventoryData["id"];
  user_id: string;
  quantity: number;
  is_deleted: boolean;
};
