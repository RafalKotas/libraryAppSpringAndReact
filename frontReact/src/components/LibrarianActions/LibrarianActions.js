import React from "react";
import DeleteSection from "./DeleteSection/DeleteSection";
import UpdateButton from "./UpdateButton/UpdateButton";

export default function LibrarianActions(props) {
    return (
        <React.Fragment>
            <h2>LIBRARIAN ACTIONS:</h2>
            <div className="d-flex flex-row">
            <DeleteSection bookId={props.bookId}/>
            <UpdateButton bookId={props.bookId}/>
            </div>
        </React.Fragment>
    )
}