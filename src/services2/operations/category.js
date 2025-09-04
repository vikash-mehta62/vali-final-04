import { apiConnector } from "../apiConnector";
import { category } from "../apis";
import { toast } from 'react-toastify';
import { setLoading } from "../../redux/authSlice";

const { GET_CATEGORIES } = category

// export const createCategoryAPI = (formData, token) => {
//     return async (dispatch) => {
//         const toastId = toast.loading("Loading...");
//         dispatch(setLoading(true));

//         try {
//             const response = await apiConnector("POST", CREATE_CATEGORY, formData, {
//                 Authorization: `Bearer ${token}`,
//             });

//             // console.log("Category API RESPONSE:", response);

//             if (!response?.data?.success) {
//                 throw new Error(response?.data?.message || "Something went wrong!");
//             }

//             return response;
//         } catch (error) {
//             console.error("CATEGORY API ERROR:", error);
//             toast.error(error?.response?.data?.message || "Failed to create category!");
//             return null;
//         } finally {
//             dispatch(setLoading(false));
//             toast.dismiss(toastId);
//         }
//     };
// };



export const getAllCategoriesAPI = () => {
    return async (dispatch) => {
        try {
            const response = await apiConnector("GET", GET_CATEGORIES)

            // console.log("Category API RESPONSE:", response);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Something went wrong!");
            }

            return response?.data?.categories || [];
        } catch (error) {
            console.error("CATEGORY API ERROR:", error);
            toast.error(error?.response?.data?.message || "Failed to get category!");
            return [];
        } finally {
            dispatch(setLoading(false));
            // toast.dismiss(toastId);
        }
    };
};

// export const deleteCategoriesAPI = (id, token) => {
//     return async (dispatch) => {
//         const toastId = toast.loading("Loading...");
//         dispatch(setLoading(true));

//         try {
//             const response = await apiConnector("DELETE", `${DELETE_CATEGORY}/${id}`, {}, {
//                 Authorization: `Bearer ${token}`,
//             });


//             if (!response?.data?.success) {
//                 throw new Error(response?.data?.message || "Something went wrong!");
//             }

//             return response?.data;
//         } catch (error) {
//             console.error("DELETE Sub CATEGORY API ERROR:", error);
//             toast.error(error?.response?.data?.message || "Failed to delete Sub category!");
//             return [];
//         } finally {
//             dispatch(setLoading(false));
//             toast.dismiss(toastId);
//         }
//     };
// };
// export const updateCategoryAPI = (id, formData, token) => {
//     return async (dispatch) => {
//         const toastId = toast.loading("Loading...");
//         dispatch(setLoading(true));

//         try {
//             const response = await apiConnector("PUT", `${UPDATE_CATEGORY}/${id}`, formData, {
//                 Authorization: `Bearer ${token}`,
//             });


//             if (!response?.data?.success) {
//                 throw new Error(response?.data?.message || "Something went wrong!");
//             }

//             return response?.data;
//         } catch (error) {
//             console.error("UPDATE CATEGORY API ERROR:", error);
//             toast.error(error?.response?.data?.message || "Failed to Update category!");
//             return [];
//         } finally {
//             dispatch(setLoading(false));
//             toast.dismiss(toastId);
//         }
//     };
// };




