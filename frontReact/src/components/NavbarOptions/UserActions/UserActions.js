import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";

export default function UserActions(props) {
    return (
        <div className="navbar-nav ml-auto">
            <li className="nav-item">
                <Link to={"/profile"} className="nav-link vertical-line-right">
                    {props.user.username} <FontAwesomeIcon icon={faUser} />
                </Link>
            </li>
            <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={props.logOutFunc}>
                    LogOut <FontAwesomeIcon icon={faSignOutAlt} />
                </Link>
            </li>
        </div>
    )
}