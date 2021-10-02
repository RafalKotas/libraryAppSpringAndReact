import React from "react";
import AuthService from "../services/auth.service";

import "./Profile.css"

const Profile = () => {
    const currentUser = AuthService.getCurrentUser();

    const capitalize = (value) => {
        return value.substring(0, 1).toUpperCase() + value.substring(1, value.length)
    }

    const userProperties = ["id", "email", "firstName", "lastName"]

    return (
        <div className="border rounded m-3 p-2 d-flex flex-column align-items-center" style={{backgroundColor: "gray"}}>
            <header>
                <h3 className="border p-2 d-flex flex-column align-items-center rounded" style={{maxWidth: "fit-content", backgroundColor: "white"}}>
                        <span>Profile</span>
                        <strong>{currentUser.username}</strong>
                </h3>
            </header>
            <p>
                <strong className="profileFeature">Authentication token value (20 first and 20 last chars): </strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
                {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
            </p>
            {userProperties.map((property) => {
                return (
                    <p key={"user-" + currentUser.id + "-property-" + property}>
                        <strong className="profileFeature">{capitalize(property)} : </strong>{currentUser[property]}
                    </p>
                )
            })}
            <strong className="profileFeature">Authorites:</strong>
            <ul>
                {currentUser.roles &&
                    currentUser.roles.map((role, index) => <li key={"role" + index}>{role}</li>)}
            </ul>
        </div>
    )
}

export default Profile;