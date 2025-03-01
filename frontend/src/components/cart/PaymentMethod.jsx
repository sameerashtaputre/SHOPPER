import React, { useEffect, useState } from "react";
import MetaData from "../layout/MetaData";
import { useSelector } from "react-redux";
import CheckoutSteps from "./CheckoutSteps";
import { caluclateOrderCost } from "../../helpers/helpers";
import { useCreateNewOrderMutation } from "../../redux/api/orderApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PaymentMethod = () => {
  const [method, setMethod] = useState("");
  const [utr, setUtr] = useState(""); // State for UTR field

  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const [createNewOrder, { error, isSuccess }] = useCreateNewOrderMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      navigate("/me/orders?order_success=true");
    }
  }, [error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();

    const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
      caluclateOrderCost(cartItems);

    // Default payment status for both COD and QR payment methods
    const paymentStatus = "Not Paid";

    let paymentMethod = ""; // Initialize paymentMethod variable

    if (method === "COD") {
      // Create COD Order
      paymentMethod = "COD"; // Set paymentMethod for COD
    }

    if (method === "QR") {
      // Create QR Payment Order
      paymentMethod = "QR"; // Set paymentMethod for QR
    }

    if (method === "ONLINE") {
      // Create Online Payment Order
      paymentMethod = "ONLINE"; // Set paymentMethod for online payment
    }

    // Ensure each cart item has the shopKeeperId
    const shopKeeperId = cartItems[0]?.shopKeeperId || "defaultShopKeeperId"; // Fallback to a default shopKeeperId if missing

    // Create Order Data
    const orderData = {
      shippingInfo,
      orderItems: cartItems,
      itemsPrice,
      shippingAmount: shippingPrice,
      taxAmount: taxPrice,
      totalAmount: totalPrice,
      paymentInfo: {
        status: paymentStatus,
      },
      shopKeeperId, // Ensure shopKeeperId is included
      paymentMethod, // Set paymentMethod in orderData
      utr, // Include UTR field for QR payments
    };

    // Create New Order
    createNewOrder(orderData);
  };

  return (
    <>
      <MetaData title={"Payment Method"} />
      <CheckoutSteps shipping confirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Select Payment Method</h2>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                onChange={(e) => setMethod("COD")}
              />
              <label className="form-check-label" htmlFor="codradio">
                Cash on Delivery
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="qrradio"
                value="QR"
                onChange={(e) => setMethod("QR")}
              />
              <label className="form-check-label" htmlFor="qrradio">
                QR Payment
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="onlineradio"
                value="ONLINE"
                onChange={(e) => setMethod("ONLINE")}
              />
              <label className="form-check-label" htmlFor="onlineradio">
                Online Payment (e.g., Stripe, PayPal)
              </label>
            </div>

            {method === "QR" && (
              <div>
                <div className="form-group mt-3">
                  <label htmlFor="utr">Enter UTR Number:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="utr"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                  />
                </div>

                {/* Image for QR Payment */}
                
              </div>
            )}

            {method === "ONLINE" && (
              <div className="mt-3">
                {/* Here, you can include a placeholder or button for handling the online payment process */}
                <p>Proceed with the payment through your selected online payment gateway (e.g., Stripe or PayPal).</p>
              </div>
            )}

            <button id="shipping_btn" type="submit" className="btn py-2 w-100">
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
