import React, { useState, useEffect } from "react";
import {
    Table,
    TableContainer,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    TableSortLabel
} from "@material-ui/core";
import { withStyles} from '@material-ui/core/styles';

import "./BookQueue.css"

import UserInQueueEntry from "./UserInQueueEntry/UserInQueueEntry.js";

import bookBorrowingsService from "../../../../../services/bookBorrowings.service";

import {headersWithoutInputs} from "./queueHeaders.js";
import StatisticHeaders from "./StatisticHeaders/StatisticHeaders";


export default function BookQueue (props) {

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = useState("Score");
    const [usersInQueue, setUsersInQueue] = useState(null);

    const [statisticWeights, setStatisticWeights] = useState({
        statisticSingleBookHeaders : {
            meanPos : 5.0,
            meanRet: 5.0,
            maxPos: 5.0,
            maxRet: 5.0
        },
        statisticAllBooksHeaders : {
            meanPos : 5.0,
            meanRet: 5.0,
            maxPos: 5.0,
            maxRet: 5.0
        }
    });

    const StyledTableCell = withStyles((theme) => ({
        head: {
          backgroundColor: "#11538C",
          color: "#00FFFF",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "black",
          fontStyle: "italic"
        },
        body: {
          fontSize: 14,
        },
    }))(TableCell);

    useEffect(() => {
        bookBorrowingsService.getBookQueue(props.bookId)
        .then(response => {

            let users = response.data.map((element) => {
                return {
                    "userData" : element.user, 
                    "requestDate" : element.id.requestDate
                }
            })

            setUsersInQueue(users)
        })
    }, [props.bookId]);

    useEffect(() => {
        console.log(usersInQueue);
    }, [usersInQueue])

    const onWeightChange = (event) => {
        console.log("---line 49 onWeightChange ---");
        let [headerType, statAbbreviation] =  event.target.name.split("-");
        let newStatistics = statisticWeights;
        let newValue = event.target.value;

        if(parseFloat(newValue) > 10) {
            newValue = 10;
        }

        newStatistics[headerType][statAbbreviation] = parseFloat(newValue);

        setStatisticWeights({
            ...statisticWeights,
            [headerType] : {
                ...statisticWeights[headerType],
                [statAbbreviation] : parseFloat(newValue)
            }
        });
    }

    useEffect(() => {
        console.log(statisticWeights);
    }, [statisticWeights]);

    const areStringsEqual = (s1, s2) => {
        return s1 === s2;
    }

    //zmienia porządek sortowania asc->desc, desc->asc, null(inne property)->asc
    const handleRequestSort = (event, property) => {
        const isAsc = (orderBy === property && order === 'asc');
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };

    return (
        props.displayQueue && <TableContainer >
            <TableHead style={{"width" : "100px"}}>

                {
                    headersWithoutInputs.map(headerGroup => {
                        return <TableRow>
                            {headerGroup.map(({textValue, rowSpan, colSpan, appendSortLabel}) => {
                                return <StyledTableCell align={"center"} rowSpan={rowSpan} colSpan={colSpan}>
                                    {appendSortLabel ?
                                    <TableSortLabel
                                        key={textValue}
                                        active={areStringsEqual(orderBy, textValue)}
                                        direction={areStringsEqual(orderBy, textValue) ? order : 'asc'}
                                        onClick={createSortHandler(textValue)}
                                    >
                                        {textValue}
                                    </TableSortLabel> : textValue}
                                </StyledTableCell>
                            })}
                        </TableRow>
                    })
                }

                <StatisticHeaders
                    orderBy={orderBy}
                    onWeightChange={onWeightChange}
                    statisticWeights={statisticWeights}
                />
            </TableHead>
            <TableBody>
                    {
                        usersInQueue && usersInQueue.map(userInQueueEntry => 
                            <UserInQueueEntry
                                statisticWeights={statisticWeights}
                                key={"user-id-" + userInQueueEntry["userData"]["id"] + "-bookQueue-" + props.bookId} 
                                user={userInQueueEntry["userData"]}
                                bookRequestDate={userInQueueEntry["requestDate"]}
                                bookId={props.bookId} 
                                bookFree={props.bookFree}
                            />
                        )
                    }
            </TableBody>
        </TableContainer>
    )
}