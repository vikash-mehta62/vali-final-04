
const BASE_URL = "http://localhost:8080/api/v1"

export const endpoints = {
  LOGIN_API: BASE_URL + "/auth/login",
  SIGNUP_API: BASE_URL + "/auth/register",
  GET_USER_API: BASE_URL + "/auth/user",
  DELETE_STORE_API: BASE_URL + "/auth/delete-store",
  CREATE_MEMBER_API: BASE_URL + "/auth/member",
  GET_ALL_MEMBER_API: BASE_URL + "/auth/all-members",
  GET_ALL_STORES_API: BASE_URL + "/auth/all-stores",
  UPDATE_MEMBER_PERMISSION_API: BASE_URL + "/auth/update",
  UPDATE_STORE: BASE_URL + "/auth/update-store",
  FETCH_MY_PROFILE_API : BASE_URL + "/auth/fetchMyProfile",
  UPDATE_PASSWORD_API : BASE_URL + "/auth/update-password",
  USER_WITH_ORDER :BASE_URL + "/order/user",
  VENDOR_WITH_ORDER :BASE_URL + "/purchase-orders/user",
  



}


export const category = {
  // CREATE_CATEGORY: BASE_URL + "/category/create",
  GET_CATEGORIES: BASE_URL + "/category/getAll",
  // DELETE_CATEGORY: BASE_URL + "/category/delete",
  // UPDATE_CATEGORY: BASE_URL + "/category/update",
}

export const product = {
  CREATE_PRODUCT: BASE_URL + "/product/create",

  GET_ALL_PRODUCT: BASE_URL + "/product/getAll",
  GET_ALL_PRODUCT_SUMMARY: BASE_URL + "/product/getAllSummary",
  GET_PRODUCT: BASE_URL + "/product/get",
  UPDATE_PRODUCT: BASE_URL + "/product/update",
  GET_PRODUCT_ORDER: BASE_URL + "/product/get-order",
  DELETE_PRODUCT: BASE_URL + "/product/delete",
  DELETE_PRODUCT: BASE_URL + "/product/delete",
 TRASH_PRODUCT: BASE_URL + "/product/trash",
 QUANITY_ADD_PRODUCT: BASE_URL + "/product/addQuantity",
  UPDATE_PRODUCT_PRICE: BASE_URL + "/product/update-price",
  UPDATE_BULK_DISCOUNT: BASE_URL + "/product/update-bulk-discounts",
  GET_PRODUCT_BY_STORE: BASE_URL + "/product/get-by-store",
 REFRESH_PRODUCT: BASE_URL + "/product/reset-history",
}

export const priceList = {
  CREATE_PRICE_LIST: BASE_URL + "/price-list-templates/create",
  GET_ALL_PRICE_LIST: BASE_URL + "/price-list-templates/getAll",
  GET_PRICE_LIST: BASE_URL + "/price-list-templates/get",
  DELETE_PRICE_LIST: BASE_URL + "/price-list-templates/delete",
  UPDATE_PRICE_LIST: BASE_URL + "/price-list-templates/update",

}

export const groupPricing = {
  CREATE_GROUP_PRICING: BASE_URL + "/pricing/create",
  GET_ALL_GROUP_PRICING: BASE_URL + "/pricing/getAll",
  GET_GROUP_PRICING: BASE_URL + "/pricing/get",
  DELETE_GROUP_PRICING: BASE_URL + "/pricing/delete",
  UPDATE_GROUP_PRICING: BASE_URL + "/pricing/update",

}
export const order = {
  CREATE_ORDER: BASE_URL + "/order/create",

  GET_ALL_ORDER: BASE_URL + "/order/getAll",
  GET_ORDER: BASE_URL + "/order/get",
  DELETE_ORDER: BASE_URL + "/order/delete",
  UPDATE_ORDER: BASE_URL + "/order/update",
  UPDATE_ORDER_ORDER_TYPE: BASE_URL + "/order/update-otype",
  UPDATE_PLATE_ORDER: BASE_URL + "/order/update-plate",
  UPDATE_PAYMENT_ORDER: BASE_URL + "/order/payment-update",
  UPDATE_PAYMENT_UNPAID_ORDER: BASE_URL + "/order/unpaid",
  UPDATE_SHIPPING_COST: BASE_URL + "/order/update-shipping",
  GET_STORE_ORDERS: BASE_URL + "/order/store-orders",
  GET_USERSTATEMENT: BASE_URL + "/order/statement",
  DASHBOARD_DATA: BASE_URL + "/order/dashboard",
  PENDING_ORDER_DATA: BASE_URL + "/order/pending",
  SEND_INVOICE_MAIL: BASE_URL + "/order/invoiceMail",


  HARD_DELETE_ORDER: BASE_URL + "/order/hard-delete", // append /:id when using


}
export const crm = {
  CREATE_CONTACT_CRM: BASE_URL + "/crm/create",
  GET_ALL_CONTACT_CRM: BASE_URL + "/crm/getAll",
  UPDATE_CONTACT_CRM: BASE_URL + "/crm/update",
  DELETE_CONTACT_CRM: BASE_URL + "/crm/delete",

  CREATE_MEMBER_CRM: BASE_URL + "/crm/member-create",
  GET_ALL_MEMBER_CRM: BASE_URL + "/crm/member-getAll",
  UPDATE_MEMBER_CRM: BASE_URL + "/crm/member-update",
  DELETE_MEMBER_CRM: BASE_URL + "/crm/member-delete",


}
export const dealCrm = {
  CREATE_DEAL_CRM: BASE_URL + "/crm-deal/create",
  GET_ALL_DEAL_CRM: BASE_URL + "/crm-deal/getAll",
  UPDATE_DEAL_CRM: BASE_URL + "/crm-deal/update",
  DELETE_DEAL_CRM: BASE_URL + "/crm-deal/delete",
}
export const task = {
  CREATE_TASK_CRM: BASE_URL + "/task/create",
  GET_ALL_TASK_CRM: BASE_URL + "/task/getAll",
  UPDATE_TASK_CRM: BASE_URL + "/task/update",
  DELETE_TASK_CRM: BASE_URL + "/task/delete",
}
export const image = {
  IMAGE_UPLOAD: BASE_URL + "/image/multi",
}
export const store = {
  STORE_DASHBOARD: BASE_URL + "/store/dashboard",
  STORE_PRODUCTS: BASE_URL + "/store/products",
  PLACE_ORDER: BASE_URL + "/store/order",
}
export const email = {
  PRICE_LIST: BASE_URL + "/email/price-list",
  PRICE_LIST_MULTI: BASE_URL + "/email/price-list-multi",

}


export const vendor = {
  CREATE_VENDOR: BASE_URL + "/vendors/create",
  GET_ALL_VENDORS: BASE_URL + "/vendors/getAll",
  GET_VENDOR: BASE_URL + "/vendors/get", // append /:id when using
  UPDATE_VENDOR: BASE_URL + "/vendors/update", // append /:id when using
  DELETE_VENDOR: BASE_URL + "/vendors/delete", // append /:id when using
};

export const purchaseOrder = {
  CREATE_PURCHASE_ORDER: BASE_URL + "/purchase-orders/create",
  GET_ALL_PURCHASE_ORDERS: BASE_URL + "/purchase-orders/getAll",
  GET_PURCHASE_ORDER: BASE_URL + "/purchase-orders/get", // append /:id when using
  UPDATE_PURCHASE_ORDER: BASE_URL + "/purchase-orders/update", // append /:id when using
  UPDATE_PURCHASE_QAULITY_ORDER: BASE_URL + "/purchase-orders/update-quality", // append /:id when using
  DELETE_PURCHASE_ORDER: BASE_URL + "/purchase-orders/delete", // append /:id when using
  PAYMENT_PURCHASE_ORDER: BASE_URL + "/purchase-orders/update-payment", // append /:id when using
};



export const customer = {
  GET_ALL_CUSTOMERS: BASE_URL + "/customers/all",
  GET_CUSTOMER: BASE_URL + "/customers/single", // append /:id
  CREATE_CUSTOMER: BASE_URL + "/customers/create",
  UPDATE_CUSTOMER: BASE_URL + "/customers/update", // append /:id
  DELETE_CUSTOMER: BASE_URL + "/customers/delete", // append /:id
  GET_CUSTOMER_ORDERS: BASE_URL + "/customers/orders", // append /:customerId
  GET_CUSTOMER_ANALYTICS: BASE_URL + "/customer/analytics", // append /:customerId
  GET_CUSTOMER_INSIGHTS: BASE_URL + "/customer", // append /:customerId/insights
  SEARCH_CUSTOMERS: BASE_URL + "/customers/search",
  BULK_UPDATE_STATUS: BASE_URL + "/customers/bulk-status"
};

export const creditmemos = {
  CREATE_CREDIT_MEMO: BASE_URL + "/credit-memo/create",
  GET_CREDIT_MEMO_BY_ID: BASE_URL + "/credit-memo/by-order",
  UPDATE_CREDIT_MEMO_BY_ID: BASE_URL + "/credit-memo/update",

}