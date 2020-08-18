import React, { useState, ComponentProps } from "react";
import { PieChart } from "react-minimal-pie-chart";

function FullOption(props) {
  const [hovered, setHovered] = useState(undefined);

  const data = props.data.map((entry, i) => {
    if (hovered === i) {
      return {
        ...entry,
        color: "grey"
      };
    }
    return entry;
  });

  const lineWidth = 60;

  return (
    <PieChart
      style={{
        fontFamily: '"Nunito", -apple-system, Helvetica, Arial, sans-serif',
        fontSize: "8px"
      }}
      data={data}
      radius={PieChart.defaultProps.radius - 6}
      lineWidth={60}
      segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
      animate
      label={({ dataEntry }) => dataEntry.value}
      labelPosition={100 - lineWidth / 2}
      labelStyle={{
        fill: "#fff",
        opacity: 0.75,
        pointerEvents: "none"
      }}
      onMouseOver={(_, index) => {
        setHovered(index);
      }}
      onMouseOut={() => {
        setHovered(undefined);
      }}
    />
  );
}

export default FullOption;
