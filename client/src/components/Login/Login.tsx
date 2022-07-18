import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { ILoginProps } from "../../types";

const Login: FC<ILoginProps> = ({ login }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const tryLogin = (username: string, password: string) => {
    login(username, password);
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login to start chatting</h1>
          <p className="py-6 w-56">
            Done have an account?{" "}
            <Link to="/register">
              <span className="font-bold">Register Here!</span>
            </Link>
          </p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="username"
                className="input input-bordered"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="text"
                placeholder="password"
                className="input input-bordered"
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button
                onClick={() => tryLogin(username, password)}
                className="btn btn-primary"
                disabled={!username || !password}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
