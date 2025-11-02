import jsPDF from 'jspdf' import autoTable from 'jspdf-autotable' export const downloadInvoice =
(invoice) => { const doc = new jsPDF() // --- Logo and Company Info --- const logo = new Image()
logo.src = '/conpay-logo.png' logo.onload = () => { // Add logo (x, y, width, height)
doc.addImage(logo, 'PNG', 14, 10, 30, 15) doc.setFontSize(16) doc.text('CONPAY GADGETS', 50, 18)
doc.setFontSize(10) doc.text('123 Tech Avenue, Lagos, Nigeria', 50, 24) doc.text('Email:
conpaygadgets@gmail.com | Phone: +234 801 234 5678', 50, 29) // --- Invoice Header ---
doc.setFontSize(14) doc.text('INVOICE RECEIPT', 14, 45) doc.setFontSize(10) doc.text(`Invoice No:
${invoice.invoiceNumber}`, 14, 52) doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`,
14, 57) doc.text(`Customer: ${invoice.customerName}`, 14, 62) doc.text(`Email:
${invoice.customerEmail || '-'}`, 14, 67) // --- Table of Items --- const items =
invoice.items.map((item) => [ item.name, item.quantity, item.price.toLocaleString(), (item.price *
item.quantity).toLocaleString(), ]) autoTable(doc, { startY: 75, head: [['Item', 'Qty', 'Price (₦)',
'Total (₦)']], body: items, }) // --- Totals --- const finalY = doc.lastAutoTable.finalY + 10
doc.setFontSize(11) doc.text(`Subtotal: ₦${invoice.subtotal.toLocaleString()}`, 140, finalY)
doc.text(`Tax: ₦${invoice.tax.toLocaleString()}`, 140, finalY + 6) doc.text(`Total:
₦${invoice.total.toLocaleString()}`, 140, finalY + 12) // --- PAID Stamp --- doc.setTextColor(0,
150, 0) doc.setFontSize(28) doc.text('PAID', 150, finalY + 35, { angle: -20 }) doc.setTextColor(0,
0, 0) // --- Footer --- doc.setFontSize(9) doc.text('Thank you for your purchase!', 14, 280)
doc.text('This is a system-generated receipt.', 14, 285) // --- Save PDF ---
doc.save(`${invoice.invoiceNumber}.pdf`) } }
