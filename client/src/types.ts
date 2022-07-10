export interface ILobbyProps {
  joinRoom: (room: string, user: string) => Promise<void>;
}

export interface IChatProps {
  messages: IMessage[];
  users: string[];
  sendMessage: (message: string) => Promise<void>;
  closeConnection: () => void;
  currentChat: string;
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

export interface IAlert {
  id: string;
  message: string;
  type: string;
}
