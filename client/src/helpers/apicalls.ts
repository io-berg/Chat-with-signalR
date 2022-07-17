import { IRoom } from "../types";
import { currentAuthToken } from "./auth";

const BASEURL = "https://localhost:7278/api/";

const getRooms = async () => {
  const URL = BASEURL + "Rooms";
  const response = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await currentAuthToken()}`,
    },
  });
  const data = response.json();

  if (response.status === 200) {
    return data;
  } else {
    throw new Error("Error getting rooms");
  }
};

export { getRooms };
