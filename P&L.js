const goldSales = document.getElementById("goldSales");
const silverSales = document.getElementById("silverSales");
const goldPurchases = document.getElementById("goldPurchases");
const silverPurchases = document.getElementById("silverPurchases");
const closingBalance = document.getElementById("closingBalance");
const openingBalance = document.getElementById("openingBalance");

const grossProfit = document.getElementById("grossProfit");
const netProfit = document.getElementById("netProfit");

const calcNetProfit = (allSales, allPurchases) => {
  const grossProfitAmt = allSales - allPurchases;
  const formattedAmount = formatIndianCurrency(grossProfitAmt);
  grossProfit.textContent = formattedAmount;
};

const calcNetProfitForTally = (allSales, allPurchases) => {
  const grossProfitAmt = allSales - allPurchases;
  const tallyAmt = allPurchases + grossProfitAmt;
  console.log("Added profit amount", tallyAmt);
  document.getElementById("subTotalPurchases").textContent =
    formatIndianCurrency(tallyAmt);
  const formattedAmount = formatIndianCurrency(grossProfitAmt);
  grossProfit.textContent = formattedAmount;
  document.getElementById("grossProfitb/f").textContent = formattedAmount;
  netProfit.textContent = formatIndianCurrency(
    grossProfitAmt - allSundryExpenses - allSalaryAccount
  );
};

function formatIndianCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(amount);
}

let allSales = 0;
let allPurchases = 0;
let allSundryExpenses = 0;
let allSalaryAccount = 0;

const tallyZ = async () => {
  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;

  // Convert fromDate and toDate to Date objects
  const fromDateObj = fromDate ? new Date(fromDate) : null;
  const toDateObj = toDate ? new Date(toDate) : null;

  allSales = 0;
  allPurchases = 0;

  allSundryExpenses = 0;

  allSalaryAccount = 0;

  const paymentdata = await window.api.getPayments();
  console.log("payment data", paymentdata);

  const sundryExpenses = paymentdata.filter(
    (payment) => payment.type === "Sundry-Expenses"
  );

  const sundryExpensesByDate =
    fromDateObj && toDateObj
      ? sundryExpenses.filter(
          (entry) =>
            new Date(entry.date) >= fromDateObj &&
            new Date(entry.date) <= toDateObj
        )
      : sundryExpenses;

  sundryExpensesByDate.forEach((entry) => {
    allSundryExpenses += entry.amount;
  });
  document.getElementById("sundryExpenses").textContent =
    formatIndianCurrency(allSundryExpenses);

  const salaryAccount = paymentdata.filter(
    (payment) => payment.type === "Salary-Account"
  );

  const salaryAccountByDate =
    fromDateObj && toDateObj
      ? salaryAccount.filter(
          (entry) =>
            new Date(entry.date) >= fromDateObj &&
            new Date(entry.date) <= toDateObj
        )
      : salaryAccount;

  salaryAccountByDate.forEach((entry) => {
    allSalaryAccount += entry.amount;
  });
  document.getElementById("salaryAccount").textContent =
    formatIndianCurrency(allSalaryAccount);

  // sales total starts here
  let goldSalesBal = 0;

  const salesData = await window.api.getSales();

  const goldSalesData = salesData.filter(
    (sale) => sale.item === "Fine-Gold-Sale"
  );

  const goldSalesDataByDate =
    fromDateObj && toDateObj
      ? goldSalesData.filter(
          (entry) =>
            new Date(entry.date) >= fromDateObj &&
            new Date(entry.date) <= toDateObj
        )
      : goldSalesData;

  goldSalesDataByDate.forEach((entry) => {
    goldSalesBal += entry.amount;
  });

  const goldFormattedAmount = formatIndianCurrency(goldSalesBal);
  goldSales.textContent = goldFormattedAmount;
  allSales += goldSalesBal;

  let silverSalesBal = 0;

  const silverSalesData = salesData.filter(
    (sale) => sale.item === "Fine-Silver-Sale"
  );

  const silverSalesDataByDate =
    fromDateObj && toDateObj
      ? silverSalesData.filter(
          (entry) =>
            new Date(entry.date) >= fromDateObj &&
            new Date(entry.date) <= toDateObj
        )
      : silverSalesData;

  silverSalesDataByDate.forEach((entry) => {
    silverSalesBal += entry.amount;
  });

  const silverFormattedAmount = formatIndianCurrency(silverSalesBal);
  silverSales.textContent = silverFormattedAmount;
  allSales += silverSalesBal;

  // purchase total starts here
  let goldPurchaseBal = 0;

  const purchasedata = await window.api.getPurchases();
  console.log("purchase data", purchasedata);

  const goldPurchaseData = purchasedata.filter(
    (purchase) =>
      purchase.item === "Fine-Gold-Purchase" ||
      purchase.item === "Gold-Lagadi-Purchase"
  );

  const goldPurchaseDataByDate =
    fromDateObj && toDateObj
      ? goldPurchaseData.filter(
          (entry) =>
            new Date(entry.date) >= fromDateObj &&
            new Date(entry.date) <= toDateObj
        )
      : goldPurchaseData;

  goldPurchaseDataByDate.forEach((data) => {
    goldPurchaseBal += data.amount;
  });

  const formattedAmount = formatIndianCurrency(goldPurchaseBal);
  goldPurchases.textContent = formattedAmount;
  allPurchases += goldPurchaseBal;

  let silverPurchaseBal = 0;

  const silverPurchaseData = purchasedata.filter(
    (purchase) =>
      purchase.item === "Fine-Silver-Purchase" ||
      purchase.item === "Silver-Gat-Purchase"
  );

  const silverPurchaseDataByDate =
    fromDateObj && toDateObj
      ? silverPurchaseData.filter(
          (entry) =>
            new Date(entry.date) >= fromDateObj &&
            new Date(entry.date) <= toDateObj
        )
      : silverPurchaseData;

  silverPurchaseDataByDate.forEach((data) => {
    silverPurchaseBal += data.amount;
  });

  // const silverPurchaseData = await window.api.getPurchasesSilver();
  // silverPurchaseData.forEach((data) => {
  //   silverPurchaseBal += data.amount;
  // });
  allPurchases += silverPurchaseBal;
  const silverPurchaseformattedAmount = formatIndianCurrency(silverPurchaseBal);
  silverPurchases.textContent = silverPurchaseformattedAmount;

  let closingCashBal = 0;
  const cashData = await window.api.getCash();
  const cashAmountPayments = await window.api.getAmountPayments();
  const cashAmountReceipts = await window.api.getAmountReceipts();

  console.log("cashAmountPayments", cashAmountPayments);

  const payments = await window.api.getPayments();
  const paymentsForClosing = payments.filter(
    (payment) => payment.type !== "Bank-Payment"
  );

  const receipts = await window.api.getReceipts();
  const receiptsForClosing = receipts.filter(
    (receipt) => receipt.type !== "Bank-Receipt"
  );

  console.log("receipts for closing", receiptsForClosing);

  console.log("receipts", receipts);
  console.log("payments", payments);

  const salaryAndExpenses = payments.filter(
    (payment) =>
      payment.type === "Sundry-Expenses" || payment.type === "Salary-Account"
  );

  const salaryAndExpensesByDate =
    fromDateObj && toDateObj
      ? salaryAndExpenses.filter(
          (entry) =>
            new Date(entry.date) >= fromDateObj &&
            new Date(entry.date) <= toDateObj
        )
      : salaryAndExpenses;

  // salaryAndExpensesByDate.forEach((entry) => {
  //   closingCashBal -= entry.amount;
  // });

  cashData.forEach((cash) => {
    closingCashBal += cash.ledger_OpnBal;
  });

  const paymentsByDate =
    fromDateObj && toDateObj
      ? paymentsForClosing.filter(
          (entry) =>
            new Date(entry.date) >= fromDateObj &&
            new Date(entry.date) <= toDateObj
        )
      : paymentsForClosing;

  paymentsByDate.forEach((payment) => {
    closingCashBal -= payment.amount;
  });

  const receiptsByDate =
    fromDateObj && toDateObj
      ? receiptsForClosing.filter(
          (entry) =>
            new Date(entry.date) >= fromDateObj &&
            new Date(entry.date) <= toDateObj
        )
      : receiptsForClosing;

  receiptsByDate.forEach((receipt) => {
    closingCashBal += receipt.amount;
  });

  const closingBalanceFormattedAmt = formatIndianCurrency(closingCashBal);
  closingBalance.textContent = closingBalanceFormattedAmt;

  let openingBal = 0;
  const openingCashData = await window.api.getCash();
  openingCashData.forEach((data) => {
    openingBal += data.ledger_OpnBal;
  });

  document.getElementById("openingBalance").textContent =
    formatIndianCurrency(openingBal);

  document.getElementById("subTotalSales").textContent =
    formatIndianCurrency(allSales);
  document.getElementById("subTotalPurchases").textContent =
    formatIndianCurrency(allPurchases);

  calcNetProfitForTally(allSales, allPurchases);
};
tallyZ();
document.getElementById("searchBtn").addEventListener("click", tallyZ);

// const goldSales = document.getElementById("goldSales");
// const silverSales = document.getElementById("silverSales");
// const goldPurchases = document.getElementById("goldPurchases");
// const silverPurchases = document.getElementById("silverPurchases");

// function formatIndianCurrency(amount) {
//   const formatter = new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//   });
//   return formatter.format(amount);
// }
// let allSales = 0;
// let allPurchases = 0;
// const tallyZ = () => {
//   allSales = 0;
//   allPurchases = 0;
//   const netProfit = document.getElementById("netProfit");

//   const calcNetProfit = () => {
//     const netProfitAmt = allSales - allPurchases;
//     const formattedAmount = formatIndianCurrency(netProfitAmt);
//     netProfit.textContent = formattedAmount;
//   };
//   const calcNetProfitForTally = () => {
//     const netProfitAmt = allSales - allPurchases;
//     const tallyAmt = allPurchases + netProfitAmt;
//     console.log("Added profit amount", tallyAmt);
//     document.getElementById("subTotalPurchases").textContent =
//       formatIndianCurrency(tallyAmt);
//     const formattedAmount = formatIndianCurrency(netProfitAmt);
//     netProfit.textContent = formattedAmount;
//   };
//   const getAllSales = async () => {
//     const salesGold = async () => {
//       let goldSalesBal = 0;
//       const salesData = await window.api.getSalesGold();
//       salesData.forEach((data) => {
//         goldSalesBal += data.amount;
//       });
//       allSales += goldSalesBal;
//       console.log("all sales value in sales gold", allSales)
//       calcNetProfit();
//       document.getElementById("subTotalSales").textContent =
//         formatIndianCurrency(allSales);
//       const formattedAmount = formatIndianCurrency(goldSalesBal);
//       goldSales.textContent = formattedAmount;
//     };
//     salesGold();

//     const salesSilver = async () => {
//       let silverSalesBal = 0;
//       const salesData = await window.api.getSalesSilver();
//       salesData.forEach((data) => {
//         silverSalesBal += data.amount;
//       });
//       allSales += silverSalesBal;
//       calcNetProfit();
//       document.getElementById("subTotalSales").textContent =
//         formatIndianCurrency(allSales);
//       const formattedAmount = formatIndianCurrency(silverSalesBal);
//       silverSales.textContent = formattedAmount;
//     };
//     salesSilver();
//   };
//   getAllSales();

//   const getAllPurchases = async () => {
//     const purchasesGold = async () => {
//       let purchaseBal = 0;
//       const purchaseData = await window.api.getPurchasesGold();
//       console.log("purchase data", purchaseData);
//       purchaseData.forEach((data) => {
//         purchaseBal += data.amount;
//       });
//       allPurchases += purchaseBal;
//       calcNetProfit();
//       document.getElementById("subTotalPurchases").textContent =
//         formatIndianCurrency(allPurchases);
//       const formattedAmount = formatIndianCurrency(purchaseBal);
//       goldPurchases.textContent = formattedAmount;
//     };
//     purchasesGold();
//     const purchasesSilver = async () => {
//       let purchaseBal = 0;
//       const purchaseData = await window.api.getPurchasesSilver();
//       purchaseData.forEach((data) => {
//         purchaseBal += data.amount;
//       });
//       allPurchases += purchaseBal;
//       calcNetProfitForTally();
//       document.getElementById("subTotalPurchases").textContent =
//         formatIndianCurrency(allPurchases);
//       const formattedAmount = formatIndianCurrency(purchaseBal);
//       silverPurchases.textContent = formattedAmount;

//       // calcNetProfit();
//     };
//     purchasesSilver();
//   };
//   getAllPurchases();
//   console.log("all purchases value", allPurchases);
// };
// tallyZ();

// const subTotalSales = document.getElementById("subTotalSales");
// let salesTotal = 0;

// const subTotalPurchases = document.getElementById("subTotalPurchases");
// let purchaseTotal = 0;

// const calculateTotalSales = () => {};

// const openingBalance = document.getElementById("openingBalance");
// const openingCash = async () => {
//   let openingBal = 0;
//   const cashData = await window.api.getCash();
//   console.log("cashData", cashData);
//   cashData.forEach((data) => {
//     openingBal += data.ledger_OpnBal;
//   });

//   purchaseTotal += openingBal;
//   calcNetProfit();

//   const formattedAmount = formatIndianCurrency(openingBal);
//   openingBalance.textContent = formattedAmount;
// };
// openingCash();

// const closingBalance = document.getElementById("closingBalance");
// let closingCashBal = 0;
// const closingCash = async () => {
//   const cashData = await window.api.getCash();
//   const cashAmountPurchase = await window.api.getAmountPurchases();
//   const cashAmountSales = await window.api.getAmountSales();
//   const cashAmountPayments = await window.api.getAmountPayments();
//   const cashAmountReceipts = await window.api.getAmountReceipts();
//   cashData.forEach((cash) => {
//     closingCashBal += cash.ledger_OpnBal;
//   });
//   cashAmountPurchase.forEach((purchaseAmount) => {
//     closingCashBal -= purchaseAmount.amount;
//   });
//   cashAmountSales.forEach((saleAmount) => {
//     closingCashBal += saleAmount.amount;
//   });
//   cashAmountPayments.forEach((payment) => {
//     closingCashBal -= payment.amount;
//   });
//   cashAmountReceipts.forEach((receipt) => {
//     closingCashBal += receipt.amount;
//   });
//   salesTotal += closingCashBal;
//   calcNetProfit();

//   const formattedAmountSales = formatIndianCurrency(salesTotal);
//   subTotalSales.textContent = formattedAmountSales;
//   const formattedAmount = formatIndianCurrency(closingCashBal);
//   closingBalance.textContent = formattedAmount;
// };
// closingCash();

// const goldPurchases = document.getElementById("goldPurchases");
// const purchasesGold = async () => {
//   let purchaseBal = 0;
//   const purchaseData = await window.api.getPurchasesGold();
//   console.log("purchase data", purchaseData);
//   purchaseData.forEach((data) => {
//     purchaseBal += data.amount;
//   });
//   purchaseTotal += purchaseBal;
//   calcNetProfit();

//   const formattedAmountPurchases = formatIndianCurrency(purchaseTotal);
//   subTotalPurchases.textContent = formattedAmountPurchases;
//   const formattedAmount = formatIndianCurrency(purchaseBal);
//   goldPurchases.textContent = formattedAmount;
// };
// purchasesGold();

// const silverPurchases = document.getElementById("silverPurchases");
// const purchasesSilver = async () => {
//   let purchaseBal = 0;
//   const purchaseData = await window.api.getPurchasesSilver();
//   console.log("purchase data", purchaseData);
//   purchaseData.forEach((data) => {
//     purchaseBal += data.amount;
//   });
//   purchaseTotal += purchaseBal;
//   calcNetProfit();
//   console.log("purchase Amount", purchaseBal);
//   const formattedAmountPurchases = formatIndianCurrency(purchaseTotal);
//   subTotalPurchases.textContent = formattedAmountPurchases;
//   const formattedAmount = formatIndianCurrency(purchaseBal);
//   silverPurchases.textContent = formattedAmount;
// };
// purchasesSilver();

// const goldSales = document.getElementById("goldSales");
// let goldSalesBal = 0;
// const salesGold = async () => {
//   const salesData = await window.api.getSalesGold();
//   console.log("sales data", salesData);
//   salesData.forEach((data) => {
//     goldSalesBal += data.amount;
//   });
//   salesTotal += goldSalesBal;

//   const formattedAmountSales = formatIndianCurrency(salesTotal);
//   subTotalSales.textContent = formattedAmountSales;
//   const formattedAmount = formatIndianCurrency(goldSalesBal);
//   goldSales.textContent = formattedAmount;
// };
// salesGold();

// const silverSales = document.getElementById("silverSales");
// let silverSalesBal = 0;
// const salesSilver = async () => {
//   const salesData = await window.api.getSalesSilver();
//   console.log("sales data", salesData);
//   salesData.forEach((data) => {
//     silverSalesBal += data.amount;
//   });
//   salesTotal += silverSalesBal;
//   calcNetProfit();
//   console.log("Sub Total Sales", salesTotal);
//   const formattedAmountSales = formatIndianCurrency(salesTotal);
//   subTotalSales.textContent = formattedAmountSales;
//   console.log("sales Amount", silverSalesBal);
//   const formattedAmount = formatIndianCurrency(silverSalesBal);
//   silverSales.textContent = formattedAmount;
// };
// salesSilver();

// const receivable = document.getElementById("receivable");
// const salesOutstanding = async () => {
//   let salesBal = 0;
//   const outstandingData = await window.api.getOutstandingSales();
//   const receiptsData = await window.api.getReceipts();

//   outstandingData.forEach((data) => {
//     salesBal += data.outstanding;
//   });

//   receiptsData.forEach((receipt) => {
//     const matchingBal = outstandingData.find(
//       (balance) => balance.name === receipt.name
//     );
//     console.log("Matching balance: ", matchingBal);
//     if (matchingBal) {
//       salesBal -= receipt.amount;
//     }
//   });

//   const formattedAmount = formatIndianCurrency(salesBal);
//   receivable.textContent = formattedAmount;
// };
// salesOutstanding();

// let purchaseBal = 0;
// const outstandingPurchases = document.getElementById("payable");
// const purchasesOutstanding = async () => {
//   const outstandingData = await window.api.getOutstandingPurchases();
//   const paymentData = await window.api.getPayments();

//   outstandingData.forEach((data) => {
//     purchaseBal += data.outstanding;
//   });

//   paymentData.forEach((payment) => {
//     const matchingBal = outstandingData.find(
//       (balance) => balance.name === payment.name
//     );
//     console.log("Matching balance: ", matchingBal);
//     if (matchingBal) {
//       purchaseBal -= payment.amount;
//     }
//   });

//   const formattedAmount = formatIndianCurrency(purchaseBal);
//   outstandingPurchases.textContent = formattedAmount;
// };
// purchasesOutstanding();

// const calcNetProfit = () => {
//   const netProfit = document.getElementById("netProfit");
//   console.log("Purchase Total for profit", purchaseTotal);
//   const netProfitAmt = salesTotal - purchaseTotal;

//   const formattedAmount = formatIndianCurrency(netProfitAmt);
//   netProfit.textContent = formattedAmount;
// };

// function formatIndianCurrency(amount) {
//   const formatter = new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//   });
//   return formatter.format(amount);
// }
