//react
import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router";
import { useLocation } from "react-router-dom";

//components
import ReaderBorrowingFilterSection from "./ReaderBorrowingFilterSection/ReaderBorrowingFilterSection";
import UserBooksTable from "./UserBooksTable/UserBooksTable";
import CustomPagination from "../common/CustomPagination/CustomPagination";
import NoContentFound from "../common/NoContentFound/NoContentFound";

//components Material-UI
import 'date-fns';

//styles
import "./ReaderPanel.css"
import bookBorrowingsService from "../../services/bookBorrowings.service";
import LogoutScreen from "../common/LogoutScreen/LogoutScreen";


export default function ReaderPanel() {

    const ref = useRef(null);

    const history = useHistory();
    const params = useParams();
    const [userBorrowings, setUserBorrowings] = useState(null);
    
    const [returnedBookId, setReturnedBookId] = useState(-1);
    const [pageCount, setPageCount] = useState(null);
    const [responseMessage, setResponseMessage] = useState(null);

    const dateFiltersInitial = {
        requestDateMinValue: "1900-12-31T00:00",
        requestDateMaxValue: "2100-12-31T23:59",
        borrowingDateMinValue: "1900-01-01T00:00",
        borrowingDateMaxValue: "2100-12-31T23:59",
        returnDateMinValue: "1900-01-01T00:00",
        returnDateMaxValue: "2100-12-31T23:59",
    }

    const initialFilters = {
        userBookStatusSelected: "ALL",
        paginationParams: {pageSize: 5, currentPage: 1},
        dateBoundaryValues: dateFiltersInitial
    }

    const [filters, setFilters] = useState(initialFilters);

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();

    let queryParam_currentPage = query.get("currentPage");
    let queryParam_pageSize = query.get("pageSize");
    let queryParam_resetPage = query.get("resetPage");

    const retrieveUserBorrowings = () => {
        bookBorrowingsService.getUserBorrowingsWithPagination(
            params.id, 
            {pageSize: queryParam_pageSize, currentPage: queryParam_currentPage - 1},
            filters.userBookStatusSelected,
            filters.dateBoundaryValues)
            .then(response => {
                if(response.data.message) {
                    setResponseMessage(response.data.message);
                } else {
                    setResponseMessage(null);
                }
                const { bookBorrowings, totalPages} = response.data;
                setUserBorrowings(bookBorrowings);
                setPageCount(totalPages);
        })
    }

    const checkIfAcountDeleted = () => {
        return responseMessage?.startsWith("ACCOUNT DELETED");
    }
    
    const numberNotMoreThanZero = (numb) => {
        return numb === undefined || numb === null || numb === 0;
    }
    
    const fillReturnData = (book_id) => {
        setReturnedBookId(book_id);
    };

    const resetFilters = () => {
        setFilters(initialFilters);
    }

    //na zmianę OBECNEJ STRONY pobranie nowego podzbioru książek
    useEffect(() => {
        retrieveUserBorrowings();
        // eslint-disable-next-line
    }, [queryParam_currentPage])

    const applyFiltersFromFilterSection = (filtersFromFilterSection) => {

        setFilters({
            ...filters,
            userBookStatusSelected: filtersFromFilterSection.userBookStatusSelected,
            dateBoundaryValues: filtersFromFilterSection.dateBoundaryValues,
            paginationParams: {
                ...filters.paginationParams,
                pageSize: filtersFromFilterSection.pageSize
            }
        });

    }

    useEffect(() => {
        console.log("new filters applied!");
        
        let pageSize = filters.pageSize ? filters.pageSize : filters.paginationParams.pageSize;

        history.push("/reader/" + params.id + "/?currentPage=1&pageSize=" + pageSize + "&resetPage=false");
        
        retrieveUserBorrowings();
        // eslint-disable-next-line
    }, [filters])

    useEffect(() => {
        retrieveUserBorrowings();
        // eslint-disable-next-line
    }, [queryParam_pageSize, filters.userBookStatusSelected])

    useEffect(() => {

        console.log("step 1 reset filters");
        let resetPage = (queryParam_resetPage === "true");

        if(resetPage) {

            console.log("previous filters (before reset): ");
            console.log(filters);

            let requestParams = {
                userBookStatusSelected: "ALL",
                paginationParams: {pageSize: 5, currentPage: 1},
                dateBoundaryValues: dateFiltersInitial,
            }

            history.push("/reader/" + params.id + "/?currentPage=1&pageSize=5&resetPage=true");

            setFilters(requestParams);
        }

        // eslint-disable-next-line
    }, [queryParam_resetPage])

    useEffect(() => {

        if( !(filters.dateBoundaryValues == null || filters.dateBoundaryValues === undefined) && returnedBookId !== -1) {
            history.push("/reader/5/?currentPage=" + queryParam_currentPage + "&pageSize=" +  queryParam_pageSize + "&resetPage=false");
            retrieveUserBorrowings();
        }
        
        // eslint-disable-next-line
    }, [returnedBookId]);

    return (
            <div
                ref={ref} 
                className="container"
            >
                {
                    !responseMessage ? 
                    <React.Fragment>
                        <ReaderBorrowingFilterSection
                            key={"reader-" + params.id + "-borrowingsFilterSection"}
                            userId={params.id}
                            requestForResetFilters={resetFilters}
                            sendFiltersToReaderPanel={applyFiltersFromFilterSection}
                            parentDateBoundaries={filters.dateBoundaryValues}
                        />
                        <h2 id="borrowingsHeader" className="d-flex m-2 justify-content-center">
                            User borrowings history {"(" + filters.userBookStatusSelected + " books )"}:
                        </h2>
                        {userBorrowings && userBorrowings.length > 0 &&                     
                            <UserBooksTable
                                key={"recentlyReturned-" + returnedBookId + "-userBooksTable"}
                                data={userBorrowings}
                                headers={["Title", "Author", "Request date", "Borrowing date", "Return date"]}
                                userID={params.id}
                                parentCallback={fillReturnData}
                        />}
                        {
                            !numberNotMoreThanZero(pageCount) &&
                                <CustomPagination
                                    linkValue={"/reader/" + params.id + "/?currentPage="}
                                    secondLinkPart={`&pageSize=${queryParam_pageSize}&resetPage=false`}
                                    key={"CustomPagination-ReaderPanel"}
                                    totalPages={pageCount}
                                    currentPage={queryParam_currentPage}
                                    maxNeighbours={3}
                                /> 
                        }
                    </React.Fragment> 
                        : 
                    (checkIfAcountDeleted() ? 
                        <LogoutScreen
                            userID={params.id}
                        /> : 
                        <NoContentFound
                            key={"NoContentFound-ReaderPanel"}
                            captions={
                                [{header: "Section empty. Check reason on second slide."},
                                {header: responseMessage}]
                            }
                            componentWidth={ref.current.offsetWidth}
                        />
                    )
                }
            </div> 
    )
}