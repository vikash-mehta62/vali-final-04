import { apiConnector } from "../apiConnector";
import { toast } from 'react-toastify';
import { crm } from "../apis";


const {
    CREATE_CONTACT_CRM,
    GET_ALL_CONTACT_CRM,
    UPDATE_CONTACT_CRM,
    DELETE_CONTACT_CRM,

    CREATE_MEMBER_CRM,
    DELETE_MEMBER_CRM,
    GET_ALL_MEMBER_CRM,
    UPDATE_MEMBER_CRM
} = crm

export const createContactCrmAPI = async (formData) => {

    const toastId = toast.loading("Loading...");


    try {
        const response = await apiConnector("POST", CREATE_CONTACT_CRM, formData)

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




export const getAllContactCrmAPI = async () => {

    try {
        const response = await apiConnector("GET", GET_ALL_CONTACT_CRM,)


        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        return response?.data?.contacts || [];
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

export const deleteContactCrmAPI = async (id) => {
    const toastId = toast.loading("Loading...");


    try {
        const response = await apiConnector("DELETE", `${DELETE_CONTACT_CRM}/${id}`);


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
export const updateContactCrmAPI = async (id, formData) => {

    const toastId = toast.loading("Loading...");


    try {
        const response = await apiConnector("PUT", `${UPDATE_CONTACT_CRM}/${id}`, formData);


        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        return response?.data;
    } catch (error) {
        console.error("UPDATE contact crm API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to Update contact crm!");
        return [];
    } finally {

        toast.dismiss(toastId);
    }

};




export const createTeamCrmAPI = async (formData, token) => {

    const toastId = toast.loading("Loading...");


    try {
        const response = await apiConnector("POST", CREATE_MEMBER_CRM, formData, {
            Authorization: `Bearer ${token}`,
        })

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }


        toast.success(response?.data?.message);

        return response;
    } catch (error) {
        console.error("CREATE_MEMBER_CRM  API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to  CREATE_MEMBER_CRM!");
        return null;
    } finally {

        toast.dismiss(toastId);
    }
};

export const getAllTeamCrmAPI = async () => {

    try {
        const response = await apiConnector("GET", GET_ALL_MEMBER_CRM,)


        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }


        console.log(response?.data)
        return response?.data?.data || [];
    } catch (error) {
        console.error("GET contact crm  API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to get contact crm!");
        return [];
    }

};


export const updateTeamCrmAPI = async (id, formData) => {

    const toastId = toast.loading("Loading...");


    try {
        const response = await apiConnector("PUT", `${UPDATE_MEMBER_CRM}/${id}`, formData);
        console.log(id + "id ")

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Something went wrong!");
        }

        return response?.data;
    } catch (error) {
        console.error("UPDATE UPDATE_MEMBER_CRM API ERROR:", error);
        toast.error(error?.response?.data?.message || "Failed to Update UPDATE_MEMBER_CRM!");
        return [];
    } finally {

        toast.dismiss(toastId);
    }

};