import axios from "axios"
import authHeader from "./auth-header"
import {applicationURL_local} from "./urls"

const API_URL = applicationURL_local

const getPublicContent = () => {
    let fullUrl = API_URL + "/test/all"
    console.log("public content URL: " + fullUrl)
    return axios.get(API_URL + "/test/all")
}

const getReaderBoard = (userId) => {
    return axios.get(API_URL + `/test/reader/${userId}`, { headers: authHeader() })
}

const getLibrarianBoard = () => {
    return axios.get(API_URL + "/test/librarian", { headers: authHeader() })
}

const getUserData = (userId) => {
    return axios.get(API_URL + `/user/${userId}`)
}

const userWithEmailExists = (userEmail) => {
    return axios.get(API_URL + `/user/existByEmail/${userEmail}`)
}

const UserService = {
    userWithEmailExists,
    getPublicContent,
    getReaderBoard,
    getLibrarianBoard,
    getUserData,
}

export default UserService