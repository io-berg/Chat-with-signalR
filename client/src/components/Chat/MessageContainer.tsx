import { IMessageContainerProps } from "../../types";
import { useEffect, useRef } from "react";

const MessageContainer = (props: IMessageContainerProps) => {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef && messageRef.current) {
      const { scrollHeight, clientHeight } = messageRef.current;
      messageRef.current.scrollTo(0, scrollHeight - clientHeight);
    }
  }, [props.messages]);

  const messages = props.messages.map((message, index) => {
    return (
      <div key={index} className="flex flex-col">
        <span className="text-gray-100">{message.message}</span>
        <span className="text-xs">{message.user}</span>
        <div className="divider m-0.5"></div>
      </div>
    );
  });

  return (
    <div className="flex flex-col shrink h-full w-full" ref={messageRef}>
      {messages}
    </div>
  );
};

export default MessageContainer;
