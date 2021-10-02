import React, { useState, useEffect } from "react";
import {
    TableContainer,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    TableSortLabel
} from "@material-ui/core";
import dateFormat from 'dateformat';
import { withStyles} from '@material-ui/core/styles';

import "./BookQueue.css"

import bookBorrowingsService from "../../../../../services/bookBorrowings.service";

import {headersWithoutInputs} from "./queueHeaders.js";
import StatisticHeaders from "./StatisticHeaders/StatisticHeaders";
import { queueRowDataKeysInOrder} from "./queueValueNames";


export default function BookQueue (props) {

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = useState("Score");
    const [usersRowData, setUsersRowData] = useState(null);

    const [statisticWeights, setStatisticWeights] = useState({
        
        maxDaysOfSingleBookPossession: 5.0,
        meanDaysOfSingleBookPossession: 5.0,
        meanDaysOfReturnDelaySingleBook: 5.0,
        maxDaysOfSingleBookReturnDelay: 5.0,

        maxDaysOfPossessionAllBooks: 5.0,
        meanDaysOfAllBooksPossession: 5.0,
        meanDaysOfReturnDelayAllBooks: 5.0,
        maxDaysOfReturnDelayAllBooks: 5.0,
    });

    const calculateScoreWeightedAverage = (userRowData) => {
        let sum = 0;
        let sumOfWeights = 0;
        Object.entries(statisticWeights).forEach(weightedAverage);

        function weightedAverage([statisticName, statisticWeight]) {
            sum += statisticWeight * userRowData[ statisticName ];

            sumOfWeights += parseFloat(statisticWeights[statisticName]);
        }

        if(sumOfWeights === 0) { sumOfWeights = 1};
        
        return Math.round((sum / sumOfWeights) * 100) / 100;
    }

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
        bookBorrowingsService.getBookUsersInQueueDataRows(props.bookId)
        .then(response => {
            let usersRowDataFetched = response.data;
            usersRowDataFetched = usersRowDataFetched.map(userRowData => {
                return {
                    ...userRowData,
                    "Score": calculateScoreWeightedAverage(userRowData)
                }
            })
            console.log(usersRowDataFetched)
            setUsersRowData(usersRowDataFetched);
        })

        // eslint-disable-next-line
    }, [props.bookId])

    const onWeightChange = (event) => {
        let statisticName = event.target.name;
        let newValue = event.target.value;


        if(parseFloat(newValue) > 10) {
            newValue = 10;
        }

        setStatisticWeights({
            ...statisticWeights,
            [statisticName]: newValue
        });
    }

    useEffect(() => {
        let usersRowDataTmp = usersRowData;
        if(usersRowDataTmp) {
            usersRowDataTmp = usersRowDataTmp.map(userRowData => {
                return {
                    ...userRowData,
                    "Score": calculateScoreWeightedAverage(userRowData)
                }
            });
            setUsersRowData(usersRowDataTmp);
        }
        // eslint-disable-next-line
    }, [statisticWeights])

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

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
      }

    const getComparator = (order, orderBy) => {
        return order === 'desc'
          ? (a, b) => descendingComparator(a, b, orderBy)
          : (a, b) => -descendingComparator(a, b, orderBy);
      }

    return (
        props.displayQueue && <TableContainer >
            <TableHead>

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
                        
                        usersRowData && usersRowData.sort(getComparator(order, orderBy)).map(userRowData => {
                            return <TableRow>
                                {
                                    queueRowDataKeysInOrder.map(propName => {
                                        return propName === "requestDate" ? 
                                        <TableCell>{dateFormat(userRowData[propName], "mmmm dS, yyyy")}</TableCell> :
                                        <TableCell>{userRowData[propName]}</TableCell>
                                    })
                                }
                            </TableRow>
                        }) 
                    }
            </TableBody>
        </TableContainer>
    )
}