import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

//subcomponents
import DeleteButton from "./DeleteButton"
import ModalConfirmDelete from "./ModalConfirmDelete";

//services
import bookBorrowingsService from "../../../services/bookBorrowings.service";
import bookService from "../../../services/book.service";

export default function DeleteSection(props) {

    const history = useHistory()
    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = () => {
        bookBorrowingsService.existBorrowingsWithBookId(props.bookId)
        .then(response => {
          if(response.data > 0) {
            setIsOpen(true);
          } else {
            deleteBook();
          }
        })
        
    }

    const deleteBook = () => {
        bookBorrowingsService.deleteBorrowingsWithBookId(props.bookId).then(
          () => bookService.delete(props.bookId)
        ).then(
          () => {
            closeModal()
            history.push("/books/1")
          }
        )
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    return (
        <React.Fragment>
            <DeleteButton 
                openModal={openModal}
            />
            <ModalConfirmDelete 
                modalOpen={modalIsOpen}
                closeModal={closeModal}
                deleteBook={deleteBook}
            />
        </React.Fragment>
    )
}