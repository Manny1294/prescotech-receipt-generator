<template>
  <div class="invoice-list-container">
    <h2>Recent Invoices</h2>

    <div v-if="loading" class="loading">Loading invoices...</div>

    <div v-else-if="invoiceStore.invoices.length === 0" class="empty-state">
      <FileTextIcon :size="64" class="empty-icon" />
      <p>No invoices yet</p>
      <p class="empty-subtext">Create your first invoice to get started</p>
    </div>

    <div v-else class="invoices-grid">
      <div
        v-for="invoice in invoiceStore.invoices"
        :key="invoice.invoiceNumber"
        class="invoice-card"
      >
        <div class="invoice-card-header">
          <h3>{{ invoice.invoiceNumber }}</h3>
          <span class="invoice-date">{{ formatDate(invoice.date) }}</span>
        </div>

        <div class="invoice-card-body">
          <p class="customer-name">{{ invoice.customer.name }}</p>
          <p class="invoice-total">{{ formatCurrency(invoice.total) }}</p>
          <p class="items-count">{{ invoice.items.length }} item(s)</p>
        </div>

        <div class="invoice-card-actions">
          <button @click="viewInvoice(invoice)" class="btn-view">View</button>
          <button @click="downloadInvoice(invoice)" class="btn-download-small">
            <DownloadIcon :size="16" />
          </button>
          <button @click="deleteInvoice(invoice.invoiceNumber)" class="btn-delete">
            <Trash2Icon :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  FileText as FileTextIcon,
  Download as DownloadIcon,
  Trash2 as Trash2Icon,
} from 'lucide-vue-next'
import { useInvoiceStore } from '../stores/invoiceStore'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const invoiceStore = useInvoiceStore()
const loading = ref(true)

onMounted(async () => {
  await invoiceStore.loadInvoices()
  loading.value = false
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatCurrency = (amount) => {
  return `₦${amount.toLocaleString('en-NG')}`
}

const viewInvoice = (invoice) => {
  // You can implement a modal or navigate to a view page
  alert(`Viewing invoice: ${invoice.invoiceNumber}`)
}

const downloadInvoice = (invoice) => {
  const doc = new jsPDF()

  // Company Info
  doc.setFontSize(20)
  doc.setTextColor(102, 126, 234)
  doc.text('CONPAY', 20, 20)

  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text('123 Business Street', 20, 28)
  doc.text('Lagos, Nigeria', 20, 33)
  doc.text('Phone: +234 800 000 0000', 20, 38)
  doc.text('Email: info@conpay.com', 20, 43)

  // Invoice Details
  doc.setFontSize(24)
  doc.setTextColor(102, 126, 234)
  doc.text('INVOICE', 140, 20)

  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 140, 28)
  doc.text(`Date: ${formatDate(invoice.date)}`, 140, 33)

  // Customer Info
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('Bill To:', 20, 60)

  doc.setFont(undefined, 'normal')
  doc.setFontSize(10)
  doc.text(invoice.customer.name, 20, 68)
  doc.text(invoice.customer.address, 20, 73)
  doc.text(invoice.customer.phone, 20, 78)
  if (invoice.customer.email) {
    doc.text(invoice.customer.email, 20, 83)
  }

  // Items Table
  const tableData = invoice.items.map((item) => [
    item.name,
    item.quantity,
    formatCurrency(item.price),
    formatCurrency(item.quantity * item.price),
  ])

  doc.autoTable({
    startY: 95,
    head: [['Item', 'Quantity', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [102, 126, 234] },
  })

  // Totals
  const finalY = doc.lastAutoTable.finalY + 10
  doc.text(`Subtotal: ${formatCurrency(invoice.subtotal)}`, 140, finalY)
  doc.text(`Tax: ${formatCurrency(invoice.tax)}`, 140, finalY + 7)

  doc.setFont(undefined, 'bold')
  doc.setFontSize(12)
  doc.text(`Total: ${formatCurrency(invoice.total)}`, 140, finalY + 15)

  // Footer
  doc.setFont(undefined, 'italic')
  doc.setFontSize(10)
  doc.text('Thank you for your purchase!', 105, finalY + 35, { align: 'center' })

  doc.save(`${invoice.invoiceNumber}.pdf`)
}

const deleteInvoice = async (invoiceNumber) => {
  if (confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
    await invoiceStore.deleteInvoice(invoiceNumber)
  }
}
</script>

<style scoped>
.invoice-list-container {
  margin-top: 3rem;
}

.invoice-list-container h2 {
  font-size: 1.8rem;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
}

.empty-icon {
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.empty-state p {
  margin: 0.5rem 0;
  font-size: 1.2rem;
}

.empty-subtext {
  font-size: 1rem;
  color: #a0aec0;
}

.invoices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.invoice-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.invoice-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.invoice-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.invoice-card-header h3 {
  color: #667eea;
  margin: 0;
  font-size: 1.1rem;
}

.invoice-date {
  color: #718096;
  font-size: 0.9rem;
}

.invoice-card-body {
  margin-bottom: 1rem;
}

.customer-name {
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.invoice-total {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin: 0.5rem 0;
}

.items-count {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

.invoice-card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view {
  flex: 1;
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-view:hover {
  background: #5a67d8;
}

.btn-download-small,
.btn-delete {
  background: #e2e8f0;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-download-small:hover {
  background: #cbd5e0;
}

.btn-delete {
  background: #fed7d7;
}

.btn-delete:hover {
  background: #fc8181;
  color: white;
}
</style>
