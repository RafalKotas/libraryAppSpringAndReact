import axios from "axios";
import http from "../http-common";
import authHeader from "./auth-header";

class UserManipulationService {
    deleteUserToken = (userId) => {
        return http.delete(`/userManipulation/removeUserToken/${userId}`, {headers: authHeader()})
    }

    removeTokenOnLogout = (userId) => {
        return http.delete(`/userManipulation/removeTokenOnLogout/${userId}`)
    }

    getRandomUserDetails = () => {
        return axios.get("https://api.randomuser.me/");
    }
}

let userManipulationService = new UserManipulationService();
export default userManipulationService;