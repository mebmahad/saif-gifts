import React, { useState } from 'react';
import QRCode from 'qrcode';
import { PDFDocument, rgb } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

const QRCodeGenerator = ({ productData, quantity, onSuccess }) => {
  const [generating, setGenerating] = useState(false);

  const generateQRCodes = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      // Create temporary canvas for QR code generation
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      // Create PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
      const { width } = page.getSize();

      // QR code size (2cm = ~56.7 pixels at 72 DPI)
      const qrSize = 56.7;
      const margin = 20;
      const codesPerRow = Math.floor((width - 2 * margin) / (qrSize + margin));

      // Generate QR code data URL using the temporary canvas
      canvas.width = qrSize;
      canvas.height = qrSize;
      if (!productData || !productData.$id) {
        throw new Error('Invalid product data: Missing product ID');
      }
      await QRCode.toCanvas(canvas, productData.$id, {
        width: qrSize,
        margin: 0,
      });
      const qrDataUrl = canvas.toDataURL();

      // Convert data URL to bytes
      const qrImageBytes = await fetch(qrDataUrl).then(res => res.arrayBuffer());
      const qrImage = await pdfDoc.embedPng(qrImageBytes);

      // Calculate positions and draw QR codes
      let currentX = margin;
      let currentY = page.getSize().height - margin - qrSize;
      let codesInCurrentRow = 0;

      for (let i = 0; i < quantity; i++) {
        // Draw QR code
        page.drawImage(qrImage, {
          x: currentX,
          y: currentY,
          width: qrSize,
          height: qrSize,
        });

        // Update position for next QR code
        codesInCurrentRow++;
        if (codesInCurrentRow === codesPerRow) {
          currentX = margin;
          currentY -= (qrSize + margin);
          codesInCurrentRow = 0;

          // Add new page if needed
          if (currentY < margin) {
            page = pdfDoc.addPage([595.28, 841.89]);
            currentY = page.getSize().height - margin - qrSize;
          }
        } else {
          currentX += (qrSize + margin);
        }
      }

      // Save and download PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `qrcodes-${productData.name}.pdf`);
      toast.success('QR codes generated successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error generating QR codes:', error);
      toast.error('Failed to generate QR codes');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={generateQRCodes}
      disabled={generating}
      className={`bg-gift-primary text-white px-4 py-2 rounded-lg transition-colors ${generating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'}`}
    >
      {generating ? 'Generating...' : 'Generate QR Codes PDF'}
    </button>
  );
};

export default QRCodeGenerator;