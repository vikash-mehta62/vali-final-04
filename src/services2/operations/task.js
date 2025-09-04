import { apiConnector } from "../apiConnector";
import { toast } from 'react-toastify';
import { task } from "../apis";


const {
    CREATE_TASK_CRM, GET_ALL_TASK_CRM, UPDATE_TASK_CRM, DELETE_TASK_CRM } = task

export const createTaskCrmAPI = async (formData) => {

    const toastId = toast.loading("Loading...");


    try {
        const response = await apiConnector("POST", CREATE_TASK_CRM, formData)

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }


        toast.success(response?.data?.message);

        return response;
    } catch (error) {
        console.error("Product  API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to create Product!");
        return null;
    } finally {

        toast.dismiss(toastId);
    }
};




export const getAllTaskCrmAPI = async () => {

    try {
        const response = await apiConnector("GET", GET_ALL_TASK_CRM,)


        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        return response?.data?.tasks || [];
    } catch (error) {
        console.error("GET contact crm  API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to get contact crm!");
        return [];
    }

};
// export const getSingleProductAPI = async (id) => {


//     try {
//         const response = await apiConnector("GET", `${GET_PRODUCT}/${id}`)


//         if (!response?.data?.success) {
//             throw new Error(response?.data?.message || "Something went wrong!");
//         }

//         return response?.data?.product
//     } catch (error) {
//         console.error("GET Product API ERROR:", error);
//         toast.error(error?.response?.data?.message || "Failed to get product!");
//         return false;
//     } finally {

//     }

// };

export const deleteTaskCrmAPI = async (id) => {
    const toastId = toast.loading("Loading...");


    try {
        const response = await apiConnector("DELETE", `${DELETE_TASK_CRM}/${id}`);


        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }
        toast.success(response?.data?.message);
        toast.dismiss(toastId);

        return response?.data;
    } catch (error) {
        console.error("DELETE contact crm API ERROR:", error);
        toast.dismiss(toastId);

        toast.error(error?.response?.data?.message || "Failed to delete contact crm!");
        return [];
    }
    toast.dismiss(toastId);


};

export const updateTaskCrmAPI = async (id, formData) => {

    const toastId = toast.loading("Loading...");


    try {
        const response = await apiConnector("PUT", `${UPDATE_TASK_CRM}/${id}`, formData);
        console.log(id + "id ")

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }
        toast.success(response?.data?.message)
        return response?.data;
    } catch (error) {
        console.error("UPDATE contact crm API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to Update contact crm!");
        return [];
    } finally {

        toast.dismiss(toastId);
    }

};




