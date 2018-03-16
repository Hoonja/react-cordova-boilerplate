export const PLATFORM = {
    ios: 'ios',
    android: 'android',
    browser: 'browser'
};

export function getPlatformName() {
    const uagentLow = navigator.userAgent.toLocaleLowerCase();
    console.info('agent info: ' + uagentLow);
    if (~uagentLow.indexOf('iphone')) {
        return PLATFORM.ios;
    } else if (~uagentLow.indexOf('android') && ~uagentLow.indexOf('wv')) {
        return PLATFORM.android;
    } else {
        return PLATFORM.browser;
    }
}
