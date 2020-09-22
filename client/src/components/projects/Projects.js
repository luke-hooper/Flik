import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { getMyProjects } from "../../actions/projects";
import { getAProject } from "../../actions/projects";
import { getProjectTickets } from "../../actions/tickets";

const Projects = ({
  projects: { projects, loading },
  getMyProjects,
  getAProject,
  getProjectTickets
}) => {
  useEffect(() => {
    getMyProjects();
  }, [getMyProjects]);

  const history = useHistory();

  const clickHandler = projectId => {
    console.log(projectId);
    getAProject(projectId);
    getProjectTickets(projectId);
    history.push(`/project`);
  };

  return (
    <Fragment>
      {!loading && projects !== null ? (
        <Fragment>
          <div className='head'>
            <h1 className='large'>My projects</h1>
            <p className='medium'>
              <i className='fas fa-clipboard text-primary'></i>
              View Projects Assigned to You
            </p>
          </div>
          <div className='wrapper'>
            <div className='projects'>
              <table className='table'>
                <thead>
                  <tr>
                    <th scope='col'>Name</th>
                    <th scope='col'>Description</th>
                    <th scope='col'>Project Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr
                      key={project.id}
                      onClick={() => clickHandler(project._id)}
                    >
                      <td>{project.title ? project.title : <p>N/A</p>}</td>
                      <td>
                        {project.description ? project.description : <p>N/A</p>}
                      </td>
                      <td>
                        {project.owner.name ? project.owner.name : <p>N/A</p>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Fragment>
      ) : (
        <h1>Content Loading ...</h1>
      )}
    </Fragment>
  );
};

Projects.propTypes = {
  projects: PropTypes.object.isRequired,
  getMyProjects: PropTypes.func.isRequired,
  getAProject: PropTypes.func.isRequired,
  getProjectTickets: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  projects: state.projects
});

export default connect(mapStateToProps, {
  getMyProjects,
  getAProject,
  getProjectTickets
})(Projects);
