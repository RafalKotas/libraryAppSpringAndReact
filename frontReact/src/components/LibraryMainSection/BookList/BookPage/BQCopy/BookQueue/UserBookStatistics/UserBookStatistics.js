import React from "react";
import {
    TableCell
} from "@material-ui/core";
import { useState, useEffect } from "react";
import bookService from "../../../../../../services/book.service";

import {headersWithInputs, headersWithInputsReversed } from "../queueHeaders.js";

export default function UserBookStatistics(props) {

    console.log("user book statistic render...");
    console.log(props);

    const [userStatistics, setUserStatistics] = useState(null);

    useEffect(() => {
        bookService.getBookStatsForUser(props.userId, props.bookId)
        .then(response => {
            setUserStatistics(response.data);
        });
        // eslint-disable-next-line
    }, []);

    const calculateScoreWeightedAverage = () => {
        let sum = 0;
        let sumOfWeights = 0;
        Object.entries(props.statisticWeights).map(([key, singleOrAll]) => {
            Object.entries(props.statisticWeights[key]).map(([meanOrMax, statisticWeight]) => {
                sum = sum + statisticWeight * userStatistics[ headersWithInputsReversed[ key ][ meanOrMax ] ];
                sumOfWeights += parseInt(statisticWeight);
            })
        })
        console.log("sum: " + sum);
        console.log("sumOfWeights: " + sumOfWeights);
        if(sumOfWeights == 0) { sumOfWeights = 1};
        
        return Math.round((sum / sumOfWeights) * 100) / 100;
    }

    return (
        userStatistics && <React.Fragment>
            {
                Object.keys(headersWithInputs.statisticSingleBookHeaders).map(statName => {
                    return <TableCell key={statName + "-userId" + props.userId}>{ Math.round(userStatistics[ statName ] * 100) / 100}</TableCell>
                })
            }
            {
                Object.keys(headersWithInputs.statisticAllBooksHeaders).map(statName => {
                    return <TableCell key={statName + "-userId" + props.userId}>{ Math.round(userStatistics[ statName ] * 100) / 100}</TableCell>
                })
            }
            <TableCell>
                {calculateScoreWeightedAverage()}
            </TableCell>
        </React.Fragment>
    )
}