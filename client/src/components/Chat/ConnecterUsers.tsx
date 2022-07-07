import { IConnectedUsersProps } from "../../types";

const ConnectedUsers = (props: IConnectedUsersProps) => {
  return (
    <div className="w-48 border-l-2 border-gray-600 pl-2">
      <h2>Connected Users</h2>
      <ul>
        {props.users.map((user, index) => (
          <li className="text-gray-100" key={index}>
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectedUsers;
