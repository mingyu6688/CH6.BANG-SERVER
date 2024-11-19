import { getRoomByUserId } from "../../session/room.session.js";
import { getUserBySocket } from "../../session/user.session.js";

const gamePrepareHandler = ({socket, payload}) => {
    // 룸의 인원 수 파악
    const user = getUserBySocket(socket);
    const userId = user.id;
    const thisLobby = getRoomByUserId(userId);
    const lobbyUsersCount = thisLobby.users.length;

    // 인원 수에 따라 정해져있는 역할을 랜덤으로 배정
    switch(lobbyUsersCount) {
        case 2: {
            // 타겟1, 히트맨1
            // 유저 목록을 가져와야함
            // 두명 중 하나에게 먼저 타겟을 부여
            // 나머지 하나에게 히트맨을 부여
            break;
        }
        case 3: {
            break;
        }
        case 4: {
            break;
        }
        case 5: {
            break;
        }
        case 6: {
            break;
        }
        case 7: {
            break;
        }
    }

    // 유저별 캐릭터도 랜덤으로 배정


}

export default gamePrepareHandler;