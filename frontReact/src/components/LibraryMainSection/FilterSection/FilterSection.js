import React, {useState} from "react";

//components
import SingleTextFilter from "./SingleTextFilter/SingleTextFilter";
import SelectFilter from "../../common/SelectFilter/SelectFilter";
import StatusFilters from "./StatusFilters/StatusFilters";

//services
import bookService from "../../../services/book.service";

function FilterSection(props) {

    const [filters, setFilters] = useState(props.mainSectionFilters);

    const placeholders = {
        title: "title",
        author: "author",
        genre: "genre",
        description: "description",
        yearPublishedMinimum: "min year",
        yearPublishedMaximum: "max year"
    }

    const basicProperties = ["genre", "title", "author", "description"];
    

    const getPropertyFromChild = (property, value) => {
        let desiredValue = (property === "genre" && value === "All") ? "" : value;
        setFilters({
            ...filters,
            [property]: desiredValue
        });
    }

    const sendPropertiesToBooksList = () => {
        props.parentCallback(filters);
    }

    const extractSortCriteria = (sortCriteria) => {
        let criterium = sortCriteria.substring(0,5) === "title" ? "title" : "author";
        let order = sortCriteria.substr(-3) === "Asc" ? "ascending" : "descending";

        return {"criterium" : criterium, "order" : order};
    }

    const handleSortCriteriumChange = (event) => {
        let criteriumAndOrder = extractSortCriteria(event.target.value);
        setFilters({
            ...filters,
            sortCriterium: criteriumAndOrder.criterium,
            sortOrder: criteriumAndOrder.order
        });
    }

    const getSelectedBorrowingStatus = (borrowingStatus) => {
        setFilters({
            ...filters,
            status: borrowingStatus
        })
    }

    return (
        <React.Fragment key="mainSectionFilter">
            <div className="input-group mb-3 d-flex flex-column justify-content-center">
                <h2>Filters:</h2>
                <label htmlFor="sort"><b>Sort by:</b></label>
                <select className="border rounded" name="sort" onChange={handleSortCriteriumChange}>
                        <option value="titleAsc">Title ascending</option>
                        <option value="titleDesc">Title descending</option>
                        <option value="authorAsc">Author ascending</option>
                        <option value="authorDesc">Author descending</option>
                </select>
                {basicProperties.map((property) => {
                    if(property !== "genre") {
                        return (
                            <SingleTextFilter
                                key={property + "-SingleTextFilter"}
                                filterType={"text"}
                                propertyName={property}
                                propertyLabel={property}
                                valueFromMainSection={props.mainSectionFilters[property]}
                                placeholderVal={placeholders[property]} 
                                parentCallback={getPropertyFromChild}
                            />
                        )
                    } else {
                            return (
                                <SelectFilter
                                    key={property + "-SelectTextFilter"} //const
                                    filterType={"text"} //const
                                    serviceMethod={true} //const
                                    propertyName={property} //const
                                    getOptions={bookService.getAllBookGenres} //const
                                    parentCallback={getPropertyFromChild} //const
                                    currentOption={props.mainSectionFilters.genre}
                                />
                            )
                    }
                })}
                <div id="yearFilters" className={"w-100"}>
                    <h4 className={"m-0"}>Year published:</h4>
                    <div className={"d-flex m-0"}>
                        <SingleTextFilter
                            key={"minimumYearPublished-singleTextFilter"}
                            filterType={"number"}
                            propertyName={"yearPublishedMinimum"}
                            propertyLabel={"Min year"}
                            valueFromMainSection={props.mainSectionFilters["yearPublishedMinimum"]}
                            placeholderVal={placeholders["yearPublishedMinimum"]} 
                            parentCallback={getPropertyFromChild}/>
                        <SingleTextFilter
                            key={"maximumYearPublished-singleTextFilter"}
                            filterType={"number"}
                            propertyName={"yearPublishedMaximum"}
                            propertyLabel={"Max year"}
                            valueFromMainSection={props.mainSectionFilters["yearPublishedMaximum"]}
                            placeholderVal={placeholders["yearPublishedMaximum"]} 
                            parentCallback={getPropertyFromChild}/>
                    </div>
                </div>
                <StatusFilters parentCallback={getSelectedBorrowingStatus}/>
                <button className="btn-primary rounded m-1" type="button" onClick={sendPropertiesToBooksList}>
                    Apply
                </button>
            </div>
        </React.Fragment>
    )
}

export default FilterSection;