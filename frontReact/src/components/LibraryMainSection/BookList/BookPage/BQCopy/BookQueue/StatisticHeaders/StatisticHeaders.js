import React from "react";
import {headersWithInputs} from "../queueHeaders.js";
import {
    TableCell,
    TableRow,
    TableSortLabel
} from "@material-ui/core";
import { withStyles} from '@material-ui/core/styles';

//styles
import "./StatisitcHeaders.min.css";

export default function StatisticHeaders({onWeightChange, statisticWeights}) {

    const StyledTableCell = withStyles((theme) => ({
        head: {
          backgroundColor: "#11538C",
          color: "#00FFFF",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "black",
          fontStyle: "italic"
        },
        body: {
          fontSize: 14,
        },
    }))(TableCell);

    return (
        <TableRow>
            {
                Object.entries(headersWithInputs).map(([headerType, headersAndAbbreviations]) => {
                    return Object.entries(headersAndAbbreviations).map(([header, abbr]) => {
                        return <StyledTableCell align={"center"} rowSpan={1}>
                                {abbr}<br/>
                            <input 
                                onChange={onWeightChange} 
                                type={"number"}
                                min={0} 
                                max={10} 
                                step={0.1}
                                name={headerType + "-" + abbr}
                                value={statisticWeights[headerType][abbr]}
                            />
                        </StyledTableCell>
                    })
                })
            }
        </TableRow>
    )
}