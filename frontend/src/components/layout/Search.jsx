import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    if (keyword?.trim()) {
      navigate(`/?keyword=${keyword}`);
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
          marginTop: "20px",
          maxWidth: "400px",
          margin: "auto",
        }}
      >
        <input
          type="text"
          id="search_field"
          aria-describedby="search_btn"
          className="form-control"
          placeholder="Enter Product Name ..."
          name="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "1rem",
            borderRadius: "25px",
            border: "2px solid 0056b3",
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
            backgroundColor: "#007bff",
            color: "#fff",
            border: "2px solid #0056b3",
            borderRadius: "25px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            boxSizing:"border-box"
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          <i className="fa fa-search" aria-hidden="true"></i>
        </button>
      </div>
    </form>
  );
};

export default Search;
