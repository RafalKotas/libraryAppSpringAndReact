import {Link} from "react-router-dom";
import React, { useState, useEffect } from "react";
import PaginationElement from "./PaginationElement/PaginationElement";

import "./CustomPagination.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faLongArrowAltRight} from "@fortawesome/free-solid-svg-icons";

export default function CustomPagination(props) {

    const [pagesToRender, setPagesToRender] = useState(null)

    useEffect(() => {

        const pageNumberInNeighbourRange = (index) => {

            return ( Math.abs(index - props.currentPage) <= props.maxNeighbours )
        }

        let tmpPageNumbers = []

        for(let i = 1; i <= props.totalPages; i++) {
            if(pageNumberInNeighbourRange(i)) {
                tmpPageNumbers.push(i);
            }
        }
        if(!tmpPageNumbers.includes(1))
            tmpPageNumbers.unshift(1);
        if(!tmpPageNumbers.includes(props.totalPages))
            tmpPageNumbers.push(props.totalPages);
        setPagesToRender(tmpPageNumbers)
    },[props.currentPage, props.totalPages, props.maxNeighbours])

    const [pageInInputSelected, setPageInInputSelected] = useState(props.currentPage);

    const handleCurrentPageChange = (event) => {
        if(pageNumberInsideBounds(event.target.value)) {
            setPageInInputSelected(event.target.value)
        }
    }

    const pageNumberInsideBounds = (pageNumber) => {
        return (pageNumber <= props.totalPages && pageNumber > 0)
    }

    const sendNewCurrentPageToParent = (newCurrentPage) => {
        props.passNewCurrentPageToList(newCurrentPage);
    }

    const currentPageParsed = parseInt(props.currentPage);

    const selected = (index) => {
        return (index === currentPageParsed);
    }

    return(
        <React.Fragment key={"customPagination-current-" + currentPageParsed + "-total-" + props.totalPages}>
            <div className={"d-flex flex-row flex-wrap justify-content-center"}>
                {
                    (currentPageParsed !== 1) && (<React.Fragment key={"paginationElementPrevAndFirst"}>
                        
                        <PaginationElement
                            key={"pagElem-|<"}
                            linkValue={props.linkValue}
                            secondLinkPart={props.secondLinkPart}
                            passNewCurrentPage={sendNewCurrentPageToParent} 
                            pageMark={"|<"} 
                            currentPage={currentPageParsed}
                            totalPages={props.totalPages}
                        />
                        <PaginationElement
                            key={"pagElem-<"}
                            linkValue={props.linkValue}
                            secondLinkPart={props.secondLinkPart}
                            passNewCurrentPage={sendNewCurrentPageToParent} 
                            pageMark={"<"} 
                            currentPage={currentPageParsed}
                        />

                    </React.Fragment>)
                }



                {
                    pagesToRender && pagesToRender.map((pageNumber, index) => {
                        return (
                            <React.Fragment key={"paginationElementWithNumber-" + pageNumber}>
                                <PaginationElement
                                        key={"pagElem-" + pageNumber}
                                        linkValue={props.linkValue}
                                        secondLinkPart={props.secondLinkPart}
                                        elementIndex={pageNumber}
                                        totalPages={props.totalPages}
                                        edgePage={(pageNumber === 1 || pageNumber === props.totalPages) && !selected(pageNumber)}
                                        passNewCurrentPage={sendNewCurrentPageToParent}
                                        pageMark={pageNumber}
                                        selected={selected(pageNumber)} 
                                        currentPage={currentPageParsed}
                                />
                                {pagesToRender[index + 1] - pagesToRender[index] > 1 && <div>...</div>}
                            </React.Fragment>
                        )
                    })
                }


                {
                    (currentPageParsed !== props.totalPages) && (<React.Fragment key={"paginationElementNextAndLast"}>
                        
                        <PaginationElement
                            key={"pagElem->"}
                            linkValue={props.linkValue}
                            secondLinkPart={props.secondLinkPart}
                            passNewCurrentPage={sendNewCurrentPageToParent} 
                            pageMark={">"} 
                            currentPage={currentPageParsed}
                            totalPages={props.totalPages}
                        />
                        <PaginationElement
                            key={"pagElem->|"}
                            linkValue={props.linkValue}
                            secondLinkPart={props.secondLinkPart}
                            passNewCurrentPage={sendNewCurrentPageToParent} 
                            pageMark={">|"} 
                            currentPage={currentPageParsed}
                            totalPages={props.totalPages}
                        />

                    </React.Fragment>)
                }
            </div>

            <div className="d-flex flex-row justify-content-center p-2">
                <Link 
                    className="notUnderscored" to={props.linkValue + pageInInputSelected + props.secondLinkPart}
                    key={"PaginationGoToPageButton"}
                >
                    <button className="btn btn-primary">
                        Go To Page 
                        <FontAwesomeIcon 
                            icon={faLongArrowAltRight}
                            key={"goToPageKeyIcon"}
                        />
                    </button>
                </Link>
                <input 
                    className="ml-1 maxPaginationInputLength"
                    type="number" 
                    value={pageInInputSelected} 
                    onChange={handleCurrentPageChange}
                />
            </div>
        </React.Fragment>
    )
}