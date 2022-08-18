'use strict';
var admin = require("firebase-admin");

var serviceAccount = require("../../../firebaseAdminKey.json");

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#bootstrap
 */

module.exports = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
};
