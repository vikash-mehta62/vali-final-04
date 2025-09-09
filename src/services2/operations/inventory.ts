import { apiConnector } from "../apiConnector";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// Inventory API endpoints
export const inventoryEndpoints = {
  GET_ALL_PRODUCT_LOCATIONS: BASE_URL + "/product-location/getAll",
  GET_PRODUCT_LOCATION: BASE_URL + "/product-location/get",
  CREATE_PRODUCT_LOCATION: BASE_URL + "/product-location/create",
  UPDATE_PRODUCT_LOCATION: BASE_URL + "/product-location/update",
  ADJUST_INVENTORY: BASE_URL + "/product-location/adjust",
  GET_INVENTORY_BY_STATE: BASE_URL + "/product-location/by-state",
  GET_LOW_STOCK_ALERTS: BASE_URL + "/product-location/low-stock",
  GET_INVENTORY_SUMMARY: BASE_URL + "/product-location/summary",
  TRANSFER_INVENTORY: BASE_URL + "/product-location/transfer",
  SEED_INVENTORY_DATA: BASE_URL + "/product-location/seed-data",
  
  // Warehouse endpoints
  GET_ALL_WAREHOUSES: BASE_URL + "/warehouse/getAll",
  GET_WAREHOUSE: BASE_URL + "/warehouse/get",
  CREATE_WAREHOUSE: BASE_URL + "/warehouse/create",
  UPDATE_WAREHOUSE: BASE_URL + "/warehouse/update"
};

// Get all product locations with optional filters
export const getAllProductLocationsAPI = async (token: string, params?: string) => {
  try {
    const url = params ? `${inventoryEndpoints.GET_ALL_PRODUCT_LOCATIONS}?${params}` : inventoryEndpoints.GET_ALL_PRODUCT_LOCATIONS;
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("GET_ALL_PRODUCT_LOCATIONS_API ERROR:", error);
    throw error;
  }
};

// Get inventory by state
export const getInventoryByStateAPI = async (token: string, state: string, params?: string) => {
  try {
    const url = params ? 
      `${inventoryEndpoints.GET_INVENTORY_BY_STATE}/${state}?${params}` : 
      `${inventoryEndpoints.GET_INVENTORY_BY_STATE}/${state}`;
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("GET_INVENTORY_BY_STATE_API ERROR:", error);
    throw error;
  }
};

// Get low stock alerts
export const getLowStockAlertsAPI = async (token: string, params?: string) => {
  try {
    const url = params ? `${inventoryEndpoints.GET_LOW_STOCK_ALERTS}?${params}` : inventoryEndpoints.GET_LOW_STOCK_ALERTS;
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("GET_LOW_STOCK_ALERTS_API ERROR:", error);
    throw error;
  }
};

// Get inventory summary by state
export const getInventorySummaryAPI = async (token: string, state: string) => {
  try {
    const response = await apiConnector("GET", `${inventoryEndpoints.GET_INVENTORY_SUMMARY}/${state}`, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("GET_INVENTORY_SUMMARY_API ERROR:", error);
    throw error;
  }
};

// Adjust inventory quantities
export const adjustInventoryAPI = async (token: string, locationId: string, adjustmentData: any) => {
  try {
    const response = await apiConnector("PUT", `${inventoryEndpoints.ADJUST_INVENTORY.replace(':id', locationId)}/${locationId}/adjust`, adjustmentData, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("ADJUST_INVENTORY_API ERROR:", error);
    throw error;
  }
};

// Transfer inventory between warehouses
export const transferInventoryAPI = async (token: string, transferData: any) => {
  try {
    const response = await apiConnector("POST", inventoryEndpoints.TRANSFER_INVENTORY, transferData, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("TRANSFER_INVENTORY_API ERROR:", error);
    throw error;
  }
};

// Get all warehouses
export const getAllWarehousesAPI = async (token: string) => {
  try {
    const response = await apiConnector("GET", inventoryEndpoints.GET_ALL_WAREHOUSES, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("GET_ALL_WAREHOUSES_API ERROR:", error);
    throw error;
  }
};

// Seed inventory data (development only)
export const seedInventoryDataAPI = async (token: string) => {
  try {
    const response = await apiConnector("POST", inventoryEndpoints.SEED_INVENTORY_DATA, {}, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("SEED_INVENTORY_DATA_API ERROR:", error);
    throw error;
  }
};

// Create product location
export const createProductLocationAPI = async (token: string, locationData: any) => {
  try {
    const response = await apiConnector("POST", inventoryEndpoints.CREATE_PRODUCT_LOCATION, locationData, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("CREATE_PRODUCT_LOCATION_API ERROR:", error);
    throw error;
  }
};

// Update product location
export const updateProductLocationAPI = async (token: string, locationId: string, locationData: any) => {
  try {
    const response = await apiConnector("PUT", `${inventoryEndpoints.UPDATE_PRODUCT_LOCATION}/${locationId}`, locationData, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("UPDATE_PRODUCT_LOCATION_API ERROR:", error);
    throw error;
  }
};