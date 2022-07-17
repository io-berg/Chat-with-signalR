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
  const token = await currentAuthToken();

  if (token === "") {
    return false;
  }

  const URL = BASEURL + "IsAuthenticated";

  const response = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    return true;
  } else if (response.status === 404) {
    return false;
  }
  return false;
};

const currentAuthToken = () => {
  const token = localStorage.getItem("token");

  return token;
};

export { authenticate, isAuthenticated, currentAuthToken };
