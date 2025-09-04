import { apiConnector } from "../apiConnector";
import { order, product } from "../apis";
import { toast } from 'react-toastify';


const { CREATE_PRODUCT,
    CREATE_ORDER,
    GET_ALL_ORDER, 
    GET_ORDER,
    UPDATE_ORDER,
    UPDATE_PLATE_ORDER,
    UPDATE_PAYMENT_ORDER,
    DELETE_ORDER,
    UPDATE_ORDER_ORDER_TYPE,
    GET_USERSTATEMENT,
    UPDATE_SHIPPING_COST,
    DASHBOARD_DATA,
    PENDING_ORDER_DATA,
    SEND_INVOICE_MAIL,
    UPDATE_PAYMENT_UNPAID_ORDER,
    HARD_DELETE_ORDER
} = order


export const createOrderAPI = async (formData, token) => {

    const toastId = toast.loading("Loading...");


    try {
        const response = await apiConnector("POST", CREATE_ORDER, formData, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }


        toast.success(response?.data?.message);

        return response.data?.newOrder;
    } catch (error) {
        console.error("CREATE_ORDER  API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to CREATE_ORDER!");
        return null;
    } finally {

        toast.dismiss(toastId);
    }
};


export const getOrderAPI = async (id,token) => {

    try {
        const response = await apiConnector("GET", `${GET_ORDER}/${id}`,{},{
            Authorization: `Bearer ${token}`,
        })


        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        return response?.data?.order || [];
    } catch (error) {
        console.error("GET GET_ALL_ORDER API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to get GET_ALL_ORDER!");
        return [];
    }

};
export const senInvoiceAPI = async (id, token) => {
    const toastId = toast.loading("Sending invoice...");

    try {
        const response = await apiConnector(
            "POST",
            `${SEND_INVOICE_MAIL}/${id}`,
            {},
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        toast.update(toastId, {
            render: "Invoice sent successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
        });

        return response?.data?.order || [];
    } catch (error) {
        console.error("POST SEND_INVOICE_MAIL API ERROR:", error);

        toast.update(toastId, {
            render: error?.response?.data?.message || "Failed to send invoice!",
            type: "error",
            isLoading: false,
            autoClose: 3000,
        });

        return [];
    }
};

export const getStatement = async (id,token) => {

    try {
        const response = await apiConnector("GET", `${GET_USERSTATEMENT}/${id}`,{},{
            Authorization: `Bearer ${token}`,
        })


        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        return response?.data.data|| [];
    } catch (error) {
        console.error("GET GET_ALL_ORDER API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to get GET_ALL_ORDER!");
        return [];
    }

};


export const getDashboardData = async (token) => {

    try {
        const response = await apiConnector("GET", DASHBOARD_DATA,{},{
            Authorization: `Bearer ${token}`,
        })


        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        return response?.data || [];
    } catch (error) {
        console.error("GET GET_ALL_ORDER API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to get GET_ALL_ORDER!");
        return [];
    }

};
export const getPendingData = async (token) => {

    try {
        const response = await apiConnector("GET", PENDING_ORDER_DATA,{},{
            Authorization: `Bearer ${token}`,
        })


        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        return response?.data || [];
    } catch (error) {
        console.error("GET GET_ALL_ORDER API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to get GET_ALL_ORDER!");
        return [];
    }

};



export const getAllOrderAPI = async (token, queryParams = "") => {
  try {
    console.log("Fetching orders with params:", queryParams)

    const response = await apiConnector(
      "GET",
      `${GET_ALL_ORDER}?${queryParams}`,
      {},
      {
        Authorization: `Bearer ${token}`,
      },
    )

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!")
    }

    console.log("API response:", response.data)

    return {
      orders: response?.data?.orders || [],
      totalOrders: response?.data?.totalOrders || 0,
      currentPage: response?.data?.currentPage || 1,
      totalPages: response?.data?.totalPages || 1,
      summary: response?.data?.summary || {},
    }
  } catch (error) {
    console.error("GET GET_ALL_ORDER API ERROR:", error)
    toast.error(error?.response?.data?.message || "Failed to get orders!")
    return {
      orders: [],
      totalOrders: 0,
      currentPage: 1,
      totalPages: 1,
    }
  }
}

export const updateOrderAPI = async (formData, token,id) => {

    const toastId = toast.loading("Loading...");


    try {
        const response = await apiConnector("PUT", `${UPDATE_ORDER}/${id}`, formData, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }


        toast.success(response?.data?.message);

        return response;
    } catch (error) {
        console.error("updateOrderAPI  API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to updateOrderAPI!");
        return null;
    } finally {

        toast.dismiss(toastId);
    }
};
export const updateOrderShippingAPI = async (formData, token) => {
    const toastId = toast.loading("Loading...");

    try {
        // Sending PUT request to update shipping cost
        const response = await apiConnector("POST", `${UPDATE_SHIPPING_COST}`, formData, {
            Authorization: `Bearer ${token}`,
        });

        // Check if response indicates success
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        // If success, show a success toast
        toast.success(response?.data?.message || "Shipping cost updated successfully!");

        return response.data.updatedOrder;  // Return the response in case you want to use it elsewhere
    } catch (error) {
        console.error("updateOrderShippingAPI ERROR:", error);

        // Displaying error message
        const errorMessage = error?.response?.data?.message || error.message || "Failed to update shipping cost!";
        toast.error(errorMessage);

        return null;  // Returning null to indicate failure
    } finally {
        // Dismissing the loading toast after the operation is done
        toast.dismiss(toastId);
    }
};

export const updateOrderTypeAPI = async (formData, token,id) => {

    const toastId = toast.loading("Loading...");


    try {
        const response = await apiConnector("PUT", `${UPDATE_ORDER_ORDER_TYPE}/${id}`, formData, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }


        toast.success(response?.data?.message);

        return response;
    } catch (error) {
        console.error("updateOrderAPI  API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to updateOrderAPI!");
        return null;
    } finally {

        toast.dismiss(toastId);
    }
};


export const updateOrderPaymentAPI = async (formData, token, id) => {
    const toastId = toast.loading("Updating payment...");
  
    try {
      const response = await apiConnector(
        "PUT",
        `${UPDATE_PAYMENT_ORDER}/${id}`,
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
export const updateOrderUnpaidAPI = async (id, token) => {
    const toastId = toast.loading("Updating payment...");
  
    try {
      const response = await apiConnector(
        "PUT",
        `${UPDATE_PAYMENT_UNPAID_ORDER}/${id}`,
        {}, // ✅ Send formData directly, not wrapped inside an object
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
  



export const updateOrderPlateAPI = async (palletData, token,id) => {
console.log(palletData)
    const toastId = toast.loading("Loading...");


    try {
        const response = await apiConnector("PUT", `${UPDATE_PLATE_ORDER}/${id}`, {palletData:palletData}, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }


        toast.success(response?.data?.message);

        return response;
    } catch (error) {
        console.error("updateOrderAPI  API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to updateOrderAPI!");
        return null;
    } finally {

        toast.dismiss(toastId);
    }
};



export const deleteOrderAPI = async (id, token,reason) => {
    try {
        const response = await apiConnector("DELETE", `${DELETE_ORDER}/${id}`, {reason}, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        toast.success("Order Voided successfully!");
        return response?.data?.deletedOrder || null;
    } catch (error) {
        console.error("DELETE ORDER API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to voided order!");
        return null;
    }
};
export const deleteHardOrderAPI = async (id, token) => {
    try {
        const response = await apiConnector("DELETE", `${HARD_DELETE_ORDER}/${id}`, null, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        toast.success("Order Permanently Deleted successfully!");
        return response?.data?.deletedOrder || null;
    } catch (error) {
        console.error("DELETE ORDER API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to Permanently Deleted order!");
        return null;
    }
};
