<template>
  <div class="preview-container">
    <div class="preview-actions">
      <button @click="$emit('back')" class="btn-back">
        <ArrowLeftIcon :size="20" />
        Edit Invoice
      </button>
      <div class="action-buttons">
        <button @click="downloadPDF" class="btn-download">
          <DownloadIcon :size="20" />
          Download PDF
        </button>
        <button @click="$emit('save')" class="btn-save">Save Invoice</button>
      </div>
    </div>

    <div id="invoice-content" class="invoice-preview">
      <div class="invoice-paper">
        <!-- Header -->
        <div class="invoice-header-preview">
          <div class="company-info">
            <div class="logo-placeholder">
              <img src="/logo.png" alt="Conpay Logo" class="logo" />
            </div>
            <h2>PRESCO TECH</h2>
            <p>123 Business Street</p>
            <p>Lagos, Nigeria</p>
            <p>Phone: +234 800 000 0000</p>
            <p>Email: info@conpay.com</p>
          </div>
          <div class="invoice-details">
            <h1>INVOICE</h1>
            <p><strong>Invoice #:</strong> {{ invoice.invoiceNumber }}</p>
            <p><strong>Date:</strong> {{ formatDate(invoice.date) }}</p>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="customer-section">
          <h3>Bill To:</h3>
          <p>
            <strong>{{ invoice.customer.name }}</strong>
          </p>
          <p>{{ invoice.customer.address }}</p>
          <p>{{ invoice.customer.phone }}</p>
          <p v-if="invoice.customer.email">{{ invoice.customer.email }}</p>
        </div>

        <!-- Items Table -->
        <table class="items-table-preview">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in invoice.items" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatCurrency(item.price) }}</td>
              <td>{{ formatCurrency(item.quantity * item.price) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Totals -->
        <div class="totals-section">
          <div class="totals-grid">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>{{ formatCurrency(invoice.subtotal) }}</span>
            </div>
            <div class="total-row">
              <span>Tax:</span>
              <span>{{ formatCurrency(invoice.tax) }}</span>
            </div>
            <div class="total-row grand-total-preview">
              <span>Total:</span>
              <span>{{ formatCurrency(invoice.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="invoice-footer">
          <p>Thank you for your purchase!</p>
          <p class="footer-note">For any questions regarding this invoice, please contact us.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft as ArrowLeftIcon, Download as DownloadIcon } from 'lucide-vue-next'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const props = defineProps({
  invoice: Object,
})

defineEmits(['back', 'save'])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
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

  // Invoice Details
  doc.setFontSize(24)
  doc.setTextColor(102, 126, 234)
  doc.text('INVOICE', 140, 20)

  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text(`Invoice #: ${props.invoice.invoiceNumber}`, 140, 28)
  doc.text(`Date: ${formatDate(props.invoice.date)}`, 140, 33)

  // Customer Info
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('Bill To:', 20, 60)

  doc.setFont(undefined, 'normal')
  doc.setFontSize(10)
  doc.text(props.invoice.customer.name, 20, 68)
  doc.text(props.invoice.customer.address, 20, 73)
  doc.text(props.invoice.customer.phone, 20, 78)
  if (props.invoice.customer.email) {
    doc.text(props.invoice.customer.email, 20, 83)
  }

  // Items Table
  const tableData = props.invoice.items.map((item) => [
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

  // Totals
  const finalY = doc.lastAutoTable.finalY + 10
  doc.text(`Subtotal: ${formatCurrency(props.invoice.subtotal)}`, 140, finalY)
  doc.text(`Tax: ${formatCurrency(props.invoice.tax)}`, 140, finalY + 7)

  doc.setFont(undefined, 'bold')
  doc.setFontSize(12)
  doc.text(`Total: ${formatCurrency(props.invoice.total)}`, 140, finalY + 15)

  // Footer
  doc.setFont(undefined, 'italic')
  doc.setFontSize(10)
  doc.text('Thank you for your purchase!', 105, finalY + 35, { align: 'center' })

  doc.save(`${props.invoice.invoiceNumber}.pdf`)
}
</script>

<style scoped>
.preview-container {
  max-width: 900px;
  margin: 0 auto;
}

.preview-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
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

.invoice-preview {
  background: #f7fafc;
  padding: 2rem;
  border-radius: 12px;
}

.invoice-paper {
  background: white;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-height: 800px;
}

.invoice-header-preview {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 3px solid #667eea;
}

.company-info {
  line-height: 1.6;
}

.logo-preview {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.7rem;
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

.invoice-details {
  text-align: right;
}

.invoice-details h1 {
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
</style>
