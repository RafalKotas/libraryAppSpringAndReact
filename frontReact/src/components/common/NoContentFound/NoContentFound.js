import Carousel from "react-bootstrap/Carousel";
import React from "react";
import { HolderExample } from "./HolderExample";

export default function NoContentFound({captions, componentWidth}) {
  
    return (
      <Carousel>
        {
          captions.map((caption, index) => {
            return (
              <Carousel.Item key={"caption-" + index + "-" + caption["header"]}>
                <HolderExample
                  componentWidth={componentWidth}
                  headerText={caption["header"]}
                />
              </Carousel.Item>
            )
          })
        }
      </Carousel>
    )
}