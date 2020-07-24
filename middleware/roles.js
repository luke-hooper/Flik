const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
  ac.grant("developer")
    .readOwn("Project")
    .updateOwn("Ticket")
    .readOwn("Ticket");

  ac.grant("projectLead")
    .extend("developer")
    .updateOwn("Project")
    .createOwn("Project")
    .deleteOwn("Project")
    .updateOwn("Ticket")
    .createOwn("Ticket")
    .deleteOwn("Ticket");

  ac.grant("admin")
    .updateAny("Project")
    .deleteAny("Project")
    .readAny("Project")
    .updateAny("User")
    .deleteAny("User")
    .readAny("User");

  return ac;
})();

/* Testing permissions
const permission = ac.can("admin").updateOwn("Project");
console.log(permission.granted); // —> true
console.log(permission.attributes);

*/
