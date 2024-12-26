import React, { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SalesChart from "../charts/SalesChart";
import { useLazyGetDashboardSalesQuery } from "../../redux/api/orderApi";
import { toast } from "react-hot-toast";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date().setDate(1));
  const [endDate, setEndDate] = useState(new Date());

  const [getDashboardSales, { error, isLoading, data }] =
    useLazyGetDashboardSalesQuery();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (startDate && endDate && !data) {
      getDashboardSales({
        startDate: new Date(startDate).toISOString(),
        endDate: endDate.toISOString(),
      });
    }
  }, [error]);

  const submitHandler = () => {
    getDashboardSales({
      startDate: new Date(startDate).toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <MetaData title={"Admin Dashboard"} />
      <div className="d-flex justify-content-start align-items-center" style={{ marginBottom: "30px" }}>
        <div className="mb-3 me-4">
          <label className="form-label d-block" style={{ fontSize: "1.2rem", fontWeight: "500" }}>Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="form-control"
            style={{
              borderRadius: "8px",
              padding: "12px",
              border: "1px solid #ddd",
              transition: "border-color 0.3s",
            }}
          />
        </div>
        <div className="mb-3">
          <label className="form-label d-block" style={{ fontSize: "1.2rem", fontWeight: "500" }}>End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="form-control"
            style={{
              borderRadius: "8px",
              padding: "12px",
              border: "1px solid #ddd",
              transition: "border-color 0.3s",
            }}
          />
        </div>
        <button
          className="btn fetch-btn ms-4 mt-3 px-5"
          onClick={submitHandler}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 25px",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "background-color 0.3s",
          }}
        >
          Fetch
        </button>
      </div>

      <div className="row pr-4 my-5">
        <div className="col-xl-6 col-sm-12 mb-3">
          <div
            className="card text-white bg-success o-hidden h-100"
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="card-body">
              <div className="text-center card-font-size" style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                Sales
                <br />
                <b>Rs.{data?.totalSales?.toFixed(2)}</b>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6 col-sm-12 mb-3">
          <div
            className="card text-white bg-danger o-hidden h-100"
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="card-body">
              <div className="text-center card-font-size" style={{ fontSize: "1.5rem", fontWeight: "600" }}>
                Orders
                <br />
                <b>{data?.totalNumOrders}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SalesChart salesData={data?.sales} />

      <div className="mb-5"></div>
    </AdminLayout>
  );
};

export default Dashboard;
