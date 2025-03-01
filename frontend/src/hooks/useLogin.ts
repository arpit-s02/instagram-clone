import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Credentials } from "../types";
import login from "../api/login";
import fetchAuthUser from "../api/fetchAuthUser";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchAuthUser().then(() => navigate("/"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();

  const validateFields = (credentials: Credentials) => {
    setIsValid(credentials.email && credentials.password ? true : false);
  };

  const updateFields = (credentials: Credentials) => {
    setCredentials(credentials);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name;
    const value = event.target.value;

    const updatedCredentials = {
      ...credentials,
      [field]: value,
    };

    setError(null);
    updateFields(updatedCredentials);
    validateFields(updatedCredentials);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    login(credentials)
      .then((response) => {
        const { token } = response.data;
        localStorage.setItem("token", token);
        navigate("/");
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "Something went wrong";
        setError(errorMessage);
      })
      .finally(() => setLoading(false));
  };

  return { credentials, loading, error, isValid, handleChange, handleSubmit };
};

export default useLogin;
