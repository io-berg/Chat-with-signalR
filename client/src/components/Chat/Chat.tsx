import { IChatProps, IMessage } from "../../types";
import ConnectedUsers from "./ConnecterUsers";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";

const Chat = (props: IChatProps) => {
  return (
    <div className="flex flex-col p-5 full-height">
      <div className="flex justify-between">
        <span className="text-xl font-bold w-full self-center">
          {props.currentChat}
        </span>
        <button
          className="btn btn-outline btn-warning self-end w-28 m-2"
          onClick={props.closeConnection}
        >
          Leave Room
        </button>
      </div>
      <div className="flex grow mb-2">
        <MessageContainer messages={props.messages}></MessageContainer>
        <ConnectedUsers users={props.users}></ConnectedUsers>
      </div>
      <SendMessageForm sendMessage={props.sendMessage}></SendMessageForm>
    </div>
  );
};

export default Chat;
