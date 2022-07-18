import { FC } from "react";
import { IHeaderProps } from "../types";
import AlertsContainer from "./Alerts/AlertsContainer";

const Header: FC<IHeaderProps> = ({
  alerts,
  removeAlert,
  currentUser,
  signout,
}) => {
  return (
    <header>
      <div className="navbar bg-base-200">
        <div className="navbar-start">
          {currentUser ? (
            <div className="dropdown">
              <div className="avatar placeholder">
                <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                  <label tabIndex={1} className="btn m-1">
                    {currentUser.charAt(0)}
                  </label>
                </div>
              </div>
              <ul
                tabIndex={2}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a onClick={() => signout()}>Sign out</a>
                </li>
              </ul>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost normal-case text-xl">Signal-R Chat</a>
        </div>
        <div className="navbar-end">
          <AlertsContainer alerts={alerts} removeAlert={removeAlert} />
        </div>
      </div>
    </header>
  );
};

export default Header;
