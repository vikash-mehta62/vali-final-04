import { apiConnector } from "../apiConnector";
import { groupPricing } from "../apis";
import { toast } from 'react-toastify';

const {
    CREATE_GROUP_PRICING,
    GET_ALL_GROUP_PRICING,
    UPDATE_GROUP_PRICING,
    GET_GROUP_PRICING,
    DELETE_GROUP_PRICING
} = groupPricing;


// CREATE
export const creatGroupPricingAPI = async (formData, token) => {
    const toastId = toast.loading("Creating Price List...");
    try {
        const response = await apiConnector("POST", CREATE_GROUP_PRICING, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        toast.success(response?.data?.message || "Price List Created Successfully!");
        return response?.data;
    } catch (error) {
        console.error("Price List API ERROR:", error);
        const errorMessage = error?.response?.data?.message || "Failed to create Price List!";
        toast.error(errorMessage);
        return { success: false, message: errorMessage };
    } finally {
        toast.dismiss(toastId);
    }
};


// GET ALL
export const getAllGroupPricingAPI = async () => {
    try {
        const response = await apiConnector("GET", GET_ALL_GROUP_PRICING);

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        const formattedPriceLists = response?.data?.data.map(priceList => ({
            ...priceList,
            id: priceList._id,
            products: priceList.product_arrayjson?.map(product => ({
                ...product,
                id: product._id || product.product_id // fallback
            }))
        }));

        return formattedPriceLists;
    } catch (error) {
        console.error("GET Price List API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch Price Lists!");
        return [];
    }
};


// UPDATE
export const updateGroupPricing = async (id, formData, token) => {
    const toastId = toast.loading("Updating product price...");

    try {
        const response = await apiConnector("PUT", `${UPDATE_GROUP_PRICING}/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        toast.success(response.data.message);
        return response.data;
    } catch (error) {
        console.error("Product Price Update API Error:", error);
        toast.error(error?.response?.data?.message || "Failed to update product price!");
        return null;
    } finally {
        toast.dismiss(toastId);
    }
};


// GET SINGLE
export const getSingleGroupPricingAPI = async (id) => {
    try {
        const response = await apiConnector("GET", `${GET_GROUP_PRICING}/${id}`);

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        return response?.data?.data;
    } catch (error) {
        console.error("GET GET_GROUP_PRICING API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to get price list!");
        return false;
    }
};

export const deleteGroupPricingAPI = async (id, token) => {
    const toastId = toast.loading("Deleting price list...");
    try {
        const response = await apiConnector("DELETE", `${DELETE_GROUP_PRICING}/${id}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        toast.success("Price list deleted successfully!");
        return true;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete price list!");
        return false;
    } finally {
        toast.dismiss(toastId);
    }
};
