import HANDLER_IDS from '../../constants/handlerIds.js';
import { getLobbyByRoomId } from '../../session/lobby.session.js';
import { getRoomByUserId, getRoomSessions } from '../../session/room.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const leaveRoomHandler = async ({ socket, payload }) => {
  try {
    const user = getUserBySocket(socket);
    const userId = user.id;

    // 1. 유저의 정보를 사용해 현재 request를 보낸 room의 정보를 찾아야한다. / lobby의 정보도 같이
    // const roomSessions = getRoomSessions();
    // const thisRoom = roomSessions.find((room) => room.users.find((user) => user.id === userId));
    const thisRoom = getRoomByUserId(userId);
    const thisLobby = getLobbyByRoomId(thisRoom.id);
    // 2. 방 나가기를 수행

    // 2-1. 방에 혼자 남아있을 때 나갔다면 로비에서 방을 삭제하고 끝
    if (thisRoom.users.length <= 1) {
      thisRoom.removeUser(userId);
      thisLobby.removeRoom(thisRoom.id);
      console.log(thisLobby);

      // 2-1-1. 로비에 사용자 추가
      thisLobby.addUser(user);
      console.log(thisLobby);

      // 2-1-2. 당사자에게 응답 / 방이 삭제되어 알림은 필요없음
      const S2CLeaveRoomResponse = {
        success: true,
        failCode: 0,
      };

      const gamePacket = { leaveRoomResponse: S2CLeaveRoomResponse };

      const leaveRoomResponse = createResponse(
        HANDLER_IDS.LEAVE_ROOM_RESPONSE,
        socket.version,
        socket.sequence,
        gamePacket,
      );

      socket.write(leaveRoomResponse);
      return;
    }

    // 2-2. 지금 나가려는게 방장이라면 // 해보니까 다음 순서에게 넘겨줘도 게임 시작 권한이 없음;
    if(thisRoom.ownerId === userId) {
      // 방장 다음 순서로 들어온 사람에게 방장을 넘김
      const newOwner = thisRoom.users[1]
      thisRoom.ownerId = newOwner.id;

      // 방에서 나가고 로비에 추가
      thisRoom.removeUser(userId);
      thisLobby.addUser(user);

      // 당사자에게 응답
      const S2CLeaveRoomResponse = {
        success: true,
        failCode: 0,
      };

      const gamePacket = { leaveRoomResponse: S2CLeaveRoomResponse };

      const leaveRoomResponse = createResponse(
        HANDLER_IDS.LEAVE_ROOM_RESPONSE,
        socket.version,
        socket.sequence,
        gamePacket,
      );

      socket.write(leaveRoomResponse);

      // 방에 있는 다른 사람들에게 알림
      thisRoom.leaveNotification(userId);
      return;
    }

    // 2-3. 방에 사람이 더 남아있을 때 나갔다면 정상진행
    
    // 2-3-1. 방에서 제거하고 로비에 사용자 추가
    thisRoom.removeUser(userId);
    thisLobby.addUser(user);

    // 2-3-2. 당사자에게 응답
    const S2CLeaveRoomResponse = {
      success: true,
      failCode: 0,
    };

    const gamePacket = { leaveRoomResponse: S2CLeaveRoomResponse };

    const leaveRoomResponse = createResponse(
      HANDLER_IDS.LEAVE_ROOM_RESPONSE,
      socket.version,
      socket.sequence,
      gamePacket,
    );

    socket.write(leaveRoomResponse);

    // 2-3-3. 방에 있던 사람들에게 알림
    thisRoom.leaveNotification(userId);
    return;
  } catch (err) {
    // 실패 응답
    const S2CLeaveRoomResponse = {
      success: false,
      failCode: 6,
    };

    const gamePacket = { leaveRoomResponse: S2CLeaveRoomResponse };

    const leaveRoomResponse = createResponse(
      HANDLER_IDS.LEAVE_ROOM_RESPONSE,
      socket.version,
      socket.sequence,
      gamePacket,
    );

    socket.write(leaveRoomResponse);
    return;
  }
};

export default leaveRoomHandler;
