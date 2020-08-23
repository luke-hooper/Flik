import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Moment from "react-moment";

//useState to set style border Color

const LogItem = ({ ticket: { comments } }) => {
  return (
    <Fragment>
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>Action</th>
            <th scope='col'>User</th>
            <th scope='col'>
              Date
              <div className='sort'>
                <div className='arrow up-arrow arrow-on'></div>
                <div className='arrow down-arrow arrow-off'></div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {comments.map(comment => (
            <tr key={comment._id}>
              <td>{comment.text ? comment.text : <p>N/A</p>}</td>
              <td>{comment.name ? comment.name : <p>N/A</p>}</td>

              {comment.date ? (
                <td>
                  <Moment format='DD/MM/YYYY'>{comment.date}</Moment>
                </td>
              ) : (
                <p>N/A</p>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

LogItem.propTypes = {};

const mapStateToProps = state => ({
  ticket: state.tickets.ticket
});
export default connect(mapStateToProps)(LogItem);
