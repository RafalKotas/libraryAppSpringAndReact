import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function PanelItem(props) {

    return (
        <li className="nav-item">
            <Link to={props.linkPath} className={"nav-link " + props.additionalClasses}>
                {props.textContent} <FontAwesomeIcon icon={props.icon} />
            </Link>
        </li>
    )
}