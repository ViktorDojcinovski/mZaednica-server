"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    let entity;

    let data, files;
    if (ctx.is("multipart")) {
      const parsed = parseMultipartData(ctx);
      data = parsed.data;
      files = { files: parsed.files };
    } else {
      data = ctx.request.body;
    }

    data.user = ctx.state.user.id;

    // First, try to locate any existing subvention request
    const existing = await strapi.services["subvention-request"].findOne({
      user: data.user,
      subvention: data.subvention,
    });
    if (existing) {
      entity = await strapi.services["subvention-request"].update(
        {
          id: existing.id,
        },
        data,
        {
          files,
        }
      );
    } else {
      entity = await strapi.services["subvention-request"].create(data, files);
    }

    const sanitizedEntity = sanitizeEntity(entity, {
      model: strapi.models["subvention-request"],
    });

    return sanitizedEntity;
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services["subvention-request"].findOne({ id });

    if (entity.user.id !== ctx.state.user.id && ctx.state.user.role.type !== 'admin') {
      return ctx.unauthorized(`You're not allowed to perform this action!`);
    }
    return sanitizeEntity(entity, { model: strapi.models["subvention-request"] });
  },
};
