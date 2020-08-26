import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import moment from "moment";

import { updateTicket } from "../../actions/tickets";

const UpdateTicket = ({
  tickets: { ticket, loading },
  updateTicket,
  history
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    type: "",
    completionDate: "",
    email: ""
  });

  useEffect(() => {
    setFormData({
      title: loading || !ticket.title ? "" : ticket.title,
      description: loading || !ticket.description ? "" : ticket.description,
      priority: loading || !ticket.priority ? "" : ticket.priority,
      status: loading || !ticket.status ? "" : ticket.status,
      type: loading || !ticket.type ? "" : ticket.type,
      completionDate:
        loading || !ticket.completionDate
          ? ""
          : ticket.completionDate.toDateString,
      email: loading || !ticket.users[0].email ? "" : ticket.users[0].email
    });
  }, [loading]);

  const {
    title,
    description,
    priority,
    status,
    type,
    completionDate,
    email
  } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    updateTicket(ticket._id, formData, history);
  };
  return (
    <Fragment>
      <h1 className='large'>Create A Ticket</h1>

      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <label for='title'>Name of the Ticket: </label>
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
            <option value='bug' defaultValue>
              Bug{" "}
            </option>
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
            <option value='low' defaultValue>
              Low{" "}
            </option>
            <option value='medium'>Medium</option>
            <option value='high'>High</option>
          </select>
        </div>
        <div className='form form-group'>
          <label for='priority'>Please select the status of the ticket: </label>
          <select id='status' name='status' value={status} onChange={onChange}>
            <option value='waiting' defaultValue>
              Waiting{" "}
            </option>
            <option value='inProgress'>In Progress</option>
            <option value='completed'>Completed</option>
            <option value='abadonned'>Abadonned</option>
          </select>
        </div>
        <div className='form-group'>
          <label>
            Please select the date the ticket needs to be completed by:{" "}
          </label>
          <input
            type='date'
            name='completionDate'
            value={moment(completionDate).format("YYYY-MM-DD")}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <label>
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

        <input
          type='submit'
          className='btn btn-primary'
          value='Update Ticket'
        />
      </form>
    </Fragment>
  );
};

UpdateTicket.propTypes = {
  tickets: PropTypes.object.isRequired,
  updateTicket: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  tickets: state.tickets
});

export default connect(mapStateToProps, { updateTicket })(UpdateTicket);
