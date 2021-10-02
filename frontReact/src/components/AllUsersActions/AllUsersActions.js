import React from "react";

import {Link} from "react-router-dom";

export default function AllUsersActions(props) {
    return (
        <React.Fragment>
        {
            props.userInQueue && props.maxBooksReached && <div>Return one of your book to let librarian give you this book (you are in this book queue)!</div>
        }
        {
            props.userInQueue && !props.maxBooksReached && <div>Wait for librarian who will assign you a book soon!</div>
        }
        {
            (props.bookFree && !props.maxBooksReached && !props.userInQueue) && <button onClick={() => props.borrow()} className="border-dark btn btn-success">Take!</button>
        }
        {
            ((!props.bookFree && !props.bookInYourUsage) || (props.bookFree && props.maxBooksReached)) && !props.userInQueue
            //!props.bookInYourUsage && !props.userInQueue && (!props.bookFree || props.maxBooksReached) 
            &&  <button 
                  onClick={() => props.borrow()} className="border-dark btn btn-success">Sign up for the queue
                </button>
        }
        {
            props.bookInYourUsage && <div>You have this book now. Check it in <Link to={"/reader/" + props.userId}>ReaderPanel</Link> on navbar.</div>
        }
        </React.Fragment>
    )
}