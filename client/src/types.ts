export interface ILobbyProps {
  joinRoom: (room: string, user: string) => Promise<void>;
  addAlert: (alert: IAlert) => void;
  rooms: IRoom[];
}

export interface IRoom {
  room: string;
  users: number;
}

export interface IUserConnection {
  user: string;
  room: string;
}

export interface IChatProps {
  messages: IMessage[];
  users: string[];
  sendMessage: (message: string) => Promise<void>;
  closeConnection: () => void;
  currentChat: string;
  typingUsers: IUserConnection[];
  startTyping: () => void;
  stopTyping: () => void;
}

export interface IMessage {
  user: string;
  message: string;
}

export interface IMessageContainerProps {
  messages: IMessage[];
}

export interface ISendMessageFormProps {
  sendMessage: (message: string) => Promise<void>;
  startTyping: () => void;
  stopTyping: () => void;
}

export interface IConnectedUsersProps {
  users: string[];
}

export interface IAlertsConatinerProps {
  alerts: IAlert[];
  removeAlert: (id: string) => void;
}

export interface IHeaderProps {
  alerts: IAlert[];
  removeAlert: (id: string) => void;
}

export interface IMainProps {
  addAlert: (alert: IAlert) => void;
}

export interface IAlertProps {
  alert: IAlert;
  removeAlert: (id: string) => void;
}

export interface IRoomsInfoProps {
  rooms: IRoom[];
  addAlert: (alert: IAlert) => void;
  joinRoom: (room: string, user: string) => Promise<void>;
  user: string;
}

export interface IAlert {
  id: string;
  message: string;
  type: string;
}
