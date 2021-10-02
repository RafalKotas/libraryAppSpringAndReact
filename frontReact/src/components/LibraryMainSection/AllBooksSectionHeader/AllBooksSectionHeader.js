import React from "react";
import Tooltip from '@material-ui/core/Tooltip';
import "./AllBooksSectionHeader.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlusSquare, faMinus} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

export default function AllBooksSectionHeader(props) {

    return (
        <React.Fragment>
            <h3 id="bookListHeader" className="align-self-center">Books List</h3>

            <section id="actionBar" className="d-flex flex-row align-items-center m-2">
                
                <div id="booksPerPageDiv" className="border border-dark p-2 rounded">
                    <span>{"Books per page:" }&nbsp;</span>

                    <select id="booksPerPageSelect" onChange={props.parentCallback} value={props.pageSize}>
                        {props.pageSizes.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                {
                    props.user.roles.includes("ROLE_LIBRARIAN") 
                    &&
                    <section id="bookActions">
                        <Tooltip className={"m-2"} title={<span className="tooltipHeader">Remove all books from library!</span>} placement="top" >
                            <button className={"btn btn-danger"}>
                                <FontAwesomeIcon icon={faMinus} /> Delete all
                            </button>
                        </Tooltip>

                        <Tooltip  className={"m-2"} title={<span className="tooltipHeader">Add new book to library!</span>} placement="right" >
                            <Link to={"/book/add"} style={{ textDecoration: 'none' }}>
                                <button className={"btn btn-primary"}>
                                    <FontAwesomeIcon icon={faPlusSquare} /> Add
                                </button>
                            </Link>
                        </Tooltip>
                    </section> 
                }
            </section>
        </React.Fragment>
    )
}