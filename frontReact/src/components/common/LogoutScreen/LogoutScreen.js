import React, { useEffect, useState } from "react";

//services
import AuthService from "../../../services/auth.service";

//resources
import loadingCatGif from "../../../resources/LoadingCatGif.gif";


export default function LogoutScreen() {

  const [secondsToLogout, setSecondsToLogout] = useState(null);
  const [countDownInterval, setCountDownInterval] = useState(null);

  const logOut = () => {
      AuthService.logout();
  }

  useEffect(() => {
    setSecondsToLogout(5);
  }, []);

  useEffect(() => {
      const reduceSecondToLogout = () => {
        let prevSecs = secondsToLogout;
        setSecondsToLogout(prevSecs - 1);
      }

      setCountDownInterval(setTimeout(reduceSecondToLogout, 1000));
  }, [secondsToLogout])

  useEffect(() => {
    if (secondsToLogout === 0) {
      clearTimeout(countDownInterval);
      document.getElementById("goToLoginPage").click();
    }
  })

  return secondsToLogout > -1 ? 
      <center>
        <h1>Your account was deleted.</h1>
        <h2>You will be logged out in {secondsToLogout} seconds.</h2>
        <hr/>
        <img src={loadingCatGif} alt="loadingCatGif"/>
        <a id="goToLoginPage" href="/login" className="nav-link" onClick={logOut} disabled={true}>
        </a>
      </center> : <React.Fragment></React.Fragment>
}