<template>
  <div class="create-receipt-container">
    <!-- Header -->
    <header class="header">
      <button @click="goBack" class="btn-back">
        <ArrowLeftIcon :size="20" />
        Back
      </button>
      <h1>Create Receipt</h1>
    </header>

    <!-- Form / Preview -->
    <main>
      <div v-if="!showPreview" class="form-section">
        <ReceiptForm
          :receipt-number="receiptNumber"
          :initial-data="receiptData"
          @generate="handleGenerate"
        />
      </div>

      <div v-else class="preview-section">
        <ReceiptPreview :receipt="receiptData" @back="showPreview = false" @save="handleSave" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft as ArrowLeftIcon } from 'lucide-vue-next'
import { useReceiptStore } from '../stores/receiptStore'
import ReceiptForm from '../components/ReceiptForm.vue'
import ReceiptPreview from '../components/ReceiptPreview.vue'

const router = useRouter()
const receiptStore = useReceiptStore()

const receiptNumber = ref('')
const showPreview = ref(false)
const receiptData = ref(null)

onMounted(() => {
  receiptNumber.value = receiptStore.generateReceiptNumber()
})

const goBack = () => {
  router.push('/')
}

const handleGenerate = (data) => {
  receiptData.value = data
  showPreview.value = true
}

const handleSave = async () => {
  const saved = await receiptStore.saveReceipt(receiptData.value)
  if (saved) {
    alert('Receipt saved successfully!')
    router.push('/')
  }
}
</script>

<style scoped>
.create-receipt-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.btn-back {
  background: #edf2f7;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 500;
  color: #4a5568;
  transition: background 0.2s;
}

.btn-back:hover {
  background: #e2e8f0;
}

/* Form + Preview Sections */
.form-section,
.preview-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  transition: all 0.3s ease;
}

/* Responsive Layout */
@media (max-width: 768px) {
  .create-receipt-container {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .form-section,
  .preview-section {
    padding: 1rem;
    border-radius: 12px;
  }
}

/* Buttons inside forms or previews */
button.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
}
</style>
