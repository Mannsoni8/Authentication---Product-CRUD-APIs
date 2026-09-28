import { NavLink } from "react-router";

const Navbar = () => {
  return (
    <nav>
      <div>
        <NavLink to="/">E-Commerce Store</NavLink>
      </div>

      <div>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;