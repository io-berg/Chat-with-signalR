import React, { useState } from "react";
import { ISendMessageFormProps } from "../../types";

const SendMessageForm = (props: ISendMessageFormProps) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length > 0) {
      if (isTyping === false) {
        props.startTyping();
        setIsTyping(true);
      }
    }
    if (isTyping === true && e.target.value.length === 0) {
      props.stopTyping();
      setIsTyping(false);
    }

    setMessage(e.target.value);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.sendMessage(message);
        setMessage("");
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
