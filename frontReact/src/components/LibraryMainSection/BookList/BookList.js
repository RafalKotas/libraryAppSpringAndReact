import { Link } from "react-router-dom";
import "./BookList.css";

export default function BookList(props) {
    return (
        <div id="books-list">
            {props.books.map((book, index) => (
                
                        <Link
                            key={"bookField-id-" + book.id}
                            to={"/book/about/" + book.id} 
                            style={{ textDecoration: 'none' }}
                        >
                            <div
                                className={"d-flex flex-column rounded bookEntry"}
                            >

                                <h5 className={"bookTitle"}>
                                    <i>
                                        {book.title}
                                    </i>
                                </h5>

                                <div className={"d-flex flex-row justify-content-between"}>
                                    <div className={"genreAnnotation rounded"}>
                                        {book.genre}
                                    </div>

                                    <div className={"authorAnnotation bookInfo" + index % 2}>
                                        By: {book.author}
                                    </div>
                                </div>

                                <div className={"bookYearPublished align-self-end"}>
                                    Published in: {book.yearPublished}
                                </div>
                            </div>
                        </Link>
            ))}
        </div>
    )
}