import React from "react";
import { HeaderNav } from "strapi-helper-plugin";
import pluginId from "../pluginId";

const getUrl = (to) =>
  to ? `/plugins/${pluginId}/${to}` : `/plugins/${pluginId}`;
export default () => (
  <HeaderNav
    links={[
      {
        name: "Users by type",
        to: getUrl("usersByType"),
      },
      {
        name: "Users by city",
        to: getUrl("usersByCity"),
      },
    ]}
  />
);
