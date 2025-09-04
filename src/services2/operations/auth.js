import { toast } from "react-toastify";
import { setUser, setToken } from "../../redux/authSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";
import Swal from "sweetalert2";
const {
  LOGIN_API,
  SIGNUP_API,
  CREATE_MEMBER_API,
  GET_ALL_MEMBER_API,
  UPDATE_MEMBER_PERMISSION_API,
  UPDATE_STORE,
  GET_ALL_STORES_API,
  GET_USER_API,
  FETCH_MY_PROFILE_API,
  UPDATE_PASSWORD_API,
  USER_WITH_ORDER,
  DELETE_STORE_API,
  VENDOR_WITH_ORDER
} = endpoints;

export async function login(email, password, navigate, dispatch) {
  Swal.fire({
    title: "Loading",
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("POST", LOGIN_API, {
      email,
      password,
    });
    Swal.close();
    if (!response?.data?.success) {
      await Swal.fire({
        title: "Login Failed",
        text: response.data.message,
        icon: "error",
      });
      throw new Error(response.data.message);
    }

    Swal.fire({
      title: `Login Successfully!`,
      text: `Have a nice day!`,
      icon: "success",
    });
    dispatch(setToken(response?.data?.token));
    dispatch(setUser(response.data.user));
    // navigate("/admin/dashboard");
  } catch (error) {
    console.log("LOGIN API ERROR............", error);
    Swal.fire({
      title: "Login Failed",
      text:
        error.response?.data?.message ||
        "Something went wrong, please try again later",
      icon: "error",
    });
  }
}

export async function signUp(formData, navigate, dispatch) {
  Swal.fire({
    title: "Loading",
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("POST", SIGNUP_API, formData);

    console.log("SIGNUP API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    Swal.fire({
      title: `User Register Succesfull!`,
      text: `Have a nice day!`,
      icon: "success",
    });

    // dispatch(setToken(response?.data?.token));
    // dispatch(setUser(response?.data?.user));



    return response?.data?.success;
  } catch (error) {
    console.log("SIGNUP API ERROR............", error);

    // toast.error(error.response?.data?.message)
    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Something went wrong. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }

  // Close the loading alert after completion
  // Swal.close();
}
export async function createMemberAPI(formData) {
  Swal.fire({
    title: "Loading",
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("POST", CREATE_MEMBER_API, formData);

    console.log("SIGNUP API RESPONSE............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    Swal.fire({
      title: `Member Created Succesfull!`,
      text: `Have a nice day!`,
      icon: "success",
    });


  } catch (error) {
    console.log("SIGNUP API ERROR............", error);

    Swal.fire({
      title: "Error",
      text: error.response?.data?.message || "Something went wrong. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }

  // Close the loading alert after completion
  // Swal.close();
}



export const getAllMembersAPI = async () => {

  try {
    const response = await apiConnector("GET", GET_ALL_MEMBER_API,)


    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.members || [];
  } catch (error) {
    console.error("GET Product API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get product!");
    return [];
  }

};

export const userWithOrderDetails = async (id) => {

  try {
    const response = await apiConnector("GET", `${USER_WITH_ORDER}/${id}`,)


    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.data || {};
  } catch (error) {
    console.error("GET User with order API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed User with order product!");
    return [];
  }

};



export const vendorWithOrderDetails = async (id) => {

  try {
    const response = await apiConnector("GET", `${VENDOR_WITH_ORDER}/${id}`,)


    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.data || {};
  } catch (error) {
    console.error("GET User with order API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed User with order product!");
    return [];
  }

};

export const getUserAPI = async ({
  email = null,
  id = null,
  setIsGroupOpen = () => {},
}) => {
  try {
    const response = await apiConnector("POST", GET_USER_API, { email, id });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.user;
  } catch (error) {
    if (typeof setIsGroupOpen === "function") {
      setIsGroupOpen(true);
    }

    console.error("GET USER API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get user!");
    return null;
  }
};


export const getAllStoresAPI = async () => {

  try {
    const response = await apiConnector("GET", GET_ALL_STORES_API,)


    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    return response?.data?.stores || [];
  } catch (error) {
    console.error("GET Stores API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to get Stores!");
    return [];
  }

};

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Swal.fire({
      title: `User Logout Succesfull!`,
      text: `Have a nice day!`,
      icon: "success",
    });
    navigate("/");
  };
}


export const updatePassword = async (email, newPassword) => {
  Swal.fire({
    title: "Loading",
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await apiConnector("PUT", `${FORGOT_PASSWORD_API}`, { email, newPassword })
    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    Swal.fire({
      title: `Password Update  Succesfull!`,
      text: `Have a nice day!`,
      icon: "success",
    });

  } catch (error) {
    console.error("Error updating password", error);
    throw new Error("There was an error updating the password. Please try again.");
  }
};


export const updateMemberAPI = async (id, formData) => {

  try {
    const response = await apiConnector("PUT", `${UPDATE_MEMBER_PERMISSION_API}/${id}`, formData);


    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }

    toast.success("Member Permission update!");
    return response?.data;
  } catch (error) {
    console.error("UPDATE Product API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to Update product!");
    return [];

  };
};


export const updateStoreAPI = async (id, formData, token) => {

  const toastId = toast.loading("Loading...");


  try {
    const response = await apiConnector("PUT", `${UPDATE_STORE}/${id}`, formData, {
      Authorization: `Bearer ${token}`,
    });

console.log(response)
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }
    toast.success(response?.data?.message)
    return response?.data;
  } catch (error) {
    console.error("UPDATE store API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to Update store!");
    return [];
  } finally {

    toast.dismiss(toastId);
  }

};

export const deleteStoreAPI = async (id, token) => {
  const toastId = toast.loading("Loading...");

  try {
    const response = await apiConnector("DELETE", `${DELETE_STORE_API}/${id}`, {}, {
      Authorization: `Bearer ${token}`,
    });

    console.log(response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }
    toast.success(response?.data?.message);
    return true;
  } catch (error) {
    console.error("DELETE store API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to delete store!");
    return false;
  } finally {
    toast.dismiss(toastId);
  }
};


export const updatePasswordSetting = async (formData, token) => {

  const toastId = toast.loading("Loading...");


  try {
    const response = await apiConnector("PUT", `${UPDATE_PASSWORD_API}`, formData, {
      Authorization: `Bearer ${token}`,
    });


    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Something went wrong!");
    }
    toast.success(response?.data?.messag)
    return response?.data;
  } catch (error) {
    console.error("UPDATE_PASSWORD_API API ERROR:", error);
    toast.error(error?.response?.data?.message || "Failed to Update Password!");
    return [];
  } finally {

    toast.dismiss(toastId);
  }

};




export function fetchMyProfile(token,navigate) {

  return async (dispatch) => {
  
    try {
      const response = await apiConnector("GET", FETCH_MY_PROFILE_API, null, {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      })

      console.log("APP JS RESPONSE............", response)

      if (!response?.data?.success) {
        throw new Error(response?.data?.message)
      }
      // console.log(response.data)

      dispatch(setUser(response?.data?.user))



      localStorage.setItem("user", JSON.stringify(response?.data?.user))

    } catch (error) {
      console.log("LOGIN API ERROR............", error)

      if (error?.response?.data?.message === 'Token expired' || error?.response?.data?.message === 'token is invalid') {
        Swal.fire({
          title: "Session Expired",
          text: "Please log in again for security purposes.",
          icon: "warning",
          button: "Login",
        }).then(() => {
          dispatch(logout(navigate));
          navigate('/login'); // Redirect to login page
        });
      }
    }
    
  }
}


