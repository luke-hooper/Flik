import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import LogItem from "./LogItem";
import StatusBar from "../charts/StatusBar";
import UrgencyChart from "../charts/UrgencyChart";

const Project = ({ projects: { project, loading }, tickets: { tickets } }) => {
  return (
    <Fragment>
      {loading && project === null ? (
        <Fragment>
          <h1>project Loading ...</h1>
        </Fragment>
      ) : (
        <Fragment className='project'>
          <div className='header'>
            <h1 className='large'>Project</h1>
            <p className='medium'>
              <i className='fas fa-project-alt text-primary'></i>
              Indepth View of Project: {project.title}
            </p>
          </div>
          <div className='project-table-wrapper'>
            <div className='wrapper project-top-left'>
              <UrgencyChart className='project-chart' />
            </div>
            <div className='wrapper project-top-right-upper'>
              <div className='heading'>Overview</div>
              <ul>
                <li>Title: {project.title}</li>

                <li>Project Owner: {project.owner.name}</li>
                <li>Description: {project.description}</li>
              </ul>
            </div>
            <div className='wrapper project-top-right-lower'>
              <div className='heading'>Developers Working on This project:</div>

              <ul>
                <li>Owner: </li>
                <li className='indent'>{project.owner.name}</li>
                <li>Users:</li>
                {project.users.map(user => (
                  <li className='indent'>{user.name} </li>
                ))}
              </ul>
            </div>
            <div className='wrapper project-bottom-wrapper'>
              <div className='heading'>Project Log</div>
              <div className='tickets'>
                {tickets.length > 0 ? (
                  <table className='table'>
                    <thead>
                      <tr>
                        <th scope='col'>Name</th>
                        <th scope='col'>Description</th>
                        <th scope='col'>Status</th>
                        <th scope='col'>Priority</th>
                        <th scope='col'>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map(ticket => (
                        <LogItem ticket={ticket} />
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <h2>No Tickets Found</h2>
                )}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Project.propTypes = {
  project: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  projects: state.projects,
  tickets: state.tickets
});
export default connect(mapStateToProps)(Project);
