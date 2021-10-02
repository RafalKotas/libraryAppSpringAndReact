import React from "react";
import {
    TableCell
} from "@material-ui/core";

import dateFormat from 'dateformat';

export default function UserBasicData(props) {

    const headers = ["firstName", "lastName"];

    return (
        <React.Fragment>
            {
                headers.map((property) => {
                    return (
                        <TableCell key={"UserBasicDataTableCell-" + props.user[property]}>
                            {props.user[property]}
                        </TableCell>
                    )
                })
            }
            <TableCell>{dateFormat(props.bookRequestDate, "mmmm dS, yyyy")}</TableCell>
        </React.Fragment>
    )
}