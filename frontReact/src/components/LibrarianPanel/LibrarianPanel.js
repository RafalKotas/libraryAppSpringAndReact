import React, { useState, useEffect, useRef } from "react";

import UserService from "../../services/user.service";

import UsersInfoTable from "./UsersInfoTable/UsersInfoTable";
import NoContentFound from "../common/NoContentFound/NoContentFound";


import { withStyles} from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow
} from "@material-ui/core";

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#11538C",
      color: "#00FFFF",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "black"
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

const LibrarianPanel = () => {

    const ref = useRef(null);

    const [content, setContent] = useState(null);
    const [users, setUsers] = useState(null);
    const headers = ["id", "email", "username", "firstName", "lastName"];

    useEffect(() => {
        UserService.getLibrarianBoard().then(
            (response) => {
                let usersData = response.data;
                setUsers(usersData)
            },
            (error) => {
                const _content = 
                    (error.response && 
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setContent(_content);
            }
        );
    }, []);

    return (
        <div ref={ref} className="container" key={Date()}>
            <header className="jumbotron">
                <h3 className="d-flex justify-content-center">LIBRARIAN BOARD - ALL USERS</h3>
            </header>
            {
                users ? 
                (<Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>More Info</StyledTableCell>
                            {
                                headers.map((x, i) =>
                                    <StyledTableCell align="center" key={i}>{x}</StyledTableCell>
                                )
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <UsersInfoTable key="all-users-info-table" users={users}></UsersInfoTable>
                    </TableBody>
                </Table>) : ((content && content.includes("401")) ? 
                        <NoContentFound
                            key={"NoContentFound-ReaderPanel"}
                            captions={
                                [{header: "Section empty. Check reason on second slide."},
                                {header: "Unauthorized. Your token expired or you don't have required roles."}]
                            }
                            componentWidth={ref.current.offsetWidth}
                        /> : "Other reason")
            }
        </div>
    )
}

export default LibrarianPanel;