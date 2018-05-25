## 윙크 영상통화

### 버전 정보
cordova: 8.0
platform-ios: 4.5.4

### 시작하기
```
$ cd winkapp-parent-ios
$ sudo npm install -g cordova@8.0.0
$ cordova platform add ios
$ cordova prepare
```
> winkapp-parent-ios/platforms/ios/윙크 영상통화.xcworkspace 실행

### 앱 간 링크 기능을 위해 info.plist에 다음 내용 추가
파일위치: winkapp-parent-ios/platforms/ios/윙크 영상통화/윙크 영상통화-Info.plist
```
    <key>LSApplicationQueriesSchemes</key>
    <array>
      <string>winkparentvideocallapp</string>
      <string>winkparentapp</string>
    </array>
```

### 구동환경
스테이징 - 운영 환경을 구분하는 방식은 index.html 에
window.wink_cordova_env = 'production';
를 변경하여 구분함
(로컬은 구성되어있지 않음)

