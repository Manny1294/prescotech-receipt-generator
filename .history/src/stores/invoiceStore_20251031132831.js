import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInvoiceStore = defineStore('invoice', () => {
  const invoices = ref([])
  const currentInvoice = ref(null)

  const loadInvoices = async () => {
    try {
      const result = await window.storage.list('invoice:')
      if (result && result.keys) {
        const invoiceData = await Promise.all(
          result.keys.map(async (key) => {
            try {
              const data = await window.storage.get(key)
              return data ? JSON.parse(data.value) : null
            } catch {
              return null
            }
          }),
        )
        invoices.value = invoiceData.filter((inv) => inv !== null)
      }
    } catch () {
      console.log('No invoices yet')
    }
  }

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear()
    const count = invoices.value.length + 1
    return `CON-${year}-${String(count).padStart(4, '0')}`
  }

  const saveInvoice = async (invoice) => {
    try {
      await window.storage.set(`invoice:${invoice.invoiceNumber}`, JSON.stringify(invoice))
      await loadInvoices()
      return true
    } catch (error) {
      console.error('Error saving invoice:', error)
      return false
    }
  }

  const deleteInvoice = async (invoiceNumber) => {
    try {
      await window.storage.delete(`invoice:${invoiceNumber}`)
      await loadInvoices()
      return true
    } catch (error) {
      console.error('Error deleting invoice:', error)
      return false
    }
  }

  return {
    invoices,
    currentInvoice,
    loadInvoices,
    generateInvoiceNumber,
    saveInvoice,
    deleteInvoice,
  }
})
