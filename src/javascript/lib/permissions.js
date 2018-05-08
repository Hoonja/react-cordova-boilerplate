const requestPermission = (cdvPermission, permission) => {
    return new Promise((resolve, reject) => {
        console.log('[PageContainer] requesting..', permission);
        cdvPermission.requestPermission(permission, () => {
            resolve(JSON.stringify(permission) + ' get successed');
        }, () => {
            reject(JSON.stringify(permission) + ' get failed');
        });
    })
}

export const requestPermissions = () => {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.permissions) {
        const permissions = window.cordova.plugins.permissions;

        requestPermission(permissions, permissions.CAMERA)
          .then((result) => {
              console.log('[PageContainer] ' + result);
              return requestPermission(permissions, permissions.RECORD_AUDIO)
          })
          .catch((err) => {
              console.error('[PageContainer] error: ' + err);
          });
    }
}
