import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductDetailsQuery } from "../../redux/api/productsApi";
import { toast } from "react-hot-toast";
import Loader from "../layout/Loader";
import StarRatings from "react-star-ratings";
import { useDispatch, useSelector } from "react-redux";
import { setCartItem } from "../../redux/features/cartSlice";
import MetaData from "../layout/MetaData";
import NewReview from "../reviews/NewReview";
import ListReviews from "../reviews/ListReviews";

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState("");

  const { data, isLoading, error, isError } = useGetProductDetailsQuery(
    params?.id
  );
  const product = data?.product;
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    setActiveImg(
      product?.images[0]
        ? product?.images[0]?.url
        : "/images/default_product.png"
    );
  }, [product]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  const increseQty = () => {
    const count = document.querySelector(".count");

    if (count.valueAsNumber >= product?.stock) return;

    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };

  const decreseQty = () => {
    const count = document.querySelector(".count");

    if (count.valueAsNumber <= 1) return;

    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };

  const setItemToCart = () => {
    const cartItem = {
      product: product?._id,
      name: product?.name,
      price: product?.price,
      image: product?.images[0]?.url,
      stock: product?.stock,
      shopKeeperId: product?.user,
      quantity,
    };

    dispatch(setCartItem(cartItem));
    toast.success("Item added to Cart");
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={product?.name} />
      <div className="row d-flex justify-content-around">
        <div className="col-12 col-lg-5 img-fluid" id="product_image">
          <div
            className="p-3"
            style={{
              padding: "1.5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              className="d-block w-100"
              src={activeImg}
              alt={product?.name}
              width="340"
              height="390"
              style={{
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
          <div className="row justify-content-start mt-5">
            {product?.images?.map((img) => (
              <div className="col-2 ms-4 mt-2" key={img.url}>
                <a role="button">
                  <img
                    className={`d-block border rounded p-3 cursor-pointer ${
                      img.url === activeImg ? "border-warning" : ""
                    } `}
                    height="100"
                    width="100"
                    src={img?.url}
                    alt={img?.url}
                    onClick={() => setActiveImg(img.url)}
                    style={{
                      transition: "transform 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.transform = "scale(1.1)")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-5 mt-5">
          <h3>{product?.name}</h3>
          <p id="product_id">Product # {product?._id}</p>

          <hr />

          <div className="d-flex">
            <StarRatings
              rating={product?.ratings}
              starRatedColor="#ffb829"
              numberOfStars={5}
              name="rating"
              starDimension="24px"
              starSpacing="1px"
            />
            <span
              id="no-of-reviews"
              className="pt-1 ps-2"
              style={{ color: "#666", fontSize: "1rem" }}
            >
              {" "}
              ({product?.numOfReviews} Reviews){" "}
            </span>
          </div>
          <hr />

          <p
            id="product_price"
            style={{
              fontSize: "1.5rem",
              color: "#ff5722",
              fontWeight: "bold",
              marginTop: "10px",
            }}
          >
            Rs.{product?.price}
          </p>
          <div className="stockCounter d-inline">
            <span
              className="btn btn-danger minus"
              onClick={decreseQty}
              style={{ padding: "5px 15px", fontSize: "1.2rem" }}
            >
              -
            </span>
            <input
              type="number"
              className="form-control count d-inline"
              value={quantity}
              readOnly
              style={{
                width: "60px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            />
            <span
              className="btn btn-primary plus"
              onClick={increseQty}
              style={{ padding: "5px 15px", fontSize: "1.2rem" }}
            >
              +
            </span>
          </div>
          <button
            type="button"
            id="cart_btn"
            className="btn btn-primary d-inline ms-4"
            disabled={product.stock <= 0}
            onClick={setItemToCart}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              fontWeight: "bold",
              padding: "8px 20px",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Add to Cart
          </button>

          <hr />

          <p>
            Status:{" "}
            <span
              id="stock_status"
              style={{
                color: product?.stock > 0 ? "#28a745" : "#dc3545",
                fontWeight: "bold",
              }}
            >
              {product?.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>

          <hr />

          <h4 className="mt-2">Description:</h4>
          <p>{product?.description}</p>
          <hr />
          <p id="product_seller mb-3">
            Sold by: <strong>{product?.seller}</strong>
          </p>

          {isAuthenticated ? (
            <NewReview productId={product?._id} />
          ) : (
            <div
              className="alert alert-danger my-5"
              type="alert"
              style={{
                backgroundColor: "#f8d7da",
                color: "#721c24",
                border: "none",
                borderRadius: "4px",
                padding: "10px",
              }}
            >
              Login to post your review.
            </div>
          )}
        </div>
      </div>
      {product?.reviews?.length > 0 && (
        <ListReviews reviews={product?.reviews} />
      )}
    </>
  );
};

export default ProductDetails;
