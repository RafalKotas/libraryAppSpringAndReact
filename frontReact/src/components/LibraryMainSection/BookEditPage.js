//1.React
//react
import React from "react";
import {useState, useEffect, useRef} from "react";
import { useParams, useHistory } from "react-router-dom";

//react components
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";

//react fontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPen} from "@fortawesome/free-solid-svg-icons";

//2 styles/services/subComponents
//styles
import "./BookEditPage.css"

//services
import bookService from "../../services/book.service";

//subComponents
import BookProperty from "./BookProperty/BookProperty";

const BookEditPage = (props) => {

    const form = useRef();
    const checkBtn = useRef();

    const history = useHistory()
    let { id } = useParams()
    const [book, setBook] = useState({})

    const changeBookProperty = (e) => {
        const propertyValue = e.target.value;
        const propertyName = e.target.name;
        setBook({
            ...book,
            [propertyName]: propertyValue
        });
    }

    const updateBook = (event) => {

        event.preventDefault()

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {

            bookService.update(id, book)
            .then(response => {
                history.push("/books/1")
            })
        } else {
            //TODO:
            alert(checkBtn.current.context._errors)
            console.log("TODO ALERT THAT NOT ALL CONDITIONS ARE MET")
        }


    }

    useEffect(() => {
        bookService.getBook(id)
            .then(bookInfo => {
                setBook({
                    "title": bookInfo.data.title,
                    "author": bookInfo.data.author,
                    "genre": bookInfo.data.genre,
                    "description": bookInfo.data.description,
                    "yearPublished": bookInfo.data.yearPublished
                })
            })
    }, [id])

    if (book) {
        return (
            <React.Fragment>
                <h2 id="bookEditHeader" className="align-self-center m-2">BOOK ID: {id} - update</h2>
                <Form name="editForm" ref={form} className="d-flex flex-column">
                    <div>
                        {Object.entries(Object.entries(book)).map( ([_, [key, value]]) => {
                            return (
                                <BookProperty key={"key-" + key + ".value-" + value}
                                    bookPropKey={key}
                                    className="form-group" 
                                    value={value} onChangeFunc={changeBookProperty}/>
                            )
                        })}

                        <div className="d-flex flex-column form-group">
                            <button 
                            className="btn btn-primary m-2 w-25 align-self-center updateBtn" 
                            type="button"
                            onClick={updateBook}>Update! <FontAwesomeIcon icon={faPen} />
                            </button>
                        </div>
                    </div>

                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>
            </React.Fragment>
        )
      } else {
        return null
      }
}

export default BookEditPage