import React, { Fragment, useEffect } from "react";
import Holder from "holderjs";

export function HolderExample(props) {
    useEffect(() => {        
      Holder.run({
        domain: "example.com",
        themes: {
          "simple": {
            bg: "#d5f07f",
            fg: "#677",
            align: "center"
          }
        }
      });
    });
    return (
        <Fragment>
          <img data-src={"example.com/" + props.componentWidth + "x500?text=" + props.headerText + "&theme=simple"} 
            alt="1110x500-holderjs"/>
        </Fragment>
    );
}