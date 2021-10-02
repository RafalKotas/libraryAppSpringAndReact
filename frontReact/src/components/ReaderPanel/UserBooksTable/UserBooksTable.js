import React from 'react';
import {
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    TableContainer,
    Paper
} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import BookBorrowingsService from "../../../services/bookBorrowings.service"

import dateFormat from 'dateformat';

const useRowStyles = makeStyles({
    root: {
      width: '100%'
      /*'& > *': {
        borderBottom: 'unset',
      },*/
    },
  });

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "green",
      color: '#00f8e1',
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

const useStyles = makeStyles({
    table: {
      minWidth: 700
    },
    container: {
      minHeight: 450,
      maxHeight: 600,
      marginBottom: "10px"
    }
  });

  const prepareRowData = (userBorrowing) => {
    return {
        "Title": userBorrowing.book.title,
        "Author": userBorrowing.book.author,
        "Request date": userBorrowing.id.requestDate,
        "Borrowing date": userBorrowing.borrowingDate,
        "Return date": userBorrowing.returnDate
    }
  }
  
  const cellAlignments = {
      "Title": "left",
      "Author": "center",
      "Request date": "center",
      "Borrowing date": "center",
      "Return date": "center"
  }


  const UserBooksTable = ({data, headers, userID, parentCallback}) => {
    const classes = useStyles();

    const headersFieldsLengths = {
        "Title": "28%",
        "Author": "21%",
        "Request date": "17%",
        "Borrowing date": "17%",
        "Return date": "17%"
    }

    function Row(props) {

      const {userID, bookID, rowData} = props;

      const [open, setOpen] = React.useState(false);
      const classes = useRowStyles();

      const returnProperCellContent = (propertyName) => {
        if (propertyName.includes("date")) {
          switch (propertyName) {
            case "Request date":
              return dateFormat(rowData[propertyName], "mmmm dS, yyyy")
            case "Borrowing date":
              if (rowData[propertyName] == null) {
                return "IN QUEUE";
              } else {
                return dateFormat(rowData[propertyName], "mmmm dS, yyyy")
              }
            case "Return date":
              if (rowData[propertyName] == null) {
                //borrowed at the moment
                if(rowData["Borrowing date"] !== null) {
                  return (<button onClick={() => returnBook(userID, bookID)} className="btn btn-primary">Return</button>)
                } else {
                  return "IN QUEUE";
                }
                
              } else {
                return dateFormat(rowData[propertyName], "mmmm dS, yyyy")
              }
            default:
              return dateFormat(rowData[propertyName], "mmmm dS, yyyy")
          }
        } else {
          return rowData[propertyName]
        }   
      }
    
      return (
        <React.Fragment>
          <TableRow className={classes.root}>

            <TableCell>
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>

            {
              headers.map((property) => {
                return (
                  <TableCell key={"headerProperty-" + property} align={cellAlignments[property]}>
                    {returnProperCellContent(property)}
                  </TableCell>
                )
              })
            }
          </TableRow>
        </React.Fragment>
      );
    }

    const returnBook = (userID, bookID) => {
      BookBorrowingsService.returnBook(userID, bookID)
      .then(
          parentCallback(bookID)
      )
    }

    return (
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader className={classes.table} aria-label="collapsible table">
              <TableHead>
                  <TableRow>
                    <StyledTableCell>More Info</StyledTableCell>
                    {
                      headers.map((propertyName, i) =>
                        <StyledTableCell
                          style={{width: headersFieldsLengths[propertyName]}} 
                          align={cellAlignments[propertyName]} 
                          key={i}
                        >
                          {propertyName}
                        </StyledTableCell>
                      )
                    }
                  </TableRow>
              </TableHead>
              <TableBody>
                      {
                          data.map( (bookEntry, i) => (
                                  <Row key={"rowWithReqDate-" + bookEntry.id.requestDate} 
                                      rowData={prepareRowData(bookEntry)} 
                                      userID={userID}
                                      bookID={bookEntry.id.bookId}
                                  />
                              )
                          )
                      }
              </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    )
}

export default UserBooksTable;