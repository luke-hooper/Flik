import React, { Fragment, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";

import { getMyTickets } from "../../actions/tickets";

import { getATicket } from "../../actions/tickets";

const Tickets = ({
  tickets: { tickets, loading },
  getMyTickets,
  getATicket
}) => {
  useEffect(() => {
    getMyTickets();
  }, [getMyTickets]);

  const history = useHistory();

  const clickHandler = ticketId => {
    console.log(ticketId);
    getATicket(ticketId);
    history.push(`/ticket`);
  };

  return (
    <Fragment>
      {!loading && tickets !== null ? (
        <Fragment>
          <div className='head'>
            <h1 className='large'>My Tickets</h1>
            <p className='medium'>
              <i className='fas fa-ticket-alt text-primary'></i>
              View Tickets Assigned to You
            </p>
          </div>
          <div className='wrapper'>
            <div className='tickets'>
              {tickets.length !== 0 ? (
                window.innerWidth < 700 ? (
                  <table className='table'>
                    <thead>
                      <tr>
                        <th scope='col'>Name</th>
                        <th scope='col'>Description</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map(ticket => (
                        <tr
                          key={ticket._id}
                          onClick={() => clickHandler(ticket._id)}
                        >
                          <td>{ticket.title ? ticket.title : <p>N/A</p>}</td>
                          <td>
                            {ticket.description ? (
                              ticket.description
                            ) : (
                              <p>N/A</p>
                            )}
                          </td>
                          <td>{ticket.status ? ticket.status : <p>N/A</p>}</td>
                          <td>
                            {ticket.priority ? ticket.priority : <p>N/A</p>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className='table'>
                    <thead>
                      <tr>
                        <th scope='col'>Name</th>
                        <th scope='col'>Description</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Priority</th>
                        <th scope='col'>Ticket Owner</th>
                        <th scope='col'>Completion Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map(ticket => (
                        <tr
                          key={ticket._id}
                          onClick={() => clickHandler(ticket._id)}
                        >
                          <td>{ticket.title ? ticket.title : <p>N/A</p>}</td>
                          <td>
                            {ticket.description ? (
                              ticket.description
                            ) : (
                              <p>N/A</p>
                            )}
                          </td>
                          <td>{ticket.status ? ticket.status : <p>N/A</p>}</td>
                          <td>
                            {ticket.priority ? ticket.priority : <p>N/A</p>}
                          </td>
                          <td>
                            {ticket.owner.name ? ticket.owner.name : <p>N/A</p>}
                          </td>
                          <td>
                            {ticket.completionDate ? (
                              <Moment format='DD/MM/YYYY'>
                                {ticket.completionDate}
                              </Moment>
                            ) : (
                              <p>N/A</p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              ) : (
                <h1> No Tickets Found</h1>
              )}
            </div>
          </div>
        </Fragment>
      ) : (
        <h1>Tickets are loading ..</h1>
      )}
    </Fragment>
  );
};

Tickets.propTypes = {
  tickets: PropTypes.object.isRequired,
  getATicket: PropTypes.func.isRequired,
  getMyTickets: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tickets: state.tickets
});

export default connect(mapStateToProps, { getMyTickets, getATicket })(Tickets);
