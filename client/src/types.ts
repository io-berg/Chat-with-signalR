export interface ILobbyProps {
  joinRoom: (room: string, user: string) => Promise<void>;
}

export interface IChatProps {
  messages: IMessage[];
  users: string[];
  sendMessage: (message: string) => Promise<void>;
  closeConnection: () => void;
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
