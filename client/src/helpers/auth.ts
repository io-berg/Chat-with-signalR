import { IAuthResponse } from "../types";

const BASEURL = "https://localhost:7278/api/auth/";

const authenticate = async (username: string, password: string) => {
  const URL = BASEURL + "Login";
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const data: Promise<IAuthResponse> = response.json();
    if (response.status === 200) {
      data.then((data: IAuthResponse) => {
        console.log(data);
        localStorage.setItem("token", data.token);
      });
      return true;
    }
    return false;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const isAuthenticated = async () => {
  const token = currentAuthToken();
  const URL = BASEURL + "IsAuthenticated";

  const response = fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response;
  const data = await result.text();
  if (result.status === 200) {
    return {
      user: data,
      isAuthenticated: true,
    };
  }
  return {
    user: "",
    isAuthenticated: false,
  };
};

const currentAuthToken = () => {
  const token = localStorage.getItem("token");
  if (token === null) {
    return "";
  }
  return token;
};

export { authenticate, isAuthenticated, currentAuthToken };
