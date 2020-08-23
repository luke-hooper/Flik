import React, { useState } from "react";
import PropTypes from "prop-types";

const CreateTicket = props => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    type: "",
    completionDate: "",
    user: ""
  });

  const {
    title,
    description,
    priority,
    status,
    type,
    completionDate,
    user
  } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    //Call action to create a ticket
  };
  return (
    <Fragment>
      <h1 className='large'>Create A Ticket</h1>

      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Title'
            name='name'
            value={title}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Description'
            name='name'
            value={description}
            onChange={onChange}
            required
          />
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
            <option value='low' defaultValue>
              Low{" "}
            </option>
            <option value='medium'>Medium</option>
            <option value='high'>High</option>
          </select>
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div>

        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            value={password2}
            onChange={onChange}
            required
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='login.html'>Sign In</Link>
      </p>
    </Fragment>
  );
};

CreateTicket.propTypes = {};

export default CreateTicket;
