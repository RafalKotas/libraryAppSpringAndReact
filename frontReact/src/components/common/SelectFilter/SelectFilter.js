import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import React, { useState, useEffect} from 'react';

export default function SelectFilter({parentCallback, propertyName, serviceMethod, getOptions, currentOption}) {

    /*
        parentCallback
        propertyName
        serviceMethod
        getOptions
    */

    /*console.log("-".repeat(5) + "START" + "-".repeat(5));
    console.log("propertyName: " + propertyName);
    console.log("parentCallback: " + parentCallback);
    console.log("getOptions: " + getOptions);
    console.log("-".repeat(5) + "-END-" + "-".repeat(5));*/

    const [option, setCurrentOption] = useState(currentOption || "");
    const [options, setOptions] = useState(null);

    const handleChange = (event) => {
        setCurrentOption(event.target.value);
    };

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    useEffect(() => {
        parentCallback(propertyName, option);
        // eslint-disable-next-line
    }, [option])

    useEffect(() => {
        if(serviceMethod) {
            getOptions().then(
                (response) => {
                    let opts = ["All"].concat(response.data);
                    setOptions(opts);
                }
            )
        } else {
            let opts = getOptions();
            setOptions(opts);
        }
    }, [getOptions, serviceMethod]);

    return (
        options && ( <FormControl variant="outlined" className="p-2">
            <InputLabel htmlFor="outlined-age-native-simple">
                <b>{capitalize(propertyName)}</b>
            </InputLabel>
            <Select
                className="bg-white"
                native
                value={option}
                onChange={handleChange}
                label={propertyName}
            >
            {
                <React.Fragment>
                    {options.map((option) => {
                        return (<option key={propertyName + "-" + option} value={option}>{option}</option>)
                    })}
                </React.Fragment>
            }
            </Select>
        </FormControl> )
    )
}