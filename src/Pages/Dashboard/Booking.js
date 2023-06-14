import React, { useEffect } from "react";
import { useState } from "react";
import Swal from "sweetalert2";

const Booking = ({ booking }) => {
  const {
    _id,
    roomName,
    checkIn,
    checkOut,
    time,
    totalDays,
    quantity,
    adult,
    child,
    rentCost,
    status,
    userName,
    email,
    phone,
    payment,
  } = booking;
  const [selected, setSelected] = useState(status);
  const [pay, setPay] = useState(payment);
  useEffect(() => {
    const status = { status: selected };
    fetch(`http://localhost:5000/booking/update/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(status),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount === 1) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "success",
            title: "Status Changed successfully",
          });
        }
      });
  }, [selected, _id]);
  useEffect(() => {
    const payment = { payment: pay };
    fetch(`http://localhost:5000/booking/update/paymentStatus/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payment),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount === 1) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener("mouseenter", Swal.stopTimer);
              toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: "success",
            title: "Payment Status Changed",
          });
        }
      });
  }, [pay, _id]);
  return (
    <tr>
      <td className="border-grey-light border hover:bg-gray-100 p-3">
        {roomName}
      </td>
      <td className="border-grey-light border hover:bg-gray-100 p-3">
        {userName?.split(" ")[0]}
      </td>
      <td className="border-grey-light border hover:bg-gray-100 p-3">
        {email?.split("@")[0]}
      </td>
      <td className="border-grey-light border hover:bg-gray-100 p-3">
        {phone?.slice(0, 11)}
      </td>
      <td className="border-grey-light border hover:bg-gray-100 p-3">
        {checkIn}
      </td>
      <td className="border-grey-light border hover:bg-gray-100 p-3">{time}</td>
      <td className="border-grey-light border hover:bg-gray-100 p-3">
        {checkOut}
      </td>
      <td className="border-grey-light border hover:bg-gray-100 p-3">
        {totalDays}
      </td>
      <td className="border-grey-light border hover:bg-gray-100 p-3">
        {quantity}
      </td>
      <td className="border-grey-light border hover:bg-gray-100 p-3">
        {adult}
      </td>
      <td className="border-grey-light border hover:bg-gray-100 p-3">
        {child}
      </td>
      <td className="border-grey-light border hover:bg-gray-100 p-3">
        ${rentCost}
      </td>
      <td className="border-grey-light border p-3 text-white hover:font-medium cursor-pointer rounded-sm text-center">
        <select
          defaultValue={selected}
          onChange={(e) => {
            setSelected(e.target.value);
          }}
          className={`select select-bordered w-full max-w-xs text-sm ${
            status === "Pending" && "btn-info"
          } ${status === "Approved" && "btn-success"} ${
            status === "Rejected" && "btn-primary"
          } ${status === "Checkout" && "btn-active"}`}
        >
          <option
            disabled={status === "Checkout" || status === "Rejected"}
            className="bg-white text-neutral text-base"
          >
            Pending
          </option>
          <option
            disabled={status === "Checkout"}
            className="bg-white text-neutral text-base"
          >
            Rejected
          </option>
          <option
            disabled={status === "Checkout"}
            className="bg-white text-neutral text-base"
          >
            Approved
          </option>
          <option
            disabled={
              pay === "Unpaid"
                ? true
                : status === "Pending"
                ? true
                : status === "Rejected" && true
            }
            className="bg-white text-neutral text-base"
          >
            Checkout
          </option>
        </select>
      </td>
      <td className="border-grey-light border hover:bg-gray-100 p-3 text-red-600 hover:text-red-700 hover:font-medium cursor-pointer text-xl text-center">
        <select
          defaultValue={pay}
          onChange={(e) => {
            setPay(e.target.value);
          }}
          className={`select select-bordered w-full max-w-xs text-sm ${
            pay === "Paid" && "btn-success"
          } ${status === "Rejected" && "btn-primary"} ${
            status !== "Rejected" && pay === "Unpaid" ? "btn-warning" : ""
          } `}
        >
          <option
            disabled={
              pay === "Paid" && status === "Rejected"
                ? false
                : pay === "Paid" && true
            }
            className="bg-white text-neutral text-base disabled"
          >
            UnPaid
          </option>
          <option
            disabled={
              status === "Rejected" ? true : status === "Pending" ? true : false
            }
            className="bg-white text-neutral text-base"
          >
            Paid
          </option>
        </select>
      </td>
    </tr>
  );
};

export default Booking;
