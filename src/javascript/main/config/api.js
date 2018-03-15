export const api = {
    getStudents : (params=null) => ({
        url:`/account/actors/`,
        params : {modelType :1, ...params}
    }),
    sendOneTimePassword : (params = null) => ({
        url: '/account/auths/send_sms_onetime_password/',
        params : {
            ...params
        }
    }),
    phoneAuthenticate : (params = null) => ({
        url: '/account/auths/authenticate/',
        params : {
            ...params
        }
    }),
};


export default api;
