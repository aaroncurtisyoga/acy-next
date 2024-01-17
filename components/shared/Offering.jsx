function Offering({ time, name, location, link }) {
  return (
    // Todo: replace w/ tailwind styles on hover
    <p id={"offering"}>
      {time} - {name} - {location} -
      <a className={"sign-up"} href={link} rel="noreferrer" target="_blank">
        Sign Up
      </a>
    </p>
  );
}

export default Offering;
