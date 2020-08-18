import {
  GET_TICKETS,
  TICKET_ERROR,
  CLEAR_TICKETS,
  CLEAR_TICKET,
  GET_TICKET
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
      return {
        ...state,
        tickets: payload,
        loading: false
      };
    case GET_TICKET:
      return {
        ...state,
        ticket: payload,
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
      return { ...state, tickets: null, loading: true };
    case CLEAR_TICKET:
      return { ...state, ticket: null, loading: true };

    default:
      return state;
  }
}
