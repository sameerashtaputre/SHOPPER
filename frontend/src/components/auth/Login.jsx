import React, { useEffect, useState } from "react";
import { useLoginMutation } from "../../redux/api/authApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MetaData from "./../layout/MetaData";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [login, { isLoading, error, data }] = useLoginMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && data && data.user) {
      localStorage.setItem("loggedInUserId", data.user._id);
      navigate("/");
    }
    if (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  }, [error, isAuthenticated, data, navigate]); // Added 'data' and 'navigate' to dependencies

  const submitHandler = (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };

    login(loginData);
  };

  return (
    <>
      <MetaData title={"Login"} />
      <div className="row wrapper" style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f7f8fc" }}>
        <div className="col-12 col-md-6 col-lg-4">
          <form 
            className="shadow-lg rounded p-4 bg-white" 
            onSubmit={submitHandler}
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
              borderRadius: "8px", 
              backgroundColor: "#ffffff", 
              padding: "20px", 
              transition: "box-shadow 0.3s ease"
            }}
          >
            <h2 className="mb-4 text-center" style={{ fontSize: "1.8rem", fontWeight: "600" }}>
              Login
            </h2>
            <div className="mb-3">
              <label htmlFor="email_field" className="form-label" style={{ fontWeight: "500", color: "#333" }}>
                Email
              </label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "12px 15px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "1rem",
                  transition: "border 0.3s ease",
                  outline: "none"
                }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password_field" className="form-label" style={{ fontWeight: "500", color: "#333" }}>
                Password
              </label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: "12px 15px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "1rem",
                  transition: "border 0.3s ease",
                  outline: "none"
                }}
              />
            </div>

            <a href="/password/forgot" className="float-end mb-4" style={{ fontSize: "0.9rem", color: "#007bff", textDecoration: "none" }}>
              Forgot Password?
            </a>

            <button
              id="login_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                borderRadius: "8px",
                border: "none",
                fontSize: "1.1rem",
                padding: "12px",
                transition: "background-color 0.3s ease",
              }}
            >
              {isLoading ? "Authenticating..." : "LOGIN"}
            </button>

            <div className="my-3 text-center">
              <a href="/register" className="float-end" style={{ fontSize: "0.9rem", color: "#007bff", textDecoration: "none" }}>
                New User ? Register
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
