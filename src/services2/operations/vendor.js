import { apiConnector } from "../apiConnector";
import { vendor } from "../apis"; // adjust path if needed
import { toast } from "react-toastify";

const {
  CREATE_VENDOR,
  GET_ALL_VENDORS,
  GET_VENDOR,
  UPDATE_VENDOR,
  DELETE_VENDOR,
} = vendor;

// Create Vendor
export const createVendorAPI = async (formData, token) => {
  const toastId = toast.loading("Creating vendor...");
  try {
    const response = await apiConnector("POST", CREATE_VENDOR, formData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success(response?.data?.message || "Vendor created successfully!");
    return response?.data;
  } catch (error) {
    console.error("CREATE Vendor API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to create vendor!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

// Get All Vendors
export const getAllVendorsAPI = async () => {
  try {
    const response = await apiConnector("GET", GET_ALL_VENDORS);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    console.log(response.data.data)
    return response?.data?.data || [];
  } catch (error) {
    console.error("GET ALL Vendors API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get vendors!");
    return [];
  }
};

// Get Single Vendor by ID
export const getSingleVendorAPI = async (id, token) => {
  try {
    const response = await apiConnector("GET", `${GET_VENDOR}/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.data;
  } catch (error) {
    console.error("GET Vendor API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get vendor!");
    return null;
  }
};

// Update Vendor
export const updateVendorAPI = async (id, formData, token) => {
  const toastId = toast.loading("Updating vendor...");
  try {
    const response = await apiConnector("PUT", `${UPDATE_VENDOR}/${id}`, formData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success(response?.data?.message || "Vendor updated successfully!");
    return response?.data;
  } catch (error) {
    console.error("UPDATE Vendor API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to update vendor!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

// Delete Vendor
export const deleteVendorAPI = async (id, token) => {
  const toastId = toast.loading("Deleting vendor...");
  try {
    const response = await apiConnector("DELETE", `${DELETE_VENDOR}/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success(response?.data?.message || "Vendor deleted successfully!");
    return response?.data;
  } catch (error) {
    console.error("DELETE Vendor API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to delete vendor!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};
