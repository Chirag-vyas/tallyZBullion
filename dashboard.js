const fineGold = document.getElementById("fine-gold");
const fineSilver = document.getElementById("fine-silver");
const goldLagadi = document.getElementById("gold-lagadi");
const silverGat = document.getElementById("silver-gat");

const closeButton = document.getElementById("appCloseBtn"); // Replace 'closeButton' with your button's ID

closeButton.addEventListener("click", () => {
  window.api.appQuit();
  console.log("close button clicked!");
});

const settingsBtn = document.getElementById("settings");
const settingsCloseBtn = document.getElementById("settingsCloseBtn");

settingsCloseBtn.addEventListener("click", () => {
  document.getElementById("settingSections").classList.add("hidden");
});

settingsBtn.addEventListener("click", () => {
  document.getElementById("settingSections").classList.remove("hidden");
});

const backUpBtn = document.getElementById("databaseBackup");

backUpBtn.addEventListener("click", () => {
  window.api.backupDatabase();
});

const restoreBtn = document.getElementById("databaseRestore");

// restoreBtn.addEventListener("click", () => {
//   window.api.chooseDatabaseFile();
// });

// const companyName = document.getElementById("companyName").value;
// const fromDate = document.getElementById("fromDate").value;
// const toDate = document.getElementById("toDate").value;

// const createCompanyBtn = document.getElementById("createCompanyBtn");

// createCompanyBtn.addEventListener("click", async () => {
//   const companyName = document.getElementById("companyName").value;
//   const fromDate = document.getElementById("fromDate").value;
//   const toDate = document.getElementById("toDate").value;
//   await window.api.createNewDatabase(companyName, fromDate, toDate);
//   try {
//     console.log("Button Clicked!");
//     // Your existing code...
//   } catch (error) {
//     console.error(error);
//   }
// });
// fetch database list
// const fetchDatabase = async () => {
//   // const databaseList = await window.api.fetchDatabaseList();
//   console.log("databaseList", databaseList);
//   databaseList.forEach((database) => {
//     const dbList = document.createElement("ul");
//     dbList.classList.add("py-1", "text-white");

//     const li = document.createElement("li");

//     const a = document.createElement("a");
//     a.classList.add("cursor-pointer", "hover:text-black");
//     a.textContent = database;

//     li.appendChild(a);
//     dbList.appendChild(li);
//     document.getElementById("databaseList").appendChild(dbList);
//   });
// };
// fetchDatabase();

// function handleDatabaseClick(event) {
//   event.preventDefault();

//   const selectedDatabase = event.target.textContent;

//   // Connect to the selected database using 'window.api'
//   window.api.connectToDatabase(selectedDatabase);

//   console.log("switched to the database", selectedDatabase);
//   // You can now use 'db' for your queries or perform other actions
//   // Optionally, you can notify the main process about the switch
//   // ipcRenderer.send("switchDatabase", selectedDatabase);
// }

// Attach the click event listener to the database list
// document.addEventListener("DOMContentLoaded", () => {
//   const databaseList = document.getElementById("databaseList");

//   if (databaseList) {
//     // Attach the click event listener to each anchor tag within the list
//     const anchorTags = databaseList.getElementsByTagName("a");
//     for (const anchorTag of anchorTags) {
//       anchorTag.addEventListener("click", handleDatabaseClick);
//     }
//   } else {
//     console.error("Database list element not found");
//   }
// });

// document
//   .getElementById("databaseList")
//   .addEventListener("click", handleDatabaseClick);
// settingsBtn.addEventListener("click", () => {
//   settingsBtn.disabled = true;
//   // document.getElementById("content").style.filter = "blur(5px)";

//   window.api.openSettings();
//   // Listen for the "settingsClosed" event
//   window.api.onSettingsClosed(() => {
//     // Re-enable the button when the settings window is closed
//     settingsBtn.disabled = false;
//     document.getElementById("content").style.removeProperty("filter");
//   });
// });

const stockReport = async () => {
  let fineGoldWeight = 0;
  let fineSilverWeight = 0;

  // All the gold transactions
  const fineGoldStock = await window.api.getFineGold();
  fineGoldStock.forEach((entry) => {
    fineGoldWeight += entry.fine_weight;
  });

  const goldSales = await window.api.getSalesGold();
  goldSales.forEach((entry) => {
    fineGoldWeight -= entry.fine_weight;
  });

  // const purchases = await window.api.getPurchases();

  // console.log("all Purchases only", purchases);

  // const lagadiPurchase = purchases.filter((purchase) => {
  //   purchase.item === "Gold-Lagadi-Purchase";
  // });

  // lagadiPurchase.forEach((entry) => {
  //   fineGoldWeight += entry.amount;
  // });

  // console.log("gold lagadi only", lagadiPurchase);

  // goldPurchases.forEach((entry) => {
  //   fineGoldWeight += entry.fine_weight;
  // });

  const purchases = await window.api.getPurchases();
  console.log("purchases only", purchases);

  const lagadiPurchases = purchases.filter(
    (entry) => entry.item === "Gold-Lagadi-Purchase"
  );
  lagadiPurchases.forEach((entry) => {
    fineGoldWeight += entry.refine_weight;
  });

  const finePurchases = purchases.filter(
    (entry) => entry.item === "Fine-Gold-Purchase"
  );
  finePurchases.forEach((entry) => {
    fineGoldWeight += entry.fine_weight;
  });

  // goldPurchases.forEach((entry) => {
  //   if (entry.refine_weight > 0) {
  //     fineGoldWeight += entry.refine_weight;
  //   } else {
  //     fineGoldWeight += entry.fine_weight;
  //   }
  // });

  // All the silver transactions
  const fineSilverStock = await window.api.getFineSilver();
  fineSilverStock.forEach((entry) => {
    fineSilverWeight += entry.fine_weight;
  });

  const silverSales = await window.api.getSalesSilver();
  silverSales.forEach((entry) => {
    fineSilverWeight -= entry.fine_weight;
  });

  const silverPurchases = await window.api.getPurchasesSilver();
  silverPurchases.forEach((entry) => {
    fineSilverWeight += entry.fine_weight;
  });

  document.getElementById("fine-gold").innerHTML = fineGoldWeight.toFixed(3);
  document.getElementById("fine-silver").innerHTML =
    fineSilverWeight.toFixed(3);
};

stockReport();

const cashBal = async () => {
  const closingBalance = document.getElementById("closingBalance");
  let closingCashBal = 0;
  const cashData = await window.api.getCash();
  //   const cashAmountSales = await window.api.getAmountSales();
  //   const cashAmountPurchase = await window.api.getAmountPurchases();
  const cashAmountPayments = await window.api.getAmountPayments();
  const cashAmountReceipts = await window.api.getAmountReceipts();

  //   console.log("cashData", cashData);
  //   console.log("cashAmountSales", cashAmountSales);
  //   console.log("cashAmountPurchase", cashAmountPurchase);

  cashData.forEach((cash) => {
    closingCashBal += cash.ledger_OpnBal;
  });

  const payments = await window.api.getPayments();

  const salaryAndExpenses = payments.filter(
    (payment) =>
      payment.type === "Sundry-Expenses" || payment.type === "Salary-Account"
  );

  console.log("salary And Expenses", salaryAndExpenses);

  salaryAndExpenses.forEach((entry) => {
    closingCashBal -= entry.amount;
  });

  //   cashAmountSales.forEach((saleAmount) => {
  //     closingCashBal += saleAmount.amount;
  //   });

  //   cashAmountPurchase.forEach((purchaseAmount) => {
  //     closingCashBal -= purchaseAmount.amount;
  //   });

  console.log("closingCashBal", closingCashBal);

  cashAmountPayments.forEach((payment) => {
    closingCashBal -= payment.amount;
  });
  cashAmountReceipts.forEach((receipt) => {
    closingCashBal += receipt.amount;
  });

  const closingBalanceFormattedAmt = formatIndianCurrency(closingCashBal);
  closingBalance.textContent = closingBalanceFormattedAmt;
};

cashBal();

function formatIndianCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(amount);
}
