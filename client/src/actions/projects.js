import axios from "axios";
import { setAlert } from "./alert";

import {
  GET_PROJECTS,
  PROJECT_ERROR,
  CLEAR_PROJECTS,
  GET_PROJECT,
  CLEAR_PROJECT,
  UPDATE_PROJECT,
  CREATE_PROJECT,
  DELETE_PROJECT
} from "./types";

//Get current users profile

export const getMyProjects = () => async dispatch => {
  dispatch({ type: CLEAR_PROJECTS });
  try {
    const res = await axios.get("/api/projects");

    dispatch({
      type: GET_PROJECTS,
      payload: res.data
    });
  } catch (err) {
    console.log("err response", err);
    dispatch({
      type: PROJECT_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

//Get a single project
export const getAProject = projectId => async dispatch => {
  dispatch({ type: CLEAR_PROJECT });
  try {
    const res = await axios.get(`/api/projects/${projectId}`);

    dispatch({
      type: GET_PROJECT,
      payload: res.data
    });
  } catch (err) {
    console.log("err response", err);
    dispatch({
      type: PROJECT_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// Create a project

export const createProject = (formData, history) => async dispatch => {
  const config = {
    headers: {
      "content-type": "application/json"
    }
  };

  try {
    const res = await axios.post("/api/projects", formData, config);

    dispatch({
      type: CREATE_PROJECT,
      payload: res.data
    });

    history.push("/project");
  } catch (err) {
    console.log("err response", err);
    dispatch({
      type: PROJECT_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

// Update a project

export const updateProject = (
  projectId,
  formData,
  history
) => async dispatch => {
  const config = {
    headers: {
      "content-type": "application/json"
    }
  };
  try {
    const res = await axios.put(`api/projects/${projectId}`, formData, config);

    dispatch({
      type: UPDATE_PROJECT,
      payload: res.data
    });
    history.push("/project");
  } catch (err) {
    console.log("err response", err);
    dispatch({
      type: PROJECT_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
};

export const deleteProject = projectId => async dispatch => {
  if (
    window.confirm(
      "Deleting this project is permanent and will remove all tickets for all users attached to project. Are you sure you want to delete this project?"
    )
  )
    try {
      await axios.delete(`api/projects/${projectId}`);
      dispatch({ type: DELETE_PROJECT });
      dispatch(
        setAlert("Project and its tickets have been permanantly deleted")
      );
    } catch (err) {
      console.log("err response", err);
      dispatch({
        type: PROJECT_ERROR,
        payload: {
          msg: err.response.statusText,
          status: err.response.status
        }
      });
    }
};
