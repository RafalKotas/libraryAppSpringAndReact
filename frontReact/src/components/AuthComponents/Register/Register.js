import React, { useState, useRef} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {required, validEmail, validUsername, validPassword} from "../Validations/validations";

import AuthService from "../../../services/auth.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import userManipulationService from "../../../services/userManipulation.service";

const Register = (props) => {
    const form = useRef();
    const checkBtn = useRef();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [role, setRoles] = useState("reader");
    const [message, setMessage] = useState("");
    const [hiddenPassword, setHiddenPassword] = useState(true);
    const [registerFormDisabled, setRegisterFormDisabled] = useState([false, false, false, false, false]);

    const togglePasswordVisibilty = () => {
        let prevHidden = hiddenPassword;
        let updatedHiddenStatus = !prevHidden;
        setHiddenPassword(updatedHiddenStatus);;
    }

    const generateRandomUserDetails = () => {
        userManipulationService.getRandomUserDetails()
            .then(response => {
                let userData = response.data.results[0];
                const {login, name, email} = userData;
                setUserDetails(login.username, login.password, name.first, name.last, email, true);
            })
    }

    const clearUserDetails = () => {
        setUserDetails("", "", "", "", "", false)
    }

    const setUserDetails = (userName, password, firstName, lastName, email, fieldsDisabled) => {
        let updatedRegisterFormDisabled = registerFormDisabled.map(el => {return fieldsDisabled});
        setRegisterFormDisabled(updatedRegisterFormDisabled);
        setUsername(userName);
        setPassword(password);
        setFirstName(firstName);
        setLastName(lastName);
        setEmail(email);
    }

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    }

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    }

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const onChangeFirstName = (e) => {
        const firstName = e.target.value;
        setFirstName(firstName);;
    };

    const onChangeLastName = (e) => {
        const lastName = e.target.value;
        setLastName(lastName);
    }

    const onChangeRole = (e) => {
        const role = e.target.value;
        setRoles(role);
    }

    const handleRegister = (e) => {
        e.preventDefault();

        setMessage("");
        setSuccessful(false);

        form.current.validateAll();

        if (checkBtn.current.context._errors.length === 0) {
            AuthService.register(username, email, password, firstName, lastName, role).then(
                (response) => {
                    console.log(response);
                    setMessage(response.data.message);
                    setSuccessful(true);
                },
                (error) => {
                    console.log(error);
                    const resMessage = error.response.data.message
                    setMessage(resMessage);
                    setSuccessful(false);
                }
            );
        }
    };

    const registerFormLabels = ["Username", "First Name", "Last Name", "Email"];
    const registerFormValues = [username, firstName, lastName, email];
    const registerFormNames = ["username", "firstName", "lastName", "email"];
    const registerFormOnChangeFunctions = [onChangeUsername, onChangeFirstName, onChangeLastName, onChangeEmail];
    const registerFormValidations = [validUsername, null, null, validEmail];

    return (
        <div className="col-md-12">
            <div className="card card-container">
                <img
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    className="profile-img-card"
                />

                <Form onSubmit={handleRegister} ref={form}>
                    {!successful && (
                        <div>
                            <div>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary btn-block mb-2"
                                    onClick={generateRandomUserDetails}
                                >
                                    Generate random user details
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary btn-block mb-2"
                                    onClick={clearUserDetails}
                                >
                                    Clear all inputs
                                </button>
                            </div>
                            {
                                registerFormLabels.map((label, idx) => {
                                    return (
                                        <div key={label + "-" + idx} className="form-group">
                                            <label htmlFor="username">{label}</label>
                                            <Input
                                                disabled={registerFormDisabled[idx]}
                                                type="text"
                                                className="form-control"
                                                name={registerFormNames[idx]}
                                                value={registerFormValues[idx]}
                                                onChange={registerFormOnChangeFunctions[idx]}
                                                validations={[registerFormValidations[idx], required].filter(valFunc => valFunc != null)}
                                            />
                                        </div>
                                    )
                                })
                            }

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="d-flex flex-row align-items-center">
                                    <Input
                                        disabled={false /*registerFormDisabled.slice(-1)[0]*/}
                                        type={hiddenPassword ? 'password' : 'text'}
                                        className="form-control"
                                        name="password"
                                        value={password}
                                        onChange={onChangePassword}
                                        validations={[required, validPassword]}
                                    />
                                    &nbsp;
                                    {hiddenPassword ? <FontAwesomeIcon title="show password" onClick={togglePasswordVisibilty} icon={faEyeSlash} /> 
                                    : <FontAwesomeIcon title="hide password" onClick={togglePasswordVisibilty} icon={faEye} />}
                                </div>
                            </div>

                            <div className="form-check">
                                <Input type="radio" 
                                    className="form-check-input" 
                                    name="userRole" 
                                    value={"reader"}
                                    id="userReader"
                                    onChange={onChangeRole}
                                    checked={role === 'reader'}
                                    />
                                <label className="form-check-label" htmlFor="userReader">
                                    Reader
                                </label>
                            </div>

                            <div className="form-check">
                                <Input type="radio" 
                                    className="form-check-input" 
                                    name="userRole" 
                                    value={"librarian"}
                                    id="userLibrarian"
                                    onChange={onChangeRole}
                                    checked={role === 'librarian'}
                                    />
                                <label className="form-check-label" htmlFor="userLibrarian">
                                    Librarian
                                </label>
                            </div>
                            <div className="form-group">
                                <button className="btn btn-primary btn-block">Sign Up!</button>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className="form-group">
                            <div
                                className={ successful ? "alert alert-success" : "alert alert-danger"}
                            >
                                {message}
                            </div>
                        </div>
                    )}
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>
            </div>
        </div>
    );
};

export default Register;