"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async afterCreate(result, data) {
      this.recountReportSupports(result.report.id);
    },
    async afterDelete(result, data) {
      this.recountReportSupports(result.report.id);
    },
    async recountReportSupports(reportId) {
      const reportSupportCount = await strapi.query('report-support').count({ 'report': reportId });
      await strapi.query('report').update({ id: reportId }, { supportCount: reportSupportCount });
    }
  },
};
