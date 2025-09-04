import { apiConnector } from "../apiConnector";
import { email } from "../apis";
import { toast } from 'react-toastify';
import { setLoading } from "../../redux/authSlice";


const {
    PRICE_LIST,
    PRICE_LIST_MULTI
}= email



export const priceListEmail = async (formData, token) => {

    const toastId = toast.loading("Sending...");


    try {
        const response = await apiConnector("POST", PRICE_LIST, formData, {
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
export const priceListEmailMulti = async (formData, token) => {

    const toastId = toast.loading("Sending...");


    try {
        const response = await apiConnector("POST", PRICE_LIST_MULTI, formData, {
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