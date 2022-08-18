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

    let data, files;
    if (ctx.is("multipart")) {
      const parsed = parseMultipartData(ctx);
      data = parsed.data;
      files = { files: parsed.files };
    } else {
      data = ctx.request.body;
    }

    data.municipality = ctx.state.user.municipality.id;
    entity = await strapi.services.subvention.create(data, files);

    const sanitizedEntity = sanitizeEntity(entity, {
      model: strapi.models.subvention,
    });

    await strapi.services.notification.create({
      title: "Додадена е нова субвенција",
      body: sanitizedEntity.title,
      global: true,
      municipality: data.municipality,
      type: "NEW_SUBVENTION",
      data: {
        subvention_id: `${sanitizedEntity.id}`,
      },
    });

    return sanitizedEntity;
  },
};
