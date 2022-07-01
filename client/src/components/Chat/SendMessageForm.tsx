import React, { useState } from "react";
import { ISendMessageFormProps } from "../../types";

const SendMessageForm = (props: ISendMessageFormProps) => {
  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.sendMessage(message);
        setMessage("");
      }}
    >
      <input
        type="text"
        placeholder="message"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button type="submit" disabled={!message}>
        Send
      </button>
    </form>
  );
};

export default SendMessageForm;
