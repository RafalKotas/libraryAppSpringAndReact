import React from "react";
import {required} from "../../Validations/validations";

export default function LoginPhase1({email, onChangeEmail, tryGoToNextPhase, message}) {
    return (       
        <React.Fragment>
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={onChangeEmail}
                    validations={[required]}
                />
            </div>
            {message && (
                    <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                            {message}
                        </div>
                    </div>
            )}
            <button className="btn btn-secondary btn-block" type="button" onClick={tryGoToNextPhase}>Next</button>
        </React.Fragment>             
    )
}