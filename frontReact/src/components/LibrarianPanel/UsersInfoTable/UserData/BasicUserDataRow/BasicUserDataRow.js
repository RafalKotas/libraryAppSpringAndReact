//icons
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
//core
import IconButton from '@material-ui/core/IconButton';
import {
    TableCell,
    TableRow
} from "@material-ui/core";
//styles
import { makeStyles } from '@material-ui/core/styles';

const useRowStyles = makeStyles({
    
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
});

export default function BasicUserDataRow(props) {
    
    const classes = useRowStyles();
    const { user } = props;
    const headers = ["id", "email", "username", "firstName", "lastName"];

    return (<TableRow key={"user-" + user["id"] + "-infoAtLibrarianPanel"} className={classes.root}>
        <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => props.showHideDetails(!props.open)}>
                {props.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
        </TableCell>
        {headers.map((x, i) => 
            <TableCell key={"user-" + user[x] + "-cellAtLibrarianPanel"} align="center" className="border border-dark">{user[x]}</TableCell>
        )}
    </TableRow>)
}