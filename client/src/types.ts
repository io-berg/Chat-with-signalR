import { HubConnection } from "@microsoft/signalr";

export interface IRoom {
  room: string;
  users: number;
}

export interface IUserConnection {
  user: string;
  room: string;
}

export interface IMessage {
  user: string;
  message: string;
}

export interface IOpenRoom {
  room: string;
  users: string[];
  messages: IMessage[];
  typingUsers: string[];
}

export interface IChatProps {
  currentUser: string;
  accessToken: string;
  addAlert: (type: string, message: string) => void;
  setConnection: (connection: HubConnection | undefined) => void;
  connection: HubConnection | undefined;
}

export interface IMessageContainerProps {
  messages: IMessage[];
}

export interface ISendMessageFormProps {
  sendMessage: (message: string, room: string) => Promise<void>;
  startTyping: (room: string) => void;
  stopTyping: (room: string) => void;
  room: string;
}

export interface IConnectedUsersProps {
  users: string[];
}

export interface IRegisterProps {
  register: (user: string, password: string, email: string) => Promise<void>;
  addAlert: (type: string, message: string) => void;
}

export interface IAlertsConatinerProps {
  alerts: IAlert[];
  removeAlert: (id: string) => void;
}

export interface IHeaderProps {
  alerts: IAlert[];
  removeAlert: (id: string) => void;
  currentUser: string;
  signout: () => void;
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
  addAlert: (type: string, mesasage: string) => void;
  joinRoom: (room: string, user: string) => Promise<void>;
  user: string;
}

export interface IAlert {
  id: string;
  message: string;
  type: string;
}

export interface IAuthResponse {
  token: string;
  expiration: string;
}

export interface ILoginProps {
  login: (username: string, password: string) => void;
}

export interface IRegisterResult {
  success: boolean;
  errors: IRegisterErrorItem[];
}

export interface IRegisterErrorItem {
  code: string;
  description: string;
}
