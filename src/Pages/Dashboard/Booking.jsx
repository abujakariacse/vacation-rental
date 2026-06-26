import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { ENDPOINT } from "../../config/env";

const fmtDate = (d) => {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date)) return d;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

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
    status: bookingStatus,
    userName,
    email,
    phone,
    payment: bookingPayment,
    specialNotes = booking.specialNotes || booking.notes,
    checkoutData = booking.checkoutData,
    nid = booking.nid,
  } = booking;
  const [selected, setSelected] = useState(bookingStatus);
  const [pay, setPay] = useState(bookingPayment);
  const [showDetails, setShowDetails] = useState(false);
  const didMountStatus = useRef(false);
  const didMountPay = useRef(false);

  const [currentRoomNumber, setCurrentRoomNumber] = useState(booking.roomNumber || "");

  const bookingDateStr = _id 
    ? new Date(parseInt(_id.substring(0, 8), 16) * 1000).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
    : "—";

  const qtyNum = parseInt(quantity || 1);
  const daysNum = parseInt(totalDays || 1);
  const totalNum = parseInt(rentCost || 0);
  const perNight = daysNum > 0 && qtyNum > 0 ? Math.round(totalNum / (daysNum * qtyNum)) : totalNum;

  const generateInvoice = () => {
    const invoiceNum = `INV-${(_id || "").slice(-8).toUpperCase()}`;
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice ${invoiceNum}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1f2937; background: #fff; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 3px solid #F43F5E; }
    .brand h1 { font-size: 28px; font-weight: 800; color: #F43F5E; letter-spacing: -0.5px; }
    .brand p { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .invoice-meta { text-align: right; }
    .invoice-meta h2 { font-size: 32px; font-weight: 800; color: #e5e7eb; text-transform: uppercase; letter-spacing: 2px; }
    .invoice-meta .detail { font-size: 13px; color: #6b7280; margin-top: 4px; }
    .invoice-meta .detail strong { color: #1f2937; }
    .section { margin-top: 28px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #F43F5E; margin-bottom: 12px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 32px; }
    .info-grid .item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
    .info-grid .item .label { color: #6b7280; }
    .info-grid .item .value { font-weight: 600; text-align: right; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    thead th { background: #fdf2f8; color: #F43F5E; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 10px 12px; text-align: left; border-bottom: 2px solid #fce7f3; }
    thead th:last-child, thead th:nth-child(n+2) { text-align: right; }
    tbody td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #f3f4f6; }
    tbody td:last-child, tbody td:nth-child(n+2) { text-align: right; }
    .totals { margin-top: 16px; display: flex; justify-content: flex-end; }
    .totals-box { width: 260px; }
    .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #6b7280; }
    .totals-row .val { font-weight: 600; color: #1f2937; }
    .totals-row.grand { border-top: 2px solid #F43F5E; margin-top: 8px; padding-top: 10px; font-size: 18px; color: #1f2937; font-weight: 800; }
    .totals-row.grand .val { color: #F43F5E; }
    .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 11px; color: #9ca3af; }
    .status-badge { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .status-approved { background: #d1fae5; color: #065f46; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-rejected { background: #fee2e2; color: #991b1b; }
    .status-checkout { background: #e5e7eb; color: #374151; }
    .payment-paid { background: #d1fae5; color: #065f46; }
    .payment-unpaid { background: #fee2e2; color: #991b1b; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <h1>VacationRental</h1>
      <p>Tejgaon Industrial Area<br />Dhaka, Bangladesh</p>
    </div>
    <div class="invoice-meta">
      <h2>Invoice</h2>
      <div class="detail"><strong>${invoiceNum}</strong></div>
      <div class="detail">Date: <strong>${bookingDateStr}</strong></div>
      <div class="detail" style="margin-top:6px;">
        <span class="status-badge status-${selected?.toLowerCase()}">${selected}</span>
        <span class="status-badge ${pay === "Paid" ? "payment-paid" : "payment-unpaid"}" style="margin-left:4px;">${pay || "Unpaid"}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Guest Information</div>
    <div class="info-grid">
      <div class="item"><span class="label">Name</span><span class="value">${userName || "—"}</span></div>
      <div class="item"><span class="label">Email</span><span class="value">${email || "—"}</span></div>
      <div class="item"><span class="label">Phone</span><span class="value">${phone || "—"}</span></div>
      <div class="item"><span class="label">Guests</span><span class="value">${adult || 0} Adults, ${child || 0} Children</span></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Booking Details</div>
    <div class="info-grid">
      <div class="item"><span class="label">Check In</span><span class="value">${fmtDate(checkIn)}</span></div>
      <div class="item"><span class="label">Check Out</span><span class="value">${fmtDate(checkOut)}</span></div>
      <div class="item"><span class="label">Room</span><span class="value">${roomName}${currentRoomNumber ? " (No: " + currentRoomNumber + ")" : ""}</span></div>
      ${specialNotes ? '<div class="item" style="grid-column: span 2;"><span class="label">Special Notes</span><span class="value">' + specialNotes + '</span></div>' : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Charges</div>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Rate / Night</th>
          <th>Nights</th>
          <th>Qty</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${roomName}</td>
          <td>$${perNight}</td>
          <td>${daysNum}</td>
          <td>${qtyNum}</td>
          <td><strong>$${totalNum}</strong></td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-box">
        <div class="totals-row"><span>Subtotal</span><span class="val">$${totalNum}</span></div>
        <div class="totals-row"><span>Tax</span><span class="val">$0</span></div>
        <div class="totals-row grand"><span>Total</span><span class="val">$${rentCost}</span></div>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>Thank you for choosing VacationRental!</p>
    <p style="margin-top:4px;">For questions, email abujakariacse@gmail.com or call +880 1234 567890</p>
  </div>
</body>
</html>`;

    const win = window.open("", "_blank", "width=850,height=900");
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  };

  const updateStatusAPI = (newStatus, roomNum = undefined) => {
    const payload = { status: newStatus };
    if (roomNum !== undefined) payload.roomNumber = roomNum;

    fetch(`${ENDPOINT}/booking/update/${_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount === 1) {
          setSelected(newStatus);
          if (roomNum !== undefined) setCurrentRoomNumber(roomNum);
          toast.success("Status Changed successfully");
        }
      });
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (newStatus === "Approved") {
      e.target.value = selected; // Revert visually until confirmed
      Swal.fire({
        title: "Assign Room Number",
        input: "text",
        inputLabel: "Assign a room number for this approved booking",
        inputPlaceholder: "e.g., A-102 or 305",
        showCancelButton: true,
        confirmButtonText: "Approve & Assign",
        confirmButtonColor: "#10b981",
        inputValidator: (value) => {
          if (!value) return "Please enter a room number!";
        }
      }).then((result) => {
        if (result.isConfirmed) {
          updateStatusAPI("Approved", result.value);
        }
      });
    } else {
      updateStatusAPI(newStatus);
    }
  };
  useEffect(() => {
    if (!didMountPay.current) {
      didMountPay.current = true;
      return;
    }
    if (pay === bookingPayment) return;
    const payload = { payment: pay };
    fetch(`${ENDPOINT}/booking/update/paymentStatus/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount === 1) {
          toast.success("Payment Status Changed");
        }
      });
  }, [pay, _id]);
  return (
    <>
      <tr className="hover:bg-base-200/30 transition">
        <td>
           <div className="font-semibold text-neutral">{roomName}</div>
           {currentRoomNumber && <div className="text-xs text-primary font-bold mt-1">Room: {currentRoomNumber}</div>}
        </td>
        <td>
          <div className="font-medium text-neutral">{userName}</div>
          <div className="text-xs text-neutral/60">{email}</div>
        </td>
        <td className="text-neutral/70 whitespace-nowrap text-sm font-medium">
          {bookingDateStr}
        </td>
        <td className="text-neutral/70 whitespace-nowrap">
          <div className="text-sm font-medium">{fmtDate(checkIn)}</div>
          <div className="text-xs text-neutral/50">to {fmtDate(checkOut)}</div>
        </td>
        <td className="whitespace-nowrap">
          <select
            value={selected}
            onChange={handleStatusChange}
            className={`select select-bordered w-full max-w-[160px] text-sm ${
              selected === "Pending" && "btn-info"
            } ${selected === "Approved" && "btn-success"} ${
              selected === "Rejected" && "btn-error"
            } ${selected === "Checkout" && "btn-neutral"}`}
          >
            <option
              disabled={selected === "Checkout" || selected === "Rejected"}
              className="bg-base-100 text-base-content text-base"
            >
              Pending
            </option>
            <option
              disabled={selected === "Checkout"}
              className="bg-base-100 text-base-content text-base"
            >
              Rejected
            </option>
            <option
              disabled={selected === "Checkout"}
              className="bg-base-100 text-base-content text-base"
            >
              Approved
            </option>
            <option
              disabled={
                pay === "Unpaid"
                  ? true
                  : selected === "Pending"
                    ? true
                    : selected === "Rejected" && true
              }
              className="bg-base-100 text-base-content text-base"
            >
              Checkout
            </option>
          </select>
        </td>
        <td className="whitespace-nowrap">
          <select
            defaultValue={pay}
            onChange={(e) => {
              setPay(e.target.value);
            }}
            className={`select select-bordered w-full max-w-[160px] text-sm ${
              pay === "Paid" && "btn-success"
            } ${selected === "Rejected" && "btn-error"} ${
              selected !== "Rejected" && pay === "Unpaid" ? "btn-warning" : ""
            }`}
          >
            <option
              disabled={
                pay === "Paid" && selected === "Rejected" ? false : pay === "Paid" && true
              }
              className="bg-base-100 text-base-content text-base"
            >
              UnPaid
            </option>
            <option
              disabled={selected === "Rejected" ? true : selected === "Pending" ? true : false}
              className="bg-base-100 text-base-content text-base"
            >
              Paid
            </option>
          </select>
        </td>
        <td className="text-right">
          <button 
             className="btn btn-sm btn-ghost text-primary" 
             onClick={() => setShowDetails(true)}
          >
            Details
          </button>
        </td>
      </tr>

      {/* Details Modal */}
      {showDetails && createPortal(
         <dialog className="modal modal-open z-[9999]">
           <div className="modal-box bg-base-100 relative w-11/12 max-w-2xl">
             <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setShowDetails(false)}>✕</button>
             <h3 className="font-bold text-lg text-neutral mb-4"><i className="fa-solid fa-circle-info mr-2 text-primary"></i>Booking Details</h3>
             
             <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2 border-b border-base-200/60 pb-2">
                   <div className="text-neutral/60">Room</div>
                   <div>
                     <span className="font-semibold">{roomName}</span>
                     {currentRoomNumber && <span className="ml-2 badge badge-sm badge-primary text-white">No: {currentRoomNumber}</span>}
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-base-200/60 pb-2">
                   <div className="text-neutral/60">User Name</div>
                   <div className="font-semibold">{userName}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-base-200/60 pb-2">
                   <div className="text-neutral/60">Email</div>
                   <div className="font-semibold">{email}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-base-200/60 pb-2">
                   <div className="text-neutral/60">Booking Date</div>
                   <div className="font-semibold text-primary">{bookingDateStr}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-base-200/60 pb-2">
                   <div className="text-neutral/60">Phone</div>
                   <div className="font-semibold">{phone || "—"}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-base-200/60 pb-2">
                   <div className="text-neutral/60">Check In</div>
                   <div className="font-semibold">{fmtDate(checkIn)}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-base-200/60 pb-2">
                   <div className="text-neutral/60">Checkout</div>
                   <div className="font-semibold">{fmtDate(checkOut)} {checkoutData ? `(${checkoutData})` : ''}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-base-200/60 pb-2">
                   <div className="text-neutral/60">Time</div>
                   <div className="font-semibold">{fmtDate(time) !== "—" ? fmtDate(time) : (time || "—")}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-base-200/60 pb-2">
                   <div className="text-neutral/60">Special Notes</div>
                   <div className="font-semibold">{specialNotes || "—"}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-base-200/60 pb-2">
                   <div className="text-neutral/60">Total Days</div>
                   <div className="font-semibold">{totalDays}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-b border-base-200/60 pb-2">
                   <div className="text-neutral/60">Rooms (Qty)</div>
                   <div className="font-semibold">{quantity}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 pb-2">
                   <div className="text-neutral/60">Guests</div>
                   <div className="font-semibold">{adult} Adults, {child} Children</div>
                </div>
                {nid && (
                   <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-base-200/60 pb-2">
                      <div className="text-neutral/60">Identity Document</div>
                      <div>
                         <a href={nid} target="_blank" rel="noreferrer" className="btn btn-xs btn-info text-white">
                            <i className="fa-solid fa-file-contract mr-1"></i> View NID
                         </a>
                      </div>
                   </div>
                )}
                <div className="grid grid-cols-2 gap-2 pb-2 mt-4 text-lg bg-base-200/30 p-2 rounded-xl border border-base-200/50">
                   <div className="text-neutral/60 font-semibold flex items-center">Total Cost</div>
                   <div className="font-bold text-primary">${rentCost}</div>
                </div>
             </div>
             
             <div className="modal-action mt-6">
                <button className="btn btn-outline btn-sm text-neutral" onClick={() => setShowDetails(false)}>Close</button>
                <button className="btn btn-sm btn-primary text-white" onClick={generateInvoice}>
                  <i className="fa-solid fa-file-invoice mr-1.5"></i>Generate Invoice
                </button>
              </div>
           </div>
           <div className="modal-backdrop bg-black/20" onClick={() => setShowDetails(false)}></div>
         </dialog>,
         document.body
      )}
    </>
  );
};

export default Booking;
