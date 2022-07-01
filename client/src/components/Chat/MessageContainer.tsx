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

  const messa = props.messages.map((message, index) => {
    return (
      <div key={index}>
        <span>{message.user}</span>
        <span>{message.message}</span>
      </div>
    );
  });

  return <div ref={messageRef}>{messa}</div>;
};

export default MessageContainer;
