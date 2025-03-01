import React from "react";
import Search from "./Search";
import { useGetMeQuery } from "../../redux/api/userApi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLazyLogoutQuery } from "../../redux/api/authApi";
import PinCode from "./PinCode";

const Header = ({ theme }) => {
  const navigate = useNavigate();

  const { isLoading } = useGetMeQuery();
  const [logout] = useLazyLogoutQuery();

  const { user } = useSelector((state) => state.auth);

  const isAdmin = user && user.role === "admin";
  const isShopkeeper = user && user.role === "shopkeeper";

  const { cartItems } = useSelector((state) => state.cart);

  const logoutHandler = async () => {
    try {
      await logout();
      localStorage.removeItem("loggedInUserId");
      navigate(0);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <style>{`
      /* Header Styles */
      .header-container {
        width: 100%;
        padding: 15px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      /* Theme Customization */
      .header-container.light {
        background-color: #f0f0f0;
        color: #333;
      }

      .header-container.dark {
        background-color: #222;
        color: white;
      }

      .navbar-brand p {
        margin: 0;
        font-size: 1.8rem;
        font-weight: bold;
      }

      .navbar-brand a {
        color: inherit;
        text-decoration: none;
      }

      /* Cart and Profile Section */
      #cart {
        color: inherit;
        font-size: 1.1rem;
        margin-right: 20px;
        transition: color 0.3s ease;
      }

      #cart:hover {
        color: #fe6701;
      }

      #cart_count {
        background: #fe6701;
        color: white;
        border-radius: 50%;
        padding: 2px 8px;
        font-size: 0.85rem;
        position: relative;
        top: -5px;
      }

      .dropdown-menu {
        background-color: #333 !important;
        border: none;
      }

      .dropdown-item {
        color: white !important;
        padding: 12px 20px;
        font-size: 1rem;
        text-align: left;
      }

      .dropdown-item:hover {
        background-color: #555 !important;
        cursor: pointer;
      }

      .btn {
        padding: 8px 20px;
        font-size: 1rem;
        border-radius: 30px;
      }

      .btn:hover {
        background-color: #fe6701;
        border-color: #fe6701;
        color: white;
      }

      /* Avatar Styling */
      .avatar-nav img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 8px;
      }

      /* Responsiveness */
      @media (max-width: 768px) {
        .header-container {
          flex-direction: column;
          align-items: flex-start;
        }

        .col-12 {
          text-align: center;
        }

        .navbar-brand p {
          font-size: 1.5rem;
        }

        .navbar-brand {
          margin-bottom: 10px;
        }

        #cart {
          font-size: 1rem;
        }

        .btn {
          margin-top: 10px;
        }
      }
      `}</style>

      <nav className={`navbar row header-container ${theme}`}>
        <div className="col-12 col-md-3 ps-5">
          <div className="navbar-brand">
            <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
              <p>SHOPPER</p>
            </a>
          </div>
        </div>

        <div className="col-6 col-md-3 mt-2 mt-md-0">
          <Search />
        </div>

        <div className="col-6 col-md-3 mt-2 mt-md-0">
          <PinCode />
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <span 
            id="cart" className="ms-3"  >
              Cart
            </span>
            <span className="ms-1" id="cart_count">
              {cartItems?.length}
            </span>
          </Link>

          {user ? (
            <div className="ms-4 dropdown">
              <button
                className="btn dropdown-toggle text-white"
                type="button"
                id="dropDownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav">
                  <img
                    src={
                      user?.avatar
                        ? user?.avatar?.url
                        : "/images/default_avatar.jpg"
                    }
                    alt="User Avatar"
                    className="rounded-circle"
                  />
                </figure>
                <span>{user?.name}</span>
              </button>
              <div
                className="dropdown-menu w-100"
                aria-labelledby="dropDownMenuButton"
              >
                {(isAdmin || isShopkeeper) && (
                  <Link
                    className="dropdown-item"
                    to={isAdmin ? "/admin/dashboard" : "/shopkeeper/dashboard"}
                  >
                    Dashboard
                  </Link>
                )}
                <Link className="dropdown-item" to="/me/orders">
                  Orders
                </Link>
                <Link className="dropdown-item" to="/me/profile">
                  Profile
                </Link>
                {!(isAdmin || isShopkeeper) && (
                  <Link className="dropdown-item" to="/become-seller">
                    Become a Seller
                  </Link>
                )}
                <Link
                  className="dropdown-item text-danger"
                  to="/"
                  onClick={logoutHandler}
                >
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            !isLoading && (
              <Link to="/login" className="btn ms-4" id="login_btn">
                Login
              </Link>
            )
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
