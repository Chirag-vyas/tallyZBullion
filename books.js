// document.getElementById("adjustSizeButton").addEventListener("click", () => {
//   window.api.setWindowSize(180, 400); // Adjust the width and height to your desired values
// });

const calcClosing = () => {
  if (totalCredit > totalDebit) {
    const closingCredit = totalCredit - totalDebit;
    document.getElementById("closingCredit").textContent =
      formatIndianCurrency(closingCredit);
    document.getElementById("closingDebit").textContent =
      formatIndianCurrency(0);
  } else if (totalCredit < totalDebit) {
    const closingDebit = totalDebit - totalCredit;
    document.getElementById("closingDebit").textContent =
      formatIndianCurrency(closingDebit);
    document.getElementById("closingCredit").textContent =
      formatIndianCurrency(0);
  } else {
    document.getElementById("closingCredit").textContent =
      formatIndianCurrency(0);
    document.getElementById("closingDebit").textContent =
      formatIndianCurrency(0);
  }
};

const searchBtn = document.getElementById("searchBtn");
const searchName = document.getElementById("searchName");

// async function resizeWindow() {
//   const success = await window.api.setWindowSize(1000, 800);
//   if (success) {
//     console.log("Window resized successfully");
//   } else {
//     console.error("Failed to resize window");
//   }
// }
const booksList = document.getElementById("booksData");
// let searchName = document.getElementById("searchName");
// document.addEventListener("keydown", (event) => {
//   const isAlphabetKey = /[a-zA-Z]/.test(event.key);
//   if (isAlphabetKey) {
//     searchName.focus(); // Use focus() instead of select()
//   }
// });
let totalDebit = 0;
let totalCredit = 0;

// var urlStr = window.location.toLocaleString();
// var url = new URL(urlStr);
// var name1 = url.searchParams.get("name");
// console.log(name1);

const tallyZ = async () => {
  document.getElementById("loadingAnimation").style.display = "block"; // Show loading animation

  totalDebit = 0;
  totalCredit = 0;
  try {
    const sales = await window.api.getSales();
    const purchases = await window.api.getPurchases();
    const receipts = await window.api.getReceipts();
    const payments = await window.api.getPayments();

    const entries = sales.concat(purchases, receipts, payments);

    console.log("All entries", entries);

    // Sort entries by date in ascending order
    entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    entries.forEach((entry) => {
      const debitEntry =
        entry.saleType === "Cash" ||
        entry.saleType === "Bill" ||
        entry.type === "Cash-Payment" ||
        entry.type === "Bank-Payment";
      const creditEntry =
        entry.purchaseType === "Cash" ||
        entry.purchaseType === "Bill" ||
        entry.type === "Cash-Receipt" ||
        entry.type === "Bank-Receipt";
      const isNotCredit =
        entry.purchaseType !== "Credit" && entry.saleType !== "Credit";
      if (isNotCredit) {
        const tr = document.createElement("tr");
        tr.className = "text-xl border-b-2 border-gray-300 hover:bg-blue-300";

        const dateCell = document.createElement("td");
        dateCell.className = "px-3 py-3 border-r border-gray-300";
        dateCell.textContent = entry.date;
        tr.appendChild(dateCell);

        const nameCell = document.createElement("td");
        nameCell.className = "px-3 py-3 border-r border-gray-300";
        nameCell.textContent = entry.name;
        tr.appendChild(nameCell);

        const productCell = document.createElement("td");
        productCell.className = "px-6 py-3 border-r border-gray-300";
        productCell.textContent = entry.item || entry.type;

        // Add the tag for cash sale
        if (entry.saleType === "Cash") {
          const cashTag = document.createElement("span");
          cashTag.className = "ptag tag-cash";
          cashTag.textContent = "Cash";
          productCell.appendChild(cashTag);
        }

        // Add the tag for sale by bill
        if (entry.saleType === "Bill") {
          const billTag = document.createElement("span");
          billTag.className = "ptag tag-bill";
          billTag.textContent = "Bill";
          productCell.appendChild(billTag);
        }

        // Add the tag for cash purchase
        if (entry.purchaseType === "Cash") {
          const cashTag = document.createElement("span");
          cashTag.className = "ptag tag-cash";
          cashTag.textContent = "Cash";
          productCell.appendChild(cashTag);
        }

        // Add the tag for purchase by bill
        if (entry.purchaseType === "Bill") {
          const billTag = document.createElement("span");
          billTag.className = "ptag tag-bill";
          billTag.textContent = "Bill";
          productCell.appendChild(billTag);
        }

        tr.appendChild(productCell);

        if (creditEntry) {
          console.log("Credit Entry", creditEntry);
          // Add an empty cell for purchase or receipt
          const emptyCell = document.createElement("td");
          emptyCell.className = "text-right px-6 py-3 border-r border-gray-300";
          emptyCell.textContent = "";
          tr.appendChild(emptyCell);
        }

        const amountCell = document.createElement("td");
        amountCell.className = "text-right px-6 py-3 border-r border-gray-300";
        amountCell.textContent = formatIndianCurrency(entry.amount);
        tr.appendChild(amountCell);

        if (debitEntry) {
          // If it's a credit entry, remove the empty cell and append the amount cell
          tr.removeChild(tr.lastElementChild);
          tr.appendChild(amountCell);
        }

        booksList.appendChild(tr);

        if (debitEntry) {
          totalDebit += entry.amount;
        }
        if (creditEntry) {
          totalCredit += entry.amount;
        }
      }
    });

    document.getElementById("totalDebit").textContent =
      formatIndianCurrency(totalDebit);
    document.getElementById("totalCredit").textContent =
      formatIndianCurrency(totalCredit);
    calcClosing();
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    console.log("loading animation ended..");
    document.getElementById("loadingAnimation").style.display = "none"; // Hide loading animation
  }
};

if (searchName.value == "") {
  tallyZ();
}

// Listen for changes in the input field

const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");

const ledgers = window.api.getLedgers();
console.log("promise ledgers", ledgers);

searchBtn.addEventListener("click", async () => {
  const ledgers = await window.api.getLedgers();
  console.log("awaited ledgers", ledgers);
  const sales = await window.api.getSales();
  const purchases = await window.api.getPurchases();
  const receipts = await window.api.getReceipts();
  const payments = await window.api.getPayments();
  totalDebit = 0;
  totalCredit = 0;

  // Clear the booksList
  booksList.innerHTML = "";

  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;

  // Get the entered name
  const enteredName = searchName.value.trim().toLowerCase();

  const entries = sales.concat(purchases, receipts, payments);

  // Sort entries by date in ascending order
  entries.sort((a, b) => new Date(a.date) - new Date(b.date));

  entries.forEach((entry) => {
    const debitEntry =
      entry.saleType === "Cash" ||
      entry.saleType === "Bill" ||
      entry.type === "Cash-Payment" ||
      entry.type === "Bank-Payment";
    const creditEntry =
      entry.purchaseType === "Cash" ||
      entry.purchaseType === "Bill" ||
      entry.type === "Cash-Receipt" ||
      entry.type === "Bank-Receipt";

    const entryDate = new Date(entry.date);
    // Check if the name matches
    const nameMatches = entry.name.toLowerCase().includes(enteredName);

    const isNotCredit =
      entry.purchaseType !== "Credit" && entry.saleType !== "Credit";

    // Check if the date range is valid (if fromDate and toDate are provided)
    const dateInRange =
      !fromDate ||
      !toDate ||
      (entryDate >= new Date(fromDate) && entryDate <= new Date(toDate));

    if (isNotCredit && nameMatches && dateInRange) {
      // Add the row to booksList and update totalDebit/totalCredit
      const tr = document.createElement("tr");
      tr.className = "text-xl border-b-2 border-gray-300 hover:bg-blue-300";

      const dateCell = document.createElement("td");
      dateCell.className = "px-3 py-3 border-r border-gray-300";
      dateCell.textContent = entry.date;
      tr.appendChild(dateCell);

      const nameCell = document.createElement("td");
      nameCell.className = "px-3 py-3 border-r border-gray-300";
      nameCell.textContent = entry.name;
      tr.appendChild(nameCell);

      const productCell = document.createElement("td");
      productCell.className = "px-6 py-3 border-r border-gray-300";
      productCell.textContent = entry.item || entry.type;

      // Add the tag for cash sale
      if (entry.saleType === "Cash") {
        const cashTag = document.createElement("span");
        cashTag.className = "ptag tag-cash";
        cashTag.textContent = "Cash";
        productCell.appendChild(cashTag);
      }

      // Add the tag for sale by bill
      if (entry.saleType === "Bill") {
        const billTag = document.createElement("span");
        billTag.className = "ptag tag-bill";
        billTag.textContent = "Bill";
        productCell.appendChild(billTag);
      }

      // Add the tag for cash purchase
      if (entry.purchaseType === "Cash") {
        const cashTag = document.createElement("span");
        cashTag.className = "ptag tag-cash";
        cashTag.textContent = "Cash";
        productCell.appendChild(cashTag);
      }

      // Add the tag for purchase by bill
      if (entry.purchaseType === "Bill") {
        const billTag = document.createElement("span");
        billTag.className = "ptag tag-bill";
        billTag.textContent = "Bill";
        productCell.appendChild(billTag);
      }

      // Add the tag for purchase by credit
      if (entry.purchaseType === "Credit") {
        const creditTag = document.createElement("span");
        creditTag.className = "ptag tag-credit";
        creditTag.textContent = "Credit";
        productCell.appendChild(creditTag);
      }

      // Add the tag for sale by credit
      if (entry.saleType === "Credit") {
        const creditTag = document.createElement("span");
        creditTag.className = "ptag tag-credit";
        creditTag.textContent = "Credit";
        productCell.appendChild(creditTag);
      }

      tr.appendChild(productCell);

      if (creditEntry) {
        console.log("Credit Entry", creditEntry);
        // Add an empty cell for purchase or receipt
        const emptyCell = document.createElement("td");
        emptyCell.className = "text-right px-6 py-3 border-r border-gray-300";
        emptyCell.textContent = "";
        tr.appendChild(emptyCell);
      }

      const amountCell = document.createElement("td");
      amountCell.className = "text-right px-6 py-3 border-r border-gray-300";
      amountCell.textContent = formatIndianCurrency(entry.amount);
      tr.appendChild(amountCell);

      if (debitEntry) {
        // If it's a debit entry, remove the empty cell and append the amount cell
        tr.removeChild(tr.lastElementChild);
        tr.appendChild(amountCell);
      }

      booksList.appendChild(tr);

      if (debitEntry) {
        totalDebit += entry.amount;
      }
      if (creditEntry) {
        totalCredit += entry.amount;
      }
    }
  });

  let debitOpening = 0;
  let creditOpening = 0;

  if (enteredName === "") {
    document.getElementById("openingDebit").textContent =
      formatIndianCurrency(debitOpening);
    document.getElementById("openingCredit").textContent =
      formatIndianCurrency(creditOpening);
  } else {
    ledgers.forEach((ledger) => {
      if (ledger.under !== "Cash-in-hand") {
        if (
          ledger.name.toLowerCase().includes(enteredName) &&
          ledger.dr_cr === "Debit"
        ) {
          debitOpening += ledger.ledger_OpnBal;
          totalDebit += debitOpening;
        } else if (
          ledger.name.toLowerCase().includes(enteredName) &&
          ledger.dr_cr === "Credit"
        ) {
          creditOpening += ledger.ledger_OpnBal;
          totalCredit += creditOpening;
        }
      }
    });

    document.getElementById("openingDebit").textContent =
      formatIndianCurrency(debitOpening);
    document.getElementById("openingCredit").textContent =
      formatIndianCurrency(creditOpening);
  }

  document.getElementById("openingDebit").textContent =
    formatIndianCurrency(debitOpening);
  document.getElementById("openingCredit").textContent =
    formatIndianCurrency(creditOpening);

  // Update the totalDebit and totalCredit elements
  document.getElementById("totalDebit").textContent =
    formatIndianCurrency(totalDebit);
  document.getElementById("totalCredit").textContent =
    formatIndianCurrency(totalCredit);
  calcClosing();
});

const transactionsBtn = document.getElementById("transactionsBtn");
const debtorsBtn = document.getElementById("debtorsBtn");
const creditorsBtn = document.getElementById("creditorsBtn");

const transactionsTable = document.getElementById("transactions-table");
const debtorsTable = document.getElementById("debtors-table");
const creditorsTable = document.getElementById("creditors-table");

const debtorsList = document.getElementById("debtorsData");
const creditorsList = document.getElementById("creditorsData");

const calculateDebtorsBalance = async (debtorName) => {
  let totalDebit = 0;
  let totalCredit = 0;
  const sales = await window.api.getSales();
  const purchases = await window.api.getPurchases();
  const receipts = await window.api.getReceipts();
  const payments = await window.api.getPayments();
  const ledgers = await window.api.getLedgers();

  const entries = sales.concat(purchases, receipts, payments);

  const debtorLedger = ledgers.find(
    (ledger) =>
      ledger.under === "Sundry-Debtor" &&
      ledger.name.toLowerCase() === debtorName.toLowerCase()
  );
  if (debtorLedger) {
    // Add opening balance to the respective totalCredit or totalDebit
    if (debtorLedger.dr_cr === "Debit") {
      totalDebit += debtorLedger.ledger_OpnBal;
    } else if (debtorLedger.dr_cr === "Credit") {
      totalCredit += debtorLedger.ledger_OpnBal;
    }
  }
  // ledgers.forEach((ledger) => {
  //   if(ledger.under === "Sundry-Debtor" && ledger.name.toLowerCase() === debtorName.toLowerCase())
  // })

  entries.forEach((entry) => {
    const debitEntry =
      entry.saleType === "Cash" ||
      entry.saleType === "Bill" ||
      entry.type === "Cash-Payment" ||
      entry.type === "Bank-Payment";
    const creditEntry =
      entry.purchaseType === "Cash" ||
      entry.purchaseType === "Bill" ||
      entry.type === "Cash-Receipt" ||
      entry.type === "Bank-Receipt";

    const nameMatches = entry.name.toLowerCase() === debtorName.toLowerCase();

    if (nameMatches) {
      if (debitEntry) {
        totalDebit += entry.amount;
      }
      if (creditEntry) {
        totalCredit += entry.amount;
      }
    }
    // console.log("total Debit", totalDebit);
    // console.log("total Credit", totalCredit);
  });

  // Calculate the closing balance

  // return { closingBalance, totalDebit, totalCredit };
  return { totalDebit, totalCredit };
};

const calculateCreditorsBalance = async (creditorName) => {
  let totalDebit = 0;
  let totalCredit = 0;
  const sales = await window.api.getSales();
  const purchases = await window.api.getPurchases();
  const receipts = await window.api.getReceipts();
  const payments = await window.api.getPayments();
  const ledgers = await window.api.getLedgers();

  const entries = sales.concat(purchases, receipts, payments);

  const creditorLedger = ledgers.find(
    (ledger) =>
      ledger.under === "Sundry-Creditor" &&
      ledger.name.toLowerCase() === creditorName.toLowerCase()
  );
  if (creditorLedger) {
    // Add opening balance to the respective totalCredit or totalDebit
    if (creditorLedger.dr_cr === "Debit") {
      totalDebit += creditorLedger.ledger_OpnBal;
    } else if (creditorLedger.dr_cr === "Credit") {
      totalCredit += creditorLedger.ledger_OpnBal;
    }
  }
  // ledgers.forEach((ledger) => {
  //   if(ledger.under === "Sundry-Debtor" && ledger.name.toLowerCase() === debtorName.toLowerCase())
  // })

  entries.forEach((entry) => {
    const debitEntry =
      entry.saleType === "Cash" ||
      entry.saleType === "Bill" ||
      entry.type === "Cash-Payment" ||
      entry.type === "Bank-Payment";
    const creditEntry =
      entry.purchaseType === "Cash" ||
      entry.purchaseType === "Bill" ||
      entry.type === "Cash-Receipt" ||
      entry.type === "Bank-Receipt";

    const nameMatches = entry.name.toLowerCase() === creditorName.toLowerCase();

    if (nameMatches) {
      if (debitEntry) {
        totalDebit += entry.amount;
      }
      if (creditEntry) {
        totalCredit += entry.amount;
      }
    }
    // console.log("total Debit", totalDebit);
    // console.log("total Credit", totalCredit);
  });

  // Calculate the closing balance

  // return { closingBalance, totalDebit, totalCredit };
  return { totalDebit, totalCredit };
};

function formatIndianCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(amount);
}
