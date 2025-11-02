<template>
  <div class="create-container">
    <div class="header">
      <button @click="goBack" class="btn-back">
        <ArrowLeftIcon :size="20" />
        Back
      </button>
      <h1>Create Invoice</h1>
    </div>

    <div v-if="!showPreview">
      <InvoiceForm :invoice-number="invoiceNumber" @generate="handleGenerate" />
    </div>

    <div v-else>
      <InvoicePreview :invoice="invoiceData" @back="showPreview = false" @save="handleSave" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft as ArrowLeftIcon } from 'lucide-vue-next'
import { useInvoiceStore } from '../stores/invoiceStore'
import InvoiceForm from '../components/InvoiceForm.vue'
import InvoicePreview from '../components/InvoicePreview.vue'

const router = useRouter()
const invoiceStore = useInvoiceStore()

const invoiceNumber = ref('')
const showPreview = ref(false)
const invoiceData = ref(null)

onMounted(() => {
  invoiceNumber.value = invoiceStore.generateInvoiceNumber()
})

const goBack = () => {
  router.push('/')
}

const handleGenerate = (data) => {
  invoiceData.value = data
  showPreview.value = true
}

const handleSave = async () => {
  const saved = await invoiceStore.saveInvoice(invoiceData.value)
  if (saved) {
    alert('Invoice saved successfully!')
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
