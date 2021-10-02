import React, { useState, useRef, useEffect } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";

import AuthService from "../../../services/auth.service";
import UserService from "../../../services/user.service";

//subcomponents
import LoginPhase1 from "./Phase1/LoginPhase1";
import LoginPhase2 from "./Phase2/LoginPhase2";

const Login = (props) => {
    const form = useRef();
    const checkBtn = useRef();

    const [phase, setPhase] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const onChangeEmail = (e) => {
        const email = e.target.value;
        console.log(email);
        setEmail(email);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const validateEmail = () => {
        UserService.userWithEmailExists(email)
            .then((emailExists) => {
                if(emailExists.data) {
                    let previousPhase = phase;
                    setPhase(previousPhase + 1);
                } else {
                    setMessage("Not found account with given email!");
                }
            })
    }

    useEffect(() => {
        setMessage("");
    }, [phase])

    const handleLogin = (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        form.current.validateAll();

        if(checkBtn.current.context._errors.length === 0) {
            
            AuthService.login(email, password).then(
                () => {
                    props.history.push("/profile");
                    window.location.reload();
                },
                (error) => {
                    console.log(error)
                    console.log(error.response)
                    setLoading(false);
                    setMessage(error.response.data.reason);
                }
            );
        } else {
            setLoading(false);
        }
    };

    return (
        <div className="col-md-12">
            <div className="card card-container">
                <img
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    className="profile-img-card"
                />

                <Form onSubmit={handleLogin} ref={form}>
                    {phase === 1 && 
                        <LoginPhase1 
                            email={email} 
                            onChangeEmail={onChangeEmail} 
                            tryGoToNextPhase={validateEmail}
                            message={message}
                        />}
                    {phase === 2 && 
                        <React.Fragment>
                            <h6>Email: <b>{email}</b></h6>
                            <LoginPhase2 
                                password={password} 
                                onChangePassword={onChangePassword} 
                                loading={loading} 
                                message={message}/>
                        </React.Fragment>
                    }
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>
            </div>
        </div>
    );
};

export default Login;