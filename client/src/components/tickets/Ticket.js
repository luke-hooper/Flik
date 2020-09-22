import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import LogItem from "./LogItem";
import { deleteTicket } from "../../actions/tickets";

const Ticket = ({
  tickets: { ticket, loading },
  user: { role },
  deleteTicket,
  history
}) => {
  const deleteHandler = () => {
    deleteTicket(ticket._id);
    history.goBack();
  };
  return (
    <Fragment>
      {!loading && ticket !== null ? (
        <Fragment className='ticket'>
          <div className='head'>
            <div className='header'>
              <h1 className='large'>Ticket</h1>
              <p className='medium'>
                <i className='fas fa-ticket-alt text-primary'></i>
                Indepth View of Ticket: {ticket.title}
              </p>
            </div>
            {role === "projectLead" ? (
              <div className='dash-buttons'>
                <Link to='/update-ticket' className='btn btn-light'>
                  <i className='fas fa-ticket-alt text-primary'></i> Update
                  Ticket
                </Link>
                <div onClick={deleteHandler} className='btn btn-light'>
                  <i className='fas fa-ticket-alt text-primary'></i> Delete
                  Ticket
                </div>
              </div>
            ) : (
              <div className='dash-buttons'>
                <Link to='/update-ticket' className='btn btn-light'>
                  <i className='fas fa-ticket-alt text-primary'></i> Update
                  Ticket
                </Link>
              </div>
            )}
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
      ) : (
        <Fragment>
          <h1>Ticket Loading ...</h1>
        </Fragment>
      )}
    </Fragment>
  );
};

Ticket.propTypes = {
  ticket: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  deleteTicket: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tickets: state.tickets,
  user: state.auth.user
});
export default connect(mapStateToProps, { deleteTicket })(Ticket);
