import { withStyles } from '@material-ui/core/styles';
import {
    TableCell
} from "@material-ui/core";

export const UserBooksHeaderCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#8c3e11",
      color: "#c5eff7",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "black"
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

export const StyledTableCell = withStyles((theme) => ({
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