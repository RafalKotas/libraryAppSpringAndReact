//sub-components
import UserActivities from './UserActivities/UserActivities';
//core
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import {
    TableCell,
    TableRow
} from "@material-ui/core";
//other
import React, { useState, useEffect } from "react";

import bookBorrowingsService from "../../../../../services/bookBorrowings.service";
import userManipulationService from "../../../../../services/userManipulation.service";

export default function UserDetails(props) {

    const [booksOnHands, setBooksOnHands] = useState(null);
    const [booksInQueues, setBooksInQueues] = useState(null);
    const [givenBookId, setGivenBookId] = useState(null);

    useEffect(() => {
        bookBorrowingsService.userActualBorrowings(props.userId)
        .then((response) => {
            let actualBorrowings = response.data;
            setBooksOnHands(actualBorrowings);
        })
    }, [props.userId, givenBookId]);

    useEffect(() => {
        bookBorrowingsService.userBookRequests(props.userId)
        .then((response) => {
            let queueBooks = response.data;
            setBooksInQueues(queueBooks);
        })
    }, [props.userId, givenBookId])

    const deleteUser = (e) => {
        console.log("trying to delete User with id: " + props.userId);
        userManipulationService.deleteUserToken(props.userId)
            .then(response => {
                console.log(response.data);
            });
    }

    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse style={{background: "#e6c991"}} in={props.open} timeout="auto" unmountOnExit>
                    <Box margin={1} className="d-flex flex-column">
                        <Typography variant="h6" gutterBottom component="div">
                            <h4>User activities {"(ID = " + props.userId + ")"}:</h4>
                        </Typography>
                        <UserActivities 
                            booksInQueues={booksInQueues}
                            booksOnHands={booksOnHands}
                            updateGivenBookId={setGivenBookId}
                        />
                        <button onClick = {deleteUser} className="btn btn-danger border border-dark align-self-center">
                            Delete User!
                        </button>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    )
}