export const api = {
    getStudents : (params=null) => ({
        url:`/account/actors/`,
        params : {modelType :1, ...params}
    }),
    sendOndTimePassword : (params = null) => ({
        url: '/account/auths/send_sms_onetime_password/',
        params : {
            ...params
        }
    }),
    getParent : (params = null) => ({
        url : `/account/actors/`,
        params : {modelType :2, ...params}
    }),

    getDeviceMapping : (params = null) => ({
        url : `/item/items/temporary_device_mapping/`,
        params : {...params}
    }),
    sendPushMessage : (params = null) => ({
        url : `/account/actors/send_mobile_push/`,
        params: {
            ...params
        }
    })
};


export default api;
