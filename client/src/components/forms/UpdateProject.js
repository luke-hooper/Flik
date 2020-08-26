import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { updateProject } from "../../actions/projects";

const UpdateProject = ({
  projects: { project, loading },
  history,
  updateProject
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    setFormData({
      title: loading || !project.title ? "" : project.title,
      description: loading || !project.description ? "" : project.description
    });
  }, [loading]);

  const { title, description } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    updateProject(project._id, formData, history);
  };
  return (
    <Fragment>
      <h1 className='large'>Update A Project</h1>

      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <label for='title'>Name of the Project: </label>
          <input
            type='text'
            placeholder='Title'
            name='title'
            value={title}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <label for='description'>
            Please write an overview of the new project:{" "}
          </label>
          <input
            type='textarea'
            placeholder='Description'
            name='description'
            value={description}
            onChange={onChange}
            required
          />
        </div>

        <input
          type='submit'
          className='btn btn-primary'
          value='Update Project'
        />
      </form>
    </Fragment>
  );
};

UpdateProject.propTypes = {
  projects: PropTypes.object.isRequired,
  updateProject: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  projects: state.projects
});

export default connect(mapStateToProps, { updateProject })(UpdateProject);
