<template>
  <div class="receipt-form">
    <h2>Create New Receipt</h2>

    <form @submit.prevent="handlePreview">
      <!-- Customer Info -->
      <section class="form-section">
        <h3>Customer Details</h3>
        <div class="form-grid">
          <div>
            <label>Customer Name</label>
            <input v-model="receipt.customerName" type="text" required />
          </div>
          <div>
            <label>Email</label>
            <input v-model="receipt.customerEmail" type="email" placeholder="optional" />
          </div>
          <div>
            <label>Phone</label>
            <input v-model="receipt.customerPhone" type="tel" placeholder="optional" />
          </div>
        </div>
      </section>

      <!-- Items -->
      <section class="form-section">
        <h3>Items</h3>
        <div v-for="(item, index) in receipt.items" :key="index" class="item-row">
          <input v-model="item.name" type="text" placeholder="Item name" required />
          <input v-model.number="item.quantity" type="number" min="1" placeholder="Qty" required />
          <input
            v-model.number="item.price"
            type="number"
            min="0"
            placeholder="Unit price"
            required
          />
          <button type="button" class="btn-remove" @click="removeItem(index)">✕</button>
        </div>
        <button type="button" class="btn-add" @click="addItem">+ Add Item</button>
      </section>

      <!-- Tax -->
      <section class="form-section">
        <label>Tax Rate (%)</label>
        <input v-model.number="receipt.taxRate" type="number" min="0" step="0.5" />
      </section>

      <!-- Submit -->
      <div class="form-actions">
        <button type="submit" class="btn-primary">Preview Receipt</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useReceiptStore } from '../stores/receiptStore'

const router = useRouter()
const receiptStore = useReceiptStore()

const receipt = reactive({
  receiptNumber: '',
  date: new Date().toISOString(),
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  items: [{ name: '', quantity: 1, price: 0 }],
  taxRate: 0,
})

const addItem = () => {
  receipt.items.push({ name: '', quantity: 1, price: 0 })
}

const removeItem = (index) => {
  receipt.items.splice(index, 1)
}

const handlePreview = () => {
  if (!receipt.customerName || receipt.items.length === 0) {
    alert('Please fill in all required fields.')
    return
  }

  // Generate receipt number
  receipt.receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(
    Math.random() * 9000 + 1000,
  )}`

  receiptStore.setCurrentReceipt(receipt)
  router.push('/receipt/preview')
}
</script>

<style scoped>
.receipt-form {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  font-size: 1.8rem;
  color: #1a202c;
  margin-bottom: 1.5rem;
  text-align: center;
}

h3 {
  font-size: 1.2rem;
  color: #4a5568;
  margin-bottom: 1rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
  color: #2d3748;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  font-size: 1rem;
}

input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.item-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 40px;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.btn-add {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-add:hover {
  background: #5a67d8;
}

.btn-remove {
  background: #fed7d7;
  border: none;
  border-radius: 6px;
  color: #c53030;
  font-weight: bold;
  cursor: pointer;
  padding: 0.4rem;
}

.btn-remove:hover {
  background: #feb2b2;
}

.form-actions {
  text-align: center;
  margin-top: 1.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.9rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
}
</style>
