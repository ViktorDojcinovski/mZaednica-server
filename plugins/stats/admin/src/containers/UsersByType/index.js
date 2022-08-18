/*
 *
 * HomePage
 *
 */

import React, { memo, useEffect, useState } from "react";
import {
  LoadingIndicator,
  request,
  PluginHeader,
  ContainerFluid,
} from "strapi-helper-plugin";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";
import Block from "../../components/Block";
import UserStatsHeaderNav from "../../components/UserStatsHeaderNav";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#80FF42"];

const UsersByType = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = async () => {
    const individualsCount = await request(
      "/users/count?accountType=individual"
    );
    const ngosCount = await request("/users/count?accountType=ngo");
    const companiesCount = await request("/users/count?accountType=company");
    const mediaCount = await request("/users/count?accountType=media");
    const educationCount = await request("/users/count?accountType=education");
    setData([
      { name: "Individuals", value: individualsCount, color: COLORS[0] },
      { name: "NGOs", value: ngosCount, color: COLORS[1] },
      { name: "Companies", value: companiesCount, color: COLORS[2] },
      { name: "Media", value: mediaCount, color: COLORS[3] },
      { name: "Education", value: educationCount, color: COLORS[4] },
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <ContainerFluid>
      <PluginHeader title="Statistics" description="AC statistics" />
      <UserStatsHeaderNav />
      <Block>
        {isLoading && <LoadingIndicator />}
        {!isLoading && (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie dataKey="value" data={data} label>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color || "#AAA"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Block>
    </ContainerFluid>
  );
};

export default memo(UsersByType);
