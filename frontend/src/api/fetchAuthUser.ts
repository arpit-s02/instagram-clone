import axios from "axios";
import config from "../config";

const fetchAuthUser = () => {
  const url = `${config.rootEndpoint}/users/me`;
  const token = localStorage.getItem("token");

  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default fetchAuthUser;
