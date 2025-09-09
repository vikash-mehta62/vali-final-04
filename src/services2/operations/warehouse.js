import { toast } from "react-toastify";
import { apiConnector } from "../apiConnector";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const warehouse = {
  CREATE_WAREHOUSE: BASE_URL + "/warehouse/create",
  GET_ALL_WAREHOUSES: BASE_URL + "/warehouse/getAll",
  GET_WAREHOUSE: BASE_URL + "/warehouse/get", // append /:id when using
  UPDATE_WAREHOUSE: BASE_URL + "/warehouse/update", // append /:id when using
  DELETE_WAREHOUSE: BASE_URL + "/warehouse/delete", // append /:id when using
  GET_WAREHOUSES_BY_STATE: BASE_URL + "/warehouse/by-state", // append /:state when using
  FIND_NEAREST_WAREHOUSE: BASE_URL + "/warehouse/nearest",
  GET_WAREHOUSE_INVENTORY: BASE_URL + "/warehouse", // append /:id/inventory when using
  GET_REORDER_ALERTS: BASE_URL + "/warehouse", // append /:id/reorder-alerts when using
  GET_WAREHOUSE_METRICS: BASE_URL + "/warehouse", // append /:id/metrics when using
};

export const productLocation = {
  CREATE_PRODUCT_LOCATION: BASE_URL + "/product-location/create",
  GET_ALL_PRODUCT_LOCATIONS: BASE_URL + "/product-location/getAll",
  GET_PRODUCT_LOCATION: BASE_URL + "/product-location/get", // append /:id when using
  UPDATE_PRODUCT_LOCATION: BASE_URL + "/product-location/update", // append /:id when using
  ADJUST_INVENTORY: BASE_URL + "/product-location", // append /:id/adjust when using
  GET_INVENTORY_BY_STATE: BASE_URL + "/product-location/by-state", // append /:state when using
  TRANSFER_INVENTORY: BASE_URL + "/product-location/transfer",
};

// Warehouse API functions
export const createWarehouseAPI = async (warehouseData, token) => {
  const toastId = toast.loading("Creating warehouse...");

  try {
    const response = await apiConnector("POST", warehouse.CREATE_WAREHOUSE, warehouseData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success("Warehouse created successfully!");
    return response?.data;
  } catch (error) {
    console.error("CREATE Warehouse API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to create warehouse!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

export const getAllWarehousesAPI = async (token, queryParams = "") => {
  try {
    const url = queryParams ? `${warehouse.GET_ALL_WAREHOUSES}?${queryParams}` : warehouse.GET_ALL_WAREHOUSES;
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.data || [];
  } catch (error) {
    console.error("GET ALL Warehouses API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get warehouses!");
    return [];
  }
};

export const getWarehouseAPI = async (id, token) => {
  try {
    const response = await apiConnector("GET", `${warehouse.GET_WAREHOUSE}/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.data;
  } catch (error) {
    console.error("GET Warehouse API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get warehouse!");
    return null;
  }
};

export const updateWarehouseAPI = async (id, updateData, token) => {
  const toastId = toast.loading("Updating warehouse...");

  try {
    const response = await apiConnector("PUT", `${warehouse.UPDATE_WAREHOUSE}/${id}`, updateData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success("Warehouse updated successfully!");
    return response?.data;
  } catch (error) {
    console.error("UPDATE Warehouse API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to update warehouse!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

export const deleteWarehouseAPI = async (id, token) => {
  const toastId = toast.loading("Deleting warehouse...");

  try {
    const response = await apiConnector("DELETE", `${warehouse.DELETE_WAREHOUSE}/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success("Warehouse deleted successfully!");
    return response?.data;
  } catch (error) {
    console.error("DELETE Warehouse API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to delete warehouse!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

export const getWarehousesByStateAPI = async (state, token) => {
  try {
    const response = await apiConnector("GET", `${warehouse.GET_WAREHOUSES_BY_STATE}/${state}`, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.data || [];
  } catch (error) {
    console.error("GET Warehouses by State API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get warehouses by state!");
    return [];
  }
};

export const findNearestWarehouseAPI = async (latitude, longitude, maxDistance, token) => {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      maxDistance: maxDistance?.toString() || "100"
    });

    const response = await apiConnector("GET", `${warehouse.FIND_NEAREST_WAREHOUSE}?${params}`, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.data || [];
  } catch (error) {
    console.error("FIND Nearest Warehouse API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to find nearest warehouse!");
    return [];
  }
};

export const getWarehouseInventoryAPI = async (id, queryParams, token) => {
  try {
    const url = queryParams ? 
      `${warehouse.GET_WAREHOUSE_INVENTORY}/${id}/inventory?${queryParams}` : 
      `${warehouse.GET_WAREHOUSE_INVENTORY}/${id}/inventory`;
    
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data;
  } catch (error) {
    console.error("GET Warehouse Inventory API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get warehouse inventory!");
    return null;
  }
};

export const getReorderAlertsAPI = async (id, token) => {
  try {
    const response = await apiConnector("GET", `${warehouse.GET_REORDER_ALERTS}/${id}/reorder-alerts`, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.data || [];
  } catch (error) {
    console.error("GET Reorder Alerts API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get reorder alerts!");
    return [];
  }
};

export const getWarehouseMetricsAPI = async (id, queryParams, token) => {
  try {
    const url = queryParams ? 
      `${warehouse.GET_WAREHOUSE_METRICS}/${id}/metrics?${queryParams}` : 
      `${warehouse.GET_WAREHOUSE_METRICS}/${id}/metrics`;
    
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.data;
  } catch (error) {
    console.error("GET Warehouse Metrics API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get warehouse metrics!");
    return null;
  }
};

// Product Location API functions
export const createProductLocationAPI = async (locationData, token) => {
  const toastId = toast.loading("Creating product location...");

  try {
    const response = await apiConnector("POST", productLocation.CREATE_PRODUCT_LOCATION, locationData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success("Product location created successfully!");
    return response?.data;
  } catch (error) {
    console.error("CREATE Product Location API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to create product location!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

export const getAllProductLocationsAPI = async (token, queryParams = "") => {
  try {
    const url = queryParams ? `${productLocation.GET_ALL_PRODUCT_LOCATIONS}?${queryParams}` : productLocation.GET_ALL_PRODUCT_LOCATIONS;
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data;
  } catch (error) {
    console.error("GET ALL Product Locations API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get product locations!");
    return { data: [], count: 0 };
  }
};

export const adjustInventoryAPI = async (id, adjustmentData, token) => {
  const toastId = toast.loading("Adjusting inventory...");

  try {
    const response = await apiConnector("PUT", `${productLocation.ADJUST_INVENTORY}/${id}/adjust`, adjustmentData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success("Inventory adjusted successfully!");
    return response?.data;
  } catch (error) {
    console.error("ADJUST Inventory API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to adjust inventory!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

export const getInventoryByStateAPI = async (state, queryParams, token) => {
  try {
    const url = queryParams ? 
      `${productLocation.GET_INVENTORY_BY_STATE}/${state}?${queryParams}` : 
      `${productLocation.GET_INVENTORY_BY_STATE}/${state}`;
    
    const response = await apiConnector("GET", url, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data;
  } catch (error) {
    console.error("GET Inventory by State API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get state inventory!");
    return null;
  }
};

export const transferInventoryAPI = async (transferData, token) => {
  const toastId = toast.loading("Transferring inventory...");

  try {
    const response = await apiConnector("POST", productLocation.TRANSFER_INVENTORY, transferData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success("Inventory transferred successfully!");
    return response?.data;
  } catch (error) {
    console.error("TRANSFER Inventory API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to transfer inventory!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};