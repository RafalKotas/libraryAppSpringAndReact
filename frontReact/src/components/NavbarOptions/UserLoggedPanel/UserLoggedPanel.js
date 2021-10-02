import {faBook, faBookReader} from "@fortawesome/free-solid-svg-icons";
import PanelItem from "../PanelItem";

export default function UserLoggedPanel(props) {

    return (
        <div className="navbar-nav ml-auto">
            <PanelItem
                linkPath={"/reader/" + props.user.id + "/?currentPage=1&pageSize=5&resetPage=true"}
                additionalClasses={"vertical-line-right"}
                textContent={"Reader Panel"} 
                icon={faBookReader}
            />
            <PanelItem 
                linkPath={"/books/?currentPage=1&pageSize=5&resetPage=true"}
                additionalClasses={""}
                textContent={"All Books"}
                icon={faBook}
            />
        </div>
    )
}