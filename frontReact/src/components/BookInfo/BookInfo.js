import React from "react"
import BookData from "./BookData/BookData"
import BookStatus from "./BookStatus/BookStatus"

export default function BookInfo(props) {

    return (
        <React.Fragment>
            <BookData book={props.book}/>
            <BookStatus bookFree={props.bookFree}/>
        </React.Fragment>
    )
}