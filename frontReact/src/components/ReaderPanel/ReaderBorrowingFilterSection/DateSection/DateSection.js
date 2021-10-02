import React, { useState, useEffect } from "react";

import FromToDatePicker from "./FromToDatePicker/FromToDatePicker";
import VerticalLineCustom from "../../../Stylistic/VerticalLineCustom";

export default function DateSection ({userId, userBookStatusSelected, 
    sendDateFiltersToFilterSection}) {

    const [initialDatesSend, markInitialDatesSend] = useState(false);

    const [dateBoundaryValues, setDateBoundaryValues] = useState({
        requestDateMinValue: null,
        requestDateMaxValue: null,
        borrowingDateMinValue: null,
        borrowingDateMaxValue: null,
        returnDateMinValue: null,
        returnDateMaxValue: null,
        /*from: {
            requestDate: null,
            borrowingDate: null,
            returnDate: null
        },
        to: {
            requestDate: null,
            borrowingDate: null,
            returnDate: null
        }*/
    });

    const setDateBound = (boundaryType, dateType, dateValue) => {

        const datePickersToPropertyMap = {
            from: {
                requestDate: "requestDateMinValue",
                borrowingDate: "borrowingDateMinValue",
                returnDate: "returnDateMinValue"
            },
            to: {
                requestDate: "requestDateMaxValue",
                borrowingDate: "borrowingDateMaxValue",
                returnDate: "returnDateMaxValue"
            }
        }

        console.log("-".repeat(50));
        console.log("previous date Boundaries: ");
        console.log(dateBoundaryValues);
        console.log("-".repeat(50));

        setDateBoundaryValues(prevState => ({
            ...prevState,
            [datePickersToPropertyMap[boundaryType][dateType]]: dateValue
        }))

        /*setDateBoundaryValues(prevState => ({
            ...prevState,
            [boundaryType]: {
                ...prevState[boundaryType],
                [dateType]: dateValue
            }
        }))*/
    }

    const checkIfSignificant = (dateType) => {
        switch (dateType) {
            case "requestDate":
                return true
            case "borrowingDate":
                return userBookStatusSelected !== "IN_QUEUE";
            case "returnDate":
                return userBookStatusSelected === "RETURNED" || 
                        userBookStatusSelected === "ALL";
            default:
                return true;
          }
    }

    useEffect(() => {
        sendDateFiltersToFilterSection(dateBoundaryValues);
        // eslint-disable-next-line
    }, [dateBoundaryValues])

    useEffect(() => {

        const datePickersToPropertyMap = {
            from: {
                requestDate: "requestDateMinValue",
                borrowingDate: "borrowingDateMinValue",
                returnDate: "returnDateMinValue"
            },
            to: {
                requestDate: "requestDateMaxValue",
                borrowingDate: "borrowingDateMaxValue",
                returnDate: "returnDateMaxValue"
            }
        }

        let tmpDateBoundaries = {};
        let datesFilled = 0;

        /*
        dateBoundaryValues = {requestDateMinValue: null,
        requestDateMaxValue: null,
        borrowingDateMinValue: null,
        borrowingDateMaxValue: null,
        returnDateMinValue: null,
        returnDateMaxValue: null}
        */

        /*Object.keys(dateBoundaryValues).forEach((bound_key) => {
            Object.keys(dateBoundaryValues[bound_key]).forEach((key2) => {
                let tmpVal = dateBoundaryValues[ bound_key ][ key2 ];
                let tmpKey = datePickersToPropertyMap[ bound_key ][ key2 ];
                if( tmpVal !== null) {
                    tmpDateBoundaries[ tmpKey ] = tmpVal.substr(0, 10);
                    datesFilled++;
                }
            })
        })*/

        Object.keys(datePickersToPropertyMap).forEach((bound_key) => {
            Object.keys(datePickersToPropertyMap[bound_key]).forEach((dateTypeKey) => {
                let dateBoundaryValuesKey = datePickersToPropertyMap[ bound_key ][ dateTypeKey ];
                let tmpVal = dateBoundaryValues[ dateBoundaryValuesKey ];
                if( tmpVal !== null) {
                    tmpDateBoundaries[ dateBoundaryValuesKey ] = tmpVal.substr(0, 10);
                    datesFilled++;
                }
            })
        })

        

        if(datesFilled === 6 && !initialDatesSend) {
            console.log(tmpDateBoundaries);
            sendDateFiltersToFilterSection(tmpDateBoundaries);
            markInitialDatesSend(true);
        }
    }, [dateBoundaryValues, initialDatesSend, sendDateFiltersToFilterSection])

    return (
        <div
            key={"Reader-" + userId + "-datePicker"} 
            className={"d-flex border border-dark rounded w-75 p-2 m-2"}
        >
            {
                ["requestDate", "borrowingDate", "returnDate"].map(dateType => {
                    return (
                        <React.Fragment key={dateType + "-datePicker"}>
                            <FromToDatePicker
                                key={dateType + "-picker"}
                                significant={checkIfSignificant(dateType)}
                                property={dateType}
                                sendPropertyValueToParentFunc={setDateBound}
                                userId={userId}
                            />
                            {dateType !== "returnDate" && <VerticalLineCustom key={"vertical-line-custom-" + dateType}/>}
                        </React.Fragment>
                    )
                })
            }
        </div>
    )

}