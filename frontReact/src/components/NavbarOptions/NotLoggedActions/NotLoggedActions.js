import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSignInAlt, faUserPlus} from "@fortawesome/free-solid-svg-icons";

export default function NotLoggedActions() {
    return (
        <div className="navbar-nav ml-auto">
            <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                    <FontAwesomeIcon icon={faSignInAlt} /> Login 
                </Link>
            </li>

            <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                    <FontAwesomeIcon icon={faUserPlus} /> Sign Up 
                </Link>
            </li>
        </div>
    )
}