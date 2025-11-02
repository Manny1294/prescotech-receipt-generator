<template>
  <div class="form-container">
    <div class="receipt-header">
      <h2>Receipt #{{ receiptNumber }}</h2>
      <p class="date">{{ currentDate }}</p>
    </div>

    <form @submit.prevent="generateReceipt">
      <div class="section">
        <h3>Customer Information</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Customer Name *</label>
            <input v-model="formData.customerName" type="text" required placeholder="John Doe" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="formData.customerEmail" type="email" placeholder="john@gmail.com" />
          </div>
          <div class="form-group">
            <label>Phone *</label>
            <input
              v-model="formData.customerPhone"
              type="tel"
              required
              placeholder="+2348012345678"
            />
          </div>
          <div class="form-group">
            <label>Address *</label>
            <input
              v-model="formData.customerAddress"
              type="text"
              required
              placeholder="Lekki, Lagos"
            />
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h3>Products</h3>
          <button type="button" @click="addItem" class="btn-add">
            <PlusIcon :size="16" />
            Add Item
          </button>
        </div>

        <div class="items-table">
          <div class="table-header">
            <div>Item</div>
            <div>Quantity</div>
            <div>Unit Price (₦)</div>
            <div>Total (₦)</div>
            <div></div>
          </div>

          <div v-for="(item, index) in formData.items" :key="index" class="table-row">
            <input v-model="item.name" type="text" required placeholder="Iphone 16 Pro Max" />
            <input v-model.number="item.quantity" type="number" min="1" required />
            <input
              v-model.number="item.price"
              type="number"
              min="0"
              required
              placeholder="120000"
            />
            <div class="total-cell">
              {{ formatCurrency(item.quantity * item.price) }}
            </div>
            <button
              type="button"
              @click="removeItem(index)"
              class="btn-remove"
              :disabled="formData.items.length === 1"
            >
              <Trash2Icon :size="16" />
            </button>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Payment Information</h3>
        <div class="form-grid">
          <div class="form-group">
            <label>Payment Method *</label>
            <select v-model="formData.paymentMethod" required>
              <option value="">Select payment method</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="POS">POS</option>
            </select>
          </div>
          <div class="form-group">
            <label>Payment Status *</label>
            <!-- <select v-model="formData.paymentStatus" required> -->
            <option value="Paid">Paid</option>
            <!-- <option value="Partial">Partial Payment</option> -->
            <!-- </select> -->
          </div>
        </div>
      </div>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>{{ formatCurrency(calculateSubtotal()) }}</span>
        </div>
        <div class="total-row">
          <span>Tax:</span>
          <span>₦0</span>
        </div>
        <div class="total-row grand-total">
          <span>Amount Paid:</span>
          <span>{{ formatCurrency(calculateSubtotal()) }}</span>
        </div>
      </div>

      <button type="submit" class="btn-generate">Generate Receipt</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus as PlusIcon, Trash2 as Trash2Icon } from 'lucide-vue-next'

const props = defineProps({
  receiptNumber: String,
  initialData: Object,
})

const emit = defineEmits(['generate'])

const formData = ref({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  customerAddress: '',
  items: [{ name: '', quantity: 1, price: 0 }],
  paymentMethod: '',
  paymentStatus: 'Paid',
})

// Load initial data if editing
if (props.initialData) {
  formData.value = {
    customerName: props.initialData.customer.name,
    customerEmail: props.initialData.customer.email,
    customerPhone: props.initialData.customer.phone,
    customerAddress: props.initialData.customer.address,
    items: props.initialData.items.map((item) => ({ ...item })),
    paymentMethod: props.initialData.paymentMethod,
    paymentStatus: props.initialData.paymentStatus,
  }
}

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const addItem = () => {
  formData.value.items.push({ name: '', quantity: 1, price: 0 })
}

const removeItem = (index) => {
  if (formData.value.items.length > 1) {
    formData.value.items.splice(index, 1)
  }
}

const calculateSubtotal = () => {
  return formData.value.items.reduce((sum, item) => {
    return sum + item.quantity * item.price
  }, 0)
}

const formatCurrency = (amount) => {
  return `₦${amount.toLocaleString('en-NG')}`
}

const generateReceipt = () => {
  const receipt = {
    receiptNumber: props.receiptNumber,
    date: new Date().toISOString(),
    customer: {
      name: formData.value.customerName,
      email: formData.value.customerEmail,
      phone: formData.value.customerPhone,
      address: formData.value.customerAddress,
    },
    items: formData.value.items,
    paymentMethod: formData.value.paymentMethod,
    paymentStatus: formData.value.paymentStatus,
    subtotal: calculateSubtotal(),
    tax: 0,
    total: calculateSubtotal(),
  }

  emit('generate', receipt)
}
</script>

<style scoped>
.form-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.receipt-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.receipt-header h2 {
  color: #667eea;
  margin: 0 0 0.5rem 0;
}

.date {
  color: #718096;
  margin: 0;
}

.section {
  margin-bottom: 2rem;
}

.section h3 {
  color: #1a202c;
  margin-bottom: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group select {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.btn-add {
  background: #48bb78;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.btn-add:hover {
  background: #38a169;
}

.items-table {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 50px;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  font-weight: 600;
  color: #4a5568;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 50px;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  align-items: center;
}

.table-row input {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
}

.table-row input:focus {
  outline: none;
  border-color: #667eea;
}

.total-cell {
  font-weight: 500;
  color: #1a202c;
}

.btn-remove {
  background: #fc8181;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover:not(:disabled) {
  background: #f56565;
}

.btn-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.totals {
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 1.1rem;
}

.grand-total {
  border-top: 2px solid #e2e8f0;
  margin-top: 0.5rem;
  padding-top: 1rem;
  font-weight: 700;
  font-size: 1.3rem;
  color: #667eea;
}

.btn-generate {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 2rem;
}

.btn-generate:hover {
  opacity: 0.9;
}
</style>
