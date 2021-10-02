//React
import React from "react";

//subcomponents
import UserBooksOnHandsTable from "./UserBooksOnHandsTable/UserBooksOnHandsTable";
import UserBooksInQueuesTable from "./UserBooksInQueuesTable/UserBooksInQueuesTable";

//others
import {actualBorrowingsIndicator, actualQueuesIndicator} from "./indicators";

//services
import bookBorrowingsService from "../../../../../../services/bookBorrowings.service";

export default function UserActivities({booksInQueues, booksOnHands, updateGivenBookId}) {

    const addBookToUserHand = (bookId, userId) => {
        bookBorrowingsService.giveBook(userId, bookId)
            .then(response => {
                updateGivenBookId(response.data.book.id);
            })
    }

    return (
        <React.Fragment>
            <h3>Actual requests: {booksInQueues ? actualQueuesIndicator(booksInQueues) : "loading"}</h3>
            {
                booksInQueues && booksOnHands && (booksOnHands.length < 3) && (
                    <UserBooksInQueuesTable 
                        updateUserBooksOnHands={addBookToUserHand}
                        onHands={booksOnHands.length} 
                        booksInQueues={booksInQueues}>
                    </UserBooksInQueuesTable>
                )
            }
            <h3>Actual borrowings: {booksOnHands ? actualBorrowingsIndicator(booksOnHands) : "loading"}</h3>
            {
                    booksOnHands && (
                        <UserBooksOnHandsTable booksOnHands={booksOnHands}></UserBooksOnHandsTable>
                    )
            }
        </React.Fragment>
    )
}