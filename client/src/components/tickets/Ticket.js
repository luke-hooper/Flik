import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import LogItem from "./LogItem";

const Ticket = ({ tickets: { ticket, loading } }) => {
  return (
    <Fragment>
      {loading && ticket === null ? (
        <Fragment>
          <h1>Ticket Loading ...</h1>
        </Fragment>
      ) : (
        <Fragment className='ticket'>
          <div className='header'>
            <h1 className='large'>Ticket</h1>
            <p className='medium'>
              <i className='fas fa-ticket-alt text-primary'></i>
              Indepth View of Ticket: {ticket.title}
            </p>
          </div>
          <div className='ticket-table-wrapper'>
            <div className='wrapper ticket-top-left'>
              <div className='heading'>Overview</div>
              <ul>
                <li>Title: {ticket.title}</li>
                <li>Status: {ticket.status}</li>
                <li>Priority: {ticket.priority}</li>
                <li>Ticket Owner: {ticket.owner.name}</li>
                <li>Description: {ticket.description}</li>
              </ul>
            </div>
            <div className='wrapper ticket-top-right'>
              <div className='heading'>Developers Working on This Ticket:</div>

              <ul>
                <li>Owner: </li>
                <li className='indent'>{ticket.owner.name}</li>
                <li>Users:</li>
                {ticket.users.map(user => (
                  <li className='indent'>{user.name} </li>
                ))}
              </ul>
            </div>
            <div className='wrapper ticket-bottom-wrapper'>
              <div className='heading'>Ticket Log</div>
              <LogItem />
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Ticket.propTypes = {
  ticket: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  tickets: state.tickets
});
export default connect(mapStateToProps)(Ticket);
