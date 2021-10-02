import "../CustomPagination.css"
import {Link} from "react-router-dom";

import "./PaginationElement.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCaretLeft, faStepBackward, faStepForward, faCaretRight} from "@fortawesome/free-solid-svg-icons";


export default function PaginationElement (props) {


    let highlight = props.selected;

    const basicClasses = "rounded mx-1 d-flex justify-content-center mb-1 ";

    const returnProperIcon = () => {
        switch (props.pageMark) {
            case "<":
                return <FontAwesomeIcon icon={faCaretLeft} />
            case "|<":
                return <FontAwesomeIcon icon={faStepBackward} />
            case ">":
                return <FontAwesomeIcon icon={faCaretRight} />
            case ">|":
                return <FontAwesomeIcon icon={faStepForward} />       
            default:
                return <b>{props.pageMark}</b>
        }
    }

    const returnProperPage = () => {
        if(isNaN(props.pageMark)) {
            switch (props.pageMark) {
                case "<":
                    return props.currentPage - 1;
                case ">":
                    return props.currentPage + 1;
                case "|<":
                    return 1;
                case ">|":
                    return props.totalPages;       
                default:
                  break;
            }
        } else {
            return parseInt(props.pageMark);
        }
    }

    const markFirstElement = () => {
        return props.pageMark === 1 ? "firstPaginationElement " : ""
    }

    const markLastElement = () => {
        return (props.pageMark === props.totalPages ? "lastPaginationElement " : "")
    }

    const disableEdgeButtonCond = (sign) => {
        return isNaN(props.pageMark) && props.pageMark.split("").includes(sign) 
    }

    const disablePreviousCond = disableEdgeButtonCond("<") && props.currentPage === 1;
    const disableNextCond = disableEdgeButtonCond(">") && props.totalPages && props.totalPages === props.currentPage;

    return (
        <Link className="notUnderscored" to={props.linkValue + returnProperPage() + props.secondLinkPart}>
            <button
                disabled={disablePreviousCond || disableNextCond}
                className={basicClasses + 
                            (highlight ? "selectedElement " : "") + 
                            markFirstElement() + 
                            markLastElement()}
                style={{width: "30px", height: "auto"}}>
                    <span>{returnProperIcon()}</span>
            </button>
        </Link>
    )
}