import axios from "axios";
import { applicationURL_AWS, applicationURL_local } from "./urls";

const API_URL = applicationURL_AWS;

const register = (username, email, password, firstName, lastName, role) => {
  console.log(role)
  return axios.post(API_URL + "/auth/signup", {
    username,
    email,
    password,
    firstName,
    lastName,
    role
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "/auth/signin", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;