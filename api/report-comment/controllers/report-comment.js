"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
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
      entity = await strapi.services["report-comment"].create(data, { files });
    } else {
      // ctx.request.body.author = ctx.state.user.id;
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services["report-comment"].create(ctx.request.body);
    }

    const sanitizedEntity = sanitizeEntity(entity, {
      model: strapi.models["report-comment"],
    });

    if (ctx.state.user.role.type === "admin") {
      // const report = await strapi.services["report"].findOne(
      //   { id: sanitizedEntity.report },
      //   ["reporter"]
      // );
      await strapi.services.notification.create({
        title: "Нов коментар на вашата пријава",
        body: "Пријава",
        user: entity.report.reporter,
        // global: true,
        type: "REPORT_NEW_COMMENT",
        data: {
          comment_id: `${sanitizedEntity.id}`,
          report_id: `${sanitizedEntity.report.id}`,
        },
      });
    }

    return sanitizedEntity;
  },
};
