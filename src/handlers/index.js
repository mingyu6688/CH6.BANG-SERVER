import HANDLER_IDS from '../constants/handlerIds.js';
import registerHandler from './auth/register.handler.js';
import loginHandler from './auth/login.handler.js';
import getRoomListHandler from './lobby/getRoomList.handler.js';
import createRoomHandler from './lobby/createRoom.handler.js';
import joinRoomHandler from './lobby/joinRoom.handler.js';
import joinRandomRoomHandler from './lobby/joinRandomRoom.handler.js';
import leaveRoomHandler from './lobby/leaveRoom.handler.js';
import gamePrepareHandler from './lobby/gamePrepare.handler.js';
const packetTypes = {
  [HANDLER_IDS.REGISTER_REQUEST]: {
    packetType: registerHandler,
    protoType: 'C2SRegisterRequest',
  },
  [HANDLER_IDS.LOGIN_REQUEST]: {
    packetType: loginHandler,
    protoType: 'C2SLoginRequest',
  },
  [HANDLER_IDS.CREATE_ROOM_REQUEST]: {
    packetType: createRoomHandler,
    protoType: 'C2SCreateRoomRequest',
  },
  [HANDLER_IDS.GET_ROOM_LIST_REQUEST]: {
    packetType: getRoomListHandler,
    protoType: 'C2SGetRoomListRequest',
  },
  [HANDLER_IDS.JOIN_ROOM_REQUEST]: {
    packetType: joinRoomHandler,
    protoType: 'C2SJoinRoomRequest',
  },
  [HANDLER_IDS.JOIN_RANDOM_ROOM_REQUEST]: {
    packetType: joinRandomRoomHandler,
    protoType: 'C2SJoinRandomRoomRequest',
  },
  [HANDLER_IDS.LEAVE_ROOM_REQUEST]: {
    packetType: leaveRoomHandler,
    protoType: 'C2SLeaveRoomRequest',
  },
  [HANDLER_IDS.GAME_PREPARE_REQUEST]: {
    packetType: gamePrepareHandler,
    protoType: 'C2SGamePrepareRequest',
  },
};
/**
 * 패킷타입에 맞는 핸들러로 분배해주는 함수
 * @param {Socket} socket
 * @param {Number} packetType
 * @param {Object} payload
 */
export const handler = async (socket, packetType, payload) => {
  try {
    console.log('PacketType: ', packetType);
    console.log('Payload: ', payload);
    const handlerFunction = packetTypes[packetType].packetType;
    if (!handlerFunction) {
      throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `핸들러를 찾을 수 없습니다`);
    }
    await handlerFunction({ socket, payload });
  } catch (err) {
    //await handlerError(socket, err);
  }
};

// export const getHandlerById = (packetType) => {
//   if (!handlers[packetType]) {
//     throw new CustomError(
//       ErrorCodes.UNKNOWN_HANDLER_ID,
//       `[${packetType}] HandlerID의 핸들러를 찾을 수 없습니다.`,
//     );
//   }

//   return handlers[packetType].handler;
// };

// export const getProtoTypeById = (packetType) => {
//   if (!handlers[packetType]) {
//     throw new CustomError(
//       ErrorCodes.UNKNOWN_HANDLER_ID,
//       `[${packetType}] HandlerID의 프로토타입을 찾을 수 없습니다.`,
//     );
//   }

//   return handlers[packetType].protoType;
// };

// export const getProtoPayloadTypeById = (packetType) => {
//   if (!handlers[packetType]) {
//     throw new CustomError(
//       ErrorCodes.UNKNOWN_HANDLER_ID,
//       `[${packetType}] HandlerID의 프로토타입 페이로드를 찾을 수 없습니다.`,
//     );
//   }

//   return handlers[packetType].protoPayloadType;
// };
