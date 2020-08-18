import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { PieChart } from "react-minimal-pie-chart";
import FullOption from "./RenderPie";

const UrgencyChart = ({ tickets: { tickets } }) => {
  let data = [];
  const values = ["waiting", "inProgress", "abadoned"];
  values.map(status => {
    let count = tickets.filter(ticket => ticket.status === status).length;
    let colorSelection = "";
    if (status === "waiting") {
      colorSelection = "#E38627";
    } else if (status === "inProgress") {
      colorSelection = "#C13C37";
    } else if (status === "abadoned") {
      colorSelection = "#6A2135";
    }
    let insert = {
      title: status,
      value: count,
      color: colorSelection
    };
    data.push(insert);
  });
  const filteredData = data.filter(obj => obj.value > 0);
  const dataMock = filteredData;

  const legend = filteredData.map(row => (
    <div className={row.title}>
      <div className='square' style={{ backgroundColor: row.color }}></div>
      <p>{row.title}</p>
    </div>
  ));

  return (
    <Fragment>
      <FullOption data={dataMock} />
      <div className='legend'>{legend}</div>
    </Fragment>
  );
};

PieChart.propTypes = {
  tickets: PropTypes.object
};
const mapStateToProps = state => ({
  tickets: state.tickets
});

export default connect(mapStateToProps)(UrgencyChart);
