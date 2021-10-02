import React, {useEffect, useState, useRef} from "react";
import "./StatusFilters.css"

export default function StatusFilters(props) {
    
    const bookStatusParentDivRef = useRef(null);

    const bookStatusList = ["any", "available", "borrowed"];

    const [selectedStatus, setSelectedStatus] = useState("any");
    
    const handleBookStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    }

    useEffect(() => {
        props.parentCallback(selectedStatus);
        //eslint-disable-next-line
    }, [selectedStatus])

    return (
        <div ref={bookStatusParentDivRef} id="bookStatusParentDiv" className={"flex flex-column"}>
            <h4 className="autoWidth">Status</h4>
            {
                bookStatusList.map((status) => {
                    return (
                        <div className="container autoWidth" key={"status-" + status}>
                            <input 
                                className="form-check-input" 
                                type="radio" 
                                name="bookStatus" 
                                value={status} 
                                id={"status1_" + status} 
                                onChange={handleBookStatusChange} 
                                checked={selectedStatus === status}
                            />
                            <label className="form-check-label" htmlFor={"status1_" + status}>
                                {status}
                            </label>
                        </div>
                    )
                })
            }
        </div>  
    )
} 