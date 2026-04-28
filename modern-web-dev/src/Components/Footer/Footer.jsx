import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="px-6 py-3 border-t border-border text-xs text-muted-foreground">
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
                    <li>
                        <Link to="/leagues">Leagues</Link>
                    </li>
                </ul>
            </nav>
        </footer>
    )
};

export default Footer;