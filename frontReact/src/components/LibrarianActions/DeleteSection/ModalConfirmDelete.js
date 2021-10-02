import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";

export default function ModalConfirmDelete (props) {

    const customStyles = {
        content : {
          top                   : '50%',
          left                  : '50%',
          right                 : 'auto',
          bottom                : 'auto',
          marginRight           : '-50%',
          transform             : 'translate(-50%, -50%)'
        }
    };

    return (
        <Modal
        isOpen={props.modalOpen}
        onRequestClose={props.closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
        >
            <div className={"d-flex justify-content-end"}>
                <FontAwesomeIcon onClick={props.closeModal} className={"fa-lg"} style={{color: "red"}} icon={faTimesCircle} />
            </div>

            <h2>Are you sure to delete this book?</h2>
            <div className={"d-flex justify-content-center"}>
            <button onClick={props.deleteBook} className={"btn btn-success ml-2 mr-2"}>Yes.</button>
            <button onClick={props.closeModal} className={"btn btn-danger ml-2 mr-2"}>No!</button>
            </div>
        </Modal>
    )
}

