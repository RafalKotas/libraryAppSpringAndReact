import {Link} from "react-router-dom";

export default function UpdateButton(props) {
    return (
        <Link to={"/book/update/" + props.bookId} style={{ textDecoration: 'none' }}>
            <button
                type="submit"
                className="border-dark btn btn-warning"
            >
                Update
            </button>
        </Link>
    )
}