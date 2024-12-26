import React, { useEffect, useState } from "react";
import Loader from "../layout/Loader";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import {
  useOrderDetailsQuery,
  useUpdateShopkeeperOrderMutation,
  useUpdateShopkeeperPaymentMutation,
} from "../../redux/api/orderApi";
import ShopkeeperLayout from "../layout/ShopkeeperLayout";

const ProcessOrderShopkeeper = () => {
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const params = useParams();

  const { data, isLoading } = useOrderDetailsQuery(params?.id);

  const order = data?.order || {};

  const [updateOrder, { error: orderError, isSuccess: orderSuccess }] =
    useUpdateShopkeeperOrderMutation();

  const [updatePayment, { error: paymentError, isSuccess: paymentSuccess }] =
    useUpdateShopkeeperPaymentMutation();

  useEffect(() => {
    if (orderError) {
      toast.error(orderError?.data?.message || "Failed to update the order status.");
    }
    if (orderSuccess) {
      toast.success("Order updated successfully.");
    }
  }, [orderError, orderSuccess]);

  useEffect(() => {
    if (paymentError) {
      toast.error(paymentError?.data?.message || "Failed to update the payment status.");
    }
    if (paymentSuccess) {
      toast.success("Payment status updated successfully.");
    }
  }, [paymentError, paymentSuccess]);

  const updateOrderHandler = (id) => {
    const orderData = { status };
    const paymentData = { status: paymentStatus };

    updateOrder({ id, body: orderData })
      .unwrap()
      .then(() => {
        updatePayment({ id, body: paymentData })
          .unwrap()
          .then(() => toast.success("Payment status updated successfully"))
          .catch(paymentErr => toast.error(paymentErr?.data?.message || "Error updating payment status"));
      })
      .catch(orderErr => toast.error(orderErr?.data?.message || "Error updating order status"));
  };

  if (isLoading) return <Loader />;

  const { shippingInfo, orderItems, paymentInfo, user, totalAmount, utr, orderStatus } = order;

  const isPaid = paymentInfo?.status === "not paid" ? true : false;

  return (
    <ShopkeeperLayout>
      <MetaData title={"Process Order"} />
      <div className="row d-flex justify-content-around">
        <div className="col-12 col-lg-8 order-details">
          <h3 className="mt-5 mb-4">Order Details</h3>

          <h5>Order ID: {order?._id}</h5>
          <h5>Order Status: {orderStatus}</h5>

          <h3 className="mt-5 mb-4">Shipping Info</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Name</th>
                <td>{user?.name}</td>
              </tr>
              <tr>
                <th scope="row">Email</th>
                <td>{user?.email}</td>
              </tr>
              <tr>
                <th scope="row">Phone No</th>
                <td>{shippingInfo?.phoneNo}</td>
              </tr>
              <tr>
                <th scope="row">Address</th>
                <td>
                  {shippingInfo?.address}, {shippingInfo?.city}, {shippingInfo?.zipCode}, {shippingInfo?.country}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 mb-4">Payment Info</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Status</th>
                <td className={isPaid ? "greenColor" : "redColor"}>
                  <b>{paymentInfo?.status}</b>
                </td>
              </tr>
              <tr>
                <th scope="row">Method</th>
                <td>{order?.paymentMethod}</td>
              </tr>
              <tr>
                <th scope="row">UTR ID</th>
                <td>{utr}</td>
              </tr>
              <tr>
                <th scope="row">Amount Paid</th>
                <td>${totalAmount}</td>
              </tr>
            </tbody>
          </table>

          {/* Remaining code for order items */}
        </div>

        <div className="col-12 col-lg-3 mt-5">
          <h4 className="my-4">Status</h4>
          <div className="mb-3">
            <select
              className="form-select"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <h4 className="my-4">Payment Status</h4>
          <div className="mb-3">
            <select
              className="form-select"
              name="paymentStatus"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="Not Paid">Not Paid</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          {/* Button to update both order and payment status */}
          <button
            className="btn btn-primary w-100"
            onClick={() => order?._id && updateOrderHandler(order?._id)}
            disabled={!order?._id || !status || !paymentStatus}  // Disable if order ID or status is missing
          >
            Update Order
          </button>

          <h4 className="mt-5 mb-3">Order Invoice</h4>
          <Link
            to={`/invoice/orders/${order?._id}`}
            className="btn btn-success w-100"
          >
            <i className="fa fa-print"></i> Generate Invoice
          </Link>
        </div>
      </div>
    </ShopkeeperLayout>
  );
};

export default ProcessOrderShopkeeper;
