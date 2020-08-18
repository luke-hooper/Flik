import { combineReducers } from "redux";

import alert from "./alert";
import auth from "./auth";
import tickets from "./tickets";
import projects from "./projects";

export default combineReducers({ alert, auth, tickets, projects });
