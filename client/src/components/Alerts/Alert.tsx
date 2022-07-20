import { FC } from "react";
import { IAlertProps } from "../../types";

const Alert: FC<IAlertProps> = ({ alert, removeAlert }) => {
  return (
    <div
      className={`alert h-12 m-1 ${
        alert.type == "error" ? "alert-warning" : "alert-info"
      }`}
      id={alert.id}
    >
      <div>
        <span>{alert.message}</span>
      </div>
      <button
        onClick={() => {
          removeAlert(alert.id);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default Alert;
