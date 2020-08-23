import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import CanvasJSReact from "../../canvasJS/canvasjs.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const UrgencyChart = ({ tickets: { tickets } }) => {
  CanvasJS.addColorSet("primaryShades", [
    //colorSet Array

    "#29E5CF",
    "#00CDE6",
    "#00B0F4",
    "#008FEE",
    "#6C66CE"
  ]);
  const dataPoint = () => {
    const values = ["low", "medium", "high"];
    return values.map(priority => {
      let count = tickets.filter(ticket => ticket.priority === priority).length;
      return { label: priority, y: count };
    });
  };

  const options = {
    colorSet: "primaryShades",
    height: 300,

    data: [
      {
        type: "column",
        dataPoints: dataPoint()
      }
    ]
  };

  return <CanvasJSChart options={options} />;
};

UrgencyChart.propTypes = {
  tickets: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  tickets: state.tickets
});

export default connect(mapStateToProps)(UrgencyChart);
