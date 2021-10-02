import axios from "axios";

const applicationURL_AWS = "https://springawslibraryserver5000-env.eba-jm3u5meh.eu-central-1.elasticbeanstalk.com/api"
//const applicationURL_local = "http://localhost:5000/api"



export default axios.create({
    baseURL:  applicationURL_AWS,
    headers: {
        "Content-type": "application/json"
    }
});