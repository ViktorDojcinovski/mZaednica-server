"use strict";

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    let entities;
    const municipalityId = ctx.state.user && ctx.state.user.municipality.id;
    const query = {
      ...ctx.query,
      _where: {
        _or: [
          {
            global: true,
            ...municipalityId && {municipality: municipalityId}
          },
          {
            'user.id': ctx.state.user.id,
          },
        ],
      },
    };

    entities = await strapi.services.notification.find(query);

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.notification })
    );
  },
};
