import React from "react"
import { useState, useEffect } from "react";
import {
    TableRow,
    TableCell
} from "@material-ui/core";
import UserBasicData from "../UserBasicData/UserBasicData"

import bookBorrowingsService from "../../../../../../services/bookBorrowings.service"
import UserBookStatistics from "../UserBookStatistics/UserBookStatistics";

export default function UserInQueueEntry (props) {
    
    const [booksOnHandsCount, setBooksOnHandsCount] = useState(null);
    const [bookRequestCount, setBookRequestCount] = useState(null);

    useEffect(() => {
        bookBorrowingsService.userActualBorrowingsCount(props.user.id)
        .then(response => {
            let onHandsCount = response.data
            setBooksOnHandsCount(onHandsCount)
        })
    }, [props.user]);

    useEffect(() => {
        bookBorrowingsService.userBookRequestsCount(props.user.id)
        .then(response => {
            let requestCount = response.data
            setBookRequestCount(requestCount)
        })
    }, [props.user]);

    const userDataLoaded = () => {
        return (bookRequestCount && booksOnHandsCount)
    }

    //TODO zupdatować stan parent Componentu
    const addBookToUserHand = () => {
        bookBorrowingsService.giveBook(props.user.id, props.bookId)
            .then(response => {
                console.log("Book succesfully given!")
            })
    }
    
    
    return (
        userDataLoaded() && 
                <TableRow>
                    <UserBasicData 
                        user={props.user}
                        bookRequestDate={props.bookRequestDate}
                    />
                    <TableCell>{booksOnHandsCount}</TableCell>
                    <TableCell>{bookRequestCount}</TableCell>
                    <UserBookStatistics 
                        userId={props.user.id}
                        bookId={props.bookId}
                        statisticWeights={props.statisticWeights}
                    />
                    <TableCell>
                        <button 
                            onClick={() => addBookToUserHand()}
                            className="btn btn-primary" 
                            disabled={booksOnHandsCount === 3 || !props.bookFree}
                        >
                            Give this book!
                        </button>
                    </TableCell>
                </TableRow>
                
    )
}