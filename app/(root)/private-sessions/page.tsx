import { redirect } from "next/navigation";

const PrivateSessionsPage = () => {
  // Redirect to the welcome page where people can Log In or Change Users
  redirect("/private-sessions/welcome");
};

export default PrivateSessionsPage;
