import {StyledTableCell} from "../../../../../../CellStyles";

import { useState, useEffect } from "react";

import BookDataService from "../../../../../../../../services/book.service"

export default function GiveBookButton(props) {

    const [bookFree, setBookFree] = useState(null);

    const printBookAndUser = () => {
        props.onClickFunction(props.bookId, props.userId)
    }

    useEffect(() => {
        BookDataService.bookAvailable(props.bookId)
        .then((response) => {
            let requestedBookFree = response.data;
            setBookFree(requestedBookFree)
        })
    }, [props.bookId])

    return (
        <StyledTableCell>
            {<button onClick={() => printBookAndUser()} 
                className={"btn " + (bookFree ? "btn-primary" : "btn-danger")}
                disabled={props.onHands === 3 || !bookFree}
            >
                Give book
            </button>}
        </StyledTableCell>
    )
}