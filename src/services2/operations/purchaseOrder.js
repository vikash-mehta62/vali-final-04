// src/services/purchaseOrderAPI.js

import { apiConnector } from "../apiConnector";
import { purchaseOrder } from "../apis";
import { toast } from "react-toastify";

const {
  CREATE_PURCHASE_ORDER,
  GET_ALL_PURCHASE_ORDERS,
  GET_PURCHASE_ORDER,
  UPDATE_PURCHASE_ORDER,
  DELETE_PURCHASE_ORDER,
  UPDATE_PURCHASE_QAULITY_ORDER,
  PAYMENT_PURCHASE_ORDER
} = purchaseOrder;

// Create Purchase Order
export const createPurchaseOrderAPI = async (formData, token) => {
  const toastId = toast.loading("Creating purchase order...");
  try {
    const response = await apiConnector("POST", CREATE_PURCHASE_ORDER, formData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success(response?.data?.message || "Purchase order created successfully!");
    return response?.data;
  } catch (error) {
    console.error("CREATE Purchase Order API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to create purchase order!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

// Get All Purchase Orders
export const getAllPurchaseOrdersAPI = async (queryParams = "",token) => {
  try {
    // const response = await apiConnector("GET", GET_ALL_PURCHASE_ORDERS, null, {
    //   Authorization: `Bearer ${token}`,
    // });



     const response = await apiConnector(
      "GET",
      `${GET_ALL_PURCHASE_ORDERS}?${queryParams}`,
      {},
      {
        Authorization: `Bearer ${token}`,
      },
    )


    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data || [];
  } catch (error) {
    console.error("GET ALL Purchase Orders API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get purchase orders!");
    return [];
  }
};

// Get Single Purchase Order
export const getSinglePurchaseOrderAPI = async (id, token) => {
  try {
    const response = await apiConnector("GET", `${GET_PURCHASE_ORDER}/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.data;
  } catch (error) {
    console.error("GET Purchase Order API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get purchase order!");
    return null;
  }
};

// Update Purchase Order
export const updatePurchaseOrderAPI = async (id, formData, token) => {
  const toastId = toast.loading("Updating purchase order...");
  try {
    const response = await apiConnector("PUT", `${UPDATE_PURCHASE_ORDER}/${id}`, {quantityData : formData}, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success(response?.data?.message || "Purchase order updated successfully!");
    return response?.data;
  } catch (error) {
    console.error("UPDATE Purchase Order API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to update purchase order!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

export const updatePurchaseOrderQualityAPI = async (purchaseId, formData, token) => {
  const toastId = toast.loading("Updating purchase order...");
  try {
    const response = await apiConnector("PUT", `${UPDATE_PURCHASE_QAULITY_ORDER}/${purchaseId}`, formData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success(response?.data?.message || "Purchase order updated successfully!");
    return response?.data;
  } catch (error) {
    console.error("UPDATE Purchase Order API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to update purchase order!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

// Delete Purchase Order
export const deletePurchaseOrderAPI = async (id, token) => {
  const toastId = toast.loading("Deleting purchase order...");
  try {
    const response = await apiConnector("DELETE", `${DELETE_PURCHASE_ORDER}/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success(response?.data?.message || "Purchase order deleted successfully!");
    return response?.data;
  } catch (error) {
    console.error("DELETE Purchase Order API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to delete purchase order!");
    return null;
  } finally {
    toast.dismiss(toastId);
  }
};

export const updatePurchaseOrderPaymentAPI = async (formData, token, id) => {
    const toastId = toast.loading("Updating payment...");
  
    try {
      const response = await apiConnector(
        "PUT",
        `${PAYMENT_PURCHASE_ORDER}/${id}`,
        formData, // ✅ Send formData directly, not wrapped inside an object
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // 👈 Only if formData is a plain JS object
        }
      );
  
      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Something went wrong!");
      }
  
      toast.success(response?.data?.message || "Payment updated successfully");
      return response;
    } catch (error) {
      console.error("updateOrderPaymentAPI ERROR:", error);
      toast.error(error?.response?.data?.message || "Payment update failed!");
      return null;
    } finally {
      toast.dismiss(toastId);
    }
  };