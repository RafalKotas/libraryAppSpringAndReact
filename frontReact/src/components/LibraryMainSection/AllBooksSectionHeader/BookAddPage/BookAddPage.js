//1.React
//react
import React from "react";
import {useRef, useState} from "react";
import { useHistory } from "react-router-dom";

//react components
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

//styles
import "../../BookEditPage.css"

//form requirements
import {titleRestrictions, 
        authorRestrictions, 
        genreRestrictions, 
        descriptionRestrictions, 
        yearRestrictions} from "../../bookFeaturesRestrictions"

//services
import bookService from "../../../../services/book.service";

const BookAddPage = () => {

    const form = useRef();
    const checkBtn = useRef();

    const capitalize = (value) => {
        return (value.substring(0,1).toUpperCase() + value.substring(1, value.length))
    }

    const history = useHistory()
    const [book, setBook] = useState({
        "title": "",
        "author": "",
        "genre": "",
        "description": "",
        "yearPublished": 2000
    })

    const propertyValidations = {
        "title": [titleRestrictions],
        "author": [authorRestrictions],
        "description": [descriptionRestrictions],
        "genre": [genreRestrictions],
        "yearPublished": [yearRestrictions]
    }

    const changeBookProperty = (e) => {
        const propertyValue = e.target.value;
        const propertyName = e.target.name;
        setBook({
            ...book,
            [propertyName]: propertyValue
        });
    }

    const createBook = (event) => {

        event.preventDefault()

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {

            let bookUpdated = {
                "title": book.title,
                "author": book.author,
                "genre": book.genre,
                "description": book.description,
                "yearPublished": book.yearPublished
            }

            bookService.update(0, bookUpdated)
            .then(response => {
                history.push("/books/?currentPage=1&pageSize=5&resetPage=true")
            })
        } else {
            console.log("TODO ALERT THAT NOT ALL CONDITIONS ARE MET")
        }


    }

    return (
        <React.Fragment>
            <h2 id="bookEditHeader" className="align-self-center m-2">Add new book, enter features:</h2>
            <Form onSubmit={createBook} ref={form} className="d-flex flex-column">
                <div>
                    {Object.entries(Object.entries(book)).map( ([index, [key, value]]) => {
                        return (
                            <div className="form-group">
                                <label className="propertyHeader" htmlFor={"title"}>
                                    <strong>{capitalize(key)} </strong>
                                </label>
                                <Input
                                    type="text"
                                    className="form-control"
                                    name={key}
                                    value={value}
                                    onChange={changeBookProperty}
                                    validations={propertyValidations[key]}
                                />
                            </div>
                        )
                    })}

                    <button 
                        className="btn btn-primary m-2 w-25 align-self-center" 
                        type="submit"
                        onClick={createBook}>Add book to library!
                    </button>

                </div>
                
                <CheckButton style={{ display: "none" }} ref={checkBtn} />
            </Form>
        </React.Fragment>
    )
}

export default BookAddPage