<script setup>
import {
  ArrowLeft as ArrowLeftIcon,
  Download as DownloadIcon,
  LocateFixedIcon as LocateIcon,
  PhoneCallIcon as PhoneCallIcon,
} from 'lucide-vue-next'
import html2pdf from 'html2pdf.js'
import { useReceiptStore } from '@/stores/receiptStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  receipt: Object,
})

const receiptStore = useReceiptStore()

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

const formatCurrency = (amount) => `₦${amount.toLocaleString('en-NG')}`

// 🧾 Download the receipt as PDF
const downloadPDF = () => {
  const element = document.getElementById('receipt-content')
  const opt = {
    margin: [0.2, 0.2, 0.2, 0.2],
    filename: `${props.receipt.receiptNumber}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  }
  html2pdf().set(opt).from(element).save()
}

// 💾 Save receipt directly using localStorage
const saveReceipt = async () => {
  const success = await receiptStore.saveReceipt(props.receipt)
  if (success) {
    alert('✅ Receipt saved successfully!')
    router.push('/')
  } else {
    alert('❌ Failed to save receipt. Please try again.')
  }
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
        <button @click="saveReceipt" class="btn-save">Save Receipt</button>
      </div>
    </div>

    <!-- Receipt Content -->
    <div id="receipt-content" class="receipt-preview">
      <div class="receipt-paper">
        <!-- Header -->
        <div class="receipt-header-preview">
          <div class="company-info">
            <div class="logo-preview">
              <img src="/logo.png" alt="Presco Tech Logo" class="logo" />
            </div>
            <div class="icon-info">
              <LocateIcon :size="15" class="icon" />
              <p class="add">
                No.11 Somoye Osundairo Street <br />(Foramot Plaza) Computer Village, <br />Ikeja,
                Lagos.
              </p>
            </div>
            <div class="icon-info">
              <PhoneCallIcon :size="15" class="icon" />
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

  gap: 5px;
}
.icon {
  color: 000;
}
</style>
