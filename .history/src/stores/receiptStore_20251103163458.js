import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReceiptStore = defineStore('receipt', () => {
  const receipts = ref([])
  const currentReceipt = ref(null)

  // 🔹 Load all saved receipts from localStorage
  const loadReceipts = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('receipts')) || []
      receipts.value = stored
    } catch (error) {
      console.error('Error loading receipts:', error)
      receipts.value = []
    }
  }

  // 🔹 Generate unique receipt number (e.g., RCP-2025-0001)
  const generateReceiptNumber = () => {
    const year = new Date().getFullYear()
    const count = receipts.value.length + 1
    return `RCP-${year}-${String(count).padStart(4, '0')}`
  }

  // 🔹 Save a new receipt to localStorage
  const saveReceipt = async (receipt) => {
    try {
      const stored = JSON.parse(localStorage.getItem('receipts')) || []

      // Prevent duplicates by receiptNumber
      const existingIndex = stored.findIndex((r) => r.receiptNumber === receipt.receiptNumber)

      if (existingIndex !== -1) {
        stored[existingIndex] = receipt // update
      } else {
        stored.push(receipt) // add new
      }

      localStorage.setItem('receipts', JSON.stringify(stored))
      receipts.value = stored
      return true
    } catch (error) {
      console.error('Error saving receipt:', error)
      return false
    }
  }

  // 🔹 Delete a receipt from localStorage
  const deleteReceipt = async (receiptNumber) => {
    try {
      const stored = JSON.parse(localStorage.getItem('receipts')) || []
      const filtered = stored.filter((r) => r.receiptNumber !== receiptNumber)
      localStorage.setItem('receipts', JSON.stringify(filtered))
      receipts.value = filtered
      return true
    } catch (error) {
      console.error('Error deleting receipt:', error)
      return false
    }
  }

  // 🔹 Optional: clear all receipts (for testing)
  const clearAllReceipts = () => {
    localStorage.removeItem('receipts')
    receipts.value = []
  }

  // 🔹 Run once on store init
  loadReceipts()

  return {
    receipts,
    currentReceipt,
    loadReceipts,
    generateReceiptNumber,
    saveReceipt,
    deleteReceipt,
    clearAllReceipts,
  }
})
