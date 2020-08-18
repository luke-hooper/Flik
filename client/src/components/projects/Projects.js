import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { getMyProjects } from "../../actions/projects";
import { getAProject } from "../../actions/projects";

const Projects = ({
  projects: { projects, loading },
  getMyProjects,
  getAProject
}) => {
  useEffect(() => {
    getMyProjects();
  }, [getMyProjects]);

  const history = useHistory();

  const clickHandler = projectId => {
    console.log(projectId);
    getAProject(projectId);
    history.push(`/project/${projectId}`);
  };

  return (
    <Fragment>
      {loading && projects === null ? (
        <h1>Content Loading ...</h1>
      ) : (
        <Fragment>
          <h1 className='large'>My projects</h1>
          <p className='medium'>
            <i className='fas fa-clipboard text-primary'></i>
            View projects Assigned to You
          </p>
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
      )}
    </Fragment>
  );
};

Projects.propTypes = {
  projects: PropTypes.object.isRequired,
  getMyProjects: PropTypes.func.isRequired,
  getAProject: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  projects: state.projects
});

export default connect(mapStateToProps, { getMyProjects, getAProject })(
  Projects
);
