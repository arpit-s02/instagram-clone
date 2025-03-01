import axios from "axios";
import { Credentials } from "../types";
import config from "../config";

const login = (credentials: Credentials) => {
  const url = `${config.rootEndpoint}/users/login`;
  return axios.post(url, credentials);
};

export default login;
