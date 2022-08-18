"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      // data.author = ctx.state.user.id;
      data.user = ctx.state.user.id;
      entity = await strapi.services["subvention-request-comment"].create(data, { files });
    } else {
      // ctx.request.body.author = ctx.state.user.id;
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services["subvention-request-comment"].create(ctx.request.body);
    }

    const sanitizedEntity = sanitizeEntity(entity, {
      model: strapi.models["subvention-request-comment"],
    });

    if (ctx.state.user.role.type === "admin") {
      // const report = await strapi.services["report"].findOne(
      //   { id: sanitizedEntity.report },
      //   ["reporter"]
      // );
      await strapi.services.notification.create({
        title: "Нов коментар на вашето барање",
        body: "Барање",
        user: entity.subventionRequest.user,
        // global: true,
        type: "REPORT_NEW_REQUEST_COMMENT",
        data: {
          comment_id: `${sanitizedEntity.id}`,
          request_id: `${sanitizedEntity.subventionRequest.id}`,
        },
      });
    }

    return sanitizedEntity;
  },
};
