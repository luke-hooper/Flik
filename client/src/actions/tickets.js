import axios from "axios";
import { setAlert } from "./alert";

import {
  GET_TICKETS,
  TICKET_ERROR,
  CLEAR_TICKETS,
  CLEAR_TICKET,
  GET_TICKET,
  GET_PROJECT_TICKETS,
  ADD_TICKET,
  UPDATE_TICKET,
  DELETE_TICKET
} from "./types";

//Get current users profile

export const getMyTickets = () => async dispatch => {
  dispatch({ type: CLEAR_TICKETS });
  try {
    const res = await axios.get("/api/tickets");

    dispatch({
      type: GET_TICKETS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: TICKET_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

export const getATicket = ticketId => async dispatch => {
  dispatch({ type: CLEAR_TICKET });
  try {
    const res = await axios.get(`/api/tickets/${ticketId}`);

    dispatch({
      type: GET_TICKET,
      payload: res.data
    });
  } catch (err) {
    console.log("err response", err);
    dispatch({
      type: TICKET_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//Get all tickets on a project

export const getProjectTickets = project_id => async dispatch => {
  dispatch({ type: CLEAR_TICKETS });
  try {
    const res = await axios.get(`/api/tickets/project/${project_id}`);

    dispatch({
      type: GET_PROJECT_TICKETS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: TICKET_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// Create a ticket on a project
export const createTicket = (
  project_id,
  formData,
  history
) => async dispatch => {
  const config = {
    headers: {
      "content-type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      `api/tickets/project/${project_id}`,
      formData,
      config
    );

    dispatch({
      type: ADD_TICKET,
      payload: res.data
    });
    history.push("/ticket");
  } catch (err) {
    dispatch({
      type: TICKET_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// Update a specific ticket
export const updateTicket = (
  ticket_id,
  formData,
  history
) => async dispatch => {
  const config = {
    headers: {
      "content-type": "application/json"
    }
  };
  try {
    const res = await axios.put(`api/tickets/${ticket_id}`, formData, config);

    dispatch({
      type: UPDATE_TICKET,
      payload: res.data
    });
    history.push("/ticket");
  } catch (err) {
    dispatch({
      type: TICKET_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// Delete a specific ticket
export const deleteTicket = ticket_id => async dispatch => {
  if (
    window.confirm(
      "Are you sure you want to delete this ticket? This can not be undone! Don't forget you can just update your tickets status to Abadonned"
    )
  )
    try {
      await axios.delete(`api/tickets/${ticket_id}`);

      dispatch({
        type: DELETE_TICKET,
        payload: ticket_id
      });
      dispatch(setAlert("Ticket has been permanantly deleted"));
    } catch (err) {
      dispatch({
        type: TICKET_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status
        }
      });
    }
};
