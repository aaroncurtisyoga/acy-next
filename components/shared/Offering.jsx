import React from "react";

function Offering({ time, name, location, link }) {
  return (
    <p>
      {time} - {name} - {location}
      <a href={link} rel="noreferrer" target="_blank">
        {" "}
        <em>Sign Up</em>
      </a>
    </p>
  );
}

export default Offering;
