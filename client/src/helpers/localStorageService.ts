const addRoomToLocalStorage = (room: string) => {
  const rooms = getRoomsFromLocalStorage();
  if (rooms.includes(room)) return;
  rooms.push(room);
  localStorage.setItem("rooms", JSON.stringify(rooms));
};

const getRoomsFromLocalStorage = (): string[] => {
  const rooms = localStorage.getItem("rooms");
  if (rooms) {
    return JSON.parse(rooms);
  }
  return [];
};

const removeRoomFromLocalStorage = (room: string) => {
  const rooms: string[] = getRoomsFromLocalStorage();
  const newRooms: string[] = rooms.filter((r: string) => r !== room);
  localStorage.setItem("rooms", JSON.stringify(newRooms));
};

export {
  addRoomToLocalStorage,
  getRoomsFromLocalStorage,
  removeRoomFromLocalStorage,
};
