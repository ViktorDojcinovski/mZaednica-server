"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const fs = require("fs");
const path = require("path");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

let adminCreateEmailTpl;
let adminCreateEmailTxtTpl;

fs.readFile(
  path.join(__dirname, "../new-report-email.txt"),
  "utf8",
  function (err, data) {
    if (err) throw err;
    adminCreateEmailTpl = data;
  }
);
fs.readFile(
  path.join(__dirname, "../new-report-email-txt.txt"),
  "utf8",
  function (err, data) {
    if (err) throw err;
    adminCreateEmailTxtTpl = data;
  }
);

module.exports = {
  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.report.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.report.update({ id }, ctx.request.body);
    }

    const sanitizedEntity = sanitizeEntity(entity, {
      model: strapi.models.report,
    });

    if (ctx.state.user.role.type === "admin" || ctx.state.user.role.type === "category_admin") {
      await strapi.services.notification.create({
        title: "Променет статус на пријава",
        body: entity.description,
        type: "REPORT_STATUS_CHANGED",
        user: entity.reporter.id,
        data: {
          report_id: `${sanitizedEntity.id}`,
        },
      });

      await strapi.services["report-comment"].create({
        user: ctx.state.user.id,
        report: sanitizedEntity.id,
        commentType: "status_change",
        newStatus: sanitizedEntity.status,
      });
    }

    return sanitizedEntity;
  },

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

    data.reporter = ctx.state.user.id;
    data.municipality = ctx.state.user.municipality.id;
    entity = await strapi.services.report.create(data, files);

    entity = sanitizeEntity(entity, { model: strapi.models.report });

    // try {
    //   await strapi.plugins["email"].services.email.sendTemplatedEmail(
    //     {
    //       to: strapi.config.get("custom.email.notificationEmailTo"),
    //     },
    //     {
    //       subject: 'New SSM report',
    //       text: adminCreateEmailTxtTpl,
    //       html: adminCreateEmailTpl,
    //     },
    //     entity
    //   );
    // } catch (e) {
    //   console.error(e);
    // }

    return entity;
  },
};
