import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import { getMyTickets } from "../../actions/tickets";

import UrgencyChart from "../charts/UrgencyChart";
import StatusBar from "../charts/StatusBar";
import TableItems from "./TableItems";

const Dashboard = ({
  getMyTickets,
  tickets: { tickets, loading },
  user: { name, role }
}) => {
  useEffect(() => {
    getMyTickets();
  }, [getMyTickets]);

  const renderRows = type => {
    const importantTickets = tickets.filter(
      ticket => ticket.priority === "high"
    );
    const openTickets = tickets.filter(
      ticket => ticket.status === "inProgress"
    );
    if (type === "important") {
      return importantTickets.length > 0 ? (
        importantTickets.map(ticket => (
          <TableItems tickets={ticket} key={ticket._id} />
        ))
      ) : (
        <tbody>
          <tr>
            <td className='span' colSpan='4'>
              <h2>No High Priority Tickets Found!</h2>
            </td>
          </tr>
        </tbody>
      );
    } else if (type === "open") {
      return openTickets.length > 0 ? (
        openTickets.map(ticket => (
          <TableItems tickets={ticket} key={ticket._id} />
        ))
      ) : (
        <tbody>
          <tr>
            <td className='span' colSpan='4'>
              <h2>No Open Tickets Found!</h2>
            </td>
          </tr>
        </tbody>
      );
    }
  };

  return (
    <Fragment>
      {!loading && tickets !== null ? (
        <Fragment>
          <div className='head'>
            <h1 className='large'>Dashboard</h1>
            <p className='medium'>
              <i className='fas fa-user text-primary'></i> Welcome {name}
            </p>
            {role === "projectLead" && (
              <div className='dash-buttons'>
                <Link to='/create-project' className='btn btn-light'>
                  <i className='fas fa-clipboard text-primary'></i> Create A
                  Project
                </Link>
              </div>
            )}
          </div>

          <div className='dashboard table-wrapper'>
            <div className='left-wrapper'>
              <h2 className='center '>Ticket Priority Overview</h2>
              <div className='wrapper'>
                <UrgencyChart />
              </div>
              <h2 className='center '>High Priority Tickets</h2>
              <div className='wrapper'>
                <div className='tickets'>
                  {tickets.length > 0 ? (
                    <table className='table'>
                      <thead>
                        <tr>
                          <th scope='col'>Name</th>
                          <th scope='col'>Description</th>
                          <th scope='col'>Status</th>
                          <th scope='col'>Priority</th>
                        </tr>
                      </thead>
                      {renderRows("important")}
                    </table>
                  ) : (
                    <h2>No Tickets Found! </h2>
                  )}
                </div>
              </div>
            </div>
            <div className='right-wrapper'>
              <h2 className='center '>Ticket Status Overview</h2>
              <div className='wrapper'>
                <StatusBar />
              </div>
              <h2 className='center '>Open Tickets Overview</h2>
              <div className='wrapper'>
                <div className='tickets'>
                  {tickets.length > 0 ? (
                    <table className='table'>
                      <thead>
                        <tr>
                          <th scope='col'>Name</th>
                          <th scope='col'>Description</th>
                          <th scope='col'>Status</th>
                          <th scope='col'>Priority</th>
                        </tr>
                      </thead>
                      {renderRows("open")}
                    </table>
                  ) : (
                    <h2>No Tickets Found! </h2>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      ) : (
        <h1>Content Loading ...</h1>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getMyTickets: PropTypes.func.isRequired,
  tickets: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  tickets: state.tickets,
  user: state.auth.user
});

export default connect(mapStateToProps, { getMyTickets })(Dashboard);
