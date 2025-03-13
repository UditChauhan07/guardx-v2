import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import axios from "axios";
import "./Billing.css";
import { FaSearch, FaFilter, FaFileInvoiceDollar, FaTimesCircle, FaFileExcel, FaFileCsv } from "react-icons/fa";

const Billing = () => {
  const [moduleTitle, setModuleTitle] = useState("Billing");
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState("");
  const [bills, setBills] = useState([]);
  const [allBills, setAllBills] = useState([]); // Store all bills separately
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch all societies
  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const response = await axios.get("https://api-kpur6ixuza-uc.a.run.app/api/get-all-societies");
        setSocieties(response.data.societies);
      } catch (error) {
        console.error("Error fetching societies:", error);
      }
    };
    fetchSocieties();
  }, []);

  

  // Fetch bills when society is selected
  useEffect(() => {
    if (selectedSociety) {
      fetchBills(selectedSociety);
    }
  }, [selectedSociety]);

  const fetchBills = async (societyId) => {
    try {
        const response = await axios.get(`https://api-kpur6ixuza-uc.a.run.app/api/billing/${societyId}`);
        const formattedBills = response.data.bills.map((bill) => formatBillDates(bill));
        setBills(formattedBills || []);
    } catch (error) {
        console.error("Error fetching bills:", error);
    }
};

// Fetch all bills and format dates
const fetchAllBills = async () => {
    try {
        const response = await axios.get("https://api-kpur6ixuza-uc.a.run.app/api/billing/all");
        const formattedBills = response.data.bills.map((bill) => formatBillDates(bill));
        setAllBills(formattedBills);
        setBills(formattedBills);
    } catch (error) {
        console.error("Error fetching all bills:", error);
    }
};

// ✅ Helper Function to Format Dates
const formatBillDates = (bill) => ({
    ...bill,
    startDate: formatDate(bill.startDate?._seconds),
    endDate: formatDate(bill.endDate?._seconds),
    dueDate: formatDate(bill.dueDate?._seconds),
});

// ✅ Date Formatter Function
const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};     

  // ✅ Handle Payment Status Update
const updatePaymentStatus = async (invoiceId, isPaid) => {
    try {
        await axios.put(`https://api-kpur6ixuza-uc.a.run.app
/api/billing/update-payment/${invoiceId}`, {
            status: isPaid,
        });
        fetchBills(selectedSociety); 
    } catch (error) {
        console.error('Error updating payment status:', error);
    }
};


  // ** Handle Search Filter **
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterBills(e.target.value, startDate, endDate);
  };

  // ** Handle Date Filters **
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
    filterBills(searchQuery, startDate, endDate);
  };

  // ** Filter Bills Based on Search & Date Range **
  const filterBills = (search, start, end) => {
    const filtered = bills.filter((bill) => {
      const isMatchSearch =
        bill.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        bill.billCycle.toLowerCase().includes(search.toLowerCase());

      const isMatchDate =
        !start && !end
          ? true
          : new Date(bill.startDate) >= new Date(start) && new Date(bill.endDate) <= new Date(end);

      return isMatchSearch && isMatchDate;
    });
    setBills(filtered);
  };
  // ✅ Clear All Filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setSelectedSociety("");
    setBills("");
  };
  // ✅ Handle Export Function
const handleExport = async (format) => {
  try {
    const url = selectedSociety
      ? `https://api-kpur6ixuza-uc.a.run.app
/api/export-society-bills/${selectedSociety}?format=${format}`
      : `https://api-kpur6ixuza-uc.a.run.app
/api/export-all-bills?format=${format}`;

    const response = await axios.get(url, { responseType: "blob" });

    // Create a download link
    const file = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = file;
    link.setAttribute("download", selectedSociety ? `society_bills.${format}` : `all_bills.${format}`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error("Error exporting bills:", error);
  }
};
  return (
    <div className="billing-container">
      <Navbar moduleTitle={moduleTitle} />
      <Sidebar onClick={(title) => setModuleTitle(title)} />

      <div className="billing-content">
        {/* Header Section */}
        <div className="billing-header">
          <h2>Billing Management</h2>
      
        </div>
           {/* Export Buttons */}
           <div className="export-buttons">
            <button className="export-excel" onClick={() => handleExport("xlsx")}>
              <FaFileExcel /> Export to Excel
            </button>
            <button className="export-csv" onClick={() => handleExport("csv")}>
              <FaFileCsv /> Export to CSV
            </button>
          </div>
   

        {/* Filters Section */}
        <div className="filters-section">
          <div className="society-selection">
            <label>Select Society:</label>
            <select value={selectedSociety} onChange={(e) => setSelectedSociety(e.target.value)}>
              <option value="">-- Select Society --</option>
              {societies.map((society) => (
                <option key={society.id} value={society.id}>
                  {society.societyName}
                </option>
              ))}
            </select>
          </div>

          <div className="search-filter">
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by Invoice No. or Cycle"
            />
          </div>

          <div className="date-filters">
            <FaFilter className="filter-icon" />
            <input
              type="date"
              className="filter-input"
              name="startDate"
              value={startDate}
              onChange={handleDateChange}
            />
            <input
              type="date"
              className="filter-input"
              name="endDate"
              value={endDate}
              onChange={handleDateChange}
            />
          </div>
          <button className="all-bills-button" onClick={fetchAllBills}>
           All Bills
          </button>
          
          {/* Clear Filters Button */}
          <button className="clear-filters-button" onClick={handleClearFilters}>
            <FaTimesCircle /> Clear Filters
          </button>
  
        </div>

        {/* Show Bills in Table */}
        {bills.length > 0 ? (
          <table className="billing-table">
            <thead>
              <tr>
                <th>Interval</th>
                <th>Period Start</th>
                <th>Period End</th>
                <th>Due Date</th>
                <th>Invoice No</th>
                <th>No. of Houses</th>
                <th>Total Amount</th>
                <th>Discount</th>
                <th>Net Payable</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.invoiceNumber}>
                  <td>{bill.billCycle}</td>
                  <td>{bill.startDate}</td>
                  <td>{bill.endDate}</td>
                  <td>{bill.dueDate}</td>
                  <td>{bill.invoiceNumber}</td>
                  <td>{bill.totalHouses}</td>
                  <td>₹ {bill.totalAmount}</td>
                  <td>₹ {bill.discountAmount}</td>
                  <td>₹ {bill.netPayable}</td>
                  <td>{bill.paymentStatus}</td>
                  <td>
                <div className="invoice-actions">
                  <button
                    className="pay-button"
                    onClick={() => updatePaymentStatus(bill.id, true)}
                    disabled={bill.paymentStatus === 'Paid'}
                  >
                    ✔
                  </button>
                  <button
                    className="unpay-button"
                    onClick={() => updatePaymentStatus(bill.id, false)}
                    disabled={bill.paymentStatus === 'Unpaid'}
                >
                   ❌
                  </button>
                </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          selectedSociety && <p className="no-bills">No billing records found for this society.</p>
        )}
      </div>
    </div>
  );
};

export default Billing;
    