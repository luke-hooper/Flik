import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { PieChart } from "react-minimal-pie-chart";
import FullOption from "./RenderPie";

const UrgencyChart = ({ tickets: { tickets } }) => {
  let data = [];
  const values = ["low", "medium", "high"];
  values.map(priority => {
    let count = tickets.filter(ticket => ticket.priority === priority).length;
    let colorSelection = "";
    if (priority === "low") {
      colorSelection = "#E38627";
    } else if (priority === "medium") {
      colorSelection = "#C13C37";
    } else if (priority === "high") {
      colorSelection = "#6A2135";
    }
    let insert = {
      title: priority,
      value: count,
      color: colorSelection
    };
    data.push(insert);
  });
  const filteredData = data.filter(obj => obj.value > 0);
  const dataMock = filteredData;

  const legend = filteredData.map(row => (
    <div className={row.title} key={row._id}>
      <div className='square' style={{ backgroundColor: row.color }}></div>
      <p>{row.title}</p>
    </div>
  ));

  return (
    <Fragment>
      <FullOption data={dataMock} />
      <div className='legend'>{legend}</div>
    </Fragment>

    /*
    <div className='chart'>
      <PieChart
        data={dataMock}
        label={({ dataEntry }) => dataEntry.title}
        labelStyle={index => ({
          fill: dataMock[index].color,
          fontSize: "8px"
        })}
        radius={42}
        labelPosition={105}
      />
    </div>
      */
  );
};

PieChart.propTypes = {
  tickets: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  tickets: state.tickets
});

export default connect(mapStateToProps)(UrgencyChart);
