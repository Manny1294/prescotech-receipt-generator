<script setup>
import {
  ArrowLeft as ArrowLeftIcon,
  Download as DownloadIcon,
  LocateIcon as LocateIcon,
} from 'lucide-vue-next'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const props = defineProps({
  receipt: Object,
})

defineEmits(['back', 'save'])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatCurrency = (amount) => {
  return `₦${amount.toLocaleString('en-NG')}`
}

const downloadPDF = () => {
  const doc = new jsPDF()

  // Company Info
  doc.setFontSize(20)
  doc.setTextColor(102, 126, 234)
  doc.text('CONPAY', 20, 20)

  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text('123 Business Street', 20, 28)
  doc.text('Lagos, Nigeria', 20, 33)
  doc.text('Phone: +234 800 000 0000', 20, 38)
  doc.text('Email: info@conpay.com', 20, 43)

  // Receipt Details
  doc.setFontSize(24)
  doc.setTextColor(102, 126, 234)
  doc.text('RECEIPT', 140, 20)

  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text(`Receipt #: ${props.receipt.receiptNumber}`, 140, 28)
  doc.text(`Date: ${formatDate(props.receipt.date)}`, 140, 33)
  doc.text(`Payment: ${props.receipt.paymentStatus}`, 140, 38)

  // Customer Info
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('Customer:', 20, 60)

  doc.setFont(undefined, 'normal')
  doc.setFontSize(10)
  doc.text(props.receipt.customer.name, 20, 68)
  doc.text(props.receipt.customer.address, 20, 73)
  doc.text(props.receipt.customer.phone, 20, 78)
  if (props.receipt.customer.email) {
    doc.text(props.receipt.customer.email, 20, 83)
  }

  // Items Table
  const tableData = props.receipt.items.map((item) => [
    item.name,
    item.quantity,
    formatCurrency(item.price),
    formatCurrency(item.quantity * item.price),
  ])

  doc.autoTable({
    startY: 95,
    head: [['Item', 'Quantity', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [102, 126, 234] },
  })

  // Payment Info
  const finalY = doc.lastAutoTable.finalY + 10
  doc.setFont(undefined, 'bold')
  doc.text('Payment Information:', 20, finalY)
  doc.setFont(undefined, 'normal')
  doc.text(`Method: ${props.receipt.paymentMethod}`, 20, finalY + 7)
  doc.text(`Status: ${props.receipt.paymentStatus}`, 20, finalY + 14)

  // Totals
  doc.text(`Subtotal: ${formatCurrency(props.receipt.subtotal)}`, 140, finalY + 7)
  doc.text(`Tax: ${formatCurrency(props.receipt.tax)}`, 140, finalY + 14)

  doc.setFont(undefined, 'bold')
  doc.setFontSize(12)
  doc.text(`Amount Paid: ${formatCurrency(props.receipt.total)}`, 140, finalY + 22)

  // Footer
  doc.setFont(undefined, 'italic')
  doc.setFontSize(10)
  doc.text('Thank you for your purchase!', 105, finalY + 40, { align: 'center' })
  doc.text('Please keep this receipt for your records.', 105, finalY + 46, { align: 'center' })

  doc.save(`${props.receipt.receiptNumber}.pdf`)
}
</script>

<template>
  <div class="preview-container">
    <div class="preview-actions">
      <button @click="$emit('back')" class="btn-back">
        <ArrowLeftIcon :size="20" />
        Edit Receipt
      </button>
      <div class="action-buttons">
        <button @click="downloadPDF" class="btn-download">
          <DownloadIcon :size="20" />
          Download PDF
        </button>
        <button @click="$emit('save')" class="btn-save">Save Receipt</button>
      </div>
    </div>

    <div id="receipt-content" class="receipt-preview">
      <div class="receipt-paper">
        <!-- Header -->
        <div class="receipt-header-preview">
          <div class="company-info">
            <div class="logo-preview">
              <img src="/logo.png" alt="Presco Tech Logo" class="logo" />
            </div>
            <h2>Presco Tech</h2>
            <div class="icon-info">
              <LocateIcon :size="15" class="icon" />
              <p>No. 5 Olayeni Street, Computer Village Ikeja</p>
            </div>
            <p>Lagos, Nigeria</p>
            <p>Phone: +234 706 477 4220</p>
            <p>Email: prescojackson@yahoo.com</p>
          </div>
          <div class="receipt-details">
            <p>RC:7752778</p>
            <h2>RECEIPT</h2>
            <p><strong>Receipt #:</strong> {{ receipt.receiptNumber }}</p>
            <p><strong>Date:</strong> {{ formatDate(receipt.date) }}</p>
            <p>
              <strong>Payment:</strong>
              <span class="payment-badge">{{ receipt.paymentStatus }}</span>
            </p>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="customer-section">
          <h3>Customer's Info:</h3>
          <p>Name: {{ receipt.customer.name }}</p>
          <p>Address: {{ receipt.customer.address }}</p>
          <p>Phone: {{ receipt.customer.phone }}</p>
          <p v-if="receipt.customer.email">{{ receipt.customer.email }}</p>
        </div>

        <!-- Items Table -->
        <table class="items-table-preview">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in receipt.items" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatCurrency(item.price) }}</td>
              <td>{{ formatCurrency(item.quantity * item.price) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Payment Info -->
        <div class="payment-section">
          <div class="payment-info">
            <p><strong>Payment Method:</strong> {{ receipt.paymentMethod }}</p>
            <p><strong>Payment Status:</strong> {{ receipt.paymentStatus }}</p>
          </div>
        </div>

        <!-- Totals -->
        <div class="totals-section">
          <div class="totals-grid">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>{{ formatCurrency(receipt.subtotal) }}</span>
            </div>
            <div class="total-row">
              <span>Tax:</span>
              <span>{{ formatCurrency(receipt.tax) }}</span>
            </div>
            <div class="total-row grand-total-preview">
              <span>Amount Paid:</span>
              <span>{{ formatCurrency(receipt.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="receipt-footer">
          <p class="footer-note">
            Please keep this receipt for your records. <br />
            Goods sold in good condition are not returnable, and there is no refund of money after
            payment.
          </p>
          <p>Thank you for your purchase!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-container {
  max-width: 900px;
  margin: 0 auto;
}

.preview-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.btn-back {
  background: #e2e8f0;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.btn-back:hover {
  background: #cbd5e0;
}

.btn-download {
  background: #4299e1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.btn-download:hover {
  background: #3182ce;
}

.btn-save {
  background: #48bb78;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.btn-save:hover {
  background: #38a169;
}

.receipt-preview {
  background: #f7fafc;
  padding: 1rem;
  border-radius: 12px;
}

.receipt-paper {
  background: white;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-height: 800px;
}

.receipt-header-preview {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #667eea;
}

.company-info {
  line-height: 1.6;
}

.logo {
  height: 80px;
  margin-bottom: 1rem;
}

.company-info h2 {
  color: #667eea;
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
}

.company-info p {
  margin: 0.25rem 0;
  color: #4a5568;
}

.receipt-details {
  text-align: right;
}

.receipt-details h1 {
  color: #667eea;
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
}

.invoice-details p {
  margin: 0.5rem 0;
  color: #4a5568;
  font-size: 1rem;
}

.customer-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
}

.customer-section h3 {
  color: #1a202c;
  margin: 0 0 1rem 0;
}

.customer-section p {
  margin: 0.25rem 0;
  color: #4a5568;
}

.items-table-preview {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.items-table-preview thead {
  background: #667eea;
  color: white;
}

.items-table-preview th,
.items-table-preview td {
  padding: 1rem;
  text-align: left;
  border: 1px solid #e2e8f0;
}

.items-table-preview th {
  font-weight: 600;
}

.items-table-preview tbody tr:nth-child(even) {
  background: #f7fafc;
}

.items-table-preview td:nth-child(2),
.items-table-preview td:nth-child(3),
.items-table-preview td:nth-child(4),
.items-table-preview th:nth-child(2),
.items-table-preview th:nth-child(3),
.items-table-preview th:nth-child(4) {
  text-align: right;
}

.totals-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 3rem;
}

.totals-grid {
  width: 300px;
  padding: 1.5rem;
  background: #f7fafc;
  border-radius: 8px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 1rem;
}

.grand-total-preview {
  border-top: 2px solid #667eea;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: 700;
  font-size: 1.3rem;
  color: #667eea;
}

.invoice-footer {
  text-align: center;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
  color: #718096;
}

.invoice-footer p {
  margin: 0.5rem 0;
}

.footer-note {
  font-size: 0.9rem;
  font-style: italic;
}
.icon-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.icon {
  color: red;
}
</style>
