import { IConnectedUsersProps } from "../../types";

const ConnectedUsers = (props: IConnectedUsersProps) => {
  return (
    <div>
      <h2>Connected Users</h2>
      <ul>
        {props.users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectedUsers;
