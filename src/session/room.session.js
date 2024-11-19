import Room from "../classes/models/room.class.js";
import { roomSessions } from "./session.js";

let unusedNumbers = [];
let nextNumber = 1;

export const addRoom = (ownerId, roomName, maxUserNum) => {
    let roomId = null;

    if (unusedNumbers.length > 0) { // 숫자가 남아있으면
        roomId = unusedNumbers.pop(); // 그거 사용
      } else {
    // 숫자 남은게 없으면 다음 숫자 사용
    roomId = nextNumber++;
    }

    const room = new Room(roomId, ownerId, roomName, maxUserNum);

    roomSessions.push(room);
    return room;
}

export const removeRoomSession = (roomId) => {
    const roomIndex = roomSessions.findIndex((room) => room.id === roomId);
    unusedNumbers.push(roomId); // 사용이 끝난 숫자를 반납
    console.log(unusedNumbers);
    if (roomIndex !== -1) {
        return roomSessions.splice(roomIndex, 1)[0];
    }
}

export const getRoomById = (roomId) => {
    return roomSessions.find((room) => room.id === roomId);
}

export const getRoomSessions = () => {
    return roomSessions;
}

export const getRoomByUserId = (userId) => {
    return roomSessions.find((room) => room.users.find((user) => user.id === userId));
}
