import React, { useEffect, useState } from "react"

export default function SingleTextFilter({propertyName, propertyLabel, valueFromMainSection, 
    filterType, placeholderVal, parentCallback}) {
        
    
    const [propertyValue, setPropertyValue] = useState(valueFromMainSection);
    
    const handleChangeProperty = (e) => {
        let value = e.target.value;
        setPropertyValue(value);
    }

    useEffect(() => {
        setPropertyValue(valueFromMainSection);
    }, [valueFromMainSection])

    useEffect(() => {
        parentCallback(propertyName, propertyValue);
        // eslint-disable-next-line
    }, [propertyValue])

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    return (
        <div className={"p-2 w-100"}>
            <label htmlFor={propertyName}>
                <b>{capitalize(propertyLabel)}:</b>
            </label>
            <input
                type={filterType}
                className="form-control"
                placeholder={placeholderVal + "..."}
                value={propertyValue}
                name={propertyLabel}
                onChange={handleChangeProperty}
            />
         </div>
    )
}