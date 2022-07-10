import { FC } from "react";
import { IHeaderProps } from "../types";
import AlertsContainer from "./Alerts/AlertsContainer";

const Header: FC<IHeaderProps> = ({ alerts, removeAlert }) => {
  return (
    <header>
      <div className="navbar bg-base-200">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52">
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>My Page</a>
              </li>
              <li>
                <a>Highscores</a>
              </li>
              <li>
                <a>Multiplayer</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost normal-case text-xl">MineSwooper</a>
        </div>
        <div className="navbar-end">
          <AlertsContainer alerts={alerts} removeAlert={removeAlert} />
        </div>
      </div>
    </header>
  );
};

export default Header;
