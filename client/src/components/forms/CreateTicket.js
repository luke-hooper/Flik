import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { createTicket } from "../../actions/tickets";

const CreateTicket = ({ project: { _id }, createTicket, history }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "waiting",
    type: "bug",
    completionDate: "",
    email: ""
  });

  const {
    title,
    description,
    priority,
    type,
    completionDate,
    email
  } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createTicket(_id, formData, history);
  };
  return (
    <Fragment>
      <h1 className='large'>Create A Ticket</h1>

      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <label for='text'>Name of the Ticket: </label>
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
            Please write a short description of what is to be done:{" "}
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
        <div className='form form-group'>
          <label for='type'>Please select the type of the ticket: </label>
          <select
            id='type'
            name='type'
            value={type}
            onChange={onChange}
            required
          >
            <option value='bug'>Bug </option>
            <option value='featureReq'>Feature Request</option>
            <option value='review'>Code Review</option>
            <option value='other'>Other</option>
          </select>
        </div>
        <div className='form form-group'>
          <label for='priority'>
            Please select the priority of the ticket:{" "}
          </label>
          <select
            id='priority'
            name='priority'
            value={priority}
            onChange={onChange}
          >
            <option value='low'>Low </option>
            <option value='medium'>Medium</option>
            <option value='high'>High</option>
          </select>
        </div>

        <div className='form-group'>
          <label for='date'>
            Please select the date the ticket needs to be completed by:{" "}
          </label>
          <input
            type='date'
            name='completionDate'
            value={completionDate}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <label for='email'>
            Please provide a valid email for the developer you with to asign the
            ticket to:{" "}
          </label>
          <input
            type='email'
            placeholder='Email Address of Assigned Developer'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div>

        <input type='submit' className='btn btn-primary' value='Add Ticket' />
      </form>
    </Fragment>
  );
};

CreateTicket.propTypes = {};

const mapStateToProps = state => ({
  project: state.projects.project
});

export default connect(mapStateToProps, { createTicket })(CreateTicket);
