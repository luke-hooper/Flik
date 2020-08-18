import {
  GET_PROJECTS,
  PROJECT_ERROR,
  CLEAR_PROJECTS,
  CLEAR_PROJECT,
  GET_PROJECT
} from "../actions/types";

const initialState = {
  project: null,
  projects: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_PROJECTS:
      return {
        ...state,
        projects: payload,
        loading: false
      };
    case PROJECT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        project: null
      };
    case CLEAR_PROJECTS:
      return {
        ...state,
        projects: null,
        loading: true
      };
    case GET_PROJECT:
      return {
        ...state,
        project: payload,
        loading: false
      };
    case CLEAR_PROJECT:
      return {
        ...state,
        project: null,
        loading: true
      };
    default:
      return state;
  }
}
