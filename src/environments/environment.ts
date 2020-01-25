// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  dialogflow:{
    icrsbot:'5aa14943a00549e3959147c91eb2ed30' //dialogflow key
  },
  firebaseConfig: {
    apiKey: "AIzaSyBXWSkqL_NUOKWRbs1s1buKkQPz8Rk4qYA",
    authDomain: "test-7f580.firebaseapp.com",
    databaseURL: "https://test-7f580.firebaseio.com",
    projectId: "test-7f580",
    storageBucket: "test-7f580.appspot.com",
    messagingSenderId: "642498385348",
    appId: "1:642498385348:web:56c8672009019bb8"
  }

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
