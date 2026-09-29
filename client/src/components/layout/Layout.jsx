import { Outlet, useLocation } from "react-router";
import Navbar from "./Navbar.jsx";

const Layout = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Hide navbar on authentication pages for a cleaner UX.
  // WHY: User requested that /login and /register should not show navbar.
  const hideNavbar = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </>
  );
};

export default Layout;