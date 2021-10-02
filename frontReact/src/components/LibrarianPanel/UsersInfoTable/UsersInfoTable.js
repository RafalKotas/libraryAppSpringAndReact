import React from "react"
import UserData from "./UserData/UserData";

export default function UsersInfoTable(props) {
    return (<React.Fragment>
        {
            props.users.map(user => {
                return (<UserData key={"user-" + user.id + "-dataRow"} user={user}></UserData>)
            })
        }
    </React.Fragment>)
}