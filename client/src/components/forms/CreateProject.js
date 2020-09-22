import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { createProject } from "../../actions/projects";

const CreateProject = ({ createProject, history }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  const { title, description } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createProject(formData, history);
  };
  return (
    <Fragment>
      <h1 className='large'>Create A Project</h1>

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
          <textarea
            type='textarea'
            placeholder='Description'
            name='description'
            value={description}
            onChange={onChange}
            required
          />
        </div>

        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
    </Fragment>
  );
};

CreateProject.propTypes = {};

export default connect(null, { createProject })(CreateProject);
