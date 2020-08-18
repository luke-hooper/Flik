import axios from "axios";

import {
  GET_PROJECTS,
  PROJECT_ERROR,
  CLEAR_PROJECTS,
  GET_PROJECT,
  CLEAR_PROJECT
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
