import {values} from './';

export const service = {
    getValue: (obj, key, defaultValue) => {
        if(!obj) {
            return defaultValue;
        }
        if(!key) {
            return defaultValue;
        }

        const keys = key.split('.');
        let value = obj;
        for(let inx = 0, len = keys.length ; inx < len ; inx++) {
            let newValue = value[keys[inx]];
            if(!newValue) {
                return defaultValue;
            }
            value = newValue;
        }
        return value;
    },
    validatePhoneNumber: (mdn) => {
        if(values.reg.mdn.test(mdn)) {
            return true;
        }
        return false;
    },
    getUrl: () => {
        // const {protocol, hostname, pathname} = window.location;
        // const local = 'client.local.danbi';

        // return 'http://127.0.0.1:27070/users';
        // return 'https://msg.danbi.biz/users';

        if(window.wink_cordova_env === 'production') {
            return 'https://msg.wink.co.kr/users';
        } else {
            return 'https://msg.danbi.biz/users';
        }
        //
        // if(hostname.indexOf('admin') === 0) {
        //     window.location.href = `${protocol}//${hostname.replace('admin', 'teacher')}${pathname}`;
        // }
        //
        // if(local === hostname || '127.0.0.1' === hostname || 'localhost' === hostname) {
        //     return 'http://127.0.0.1:27070/users';
        //     // return `${http}//${hostname.replace(/(teacher|pre|admin)/, 'msg')}:27070/users`;
        // }
        //
        //
        //
        // return `${protocol}//${hostname.replace(/(teacher|pre|admin)/, 'msg')}/users`;
    },
    phoneFomatter: (mdn) => {
        if(mdn.length === 11) {
            return mdn.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        } else if(mdn.length === 10) {
            return mdn.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        } else {
            return mdn;
        }
    }

};
export default {
    service
};
