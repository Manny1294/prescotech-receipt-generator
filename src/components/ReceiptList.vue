<script setup>
import { ref, onMounted } from 'vue'
import {
  FileText as FileTextIcon,
  Download as DownloadIcon,
  Trash2 as Trash2Icon,
  Eye as EyeIcon,
} from 'lucide-vue-next'
import { useReceiptStore } from '@/stores/receiptStore'
import html2pdf from 'html2pdf.js'
import { useRouter } from 'vue-router'
import ReceiptTemplate from './ReceiptTemplate.vue'

const router = useRouter()
const receiptStore = useReceiptStore()
const loading = ref(true)
const downloadingReceipt = ref(null)

onMounted(async () => {
  await receiptStore.loadReceipts()
  loading.value = false
})

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

const formatCurrency = (amount) => `₦${amount.toLocaleString('en-NG')}`

const viewReceipt = (receipt) => {
  receiptStore.currentReceipt = receipt
  router.push({ path: '/create', query: { from: 'list' } })
}

// 🧾 Download receipt using html2pdf (same format as preview)
const downloadReceipt = (receipt) => {
  downloadingReceipt.value = receipt.receiptNumber

  setTimeout(() => {
    const element = document.getElementById(`receipt-${receipt.receiptNumber}`)
    const opt = {
      margin: [0.2, 0.2, 0.2, 0.2],
      filename: `${receipt.customer.name} presco-tech.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    }

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        downloadingReceipt.value = null
      })
  }, 100)
}

const deleteReceipt = async (receiptNumber) => {
  if (confirm(`Are you sure you want to delete receipt ${receiptNumber}?`)) {
    await receiptStore.deleteReceipt(receiptNumber)
  }
}
</script>

<template>
  <div class="receipt-list-container">
    <h2>Recent Receipts</h2>

    <div v-if="loading" class="loading">Loading receipts...</div>

    <div v-else-if="receiptStore.receipts.length === 0" class="empty-state">
      <FileTextIcon :size="64" class="empty-icon" />
      <p>No receipts yet</p>
      <p class="empty-subtext">Create your first receipt to get started</p>
    </div>

    <div v-else class="receipts-grid">
      <div
        v-for="receipt in receiptStore.receipts"
        :key="receipt.receiptNumber"
        class="receipt-card"
      >
        <div class="receipt-card-header">
          <h3>{{ receipt.receiptNumber }}</h3>
          <span class="receipt-date">{{ formatDate(receipt.date) }}</span>
        </div>

        <div class="receipt-card-body">
          <p class="customer-name">{{ receipt.customer.name }}</p>
          <p class="receipt-total">{{ formatCurrency(receipt.total) }}</p>
          <p class="items-count">{{ receipt.items.length }} item(s)</p>
        </div>

        <div class="receipt-card-actions">
          <button @click="viewReceipt(receipt)" class="btn-view">
            <EyeIcon :size="16" /> View
          </button>
          <button
            @click="downloadReceipt(receipt)"
            class="btn-download-small"
            :disabled="downloadingReceipt === receipt.receiptNumber"
          >
            <DownloadIcon :size="16" />
          </button>
          <button @click="deleteReceipt(receipt.receiptNumber)" class="btn-delete">
            <Trash2Icon :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- Hidden receipt templates for PDF generation (using reusable component) -->
    <div class="hidden-receipts">
      <div
        v-for="receipt in receiptStore.receipts"
        :id="`receipt-${receipt.receiptNumber}`"
        :key="`pdf-${receipt.receiptNumber}`"
      >
        <ReceiptTemplate :receipt="receipt" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.receipt-list-container {
  margin-top: 3rem;
  text-align: center;
}

h2 {
  font-size: 1.8rem;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
}

.empty-icon {
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.empty-subtext {
  color: #a0aec0;
  font-size: 0.95rem;
}

.receipts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.receipt-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.receipt-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.receipt-card-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
}

.receipt-card-header h3 {
  color: #667eea;
  font-size: 1rem;
  margin: 0;
}

.receipt-card-body {
  margin-bottom: 1rem;
}

.customer-name {
  font-weight: 600;
  color: #1a202c;
}

.receipt-total {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

.items-count {
  color: #718096;
  font-size: 0.9rem;
}

.receipt-card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view {
  flex: 1;
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.btn-view:hover {
  background: #5a67d8;
}

.btn-download-small,
.btn-delete {
  background: #e2e8f0;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
}

.btn-download-small:hover:not(:disabled) {
  background: #cbd5e0;
}

.btn-download-small:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-delete {
  background: #fed7d7;
}

.btn-delete:hover {
  background: #fc8181;
  color: white;
}

/* Hidden receipts for PDF generation */
.hidden-receipts {
  position: fixed;
  left: -9999px;
  top: -9999px;
  width: 210mm;
}
</style>
