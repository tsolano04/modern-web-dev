import { Link } from "react-router-dom";
import Parse from "parse";

const Navbar = () => {
    const currentUser = Parse.User.current();
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/register">Register</Link>
                </li>
            </ul>
            {currentUser && <h1>Hello, {currentUser.get("firstName")}</h1>}
        </nav>
    )
}

export default Navbar;