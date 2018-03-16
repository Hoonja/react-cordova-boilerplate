/*
학생앱 키
App ID: d06fdf4d-df90-4132-b4bd-4cf822f8bcd9
REST API Key: MmU5YmIzMjQtY2VlNi00NGE4LTlhN2MtZWE3ZjY4ZWE4MmFk

학부모앱 키
App ID: 86ece6f2-2a0a-44f1-bb5e-8768d8c0831a
REST API Key: MmZiMzNjMDYtZWU3My00NTliLWE5NmMtNDk1YmQ2ODIyZDNk
*/

import {api} from '../commons/configs';
import {APICaller} from 'wink_mobile_commons/dist/api';

const appID = '86ece6f2-2a0a-44f1-bb5e-8768d8c0831a';

export default class Push {
    static init(idsCallback, notifyCallback) {
        let iosSettings = {
            kOSSettingsKeyAutoPrompt: true,
            kOSSettingsKeyInAppLaunchURL: false
        };

        window.plugins.OneSignal.setLogLevel({ logLevel: 6, visualLevel: 0 });
        window.plugins.OneSignal
            .startInit(appID)
            .handleNotificationReceived(data => notifyCallback({...data, handleType: 'received'}))
            .handleNotificationOpened(data => notifyCallback({...data, handleType: 'opened'}))
            .iOSSettings(iosSettings)
            .endInit();

        window.plugins.OneSignal.getIds(pushIds => idsCallback(pushIds));
    }

    static send(receiver, msg) {
        const params = {receiver, msg};
        const obj = api.sendPushMessage(params);
        return APICaller.post(obj.url, obj.params);
    }
}

/*
JSON 데이터 샘플

ids:
{
  "userId": "8b19c454-39a3-41e2-953f-c72adcafb457",
  "pushToken": "a70f648ce87bc34c9d3ca8204795889568d46d757d3d34dc404536519148c5e5"
}

notify:
{
  "shown": true,
  "payload": {
    "body": "message",
    "title": "title",
    "notificationID": "b4fa6e22-244f-4377-b374-a19bca5b64f3",
    "subtitle": "subtitle",
    "rawPayload": {
      "aps": {
        "alert": {
          "subtitle": "subtitle",
          "title": "title",
          "body": "message"
        },
        "sound": "default"
      },
      "custom": {
        "i": "b4fa6e22-244f-4377-b374-a19bca5b64f3"
      }
    },
    "sound": "default"
  },
  "isAppInFocus": true,
  "displayType": 1
}
*/
