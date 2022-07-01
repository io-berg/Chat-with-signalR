import { IChatProps, IMessage } from "../../types";
import ConnectedUsers from "./ConnecterUsers";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";

const Chat = (props: IChatProps) => {
  return (
    <div>
      <div>
        <button onClick={props.closeConnection}>Leave Room</button>
      </div>
      <ConnectedUsers users={props.users}></ConnectedUsers>
      <MessageContainer messages={props.messages}></MessageContainer>
      <SendMessageForm sendMessage={props.sendMessage}></SendMessageForm>
    </div>
  );
};

export default Chat;
