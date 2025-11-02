<script setup>
import { useRouter } from 'vue-router'
import { FileText as FileTextIcon } from 'lucide-vue-next'
import ReceiptList from '../components/ReceiptList.vue'

const router = useRouter()

const createNewReceipt = () => {
  router.push('/create')
}
</script>

<template>
  <div class="container py-5">
    <!-- Header -->
    <div class="text-center mb-5">
      <div
        class="mx-auto mb-3 bg-gradient d-flex align-items-center justify-content-center shadow"
        style="width: 100px; height: 100px"
      >
        <img
          src="/logo.png"
          alt="Presco Tech Logo"
          class="img-fluid"
          style="width: 90px; height: 90px"
        />
      </div>
      <h1 class="fw-bold text-dark">Receipt Generator</h1>
      <p class="text-secondary mb-0">Powering Your Tech Needs</p>
    </div>

    <!-- Action -->
    <div class="text-center mb-5">
      <button
        @click="createNewReceipt"
        class="btn btn-primary px-4 py-2 d-inline-flex align-items-center gap-2 shadow-sm"
      >
        <FileTextIcon :size="18" />
        <span>Create New Receipt</span>
      </button>
    </div>

    <!-- Receipt List -->
    <div class="mt-4">
      <ReceiptList />
    </div>
  </div>
</template>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.2s ease-in-out;
}

.btn-primary:hover {
  transform: translateY(-2px);
  opacity: 0.95;
}

h1 {
  font-size: 2.2rem;
}

@media (max-width: 576px) {
  h1 {
    font-size: 1.8rem;
  }
}
</style>
