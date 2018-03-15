export const api = {
    getAuth : (params = null) => ({
        url : `/account/auths/`,
        params : {...params}
    }),
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
    authenticate : (params = null) => ({
        url: '/account/auths/authenticate/',
        params : {
            ...params
        }
    }),// 가족
    getFamily : (id) => ({
        url : `/account/actors/${id}/groups/`,
        params : {modelType : 13}
    }),

    //가족 멤버
    getMembers : (id, modelType=null) => ({
        url : `/account/actors/${id}/members/`,
        params : {...modelType}
    }),

    getRoomId : (params = null) => ({
        url: `/account/actor_types/ParentStudentPair/get_named/`,
        params: {
            ...params
        }
    }),
    getAuthToken : (id) => ({
        url: `/account/auths/${id}/get_auth_token/`
    })
};


export default api;
