import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import Sidebar from "../../SuperAdminDashboard/sidebar/Sidebar";
import { Loader } from "lucide-react";
import axios from "axios";
import "./SocietyBilling.css"; 
import { FaFileExport } from "react-icons/fa"; 

const SocietyBilling = () => {
  const [moduleTitle, setModuleTitle] = useState("Society Billing");
  const [plan, setPlan] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billsLoading, setBillsLoading] = useState(true);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [societyId, setSocietyId] = useState(null);

  useEffect(() => {
    const fetchSocietyDetails = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          console.error("No user data found in localStorage");
          return;
        }

        const user = JSON.parse(userData);
        if (!user.societyId) {
          console.error("No societyId found in user data");
          return;
        }

        setSocietyId(user.societyId);

        // ✅ Fetch society details
        const response = await axios.get(
          `https://api-kpur6ixuza-uc.a.run.app/api/get-society/${user.societyId}`
        );

        if (response.data.society && response.data.society.plan) {
          setPlan(response.data.society.plan);
        } else {
          console.error("No plan found for this society.");
        }

        // ✅ Fetch bills for the society
        fetchBills(user.societyId);
      } catch (error) {
        console.error("Error fetching society details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocietyDetails();
  }, []);

  // ✅ Fetch all bills of the society
  const fetchBills = async (societyId) => {
    try {
      const response = await axios.get(
        `https://api-kpur6ixuza-uc.a.run.app/api/billing/${societyId}`
      );
      const formattedBills = response.data.bills.map((bill) => formatBillDates(bill));
      setBills(formattedBills || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setBillsLoading(false);
    }
  };

  // ✅ Format dates in DD-MM-YYYY format
  const formatBillDates = (bill) => ({
    ...bill,
    startDate: formatDate(bill.startDate?._seconds),
    endDate: formatDate(bill.endDate?._seconds),
    dueDate: formatDate(bill.dueDate?._seconds),
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // ✅ Handle Export Click
  const handleExport = async (format) => {
    const apiUrl = societyId
      ? `https://api-kpur6ixuza-uc.a.run.app/api/export-society-bills/${societyId}?format=${format}`
      : `https://api-kpur6ixuza-uc.a.run.app/api/export-all-bills?format=${format}`;

    try {
      const response = await axios.get(apiUrl, { responseType: "blob" });

      // ✅ Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `billing_records.${format}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exporting file:", error);
    } finally {
      setShowExportOptions(false); // Close dropdown
    }
  };

  return (
    <div className="society-billing-container">
      <Sidebar onClick={(title) => setModuleTitle(title)} />
      <div className="society-billing-content">
        <Navbar moduleTitle={moduleTitle} />

        {/* Society Plan Details */}
        {loading ? (
          <div className="society-billing-loader">
            <Loader className="animate-spin text-gray-500" size={40} />
          </div>
        ) : plan ? (
          <div className="society-billing-card">
            <h1> Plan Details </h1>
            <h2 className="society-billing-title">{plan.planName} Plan</h2>
            <p className="society-billing-text">
              <span>Interval:</span> {plan.interval}
            </p>
            <p className="society-billing-text">
              <span>Price Per Household:</span> {plan.pricePerHousehold} {plan.currency}
            </p>
          </div>
        ) : (
          <p className="society-no-plan">No plan found for your society.</p>
        )}

        {/* Billing Table */}
        <div className="society-bills-section">
          <div className="billing-header">
            <h2 className="society-bills-title">Billing History</h2>

            {/* Export Button */}
            <div className="export-container">
              <button className="export-button" onClick={() => setShowExportOptions(!showExportOptions)}>
                <FaFileExport /> Export
              </button>
              {showExportOptions && (
                <div className="export-dropdown">
                  <button onClick={() => handleExport("xlsx")}>Excel</button>
                  <button onClick={() => handleExport("csv")}>CSV</button>
                </div>
              )}
            </div>
          </div>

          {billsLoading ? (
            <div className="society-billing-loader">
              <Loader className="animate-spin text-gray-500" size={40} />
            </div>
          ) : bills.length > 0 ? (
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Due Date</th>
                  <th>Total Houses</th>
                  <th>Total Amount</th>
                  <th>Discount</th>
                  <th>Net Payable</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.invoiceNumber}>
                    <td>{bill.invoiceNumber}</td>
                    <td>{bill.startDate}</td>
                    <td>{bill.endDate}</td>
                    <td>{bill.dueDate}</td>
                    <td>{bill.totalHouses}</td>
                    <td>₹ {bill.totalAmount}</td>
                    <td>₹ {bill.discountAmount}</td>
                    <td>₹ {bill.netPayable}</td>
                    <td>{bill.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="society-no-bills">No billing records found for your society.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocietyBilling;
