import {
    Table,
    TableBody,
    TableHead,
    TableRow
} from "@material-ui/core";
import {StyledTableCell, UserBooksHeaderCell} from "../../../../../CellStyles";

import GiveBookButton from "./GiveBookButton/GiveBookButton";

import dateFormat from 'dateformat';

export default function UserBooksInQueuesTable(props) {
    const borrowingHeaders = ["id", "title", "author", "genre", "requestDate"];

    const giveBookToUser = (bookId, userId) => {
        props.updateUserBooksOnHands(bookId, userId);
    }

    return (
        <Table>
            <TableHead>
                <TableRow>
                    {
                        borrowingHeaders.map((feature) => {
                            return (
                                <UserBooksHeaderCell key={"userBooksInQueuesHeader-" + feature}>
                                    {feature}
                                </UserBooksHeaderCell>
                            )
                        })
                    }
                    <UserBooksHeaderCell>Action</UserBooksHeaderCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    props.booksInQueues.map((queueRequest) => {
                        let {book} = queueRequest;
                        return (
                            <TableRow key={"queueWithRequestDate-" + queueRequest.id.requestDate}>
                                {
                                    Object.entries(book).map(([header, value]) => {
                                        return borrowingHeaders.includes(header) ? 
                                            <StyledTableCell key={"userBooksInQueuesCell-" + header + "-" + value}>
                                                {value}
                                            </StyledTableCell> : null
                                    })
                                }
                                <StyledTableCell>{dateFormat(queueRequest.requestDate, "mmmm dS, yyyy")}</StyledTableCell>
                                <GiveBookButton 
                                    onHands={props.onHands}
                                    userId={queueRequest.user.id}
                                    bookId={queueRequest.book.id}
                                    onClickFunction={giveBookToUser}
                                />
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
    )
}