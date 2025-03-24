import React, { useEffect, useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

const InvoicePage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);

  useEffect(() => {
    const order = JSON.parse(localStorage.getItem('currentOrder'));
    setOrderDetails(order);
    if (order) {
      generatePDF(order);
    }
  }, []);

  const generatePDF = async (order) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    
    // Load fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Add function to draw horizontal line
    const drawLine = (y) => {
      page.drawLine({
        start: { x: 50, y },
        end: { x: width - 50, y },
        thickness: 1,
        color: rgb(0.7, 0.7, 0.7),
      });
    };

    // Header section
    page.drawText('SAIF GIFTS', {
      x: 50,
      y: height - 50,
      size: 24,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });

    // Invoice title and number
    page.drawText('INVOICE', {
      x: width - 150,
      y: height - 50,
      size: 20,
      font: helveticaBold,
    });

    // Order details
    const drawText = (text, x, y, size = 12, isHeader = false) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: isHeader ? helveticaBold : helveticaFont,
      });
    };

    // Order information
    drawText(`Order ID: ${order.orderId}`, 50, height - 100);
    drawText(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, 50, height - 120);

    // Customer details
    drawText('Bill To:', 50, height - 160, 12, true);
    drawText(order.shippingDetails.fullName, 50, height - 180);
    drawText(order.shippingDetails.address, 50, height - 200);
    drawText(`${order.shippingDetails.city} - ${order.shippingDetails.postalCode}`, 50, height - 220);
    drawText(`Phone: ${order.shippingDetails.phone}`, 50, height - 240);
    drawText(`Email: ${order.shippingDetails.email}`, 50, height - 260);

    // Table header
    const tableTop = height - 300;
    drawText('Item', 50, tableTop, 12, true);
    drawText('Qty', 300, tableTop, 12, true);
    drawText('Rate', 400, tableTop, 12, true);
    drawText('Amount', 500, tableTop, 12, true);

    // Table content
    let currentY = tableTop - 30;
    order.cart.forEach((item) => {
      drawText(item.name, 50, currentY);
      drawText(item.quantity.toString(), 300, currentY);
      drawText(`Rs. ${item.price.toFixed(2)}`, 400, currentY);
      drawText(`Rs. ${(item.price * item.quantity).toFixed(2)}`, 500, currentY);
      currentY -= 25;
      drawLine(currentY + 5); // Line after each item
    });

    // Totals section
    const totalsY = currentY - 40;
    drawLine(totalsY + 20); // Line above totals
    drawText('Subtotal:', 400, totalsY);
    drawText(`Rs. ${order.subtotal.toFixed(2)}`, 500, totalsY);
    
    drawText('Tax (10%):', 400, totalsY - 25);
    drawText(`Rs. ${order.tax.toFixed(2)}`, 500, totalsY - 25);
    
    drawText('Total:', 400, totalsY - 50, 12, true);
    drawText(`Rs. ${order.totalAmount.toFixed(2)}`, 500, totalsY - 50, 12, true);

    // Footer
    page.drawText('Thank you for shopping with Saif Gifts!', {
      x: 50,
      y: 50,
      size: 12,
      font: helveticaFont,
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    setPdfBlob(blob);
    saveAs(blob, `invoice-${order.orderId}.pdf`);
  };

  const sendWhatsAppMessage = async () => {
    if (!pdfBlob || !orderDetails) return;

    const adminPhone = '+919860515246';
    const message = `New Order from Saif Gifts\n
Order Details:
------------------
Order ID: ${orderDetails.orderId}
Customer: ${orderDetails.shippingDetails.fullName}
Phone: ${orderDetails.shippingDetails.phone}
Amount: Rs. ${orderDetails.totalAmount.toFixed(2)}

Please check the attached invoice PDF.`;
    
    // For WhatsApp Web sharing
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${adminPhone}&text=${encodeURIComponent(message)}`;
    
    // First download the PDF
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfUrl;
    downloadLink.download = `invoice-${orderDetails.orderId}.pdf`;
    downloadLink.click();

    // Then open WhatsApp
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      URL.revokeObjectURL(pdfUrl);
    }, 1000);
  };

  if (!orderDetails) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Order Confirmation</h1>
        <div className="space-y-4">
          <p>Thank you for your order, {orderDetails.shippingDetails.fullName}!</p>
          <p>Order ID: {orderDetails.orderId}</p>
          <p>Total Amount: Rs. {orderDetails.totalAmount.toFixed(2)}</p>
          
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => generatePDF(orderDetails)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Download Invoice
            </button>
            <button
              onClick={sendWhatsAppMessage}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Share via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;