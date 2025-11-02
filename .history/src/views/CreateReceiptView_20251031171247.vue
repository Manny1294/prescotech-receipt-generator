<template>
  <div class="create-container">
    <div class="header">
      <button @click="goBack" class="btn-back">
        <ArrowLeftIcon :size="20" />
        Back
      </button>
      <h1>Create Receipt</h1>
    </div>

    <div v-if="!showPreview">
      <ReceiptForm
        :receipt-number="receiptNumber"
        :initial-data="receiptData"
        @generate="handleGenerate"
      />
    </div>

    <div v-else>
      <ReceiptPreview :receipt="receiptData" @back="showPreview = false" @save="handleSave" />
    </div>
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
.create-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-back {
  background: #e2e8f0;
  border: none;
  padding: 0.5rem 1rem;
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

h1 {
  font-size: 2rem;
  color: #1a202c;
  margin: 0;
}
</style>
