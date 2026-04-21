import { Link } from "react-router-dom";
import Parse from "parse";

const Navbar = ({ setFlag }) => {
    const currentUser = Parse.User.current();
    const logout = () => {
        Parse.User.logOut()
            .then(() => {
                setFlag(false);
                alert("You successfully logged out!");
                window.location.reload();
            })
            .catch((error) => {
                alert(`Error: ${error.message}`);
            });
    }
    return (
        <nav>{!currentUser && (
            <ul>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
            </ul>
          )  }
            {currentUser && (
                <>
                <h1>Hello, {currentUser.get("firstName")}</h1>
                <ul>
                    <li>
                        <button onClick={logout}>Logout</button>
                    </li>
                </ul>
                </>
                )}
        </nav>
    )
}

export default Navbar;