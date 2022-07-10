import { IRoom } from "../types";

const BASEURL = "https://localhost:7278/api/";

const getRooms = async () => {
  const URL = BASEURL + "Rooms";
  const response = await fetch(URL);
  const data = response.json();

  if (response.status === 200) {
    return data;
  } else {
    throw new Error("Error getting rooms");
  }
};

export { getRooms };
