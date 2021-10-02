import Input from "react-validation/build/input";

//bookRestrictions
import {titleRestrictions, 
    authorRestrictions, 
    genreRestrictions, 
    descriptionRestrictions, 
    yearRestrictions} from "../bookFeaturesRestrictions"

export default function BookProperty({bookPropKey, value, onChangeFunc}) {

    const propertyValidations = {
        "title": [titleRestrictions],
        "author": [authorRestrictions],
        "description": [descriptionRestrictions],
        "genre": [genreRestrictions],
        "yearPublished": [yearRestrictions]
    }

    const capitalize = (value) => {
        return (value.substring(0,1).toUpperCase() + value.substring(1, value.length))
    }

    return (
        <div>
            <label className="propertyHeader" htmlFor={"title"}>
                <strong>{capitalize(bookPropKey)} </strong>
            </label>
            <Input
                    type="text"
                    className="form-control"
                    name={bookPropKey}
                    value={value}
                    onChange={onChangeFunc}
                    validations={propertyValidations[bookPropKey]}
            />
        </div>
    )
}