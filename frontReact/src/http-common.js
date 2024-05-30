import axios from "axios";

//const applicationURL_AWS = "https://springawslibraryserver5000-env.eba-jm3u5meh.eu-central-1.elasticbeanstalk.com/api"
const applicationURL_local = "http://localhost:5000/api"


let httpCommon = axios.create({
    baseURL:  applicationURL_local,
    headers: {
        "Content-type": "application/json"
    }
});

export default httpCommon