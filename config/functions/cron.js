"use strict";
const moment = require("moment");

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#cron-tasks
 */

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  // '0 1 * * 1': () => {
  //
  // }
  '48 */2 * * *': async () => {
    const reports = await strapi.api.report.services.report.find();
    const dayAgo = moment().subtract(1, "day").toDate();

    reports.forEach(async (report) => {
      const count = await strapi.api["report-support"].services[
        "report-support"
      ].count({ report: report.id, created_at_gt: dayAgo });
      await strapi.api.report.services.report.update(
        { id: report.id },
        { popularity: count }
      );
    });
  },
};
