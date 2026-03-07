import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/addSong">Add Song</Link>
                    </li>
                    <li>
                        <Link to="/pieChart">Pie Chart</Link>
                    </li>
                </ul>
            </nav>
        </footer>
    )
}

export default Footer;