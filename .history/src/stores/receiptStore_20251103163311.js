const loadReceipts = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('receipts')) || []
    receipts.value = stored
  } catch {
    receipts.value = []
  }
}

const saveReceipt = async (receipt) => {
  try {
    const stored = JSON.parse(localStorage.getItem('receipts')) || []
    stored.push(receipt)
    localStorage.setItem('receipts', JSON.stringify(stored))
    receipts.value = stored
    return true
  } catch (error) {
    console.error('Error saving receipt:', error)
    return false
  }
}

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
