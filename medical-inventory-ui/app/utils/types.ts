export type DataFetchOptions = {
  itemsPerPage: number;
  page: number;
  keywords: string;
};

export type TableDataMapping = {
  inventory: InventoryData;
  supply: SupplyData;
  crew: CrewData;
};

export type EntityState<T> = {
  loading: boolean;
  error: any;
  current: { data: T[]; count: number };
  deleted?: { data: T[]; count: number };
  expired?: { data: T[]; count: number };
};

export type InventoryData = {
  id: number;
  supply_id: number;
  card_id: number;
  crew_id: number;
  quantity: number;
  created_at: string;
  expire_date: string;
};
export type SupplyData = {
  id: number;
  type: string;
  item: string;
  strength: string;
  route_of_use: string;
  quantity_in_package: number;
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