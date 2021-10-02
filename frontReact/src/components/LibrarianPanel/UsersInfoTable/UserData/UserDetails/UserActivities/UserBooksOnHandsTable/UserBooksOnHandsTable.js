import dateFormat from 'dateformat';
import {
    Table,
    TableBody,
    TableHead,
    TableRow
} from "@material-ui/core";
import {StyledTableCell, UserBooksHeaderCell} from "../../../../../CellStyles";
import React from 'react';


export default function UserBooksOnHandsTable(props) {
    const borrowingHeaders = ["id", "title", "author", "genre"];

    return (
        <Table key={"userBooksOnHandsTable"}>
            <TableHead>
                <TableRow>
                    {
                        borrowingHeaders.map((feature) => {
                            return (
                                <UserBooksHeaderCell key={"booksOnHandsHeader-" + feature}>
                                    {feature}
                                </UserBooksHeaderCell>
                            )
                        })
                    }
                    <UserBooksHeaderCell>borrowingDate</UserBooksHeaderCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    props.booksOnHands.map((borrowing) => {
                        let {book} = borrowing;
                        return (
                            <TableRow key={"borrowingWithRequestDate-" + borrowing.id.requestDate}>
                                {
                                    Object.entries(book).map(([borrowingHeaderKey, value]) => {
                                        if (borrowingHeaders.includes(borrowingHeaderKey)) {
                                            return (
                                                <StyledTableCell key={borrowingHeaderKey + "-" + value}> 
                                                    {value} 
                                                </StyledTableCell>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })
                                }
                                <StyledTableCell key={"borrowingDateCell-" + borrowing.borrowingDate}>
                                    {dateFormat(borrowing.borrowingDate, "mmmm dS, yyyy")}
                                </StyledTableCell>
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
    )
}