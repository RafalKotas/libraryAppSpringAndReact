export default function BookStatus(props) {
    return (
        <div className="d-flex align-items-center flex-column">
            <strong>Status:</strong>
            <h3>
            {props.bookFree && <span className="text-success">Free</span>}
            {props.bookFree !== null && !props.bookFree && <span className="text-danger">In use</span>}
            </h3>
        </div>
    )
}