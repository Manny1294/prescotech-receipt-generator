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
  <div class="home-container">
    <div class="header">
      <div class="logo-section">
        <div class="logo-placeholder">
          <img src="/logo.png" alt="Presco Tech Logo" class="logo" />
        </div>
        <h1>Receipt Generator</h1>
      </div>
      <p class="tagline">Powering Your Tech Needs</p>
    </div>

    <div class="action-section">
      <button @click="createNewReceipt" class="btn-primary">
        <FileTextIcon :size="20" />
        Create New Receipt
      </button>
    </div>

    <ReceiptList />
  </div>
  a
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
          class="mx-auto mb-3 rounded-circle bg-gradient d-flex align-items-center justify-content-center shadow"
          style="width: 100px; height: 100px; background: linear-gradient(135deg, #667eea, #764ba2)"
        >
          <img
            src="/logo.png"
            alt="Presco Tech Logo"
            class="img-fluid rounded-circle"
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
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.logo-section {
  margin-bottom: 1rem;
}

.logo-placeholder {
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
}
.logo {
  width: 120px;
  height: 120px;
}
h1 {
  font-size: 2.5rem;
  color: #1a202c;
  margin: 0;
}

.tagline {
  color: #718096;
  font-size: 1.1rem;
}

.action-section {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
}
</style>
