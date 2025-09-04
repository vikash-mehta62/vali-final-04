import { apiConnector } from "../apiConnector";
import { priceList } from "../apis";
import { toast } from 'react-toastify';

const { 
    CREATE_PRICE_LIST, 
    GET_ALL_PRICE_LIST,
    UPDATE_PRICE_LIST,
    GET_PRICE_LIST,
    DELETE_PRICE_LIST
} = priceList



export const createPriceListAPI = async (formData, token) => {
    const toastId = toast.loading("Creating Price List...");

    try {
        const response = await apiConnector("POST", CREATE_PRICE_LIST, formData, {
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


export const getAllPriceListAPI = async () => {
    try {
        const response = await apiConnector("GET", GET_ALL_PRICE_LIST);

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        // `_id` ko `id` me convert karna
        const formattedPriceLists = response?.data?.data.map(priceList => ({
            ...priceList,
            id: priceList._id, // `_id` ko `id` me change kiya
            products: priceList.products.map(product => ({
                ...product,
                id: product._id // Products ke andar bhi `_id` ko `id` me change kiya
            }))
        }));

        return formattedPriceLists;
    } catch (error) {
        console.error("GET Price List API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch Price Lists!");
        return [];
    }
};

export const updatePriceList = async (id,formData, token) => {
    // Show a loading toast message
    const toastId = toast.loading("Updating product price...");

    try {
        // API call to update product price
        const response = await apiConnector("PUT", `${UPDATE_PRICE_LIST}/${id}`, formData, {
            Authorization: `Bearer ${token}`,
        });

        // Check if the request was successful
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        // Show success toast notification
        toast.success(response.data.message);

        return response.data; // Return the response data
    } catch (error) {
        console.error("Product Price Update API Error:", error);

        // Show error toast notification
        toast.error(error?.response?.data?.message || "Failed to update product price!");

        return null;
    } finally {
        // Dismiss the loading toast
        toast.dismiss(toastId);
    }
};


export const getSinglePriceAPI = async (id) => {


    try {
        const response = await apiConnector("GET", `${GET_PRICE_LIST}/${id}`)


        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }
        console.log(response)

        return response?.data?.data
    } catch (error) {
        console.error("GET GET_PRICE_LIST API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to get GET_PRICE_LIST!");
        return false;
    } finally {

    }

};




export const deltePriceAPI = async (id) => {


    try {
        const response = await apiConnector("DELETE", `${DELETE_PRICE_LIST}/${id}`)


        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }
        console.log(response)

        return response?.data?.data
    } catch (error) {
        console.error("GET GET_PRICE_LIST API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to get GET_PRICE_LIST!");
        return false;
    } finally {

    }

};