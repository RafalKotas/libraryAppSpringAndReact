//react
import React, { useEffect, useState } from "react";

import DateFnsUtils from '@date-io/date-fns';

//material-ui-components
import Grid from '@material-ui/core/Grid';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';

import bookBorrowingsService from "../../../../../services/bookBorrowings.service";

export default function FromToDatePicker({sendPropertyValueToParentFunc, property, userId, significant}) {

    const [lowerBound, setLowerBound] = useState(null);
    const [upperBound, setUpperBound] = useState(null);

    const [earlierDateSelected, setEarlierDateSelected] = useState(null);
    const [laterDateSelected, setLaterDateSelected] = useState(null);

    const handleDateFromChange = (date) => {
        setEarlierDateSelected(date);
    };

    const handleDateToChange = (date) => {
        setLaterDateSelected(date);
    };

    const convertDateToRequiredFormat = (date) => {
        var dateInRequiredFormat;
        if(typeof(date) !== "string") {
            var DD = String(date.getDate()).padStart(2, '0');
            var MM = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            var hh = String(date.getHours()).padStart(2, '0');
            var mm = String(date.getMinutes()).padStart(2, '0');
            var YYYY = date.getFullYear();
            //YYYY-MM-DDThh:mm
            dateInRequiredFormat =  YYYY + "-" + MM + '-' + DD + "T" + hh + ":" + mm;
        } else {
            dateInRequiredFormat = date.substring(0, 16);
        }
        return dateInRequiredFormat;
    }

    useEffect(() => {
        let dateToSend = earlierDateSelected ? convertDateToRequiredFormat(earlierDateSelected, "e") : 
        (lowerBound ? convertDateToRequiredFormat(lowerBound, "lb") : null);
        sendPropertyValueToParentFunc("from", property, dateToSend);
        // eslint-disable-next-line
    }, [earlierDateSelected, lowerBound])

    useEffect(() => {
        let dateToSend = laterDateSelected ? convertDateToRequiredFormat(laterDateSelected, "l") : 
        (upperBound ? convertDateToRequiredFormat(upperBound, "ub") : null);
        sendPropertyValueToParentFunc("to", property, dateToSend);
        // eslint-disable-next-line
    }, [laterDateSelected, upperBound]) 

    useEffect(() => {
        bookBorrowingsService.getEarliestUserBorrowingDate(userId, property)
        .then(response => {
            setLowerBound(response.data);
        })
    }, [userId, property])

    useEffect(() => {
        bookBorrowingsService.getLatestUserBorrowingDate(userId, property)
        .then(response => {
            setUpperBound(response.data);
        },
        (error) => {
            console.log(error)
        })
    }, [userId, property])
    
    return (
        <React.Fragment>
            {lowerBound && upperBound && <Grid container>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disabled={!significant}
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id={property + "-date-picker-inline-from"}
                            label={property + " from:"}
                            value={earlierDateSelected || lowerBound}
                            onChange={handleDateFromChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                        <KeyboardDatePicker
                            disabled={!significant}
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id={property + "-date-picker-inline-to"}
                            label={property + " to:"}
                            value={laterDateSelected || upperBound}
                            onChange={handleDateToChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                </MuiPickersUtilsProvider>
            </Grid>}
        </React.Fragment>
    )
}