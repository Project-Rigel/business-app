// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyC13q0ogbu9gePWZa_61JyAItaFmzHqkCs',
    authDomain: 'rigel-admin.firebaseapp.com',
    databaseURL: 'https://rigel-admin.firebaseio.com',
    projectId: 'rigel-admin',
    storageBucket: 'rigel-admin.appspot.com',
    messagingSenderId: '457735200635',
    appId: '1:457735200635:web:51e9445f12c8e50b8427de',
    measurementId: 'G-0ZZX733ZFV',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
 import 'zone.js/dist/zone-error';  // Included with Angular CLI.
