import React, { FC, useState } from "react";
import { ISendMessageFormProps } from "../../types";

const SendMessageForm: FC<ISendMessageFormProps> = ({
  startTyping,
  stopTyping,
  sendMessage,
  room,
}) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    if (e.target.value.length > 0) {
      if (isTyping === false) {
        startTyping(room);
        setIsTyping(true);
      }
    }
    if (isTyping === true && e.target.value.length === 0) {
      stopTyping(room);
      setIsTyping(false);
    }

    setMessage(e.target.value);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(message, room);
        setMessage("");
        setIsTyping(false);
      }}
      className="w-full mt-auto flex"
    >
      <input
        className="textarea textarea-bordered w-full mr-2"
        placeholder="message"
        onChange={(e) => handleChange(e)}
        value={message}
      />
      <button type="submit" disabled={!message} className="btn w-48">
        Send
      </button>
    </form>
  );
};

export default SendMessageForm;
