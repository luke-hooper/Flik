import React, { Fragment } from "react";

import PropTypes from "prop-types";

const TableItems = ({ tickets: { title, description, status, priority } }) => {
  return (
    <tbody>
      <tr>
        <td>{title ? title : <p>N/A</p>}</td>
        <td>{description ? description : <p>N/A</p>}</td>
        <td>{status ? status : <p>N/A</p>}</td>
        <td>{priority ? priority : <p>N/A</p>}</td>
      </tr>
    </tbody>
  );
};

TableItems.propTypes = {
  tickets: PropTypes.object.isRequired
};

export default TableItems;
