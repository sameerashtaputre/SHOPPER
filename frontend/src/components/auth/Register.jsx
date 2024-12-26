import React, { useEffect, useState } from "react";
import { useRegisterMutation } from "../../redux/api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MetaData from "./../layout/MetaData";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const navigate = useNavigate();

  const [register, { isLoading, error, data }] = useRegisterMutation();

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error, isAuthenticated]);

  const submitHandler = (e) => {
    e.preventDefault();

    const signUpData = {
      name,
      email,
      password,
    };

    register(signUpData);
  };

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      <MetaData title={"Register"} />
      <div className="row wrapper" style={{ justifyContent: "center", marginTop: "50px" }}>
        <div className="col-12 col-md-6">
          <form
            className="shadow-lg rounded bg-white p-4"
            onSubmit={submitHandler}
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 className="mb-4 text-center" style={{ fontSize: "1.8rem", fontWeight: "500" }}>
              Create Your Account
            </h2>

            <div className="mb-3">
              <label htmlFor="name_field" className="form-label" style={{ fontSize: "1rem", fontWeight: "500" }}>
                Name
              </label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={onChange}
                style={{
                  borderRadius: "8px",
                  padding: "12px",
                  border: "1px solid #ddd",
                  transition: "border-color 0.3s",
                }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email_field" className="form-label" style={{ fontSize: "1rem", fontWeight: "500" }}>
                Email
              </label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={onChange}
                style={{
                  borderRadius: "8px",
                  padding: "12px",
                  border: "1px solid #ddd",
                  transition: "border-color 0.3s",
                }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password_field" className="form-label" style={{ fontSize: "1rem", fontWeight: "500" }}>
                Password
              </label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={onChange}
                style={{
                  borderRadius: "8px",
                  padding: "12px",
                  border: "1px solid #ddd",
                  transition: "border-color 0.3s",
                }}
              />
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "500",
                padding: "12px 0",
                transition: "background-color 0.3s",
              }}
            >
              {isLoading ? "Creating..." : "REGISTER"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
