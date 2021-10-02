import React, { useEffect } from "react";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { useState} from "react";

export default function BookQueueHeader(props) {

    const [show, setShow] = useState(true)

    const handleChange = (event) => {
        setShow(event.target.checked)
        props.setDisplayQueueCallback(show)
    }

    useEffect(() => { props.setDisplayQueueCallback(show)}, [show, props])

    return (
        <React.Fragment>
            <h2>QUEUE</h2>
            <FormControlLabel
                control={
                <Checkbox
                    checked={show}
                    onChange={handleChange}
                    name="checkedB"
                    color="primary"
                />
                }
                label="SHOW"
            />
        </React.Fragment>
    )
}