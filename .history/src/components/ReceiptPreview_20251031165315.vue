<template>
  <div class="preview-container">
    <div class="header">
      <h2>Receipt Preview</h2>
      <p class="receipt-number">Receipt No: {{ receipt.receiptNumber }}</p>
    </div>

    <div class="details-section">
      <div class="company-info">
        <img src="/logo.png" alt="Logo" class="logo" />
        <h3>Conpay Gadgets</h3>
        <p>Your one stop shop for all phones and gadgets</p>
      </div>

      <div class="customer-info">
        <h4>Billed To:</h4>
        <p>{{ receipt.customerName }}</p>
        <p>{{ receipt.customerEmail }}</p>
        <p>{{ receipt.customerPhone }}</p>
      </div>
    </div>

    <div class="items-section">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price (₦)</th>
            <th>Total (₦)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in receipt.items" :key="index">
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ formatCurrency(item.price) }}</td>
            <td>{{ formatCurrency(item.price * item.quantity) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="summary">
      <div class="summary-line">
        <span>Subtotal:</span>
        <strong>₦{{ formatCurrency(subtotal) }}</strong>
      </div>
      <div class="summary-line">
        <span>Tax ({{ receipt.taxRate || 0 }}%):</span>
        <strong>₦{{ formatCurrency(taxAmount) }}</strong>
      </div>
      <div class="summary-line total">
        <span>Total:</span>
        <strong>₦{{ formatCurrency(total) }}</strong>
      </div>
    </div>

    <div class="actions">
      <button class="btn-secondary" @click="$emit('back')">Edit</button>
      <button class="btn-primary" @click="$emit('save')">Save Receipt</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  receipt: {
    type: Object,
    required: true,
  },
})

const subtotal = computed(() =>
  props.receipt.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
)
const taxAmount = computed(() => (subtotal.value * (props.receipt.taxRate || 0)) / 100)
const total = computed(() => subtotal.value + taxAmount.value)

const formatCurrency = (value) =>
  value ? value.toLocaleString('en-NG', { minimumFractionDigits: 2 }) : '0.00'
</script>

<style scoped>
.preview-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.receipt-number {
  color: #718096;
  font-size: 0.95rem;
}

.company-info {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 0.5rem;
}

.customer-info {
  text-align: center;
  margin-bottom: 2rem;
  color: #4a5568;
}

.items-section table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.items-section th,
.items-section td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.summary {
  text-align: right;
  margin-bottom: 2rem;
}

.summary-line {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin: 0.3rem 0;
  font-size: 1rem;
}

.summary-line.total {
  font-size: 1.2rem;
  font-weight: bold;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.btn-secondary {
  background: #edf2f7;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary:hover {
  transform: translateY(-2px);
}
</style>
