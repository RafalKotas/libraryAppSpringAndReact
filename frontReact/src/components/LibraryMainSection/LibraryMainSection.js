//react
import { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";

import { useLocation } from "react-router-dom";

//components
import FilterSection from "./FilterSection/FilterSection";
import AllBooksSectionHeader from "./AllBooksSectionHeader/AllBooksSectionHeader";
import BookList from "./BookList/BookList";
import NoContentFound from "../common/NoContentFound/NoContentFound";

import CustomPagination from "../common/CustomPagination/CustomPagination";

//service(s)
import BookDataService from "../../services/book.service";

//data
import initialLBSSearchFilters from "./FilterSection/initialSearchFilters";

//styles
import "./LibraryMainSection.css"

export default function LibraryMainSection(props) {

    const history = useHistory();

    const [books, setBooks] = useState([]);

    const [pageCount, setPageCount] = useState(null);

    
    const pageSizes = [2, 5, 10];

    const ref = useRef(null);
    
    const [searchFilters, setSearchFilters] = useState(initialLBSSearchFilters);

    const search = (filters) => {
        console.log(filters)
        setSearchFilters(filters);
    }

    const getRequestParams = (newCurrentPage, pageSize) => {
        let parameters = {
            ...searchFilters
        }
        
        parameters["page"] = newCurrentPage;
        parameters["size"] = pageSize;

        return parameters;
    }

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();

    var queryParam_currentPage = query.get("currentPage");
    var queryParam_pageSize = query.get("pageSize");
    var queryParam_resetPage = query.get("resetPage");

    const retrieveBooks = (requestParams) => {
        BookDataService.getAllWithPagination(requestParams)
            .then(response => {
                const { books, totalPages} = response.data;
                setBooks(books);
                setPageCount(totalPages);
        },
        (error) => {
            console.log(error)
        }).then(
            window.scrollTo(0, 0)
        );
    }

    //na zmianę OBECNEJ STRONY, na nowo pobrać filtry -> nowy zbiór książek
    useEffect(() => {

        console.log("EFFECT 1 - currentPage changed.");
        const requestParams = getRequestParams(queryParam_currentPage - 1, queryParam_pageSize);

        retrieveBooks(requestParams);

        // eslint-disable-next-line
    }, [queryParam_currentPage])

    //na zmianę FILTRÓW WYSZUKIWANIA, na nowo pobrać filtry -> nowy zbiór książek
    useEffect(() => {

        console.log("EFFECT 2 - searchFilters changed.");

        history.push("/books/?currentPage=1&pageSize=" + queryParam_pageSize + "&resetPage=false");

        const requestParams = getRequestParams(queryParam_currentPage - 1, queryParam_pageSize);

        retrieveBooks(requestParams);

        // eslint-disable-next-line
    }, [searchFilters])

    useEffect(() => {

        console.log("EFFECT 3 - pageSize changed.");
        const requestParams = getRequestParams(queryParam_currentPage - 1, queryParam_pageSize);

        retrieveBooks(requestParams);

        // eslint-disable-next-line
    }, [queryParam_pageSize])

    useEffect(() => {
        
        let resetPage = (queryParam_resetPage === "true")

        if(resetPage) {
            console.log("EFFECT 4 - set back initial filters - PAGE RESET!");
            let requestParams = initialLBSSearchFilters;
            setSearchFilters(requestParams);
        }
    }, [queryParam_resetPage])

    const handlePageSizeChange = (e) => {
        console.log("handling pageSizeChange");
        history.push("/books/?currentPage=1&pageSize=" + e.target.value + "&resetPage=false");
    }

    return (
            <div id="libraryMainSection" className="list row">
                <section id="filterSection" className="border border-primary p-3 m-2 rounded-bottom col-md-3 h-100">
                    <FilterSection 
                        key="bookListFilters" 
                        parentCallback={search}
                        mainSectionFilters={searchFilters}
                    />
                </section>
        
                <div ref={ref} className="col-md-8 d-flex flex-column">

                    <AllBooksSectionHeader 
                        user={props.user} 
                        parentCallback={handlePageSizeChange} 
                        pageSizes={pageSizes} 
                        pageSize={queryParam_pageSize}
                    />
                    {pageCount !== 0 && searchFilters.size > 5 && <CustomPagination
                            linkValue={`/books/?currentPage=`}
                            secondLinkPart={`&pageSize=${queryParam_pageSize}&resetPage=false`}
                            totalPages={pageCount}
                            currentPage={queryParam_currentPage}
                            verticalPosition={"bottom"}
                            maxNeighbours={4}
                        />
                    }

                    {pageCount === 0 && <NoContentFound 
                        captions={[{header: "Section empty. Check reason on second slide"}, 
                        {header: "No books with selected filters found."}]}
                            componentWidth={ref.current.offsetWidth}
                        />}

                    {books && books.length > 0 && <BookList books={books}/>}

                    <br></br>

                    {pageCount !== 0 && <CustomPagination
                        linkValue={`/books/?currentPage=`}
                        secondLinkPart={`&pageSize=${queryParam_pageSize}&resetPage=false`}
                        totalPages={pageCount}
                        currentPage={queryParam_currentPage}
                        verticalPosition={"bottom"}
                        maxNeighbours={4}
                    />}
                </div>
            </div>
    )
}