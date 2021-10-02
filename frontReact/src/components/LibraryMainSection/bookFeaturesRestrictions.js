const titleRestrictions = (value) => {

    var pattern = /^[a-zA-Z!:.,()\s-]*$/;

    var cond1met = value.match(pattern);
    var cond2met = (value.length >= 3 && value.length <= 120)
    if(!cond1met || !cond2met) {
        return (
            <div className={"alert alert-danger"} role="alert">
                <ul>
                    <li className={cond1met ? "text-success" : "text-danger"}>
                        Title must contain only letters (a-z / A-Z), spaces and punctuation marks - ! : . , / ( ) .
                    </li>
                    <li className={cond2met ? "text-success" : "text-danger"}>
                        Should be between 3 and 100 characters length.
                    </li>
                </ul>
            </div>
        )
    }
}

const authorRestrictions = (value) => {
    var pattern = /^[a-zA-Z.\s]*$/;

    var cond1met = value.match(pattern);
    var cond2met = (value.length >= 4 && value.length <= 50)

    if(!cond1met || !cond2met) {
        return (
            <div className={"alert alert-danger"} role="alert">
                <ul>
                    <li className={cond1met ? "text-success" : "text-danger"}>
                        Author must contain only letters, spaces (a-z / A-Z) and a dot(.).
                    </li>
                    <li className={cond2met ? "text-success" : "text-danger"}>
                        Should be between 4 and 50 characters length.
                    </li>
                </ul>
            </div>
        )
    }
}

const descriptionRestrictions = (value) => {
    var pattern = /^[a-zA-Z!:.,()\s-]*$/;

    var cond1met = value.match(pattern);

    const [minDescriptionLength, maxDescriptionLength] = [20, 500];

    var cond2met = (value.length >= minDescriptionLength && value.length <= maxDescriptionLength)
    if(!cond1met || !cond2met) {
        return (
            <div className={"alert alert-danger"} role="alert">
                <ul>
                    <li className={cond1met ? "text-success" : "text-danger"}>
                        Description must contain only letters, spaces and punctuation marks (! . , ? : -).
                    </li>
                    <li className={cond2met ? "text-success" : "text-danger"}>
                        Should be between {minDescriptionLength} and {maxDescriptionLength} characters length.
                    </li>
                </ul>
            </div>
        )
    }
};

const genreRestrictions = (value) => {
    var pattern = /^[a-zA-Z\s]*$/;

    var cond1met = value.match(pattern);
    var cond2met = (value.length >= 5 && value.length <= 80)
    if(!cond1met || !cond2met) {
        return (
            <div className={"alert alert-danger"} role="alert">
                <ul>
                    <li className={cond1met ? "text-success" : "text-danger"}>
                            Genre must contain only letters (a-z / A-Z) and spaces.
                    </li>
                    <li className={cond2met ? "text-success" : "text-danger"}>
                            Should be between 5 and 80 characters length.
                    </li>
                </ul>
            </div>
        );
    }
};

const yearRestrictions = (value) => {

    let yearInt = parseInt(value)

    var cond1met = yearInt >= 1900 && yearInt < 2022
    if(!cond1met) {
        return (
            <div className={"alert alert-danger"} role="alert">
                <ul>
                    <li className={cond1met ? "text-success" : "text-danger"}>
                            Year must be between 1900(including) and 2022(excluding).
                    </li>
                </ul>
            </div>
        );
    }
};

export {titleRestrictions, authorRestrictions, genreRestrictions, descriptionRestrictions, yearRestrictions}