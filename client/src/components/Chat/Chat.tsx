import { join } from "path";
import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IChatProps } from "../../types";
import ConnectedUsers from "./ConnecterUsers";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";

const Chat: FC<IChatProps> = ({
  typingUsers,
  currentChat,
  currentUser,
  closeConnection,
  messages,
  users,
  sendMessage,
  startTyping,
  stopTyping,
  joinRoom,
}) => {
  const { room } = useParams();

  const currentlyTyping: string = typingUsers
    .map((userConnection) => userConnection.user)
    .join(", ");

  const currentlyTypingText = () => {
    if (currentlyTyping.length > 0) {
      if (typingUsers.length === 1) {
        return `${currentlyTyping} is typing...`;
      }
      return `${currentlyTyping} are typing...`;
    }
    return "";
  };

  useEffect(() => {
    if (!room) {
      joinRoom(currentUser, "General");
    } else {
      joinRoom(currentUser, room);
    }
  }, [room]);

  return (
    <div className="flex flex-col p-5 full-height">
      <div className="flex justify-between">
        <span className="text-xl font-bold w-full self-center">
          {currentChat}
        </span>
        <button
          className="btn btn-outline btn-warning self-end w-28 m-2"
          onClick={closeConnection}
        >
          Leave Room
        </button>
      </div>
      <div className="flex grow mb-2">
        <MessageContainer messages={messages}></MessageContainer>
        <ConnectedUsers users={users}></ConnectedUsers>
      </div>
      <span className="pb-1">{currentlyTypingText()}</span>
      <SendMessageForm
        sendMessage={sendMessage}
        startTyping={startTyping}
        stopTyping={stopTyping}
      ></SendMessageForm>
    </div>
  );
};

export default Chat;
