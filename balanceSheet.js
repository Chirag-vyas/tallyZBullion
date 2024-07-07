const creditorsBalance = document.getElementById("creditors-balance");
let creditBal = 0;
const creditors = async () => {
  const creditorsData = await window.api.getCreditors();
  console.log(creditorsData);
  creditorsData.forEach((creditor) => {
    creditBal += creditor.ledger_OpnBal;
  });
  const formattedAmount = formatIndianCurrency(creditBal);
  creditorsBalance.textContent = formattedAmount;
};
creditors();

const debtorsBalance = document.getElementById("debtors-balance");
let debitBal = 0;
const debtors = async () => {
  const debtorsData = await window.api.getDebtors();
  const outstandingData = await window.api.getOutstandingPurchases();
  const receiptsData = await window.api.getReceipts();
  console.log(debtorsData);
  debtorsData.forEach((debtor) => {
    debitBal += debtor.ledger_OpnBal;
  });
  // outstandingData.forEach((data) => {
  //   debitBal += data.outstanding;
  // });

  // receiptsData.forEach((receipt) => {
  //   const matchingBal = outstandingData.find(
  //     (balance) => balance.name === receipt.name
  //   );
  //   if (matchingBal) {
  //     debitBal -= receipt.amount;
  //   }
  // });
  const formattedAmount = formatIndianCurrency(debitBal);
  debtorsBalance.textContent = formattedAmount;
};
debtors();

const cashInHand = document.getElementById("cash-in-hand");
let cashBal = 0;
const cash = async () => {
  const cashData = await window.api.getCash();
  const cashAmountPurchase = await window.api.getAmountPurchases();
  const cashAmountSales = await window.api.getAmountSales();
  const cashAmountPayments = await window.api.getAmountPayments();
  const cashAmountReceipts = await window.api.getAmountReceipts();
  cashData.forEach((cash) => {
    cashBal += cash.ledger_OpnBal;
  });
  cashAmountPurchase.forEach((purchaseAmount) => {
    cashBal -= purchaseAmount.amount;
  });
  cashAmountSales.forEach((saleAmount) => {
    cashBal += saleAmount.amount;
  });
  cashAmountPayments.forEach((payment) => {
    cashBal -= payment.amount;
  });
  cashAmountReceipts.forEach((receipt) => {
    cashBal += receipt.amount;
  });
  const formattedAmount = formatIndianCurrency(cashBal);
  cashInHand.textContent = formattedAmount;
};
cash();

const stockBalance = document.getElementById("stockBalance");

const stock = async () => {
  let stockBal = 0;
  const stockData = await window.api.getAmountStock();
  const outstandingPurchases = await window.api.getOutstandingPurchases();
  const amountPurchases = await window.api.getAmountPurchases();
  const outstandingSales = await window.api.getOutstandingSales();
  const amountSales = await window.api.getAmountSales();
  console.log("Stock data :", stockData);
  stockData.forEach((item) => {
    stockBal += item.amount;
  });
  outstandingPurchases.forEach((purchase) => {
    stockBal += purchase.outstanding;
  });
  amountPurchases.forEach((amountP) => {
    stockBal += amountP.amount;
  });
  outstandingSales.forEach((sale) => {
    stockBal -= sale.outstanding;
  });
  amountSales.forEach((amountS) => {
    stockBal -= amountS.amount;
  });
  console.log("stockBal: ", stockBal);
  const formattedAmount = formatIndianCurrency(stockBal);
  stockBalance.textContent = formattedAmount;
};
stock();

const outstandingSales = document.getElementById("salesOutstanding");
const salesOutstanding = async () => {
  let salesBal = 0;
  const outstandingData = await window.api.getOutstandingSales();
  const receiptsData = await window.api.getReceipts();

  outstandingData.forEach((data) => {
    salesBal += data.outstanding;
  });

  receiptsData.forEach((receipt) => {
    const matchingBal = outstandingData.find(
      (balance) => balance.name === receipt.name
    );
    console.log("Matching balance: ", matchingBal);
    if (matchingBal) {
      salesBal -= receipt.amount;
    }
  });

  const formattedAmount = formatIndianCurrency(salesBal);
  outstandingSales.textContent = formattedAmount;
};
salesOutstanding();

let purchaseBal = 0;
const outstandingPurchases = document.getElementById("purchasesOutstanding");
const purchasesOutstanding = async () => {
  const outstandingData = await window.api.getOutstandingPurchases();
  const paymentData = await window.api.getPayments();

  outstandingData.forEach((data) => {
    purchaseBal += data.outstanding;
  });

  paymentData.forEach((payment) => {
    const matchingBal = outstandingData.find(
      (balance) => balance.name === payment.name
    );
    console.log("Matching balance: ", matchingBal);
    if (matchingBal) {
      purchaseBal -= payment.amount;
    }
  });

  const formattedAmount = formatIndianCurrency(purchaseBal);
  outstandingPurchases.textContent = formattedAmount;
};
purchasesOutstanding();

/*const idToMinus = document.getElementById("cash-in-hand");
const cashMinus = async () => {
  let cashBal = 0;
  const cashData = await window.api.getAmountPurchases();
  console.log(cashData);
  cashData.forEach((data) => {
    cashBal -= data.amount;
  });
  outstandingPurchases.textContent = cashBal;
};
cashMinus();*/

function formatIndianCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(amount);
}
