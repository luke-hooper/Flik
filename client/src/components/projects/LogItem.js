import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { getATicket } from "../../actions/tickets";

import Moment from "react-moment";

//useState to set style border Color

const LogItem = ({
  ticket: { _id, title, description, date, status, priority },
  getATicket
}) => {
  const history = useHistory();

  const clickHandler = ticketId => {
    console.log(ticketId);
    getATicket(ticketId);
    history.push(`/ticket`);
  };
  return (
    <Fragment>
      <tr onClick={() => clickHandler(_id)}>
        <td>{title ? title : <p>N/A</p>}</td>
        <td>{description ? description : <p>N/A</p>}</td>
        <td>{status ? status : <p>N/A</p>}</td>
        <td>{priority ? priority : <p>N/A</p>}</td>
        <td>
          {date ? <Moment format='DD/MM/YYYY'>{date}</Moment> : <p>N/A</p>}
        </td>
      </tr>
    </Fragment>
  );
};

LogItem.propTypes = {
  ticket: PropTypes.object.isRequired
};

export default connect(null, { getATicket })(LogItem);
