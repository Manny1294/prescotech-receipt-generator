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
      <p class="tagline">Create professional receipts for your gadget sales</p>
    </div>

    <div class="action-section">
      <button @click="createNewReceipt" class="btn-primary">
        <FileTextIcon :size="20" />
        Create New Receipt
      </button>
    </div>

    <ReceiptList />
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  padding: 10px;
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
