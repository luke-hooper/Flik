import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import CanvasJSReact from "../../canvasJS/canvasjs.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const StatusBar = ({ tickets: { tickets } }) => {
  CanvasJS.addColorSet("primaryShades", [
    //colorSet Array

    "#29E5CF",
    "#00CDE6",
    "#00B0F4",
    "#008FEE",
    "#6C66CE"
  ]);

  const dataPoint = () => {
    const values = ["waiting", "inProgress", "abadonned", "completed"];
    return values.map(status => {
      let count = tickets.filter(ticket => ticket.status === status).length;
      if (status === "inProgress") {
        return { label: "In Progress", y: count };
      }
      return { label: status, y: count };
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

StatusBar.propTypes = {
  tickets: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  tickets: state.tickets
});

export default connect(mapStateToProps)(StatusBar);
