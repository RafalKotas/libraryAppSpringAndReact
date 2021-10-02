import {required} from "../../Validations/validations";
import React from "react";

export default function LoginPhase2({password, onChangePassword, loading, message}) {
    return (
        <React.Fragment>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onChangePassword}
                    validations={[required]}
                />
            </div>
            <div className="form-group">
                <button className="btn btn-primary btn-block" disabled={loading}>
                    {loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Login</span>
                </button>
            </div>
            {message && (
                    <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                            {message}
                        </div>
                    </div>
            )}
        </React.Fragment>
        
    )
}