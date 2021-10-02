//react
import React from "react";
import { useState, useEffect } from "react";

//react-router
import { useParams } from "react-router-dom";

//subcomponents
import BookInfo from "../../../BookInfo/BookInfo";
import AllUsersActions from "../../../AllUsersActions/AllUsersActions";
import LibrarianActions from "../../../LibrarianActions/LibrarianActions";
import BookQueueHeader from "./BookQueueHeader/BookQueueHeader";
import BookQueue from "./BookQueue/BookQueue";


//styles
import "./BookPage.css";
import HorizontalLineCustom from "../../../Stylistic/HorizontalLineCustom";

//services
import BookDataService from "../../../../services/book.service";
import bookBorrowingsService from "../../../../services/bookBorrowings.service";

export default function BookPage(props) {

  const params = useParams();
  const [book, setBook] = useState({});
  const [bookFree, setBookStatus] = useState(null);
  const [maxBooksReached, setMaxBooksReached] = useState(null);
  const [userInQueue, setUserInQueue] = useState(null);
  const [queueLength, setQueueLength] = useState(null);
  const [bookInYourUsage, setBookInYourUsage] = useState(null);

  //const []

  const [displayQueue, setDisplayQueue] = useState(true);

  useEffect(() => {
    bookBorrowingsService.userMaxBooksCheck(props.user.id)
    .then(maxBooks => {
      if(maxBooks.data) {
        setMaxBooksReached(true)
      } else {
        setMaxBooksReached(false)
      }
    })
  }, [bookFree, props.user.id])

  useEffect(() => {
    const checkIfUserInQueue = () => {
      bookBorrowingsService.userInBookQueue(props.user.id, params.bookId)
      .then(response => {
        setUserInQueue(response.data);
      })
    }

    bookBorrowingsService.checkIfUserHasAlreadyBook(props.user.id, params.bookId)
    .then(response => {
      if(response.data === true) {
        setBookInYourUsage(true);
      } else {
        setBookInYourUsage(false);
      }
    })

    checkIfUserInQueue();
  }, [props.user.id, params.bookId])

  useEffect(() => {
    if(params.bookId !== undefined && params.bookId !== null) {
        BookDataService.getBook(params.bookId)
        .then(response => {
            setBook(response.data)
            BookDataService.bookAvailable(params.bookId)
              .then(status => {
                setBookStatus(status.data)
              })
              .catch(e => {
                console.log("Exception: " + e);
              })
        })
        .catch(e => {
            console.log("Exception: " + e);
      });
    }
  },[params.bookId])

  useEffect(() => {
      bookBorrowingsService.getBookQueueLength(params.bookId)
      .then(response => {
        setQueueLength(response.data)
      })
  }, [params.bookId])

  const borrow = () => {
    bookBorrowingsService.borrowBook(props.user.id, book.id)
      .then(response => {
        if(response.data.borrowingDate !== null) {
          setBookStatus(false);
          setBookInYourUsage(true);
        } else {
          setUserInQueue(true);
        }
      })
      .catch(e => {
        console.log("Exception: " + e);
      })
  }

  const setDQFunc = (show) => {
    setDisplayQueue(show);
  }
  
  return (
      <div className="edit-form m-3">

        <BookInfo book={book} bookFree={bookFree}/>

        <div className="d-flex align-items-center flex-column">
          <h2>ALL USERS ACTIONS:</h2>
          <AllUsersActions
            userInQueue={userInQueue}
            maxBooksReached={maxBooksReached}
            borrow={borrow}
            bookInYourUsage={bookInYourUsage}
            bookFree={bookFree}
            userId={props.user.id}
          />

          {(props.user.roles.includes("ROLE_LIBRARIAN") && (
              <React.Fragment>
                <LibrarianActions bookId={book.id}/>
                {
                  queueLength > 0 && <React.Fragment>
                    <HorizontalLineCustom />
                    <BookQueueHeader setDisplayQueueCallback={setDQFunc}/>
                    <BookQueue displayQueue={displayQueue} bookId={book.id} bookFree={bookFree}/>
                  </React.Fragment>
                }

              </React.Fragment>
            ))
          }

          {queueLength > 0 ?
              <div className="d-flex align-items-center flex-column">
                <h2>QUEUE LENGTH </h2>
                <div id="queueLen" className={"contentInTheMiddle border border-dark fontPacifico font24 animation360degrees"}>
                  {queueLength}
                </div>
              </div> :
              <div className="d-flex align-items-center flex-column">
                <h2>QUEUE EMPTY </h2>
                <div id="queueLen" className={"contentInTheMiddle border border-dark fontPacifico font24 animation360degrees"}>
                  {queueLength}
                </div>
              </div>
          }

        </div>
    </div>
    )
}