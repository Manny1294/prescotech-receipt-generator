import { defineStore } from 'pinia'

export const useReceiptStore = defineStore('receipt', {
  state: () => ({
    receipts: JSON.parse(localStorage.getItem('receipts')) || [],
  }),

  actions: {
    generateReceiptNumber() {
      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '')
      const randomPart = Math.floor(Math.random() * 9000) + 1000
      return `RCT-${datePart}-${randomPart}`
    },

    async saveReceipt(receiptData) {
      try {
        const newReceipt = {
          ...receiptData,
          id: Date.now(),
          receiptNumber: receiptData.receiptNumber || this.generateReceiptNumber(),
          dateIssued: new Date().toISOString().slice(0, 10),
        }

        this.receipts.push(newReceipt)
        localStorage.setItem('receipts', JSON.stringify(this.receipts))
        return true
      } catch (error) {
        console.error('Error saving receipt:', error)
        return false
      }
    },

    async deleteReceipt(id) {
      try {
        this.receipts = this.receipts.filter((r) => r.id !== id)
        localStorage.setItem('receipts', JSON.stringify(this.receipts))
      } catch (error) {
        console.error('Error deleting receipt:', error)
      }
    },

    async fetchReceipts() {
      try {
        const stored = JSON.parse(localStorage.getItem('receipts')) || []
        this.receipts = stored
      } catch (error) {
        console.error('Error fetching receipts:', error)
      }
    },

    getReceiptById(id) {
      return this.receipts.find((r) => r.id === id)
    },
  },
})
