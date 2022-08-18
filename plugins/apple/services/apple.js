"use strict";
const _ = require('lodash');
const resolve = require('path').resolve;

/**
 * apple.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const AppleSignIn = require("apple-sign-in-rest").default;

module.exports = {
  /** Use for website only */
  callback: async (ctx) => {
    const { code } = ctx.request.body;
    // Change the url to redirect to your front website
    const appleConfig = _.get(strapi.plugins, 'apple.config', {});
    ctx.redirect(
      `${appleConfig.callbackUrl}?code=${code}${appleConfig.callbackUrlPostfix || ''}`
    );
  },

  claim: async (code, useBundleId) => {
    const appleConfig = _.get(strapi.plugins, 'apple.config', {});
    // read your origin to define the clientId
    const clientId = useBundleId ? appleConfig.appClientId : appleConfig.siteClientId;

    const appleSignIn = new AppleSignIn({
      /**
       * This secret depends on that login "flow" you trying to create:
       *   - "web login" - this is the "serviceId"
       *   - "ios login" - this is the app "bundleId", choose only this if you trying to
       *                   verify user that has signed into using the native iOS way
       *
       */
      clientId: clientId,
      teamId: appleConfig.teamId,
      keyIdentifier: appleConfig.keyId,
      privateKeyPath: resolve("../appleAuthKey.p8"), // the name of the AuthKey previously copy/paste under config folder
    });

    const clientSecret = appleSignIn.createClientSecret({
      expirationDuration: 5 * 60, // define your own expiration client secret
    });
    const tokenResponse = await appleSignIn.getAuthorizationToken(
      clientSecret,
      code,
      {}
    );
    return await appleSignIn.verifyIdToken(tokenResponse.id_token, {});
  },
};
