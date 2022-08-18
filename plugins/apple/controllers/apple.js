"use strict";

/**
 * apple.js controller
 *
 * @description: A set of functions called "actions" of the `apple` plugin.
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */
  callback: async (ctx) => {
    return strapi.plugins.apple.services.apple.callback(ctx);
  },
};
