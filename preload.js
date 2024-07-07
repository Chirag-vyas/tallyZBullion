const { contextBridge } = require("electron");
const dbMgr = require("./db/dbmgr");

// preload.js
const { ipcRenderer } = require("electron");
window.ipcRenderer = ipcRenderer;

const { dialog } = require("electron");

console.log("Exposing functions to renderer process");

contextBridge.exposeInMainWorld("api", {
  restoreDatabase: () => {
    ipcRenderer.send("restoreDatabase");
  },
  chooseDatabaseFile: () => {
    ipcRenderer.send("chooseDatabaseFile");
  },
  backupDatabase: () => {
    ipcRenderer.send("backupDatabase");
  },

  appQuit: () => {
    ipcRenderer.send("app-quit");
  },
  connectToDatabase: dbMgr.connectToDatabase,
  fetchDatabaseList: dbMgr.fetchDatabaseList,
  createNewDatabase: dbMgr.createNewDatabase,
  addTransaction: dbMgr.addTransaction,
  addLedgers: dbMgr.addLedgers,
  addSales: dbMgr.addSales,
  getSales: dbMgr.getSales,
  getSalesGold: dbMgr.getSalesGold,
  getSalesSilver: dbMgr.getSalesSilver,
  getSalesSilverCash: dbMgr.getSalesSilverCash,
  getSalesSilverBill: dbMgr.getSalesSilverBill,
  deleteSale: dbMgr.deleteSale,
  getLedgers: dbMgr.getLedgers,
  getLedgerNames: dbMgr.getLedgerNames,
  deleteLedgers: dbMgr.deleteLedgers,
  checkIfNameExists: dbMgr.checkIfNameExists,
  getCreditors: dbMgr.getCreditors,
  getDebtors: dbMgr.getDebtors,
  getCash: dbMgr.getCash,
  getSuggestions: dbMgr.getSuggestions,
  getOutstandingSales: dbMgr.getOutstandingSales,
  getAmountSales: dbMgr.getAmountSales,
  addPurchases: dbMgr.addPurchases,
  getPurchases: dbMgr.getPurchases,
  getPurchasesGold: dbMgr.getPurchasesGold,
  getPurchasesGoldCash: dbMgr.getPurchasesGoldCash,
  getPurchasesGoldBill: dbMgr.getPurchasesGoldBill,
  getPurchasesSilver: dbMgr.getPurchasesSilver,
  getPurchasesSilverCash: dbMgr.getPurchasesSilverCash,
  getPurchasesSilverBill: dbMgr.getPurchasesSilverBill,
  deletePurchase: dbMgr.deletePurchase,
  getOutstandingPurchases: dbMgr.getOutstandingPurchases,
  getAmountPurchases: dbMgr.getAmountPurchases,
  addPayments: dbMgr.addPayments,
  getPayments: dbMgr.getPayments,
  deletePayments: dbMgr.deletePayments,
  getAmountPayments: dbMgr.getAmountPayments,
  addReceipts: dbMgr.addReceipts,
  getReceipts: dbMgr.getReceipts,
  deleteReceipts: dbMgr.deleteReceipts,
  getAmountReceipts: dbMgr.getAmountReceipts,
  addStock: dbMgr.addStock,
  getStock: dbMgr.getStock,
  deleteStock: dbMgr.deleteStock,
  getAmountStock: dbMgr.getAmountStock,
  getFineGold: dbMgr.getFineGold,
  getSalesGoldCash: dbMgr.getSalesGoldCash,
  getSalesGoldBill: dbMgr.getSalesGoldBill,
  getFineSilver: dbMgr.getFineSilver,
  getGoldLagadi: dbMgr.getGoldLagadi,
  getSilverGat: dbMgr.getSilverGat,
  getOutstandingPayments: dbMgr.getOutstandingPayments,
  getOutstandingReceipts: dbMgr.getOutstandingReceipts,
});
