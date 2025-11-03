<script setup>
import {
  ArrowLeft as ArrowLeftIcon,
  Download as DownloadIcon,
  LocateFixedIcon as LocateIcon,
  PhoneCall as PhoneCallIcon,
} from 'lucide-vue-next'
import html2pdf from 'html2pdf.js'
import { useReceiptStore } from '@/stores/receiptStore'

const props = defineProps({
  receipt: Object,
})

const emit = defineEmits(['back'])
const receiptStore = useReceiptStore()

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

// 📄 Download as PDF
const downloadPDF = () => {
  const element = document.getElementById('receipt-content')
  const opt = {
    margin: 0.3,
    filename: `${props.receipt.receiptNumber}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  }
  html2pdf().from(element).set(opt).save()
}

// 💾 Save receipt
const saveReceipt = async () => {
  const success = await receiptStore.saveReceipt(props.receipt)
  if (success) {
    alert('✅ Receipt saved successfully!')
  } else {
    alert('❌ Failed to save receipt. Please try again.')
  }
}
</script>

<template>
  <div class="preview-container">
    <div class="preview-header">
      <button @click="$emit('back')" class="btn-back"><ArrowLeftIcon size="18" /> Back</button>
      <div class="actions">
        <button @click="saveReceipt" class="btn-save">Save Receipt</button>
        <button @click="downloadPDF" class="btn-download">
          <DownloadIcon size="18" /> Download PDF
        </button>
      </div>
    </div>

    <div id="receipt-content" class="receipt">
      <div class="receipt-header">
        <h2>Prescotech Enterprises</h2>
        <p>
          <LocateIcon size="14" /> 123 Broad Street, Lagos<br />
          <PhoneCallIcon size="14" /> +234 810 234 5678
        </p>
      </div>

      <div class="receipt-meta">
        <p><strong>Date:</strong> {{ formatDate(receipt.date) }}</p>
        <p><strong>Receipt No:</strong> {{ receipt.receiptNumber }}</p>
        <p><strong>Customer:</strong> {{ receipt.customerName }}</p>
      </div>

      <table class="receipt-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in receipt.items" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ formatCurrency(item.unitPrice) }}</td>
            <td>{{ formatCurrency(item.total) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="receipt-total">
        <p><strong>Subtotal:</strong> {{ formatCurrency(receipt.subtotal) }}</p>
        <p><strong>Tax:</strong> {{ formatCurrency(receipt.tax) }}</p>
        <p><strong>Grand Total:</strong> {{ formatCurrency(receipt.total) }}</p>
      </div>

      <p class="thank-you">Thank you for your patronage!</p>
    </div>
  </div>
</template>

<style scoped>
.preview-container {
  padding: 20px;
  background: #f9fafb;
  min-height: 100vh;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-back,
.btn-save,
.btn-download {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-back {
  background: #e5e7eb;
}

.btn-save {
  background: #10b981;
  color: white;
}

.btn-download {
  background: #3b82f6;
  color: white;
}

.actions {
  display: flex;
  gap: 10px;
}

.receipt {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.receipt-header {
  text-align: center;
  margin-bottom: 20px;
}

.receipt-meta {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.receipt-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.receipt-table th,
.receipt-table td {
  border: 1px solid #e5e7eb;
  padding: 8px;
  text-align: center;
}

.receipt-total {
  text-align: right;
  margin-top: 10px;
}

.thank-you {
  text-align: center;
  margin-top: 20px;
  font-style: italic;
  color: #555;
}
</style>
