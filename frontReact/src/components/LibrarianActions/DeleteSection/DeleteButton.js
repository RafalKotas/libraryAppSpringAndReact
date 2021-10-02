export default function DeleteButton(props) {
    return (
       <button
        onClick={props.openModal}
        className="border-dark btn btn-danger mr-2"
        data-toggle="modal" data-target="#exampleModal"
      >
        Delete
      </button>
    )
}