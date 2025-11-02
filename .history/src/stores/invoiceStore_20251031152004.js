import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInvoiceStore = defineStore('invoice', () => {
  // ===== STATE =====
  // Holds all saved invoices (loaded from localStorage)
  const invoices = ref([])
  // Tracks the currently selected or edited invoice
  const currentInvoice = ref(null)

  // ===== LOAD INVOICES =====
  // Fetches all invoices saved in localStorage
  const loadInvoices = () => {
    try {
      const allKeys = Object.keys(localStorage)
      // Filter only keys that belong to invoices
      const invoiceKeys = allKeys.filter((key) => key.startsWith('invoice:'))

      // Map through all invoice keys and parse them back into objects
      const invoiceData = invoiceKeys.map((key) => {
        const item = localStorage.getItem(key)
        try {
          return item ? JSON.parse(item) : null
        } catch {
          return null // skip corrupted entries
        }
      })

      // Filter out nulls and assign to state
      invoices.value = invoiceData.filter((inv) => inv !== null)
    } catch (error) {
      console.log('No invoices found yet')
    }
  }

  // ===== GENERATE UNIQUE INVOICE NUMBER =====
  // Creates IDs like: CON-2025-0001
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear()
    const count = invoices.value.length + 1
    return `CON-${year}-${String(count).padStart(4, '0')}`
  }

  // ===== SAVE INVOICE =====
  // Saves a new or updated invoice into localStorage
  const saveInvoice = (invoice) => {
    try {
      localStorage.setItem(`invoice:${invoice.invoiceNumber}`, JSON.stringify(invoice))
      loadInvoices() // refresh list after saving
      return true
    } catch (error) {
      console.error('Error saving invoice:', error)
      return false
    }
  }

  // ===== DELETE INVOICE =====
  // Removes an invoice from localStorage by its unique ID
  const deleteInvoice = (invoiceNumber) => {
    try {
      localStorage.removeItem(`invoice:${invoiceNumber}`)
      loadInvoices() // refresh list after deletion
      return true
    } catch (error) {
      console.error('Error deleting invoice:', error)
      return false
    }
  }

  // ===== INITIAL LOAD =====
  // Automatically load existing invoices when the store is first used
  loadInvoices()

  // ===== RETURN STORE =====
  return {
    invoices,
    currentInvoice,
    loadInvoices,
    generateInvoiceNumber,
    saveInvoice,
    deleteInvoice,
  }
})
