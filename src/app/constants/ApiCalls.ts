//Production
 const API_URL = 'http://ec2-18-216-208-133.us-east-2.compute.amazonaws.com:8080/';
//UAT
//const API_URL = 'http://ec2-18-222-191-225.us-east-2.compute.amazonaws.com:8080/';
                        
export const SIGATURE_MENUS = API_URL + 'api/setmenus/kottu';
export const CUSTOM_MENUS = API_URL + 'api/custommenus/kottu/template';
export const OTHER_MENUS = API_URL + 'api/menuitems';
export const POST_ORDER = API_URL + 'api/order';
export const GET_CUSTOMER = API_URL + 'api/customer/?email=';
export const SET_CUSTOMER = API_URL + 'api/customers';
