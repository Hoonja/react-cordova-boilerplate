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
    }),
    modifyActor : (id, params = null) => ({
        url: `/account/actors/${id}/modify/`,
        params: {
            ...params
        }
    }),
    sendTalk : (params = null) => ({
        url: `/aux/talks/`,
        params: {
            ...params
        }
    }),
    modifyTalk : (id, params = null) => ({
        url: `/aux/talks/${id}/modify/`,
        params: {
            ...params
        }
    }),
    setTalk : (id, params = null) => ({
        url: `/aux/talks/${id}/set_status/`,
        params: {
            ...params
        }
    }),
    sendPushMessage: (params = null) => ({
        url: `/account/actors/send_mobile_push/`,
        params: {
            ...params
        }
    })

};


export default api;
