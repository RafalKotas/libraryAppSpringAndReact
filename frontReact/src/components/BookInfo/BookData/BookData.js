import BookImg from "../../../resources/imgBook.jpeg";


export default function BookData(props) {
    return (
        <div className="d-flex flex-row">
          
            <img src={BookImg} alt="book img" height="200" width="200"/>
            
            <div className="d-flex flex-column align-content-center">
                <header className="text-center m-2">
                    <h2 className="text-primary">{props.book.title}</h2> 
                    by <strong className="text-info"><i>{props.book.author}</i></strong>
                </header>
                
                <p id="bookDescription">
                    {props.book.description}
                </p>

                <p id="bookGenre" className="align-self-end border border-dark p-2 rounded">
                    Genre: <span id="bookGenreText">{props.book.genre}</span>
                </p>
            </div>

        </div>
    )
}