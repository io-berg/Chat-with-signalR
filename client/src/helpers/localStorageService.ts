import { ISavedRoom } from "../types";

const addRoomToLocalStorage = (room: string, type: string) => {
  const newRoom = { room, type };
  const rooms = getRoomsFromLocalStorage();
  if (rooms.includes(newRoom)) return;
  rooms.push(newRoom);
  localStorage.setItem("rooms", JSON.stringify(rooms));
};

const getRoomsFromLocalStorage = (): ISavedRoom[] => {
  const rooms = localStorage.getItem("rooms");
  if (rooms) {
    return JSON.parse(rooms);
  }
  return [];
};

const removeRoomFromLocalStorage = (room: string) => {
  const rooms: ISavedRoom[] = getRoomsFromLocalStorage();
  const newRooms: ISavedRoom[] = rooms.filter(
    (r: ISavedRoom) => r.room !== room
  );
  localStorage.setItem("rooms", JSON.stringify(newRooms));
};

export {
  addRoomToLocalStorage,
  getRoomsFromLocalStorage,
  removeRoomFromLocalStorage,
};
