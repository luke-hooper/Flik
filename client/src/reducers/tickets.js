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
} from "../actions/types";

const initialState = {
  ticket: null,
  tickets: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_TICKETS:
    case GET_PROJECT_TICKETS:
      return {
        ...state,
        tickets: payload,
        loading: false
      };
    case GET_TICKET:
    case ADD_TICKET:
    case UPDATE_TICKET:
      return {
        ...state,
        ticket: payload,
        loading: false
      };
    case DELETE_TICKET:
      return {
        ...state,
        ticket: null,
        tickets: state.tickets.filter(ticket => ticket._id !== payload),
        loading: false
      };

    case TICKET_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        ticket: null
      };
    case CLEAR_TICKETS:
      return { ...state, tickets: [], loading: false };
    case CLEAR_TICKET:
      return { ...state, ticket: null, loading: false };

    default:
      return state;
  }
}
