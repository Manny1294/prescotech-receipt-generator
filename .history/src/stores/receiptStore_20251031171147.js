import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useReceiptStore = defineStore('receipt', () => {
  const receipts = ref([])
  const currentReceipt = ref(null)

  const loadReceipts = async () => {
    try {
      const result = await window.storage.list('receipt:')
      if (result && result.keys) {
        const receiptData = await Promise.all(
          result.keys.map(async (key) => {
            try {
              const data = await window.storage.get(key)
              return data ? JSON.parse(data.value) : null
            } catch {
              return null
            }
          }),
        )
        receipts.value = receiptData.filter((rec) => rec !== null)
      }
    } catch (error) {
      console.log('No receipts yet')
    }
  }

  const generateReceiptNumber = () => {
    const year = new Date().getFullYear()
    const count = receipts.value.length + 1
    return `RCP-${year}-${String(count).padStart(4, '0')}`
  }

  const saveReceipt = async (receipt) => {
    try {
      await window.storage.set(`receipt:${receipt.receiptNumber}`, JSON.stringify(receipt))
      await loadReceipts()
      return true
    } catch (error) {
      console.error('Error saving receipt:', error)
      return false
    }
  }

  const deleteReceipt = async (receiptNumber) => {
    try {
      await window.storage.delete(`receipt:${receiptNumber}`)
      await loadReceipts()
      return true
    } catch (error) {
      console.error('Error deleting receipt:', error)
      return false
    }
  }

  return {
    receipts,
    currentReceipt,
    loadReceipts,
    generateReceiptNumber,
    saveReceipt,
    deleteReceipt,
  }
})
