<div className='profiles'>
  {profiles.length > 0 ? (
    profiles.map(profile => <ProfileItem key={profile._id} profile={profile} />)
  ) : (
    <h4>No Profiles Found!</h4>
  )}
</div>;

<table className='table'>
  <thead>
    <tr>
      <th scope='col'>Name</th>
      <th scope='col'>Description</th>
      <th scope='col'>Status</th>
      <th scope='col'>Priority</th>
    </tr>
  </thead>
  <tbody>
    tickets.map(ticket =>
    <TableItem key={ticket.id} ticket={ticket} />)
  </tbody>
</table>;

//

import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const TableItems = ({ tickets: { tickets }, itemType }) => {
  const importantTickets = tickets.filter(ticket => ticket.priority === "high");
  const openTickets = tickets.filter(ticket => ticket.status === "waiting");
  return (
    <tbody>
      {importantTickets.map(ticket => (
        <tr key={ticket.id}>
          <td>{ticket.title ? ticket.title : <p>N/A</p>}</td>
          <td>{ticket.description ? ticket.description : <p>N/A</p>}</td>
          <td>{ticket.status ? ticket.status : <p>N/A</p>}</td>
          <td>{ticket.priority ? ticket.priority : <p>N/A</p>}</td>
        </tr>
      ))}
    </tbody>
  );
};

TableItems.propTypes = {
  tickets: PropTypes.object.isRequired,
  itemType: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  tickets: state.tickets
});

export default connect(mapStateToProps)(TableItems);
