<script setup>
import { ArrowLeft as ArrowLeftIcon, Printer as PrinterIcon } from 'lucide-vue-next'

// const props = defineProps({
//   receipt: Object,
// })

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

// Simple print function - browser converts to PDF automatically
const printReceipt = () => {
  window.print()
}
</script>

<template>
  <div class="preview-container">
    <!-- Buttons (hidden when printing) -->
    <div class="preview-actions no-print">
      <button @click="$emit('back')" class="btn-back">
        <ArrowLeftIcon :size="20" />
        Edit Receipt
      </button>
      <div class="action-buttons">
        <button @click="printReceipt" class="btn-download">
          <PrinterIcon :size="20" />
          Print / Save as PDF
        </button>
        <button @click="$emit('save')" class="btn-save">Save Receipt</button>
      </div>
    </div>

    <!-- The actual receipt that will be printed -->
    <div class="receipt-preview">
      <div class="receipt-paper">
        <!-- Header -->
        <div class="receipt-header-preview">
          <div class="company-info">
            <div class="logo-preview">
              <img src="/logo.png" alt="Presco Tech Logo" class="logo" />
            </div>
            <div class="icon-info">
              <p class="add">
                No.11 Somoye Osundairo Street <br />
                (Foramot Plaza) Computer Village, <br />
                Ikeja, Lagos.
              </p>
            </div>
            <div class="icon-info">
              <p>+234 706 477 4220</p>
            </div>
          </div>
          <div class="receipt-details">
            <p>BN:7700965</p>
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
          <p><strong>Name:</strong> {{ receipt.customer.name }}</p>
          <p><strong>Address:</strong> {{ receipt.customer.address }}</p>
          <p><strong>Phone:</strong> {{ receipt.customer.phone }}</p>
          <p v-if="receipt.customer.email"><strong>Email:</strong> {{ receipt.customer.email }}</p>
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
          <p><strong>Payment Method:</strong> {{ receipt.paymentMethod }}</p>
          <p><strong>Payment Status:</strong> {{ receipt.paymentStatus }}</p>
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
            Goods sold in good condition are not returnable.
          </p>
          <p><strong>Thank you for your purchase!</strong></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide buttons when printing */
@media print {
  .no-print {
    display: none !important;
  }

  .receipt-preview {
    padding: 0;
    background: white;
  }

  .receipt-paper {
    box-shadow: none;
    padding: 20mm;
  }
}

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
  padding: 2rem;
  border-radius: 12px;
}

.receipt-paper {
  background: white;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 210mm; /* A4 width */
  margin: 0 auto;
}

.receipt-header-preview {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #667eea;
}

.company-info {
  line-height: 1.6;
}

.logo {
  height: 80px;
  margin-bottom: 1rem;
}

.company-info p {
  margin: 0.25rem 0;
  color: #4a5568;
  font-size: 0.95rem;
}

.receipt-details {
  text-align: right;
}

.receipt-details h2 {
  color: #667eea;
  margin: 0.5rem 0;
  font-size: 2rem;
}

.receipt-details p {
  margin: 0.5rem 0;
  color: #4a5568;
  font-size: 0.95rem;
}

.payment-badge {
  background: #48bb78;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
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
  font-size: 1.1rem;
}

.customer-section p {
  margin: 0.5rem 0;
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
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #e2e8f0;
}

.items-table-preview th {
  font-weight: 600;
  font-size: 0.95rem;
}

.items-table-preview td {
  font-size: 0.9rem;
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

.payment-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #e6fffa;
  border-radius: 8px;
  border-left: 4px solid #48bb78;
}

.payment-section p {
  margin: 0.5rem 0;
  color: #1a202c;
  font-size: 0.95rem;
}

.totals-section {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
}

.totals-grid {
  min-width: 300px;
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

.receipt-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
  color: #718096;
}

.receipt-footer p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.footer-note {
  font-style: italic;
  margin-bottom: 1rem;
}

.icon-info {
  display: flex;
  align-items: flex-start;
  gap: 5px;
  margin: 0.25rem 0;
}
</style>
