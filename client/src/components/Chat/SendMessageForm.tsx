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
      className="w-full mt-auto flex"
    >
      <input
        className="textarea textarea-bordered w-full mr-2"
        placeholder="message"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button type="submit" disabled={!message} className="btn w-48">
        Send
      </button>
    </form>
  );
};

export default SendMessageForm;
