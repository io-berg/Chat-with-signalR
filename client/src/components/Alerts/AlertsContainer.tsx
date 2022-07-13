import { FC, useState } from "react";
import { IAlertsConatinerProps } from "../../types";
import Alert from "./Alert";

const AlertsContainer: FC<IAlertsConatinerProps> = ({
  alerts,
  removeAlert,
}) => {
  const [showAlerts, setShowAlerts] = useState(true);

  const allertsList = (
    <div className="toast z-50 fixed top-0 right-0 mt-14 mr-2">
      {alerts.map((alert) => (
        <Alert alert={alert} removeAlert={removeAlert} />
      ))}
    </div>
  );

  return (
    <div className="indicator">
      {alerts.length > 0 ? (
        <span>
          <span className="indicator-item badge badge-secondary m-3">
            {alerts.length}
          </span>
        </span>
      ) : null}
      <button
        className="btn btn-ghost btn-circle"
        onClick={() => setShowAlerts(!showAlerts)}
      >
        <div className="indicator">
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
      </button>
      {showAlerts ? allertsList : null}
    </div>
  );
};

export default AlertsContainer;
