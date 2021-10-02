import React, {useState} from "react";

import DateSection from './DateSection/DateSection';

import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
//import ReactTooltip from 'react-tooltip';

import SelectFilter from "../../common/SelectFilter/SelectFilter"

export default function ReaderBorrowingFilterSection({userId, requestForResetFilters, sendFiltersToReaderPanel}) {
    
    const [filters, setFilters] = useState({
        dateBoundaryValues: null,
        userBookStatusSelected: "ALL",
        pageSize: 5
    });

    //user-book relation
    const getUserBookStatus = () => {
        return ["ALL", "ON_HANDS", "IN_QUEUE", "RETURNED"]
    }

    const setUserBookStatus = (_ , userBookStatusSelected) => {
        setFilters({
            ...filters,
            userBookStatusSelected: userBookStatusSelected
        })
    }

    //TODO pagSize: "ALL" ?
    const setBorrowingsPageSize = (propName, pageSizeSelected) => {
        let updatedFilters = filters;
        updatedFilters[propName] = pageSizeSelected
        setFilters({
            ...updatedFilters
        })
    }

    const collectAndSendFiltersToParent = () => {
        sendFiltersToReaderPanel( filters );
    }

    const resetFilters = () => {
        requestForResetFilters();
    }

    //page size
    const getPageSizes = () => {
        return [5, 10, 20, 50, 100, 150];
    }

    const selectFilters = {
        "userBookStatusSelected": {
            "optionsFunction": getUserBookStatus,
            "parentCallbackFunction": setUserBookStatus
        },
        "pageSize": {
            "optionsFunction": getPageSizes,
            "parentCallbackFunction": setBorrowingsPageSize
        }
    }

    //ok musi być pobranie zakresu dat do wybrania
    const getDateFilters = (dateBoundaries) => {
        setFilters({
            ...filters,
            dateBoundaryValues: dateBoundaries
        });
    }

    const logFilters = () => {
        console.log(filters);
    }

    return (
        <FormControl key={"Reader-" + userId + "-panelFormControl"} id="ReaderPanelFormControl">
            <Grid key={"Reader-" + userId + "filters"} className={"d-flex flex-row justify-content-between"}>
                <DateSection userId={userId}
                    userBookStatusSelected={filters.userBookStatusSelected}
                    sendDateFiltersToFilterSection={getDateFilters}
                />
                <div id="borrowingParametersOnRight" className={"d-flex flex-column"}>
                    {
                        Object.keys(selectFilters).map(propName => {
                            return (
                                <SelectFilter
                                    key={"SelectFilter-" + propName}
                                    className={"d-flex align-self-end"}
                                    serviceMethod={false}
                                    getOptions={selectFilters[propName]["optionsFunction"]}
                                    currentOption={filters[propName]}
                                    propertyName={propName}
                                    parentCallback={selectFilters[propName]["parentCallbackFunction"]}
                                />
                            )
                        })
                    }
                </div>
            </Grid>
            <Grid 
                key="applyButtonGrid" 
                className={"d-flex justify-content-center"}
            >
                <Button
                    key="Button-ApplyReaderBorrowingFilters"
                    variant="contained" 
                    className={"w-25"}
                    onClick={collectAndSendFiltersToParent}
                >
                    Apply Filters!
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    className={"w-25 ml-2"}
                    onClick={resetFilters}
                >
                    Reset filters!
                </Button>
                <Button
                    variant="contained"
                    className={"w-25 ml-2"}
                    onClick={logFilters}
                >
                    Log filters!
                </Button>
            </Grid>
        </FormControl>
    )
}