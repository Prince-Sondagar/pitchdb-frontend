// import { DefaultEventsMap } from '@socket.io/component-emitter';

export const socketsCommon = {
  attempDisconnect: (socket: any) => {
    if (socket && socket.connected) socket.disconnect();
  },
};
