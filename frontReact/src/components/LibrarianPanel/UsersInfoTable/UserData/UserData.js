import React from "react"
import BasicUserDataRow from "./BasicUserDataRow/BasicUserDataRow";
import UserDetails from "./UserDetails/UserDetails";

export default function UserData(props) {

    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment key={"user-" + props.user.id + "-basicDataFR"}>
            <BasicUserDataRow key={"user-" + props.user.id + "-basicData"} 
                user={props.user} 
                open={open} 
                showHideDetails={setOpen}>
            </BasicUserDataRow>

            <UserDetails userId={props.user.id} open={open}></UserDetails>
        </React.Fragment>
    )
}