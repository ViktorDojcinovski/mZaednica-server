"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    let entity;
    ctx.request.body.user = ctx.state.user.id;

    // Deny create if support from this user on this report already exists
    let existing = await strapi.services["report-support"].findOne({ report: ctx.request.body.report, user: ctx.state.user.id });
    if (existing) {
      return ctx.badRequest('Support already exists!');
    }

    entity = await strapi.services["report-support"].create(ctx.request.body);
    return sanitizeEntity(entity, { model: strapi.models["report-support"] });
  },
};
