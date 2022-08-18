"use strict";

/**
 * User.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {
  /**
   * Promise to fetch authenticated user.
   * @return {Promise}
   */
  fetchAuthenticatedUser(id) {
    return strapi.query("user", "users-permissions").findOne({ id }, ["role", "municipality", "profilePicture", "interests", "adminCategories"]);
  },
};
