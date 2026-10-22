import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function Navbar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="flex items-center justify-between px-6 py-3">
      {/* <NavLink to="/posts">Posts</NavLink> */}

      {currentUser ? (
        <div className="flex items-center gap-4">
          <span>Hi, {currentUser.name}</span>
          <button type="button" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="flex gap-4">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Sign up</NavLink>
        </div>
      )}
    </nav>
  );
}

export default Navbar;