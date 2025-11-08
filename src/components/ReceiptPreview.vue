<script setup>
import { ArrowLeft as ArrowLeftIcon, Download as DownloadIcon } from 'lucide-vue-next'
import html2pdf from 'html2pdf.js'
import { useReceiptStore } from '@/stores/receiptStore'
import { useRouter } from 'vue-router'
import ReceiptTemplate from './ReceiptTemplate.vue'

const router = useRouter()
const props = defineProps({
  receipt: Object,
})

const receiptStore = useReceiptStore()

// 🧾 Download the receipt as PDF
const downloadPDF = () => {
  const element = document.getElementById('receipt-content')
  const opt = {
    margin: [0.2, 0.2, 0.2, 0.2],
    filename: `${props.receipt.customer.name} presco-tech.pdf`,
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

    <!-- Receipt Content using reusable component -->
    <div id="receipt-content">
      <ReceiptTemplate :receipt="receipt" />
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
</style>
