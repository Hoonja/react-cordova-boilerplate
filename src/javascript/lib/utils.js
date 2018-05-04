export const PLATFORM = {
    ios: 'ios',
    android: 'android',
    browser: 'browser'
};

export function getPlatformName() {
    const uagentLow = navigator.userAgent.toLocaleLowerCase();
    if (~uagentLow.indexOf('iphone')) {
        return PLATFORM.ios;
    } else if (~uagentLow.indexOf('android') && ~uagentLow.indexOf('wv')) {
        return PLATFORM.android;
    } else {
        return PLATFORM.browser;
    }
}

export function isWebBrowser() {
    const uagentLow = navigator.userAgent.toLocaleLowerCase();
    if (~uagentLow.indexOf('iphone') || (~uagentLow.indexOf('android'))) {
        return false;
    } else {
        return true;
    }
}

export function getCurrentAppVersion() {
    if(window.cordova.getAppVersion) {
        window.cordova.getAppVersion.getVersionNumber((version) => {
            return version;
        }, (err) => {
            console.log('err: ', err);
            return '-';
        })
    } else {
        return '-.-.-'
    }
}

