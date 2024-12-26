import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PinCode = () => {
  const [pinCode, setPinCode] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    if (pinCode?.trim()) {
      navigate(`/?pinCode=${pinCode}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div
        className="input-group"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "400px",
          margin: "20px auto",
        }}
      >
        <input
          type="text"
          id="search_field"
          aria-describedby="search_btn"
          className="form-control"
          placeholder="Enter Pin Code ..."
          name="pinCode"
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "1rem",
            borderRadius: "25px",
            border: "2px solid #ced4da",
            flex: "1",
            boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        />
        <button
          id="search_btn"
          className="btn"
          type="submit"
          style={{
            padding: "10px 15px",
            fontSize: "1rem",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
        >
          <i className="fa fa-search" aria-hidden="true"></i>
        </button>
      </div>
    </form>
  );
};

export default PinCode;
