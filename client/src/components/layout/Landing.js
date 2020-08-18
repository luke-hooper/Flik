import React from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";

const Landing = props => {
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='large spaced'>Collaborative Bug Tracking Made Easy</h1>
          <p className='medium spaced'>
            An easy to use online application for teams to track bugs in their
            code. Project leaders can assign tickets to developers on their
            team.
          </p>
          <div className='buttons medium'>
            <Link to='/register' className='btn btn-primary'>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {};

export default Landing;
