import React from 'react';

const PrintOrder = ({ order }) => {
  const storeInfo = {
    name: "Jay Kirana Store",
    address: "123 Fresh Market Street",
    phone: "+1-123-456-7890",
    email: "info@jaykirana.com",
    gstin: "YOUR_GSTIN",
    website: "www.jaykirana.com"
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order #${order._id}</title>
          <style>
            @page {
              size: A4;
              margin: 10mm;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 10px;
              max-width: 100%;
              margin: 0 auto;
              color: #333;
              font-size: 12px;
            }
            .header {
              text-align: center;
              margin-bottom: 15px;
              padding-bottom: 5px;
            }
            .store-logo {
              font-size: 20px;
              font-weight: bold;
              color: #2d3250;
              margin-bottom: 3px;
            }
            .store-details {
              font-size: 12px;
              color: #666;
              margin-bottom: 10px;
            }
            .store-details p {
              margin: 2px 0;
            }
            .invoice-title {
              background: #f8f9fa;
              padding: 5px;
              border: 1px solid #ddd;
              margin-bottom: 10px;
              text-align: center;
            }
            .invoice-title h2 {
              margin: 5px 0;
              font-size: 16px;
            }
            .invoice-title p {
              margin: 3px 0;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-bottom: 10px;
            }
            .info-box {
              border: 1px solid #ddd;
              padding: 8px;
              border-radius: 4px;
              font-size: 11px;
            }
            .info-box p {
              margin: 3px 0;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 5px;
              color: #2d3250;
              border-bottom: 1px solid #eee;
              padding-bottom: 3px;
              font-size: 12px;
            }
            .order-items {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
              font-size: 11px;
            }
            .order-items th, .order-items td {
              border: 1px solid #ddd;
              padding: 5px;
              text-align: left;
            }
            .order-items th {
              background-color: #f8f9fa;
              font-weight: bold;
            }
            .total-section {
              margin-top: 10px;
              border-top: 1px solid #ddd;
              padding-top: 5px;
            }
            .total {
              text-align: right;
              font-size: 12px;
            }
            .total p {
              margin: 3px 0;
            }
            .terms {
              font-size: 10px;
              color: #666;
              margin-top: 10px;
              padding: 5px;
              background: #f8f9fa;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            .terms ol {
              margin: 5px 0 5px 20px;
              padding: 0;
            }
            .terms li {
              margin: 2px 0;
            }
            .footer {
              margin-top: 15px;
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            .footer p {
              margin: 2px 0;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="store-logo">${storeInfo.name}</div>
            <div class="store-details">
              <p>${storeInfo.address}</p>
              <p>Phone: ${storeInfo.phone} | Email: ${storeInfo.email}</p>
              <p>GST No: ${storeInfo.gstin} | Website: ${storeInfo.website}</p>
            </div>
          </div>

          <div class="invoice-title">
            <h2>TAX INVOICE</h2>
            <p>Order #${order._id}</p>
            <p>Date: ${new Date(order.orderDate).toLocaleString()}</p>
          </div>

          <div class="info-grid">
            <div class="info-box">
              <div class="section-title">Bill To:</div>
              <p><strong>Name:</strong> ${order.name}</p>
              <p><strong>Address:</strong> ${order.address}</p>
              <p><strong>Phone:</strong> ${order.phone}</p>
            </div>
            <div class="info-box">
              <div class="section-title">Order Information:</div>
              <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
              <p><strong>Status:</strong> ${order.status || 'Pending'}</p>
              <p><strong>Payment:</strong> Cash on Delivery</p>
            </div>
          </div>

          <table class="order-items">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Item Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.products.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${(order.total / order.products.reduce((sum, p) => sum + p.quantity, 0)).toFixed(2)}</td>
                  <td>₹${((order.total / order.products.reduce((sum, p) => sum + p.quantity, 0)) * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total">
              <p>Sub Total: ₹${order.total.toFixed(2)}</p>
              <p>GST (18%): ₹${(order.total * 0.18).toFixed(2)}</p>
              <p><strong>Grand Total: ₹${(order.total * 1.18).toFixed(2)}</strong></p>
            </div>
          </div>

          <div class="terms">
            <strong>Terms & Conditions:</strong>
            <ol>
              <li>Goods once sold will not be taken back or exchanged</li>
              <li>All disputes are subject to local jurisdiction only</li>
              <li>This is a computer generated invoice and does not require signature</li>
            </ol>
          </div>

          <div class="footer">
            <p>Thank you for shopping with ${storeInfo.name}!</p>
            <p>For queries: ${storeInfo.phone} | ${storeInfo.email} | ${storeInfo.website}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <button 
      onClick={handlePrint}
      className="print-button"
    >
      Print Invoice
      <style jsx>{`
        .print-button {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .print-button:hover {
          background: #388E3C;
        }
        .print-button:before {
          content: "🖨️";
        }
      `}</style>
    </button>
  );
};

export default PrintOrder; 