const debtorsList = document.getElementById("debtorsData");
let closingTotalCredit = 0;
let closingTotalDebit = 0;
let differenceTotalCredit = 0;
let differenceTotalDebit = 0;

const tallyZ = async () => {
  let closingTotalCredit = 0;
  let closingTotalDebit = 0;
  const ledgers = await window.api.getLedgers();

  const sundryDebtors = ledgers
    .filter((ledger) => ledger.under === "Sundry-Debtor")
    .map((ledger) => ledger.name)
    .sort((a, b) => a.localeCompare(b));

  const namesOnly = sundryDebtors;

  const test = async (names) => {
    debtorsList.innerHTML = "";
    for (const name of names) {
      const { totalDebit, totalCredit } = await calculateDebtorsBalance(name);
      const closingCredit = totalCredit - totalDebit;
      const closingDebit = totalDebit - totalCredit;

      console.log("closingtotaldebit", closingTotalDebit);
      if (closingCredit > 0 || closingDebit > 0) {
        const tr = document.createElement("tr");
        tr.className = "text-xl border-b-2 border-gray-300 hover:bg-blue-300";

        // Add cell for debtor name
        const nameCell = document.createElement("td");
        nameCell.className = "px-3 py-3 ";
        nameCell.textContent = name;
        tr.appendChild(nameCell);

        const emptyCell1 = document.createElement("td");
        emptyCell1.className = "text-center ";
        emptyCell1.textContent = "";
        tr.appendChild(emptyCell1);

        const emptyCell2 = document.createElement("td");
        emptyCell1.className = "text-center ";
        emptyCell1.textContent = "";
        tr.appendChild(emptyCell2);

        // Add an empty cell conditionally based on totalCredit and totalDebit
        if (totalCredit > totalDebit) {
          const emptyCell = document.createElement("td");
          emptyCell.className = "text-right px-6 py-3 border-r border-gray-300";
          emptyCell.textContent = "";
          tr.appendChild(emptyCell);
          closingTotalCredit += closingCredit;
        }

        const creditCell = document.createElement("td");
        creditCell.className = "text-right px-6 py-3 border-r border-gray-300";
        creditCell.textContent = formatIndianCurrency(closingCredit);
        tr.appendChild(creditCell);

        const debitCell = document.createElement("td");
        debitCell.className = "text-right px-6 py-3 border-r border-gray-300";
        debitCell.textContent = formatIndianCurrency(closingDebit);

        if (totalDebit > totalCredit) {
          tr.removeChild(tr.lastElementChild);
          tr.appendChild(debitCell);
          closingTotalDebit += closingDebit;
        }

        debtorsList.appendChild(tr);
      }
    }

    document.getElementById("totalDebit").innerHTML =
      formatIndianCurrency(closingTotalDebit);
    document.getElementById("totalCredit").innerHTML =
      formatIndianCurrency(closingTotalCredit);
    if (closingTotalCredit > closingTotalDebit) {
      const closingCredit = closingTotalCredit - closingTotalDebit;
      console.log("closingggggggggg", closingCredit);
      document.getElementById("closingCredit").textContent =
        formatIndianCurrency(closingCredit);
      document.getElementById("closingDebit").textContent =
        formatIndianCurrency(0);
    } else if (closingTotalCredit < closingTotalDebit) {
      const closingDebit = closingTotalDebit - closingTotalCredit;
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

  test(namesOnly);
};

const calculateDebtorsBalance = async (debtorName) => {
  let totalDebit = 0;
  let totalCredit = 0;
  const sales = await window.api.getSales();
  const purchases = await window.api.getPurchases();
  const receipts = await window.api.getReceipts();
  const payments = await window.api.getPayments();
  const ledgers = await window.api.getLedgers();

  console.log("sales: ", sales);
  console.log("purchases: ", purchases);
  console.log("receipts: ", receipts);
  console.log("payments: ", payments);

  console.log("ledgers", ledgers);
  console.log("debtor name", debtorName);

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

const calcClosing = () => {
  if (closingTotalCredit > closingTotalDebit) {
    const closingCredit = closingTotalCredit - closingTotalDebit;
    console.log("closingggggggggg", closingCredit);
    document.getElementById("closingCredit").textContent =
      formatIndianCurrency(closingCredit);
    document.getElementById("closingDebit").textContent =
      formatIndianCurrency(0);
  } else if (closingTotalCredit < closingTotalDebit) {
    const closingDebit = closingTotalDebit - closingTotalCredit;
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

function formatIndianCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(amount);
}

tallyZ();

// const debtorsList = document.getElementById("debtorsData");

// const tallyZ = async () => {
//   const ledgers = await window.api.getLedgers();
//   const sundryDebtors = ledgers
//     .filter((ledger) => ledger.under === "Sundry-Debtor")
//     .sort((a, b) => a.name.localeCompare(b.name));
//   const namesOnly = sundryDebtors.map(async (ledger) => {
//     ledger.name;

//     // return { name: ledger.name, totalDebit, totalCredit };
//   });
//   const test = async (names) => {
//     debtorsList.innerHTML = "";
//     for (const name of names) {
//       const { totalDebit, totalCredit } = await calculateDebtorsBalance(name);
//       const closingCredit = totalCredit - totalDebit;
//       const closingDebit = totalDebit - totalCredit;

//       const tr = document.createElement("tr");

//       // Add cell for debtor name
//       const nameCell = document.createElement("td");
//       nameCell.className = "px-3 py-3 ";
//       nameCell.textContent = name;
//       tr.appendChild(nameCell);

//       const emptyCell1 = document.createElement("td");
//       emptyCell1.className = "text-center ";
//       emptyCell1.textContent = "";
//       tr.appendChild(emptyCell1);

//       const emptyCell2 = document.createElement("td");
//       emptyCell1.className = "text-center ";
//       emptyCell1.textContent = "";
//       tr.appendChild(emptyCell2);

//       // Add an empty cell conditionally based on totalCredit and totalDebit
//       if (totalCredit > totalDebit) {
//         const emptyCell = document.createElement("td");
//         emptyCell.className = "text-right px-6 py-3 border-r border-gray-300";
//         emptyCell.textContent = "";
//         tr.appendChild(emptyCell);
//       }

//       const creditCell = document.createElement("td");
//       creditCell.className = "text-right px-6 py-3 border-r border-gray-300";
//       creditCell.textContent = formatIndianCurrency(closingCredit);
//       tr.appendChild(creditCell);

//       const debitCell = document.createElement("td");
//       debitCell.className = "text-right px-6 py-3 border-r border-gray-300";
//       debitCell.textContent = formatIndianCurrency(closingDebit);

//       if (totalDebit > totalCredit) {
//         tr.removeChild(tr.lastElementChild);
//         tr.appendChild(debitCell);
//       }
//       debtorsList.appendChild(tr);
//     }
//   };
//   console.log("names only", namesOnly);
//   console.log("sundry debtors", sundryDebtors);
//   // Clear the debtorsList
//   //   debtorsList.innerHTML = "";

//   //   const data = sundryDebtors.map(async (debtor) => {
//   //     const tr = document.createElement("tr");

//   //     // Add cell for debtor name
//   //     const nameCell = document.createElement("td");
//   //     nameCell.className = "px-3 py-3 ";
//   //     nameCell.textContent = debtor.name;
//   //     tr.appendChild(nameCell);

//   //     const emptyCell1 = document.createElement("td");
//   //     emptyCell1.className = "text-center ";
//   //     emptyCell1.textContent = "";
//   //     tr.appendChild(emptyCell1);

//   //     const emptyCell2 = document.createElement("td");
//   //     emptyCell1.className = "text-center ";
//   //     emptyCell1.textContent = "";
//   //     tr.appendChild(emptyCell2);

//   //     // Call the calculateClosingBalance function
//   //     const { totalDebit, totalCredit } = await calculateDebtorsBalance(
//   //       debtor.name
//   //     );

//   //     const closingCredit = totalCredit - totalDebit;
//   //     const closingDebit = totalDebit - totalCredit;

//   //     // Add an empty cell conditionally based on totalCredit and totalDebit
//   //     if (totalCredit > totalDebit) {
//   //       const emptyCell = document.createElement("td");
//   //       emptyCell.className = "text-right px-6 py-3 border-r border-gray-300";
//   //       emptyCell.textContent = "";
//   //       tr.appendChild(emptyCell);
//   //     }

//   //     const creditCell = document.createElement("td");
//   //     creditCell.className = "text-right px-6 py-3 border-r border-gray-300";
//   //     creditCell.textContent = formatIndianCurrency(closingCredit);
//   //     tr.appendChild(creditCell);

//   //     const debitCell = document.createElement("td");
//   //     debitCell.className = "text-right px-6 py-3 border-r border-gray-300";
//   //     debitCell.textContent = formatIndianCurrency(closingDebit);

//   //     if (totalDebit > totalCredit) {
//   //       tr.removeChild(tr.lastElementChild);
//   //       tr.appendChild(debitCell);
//   //     }

//   //     // Add cell for closing balance

//   //     // const closingBalanceCell = document.createElement("td");
//   //     // closingBalanceCell.className =
//   //     //   "text-right px-6 py-3 border-r border-gray-300";

//   //     // // Call the calculateClosingBalance function and append the result
//   //     // const closingBalance = await debtorsClosingBal(debtor.name);
//   //     // closingBalanceCell.textContent = formatIndianCurrency(closingBalance);

//   //     // tr.appendChild(closingBalanceCell);

//   //     // Append the row to the debtorsList
//   //     debtorsList.appendChild(tr);
//   //     // return tr;
//   //   });
//   //   console.log("data", data);
//   //   //   data.forEach((ledger) => {
//   //   //     debtorsList.appendChild(ledger);
//   //   //   });
//   //   await Promise.all(data);
//   test(namesOnly);
// };

// tallyZ();

// const calculateDebtorsBalance = async (debtorName) => {
//   let totalDebit = 0;
//   let totalCredit = 0;
//   const sales = await window.api.getSales();
//   const purchases = await window.api.getPurchases();
//   const receipts = await window.api.getReceipts();
//   const payments = await window.api.getPayments();
//   const ledgers = await window.api.getLedgers();

//   console.log("ledgers", ledgers);
//   console.log("debtor name", debtorName);

//   const entries = sales.concat(purchases, receipts, payments);

//   const debtorLedger = ledgers.find(
//     (ledger) =>
//       ledger.under === "Sundry-Debtor" &&
//       ledger.name.toLowerCase() === debtorName.toLowerCase()
//   );

//   if (debtorLedger) {
//     // Add opening balance to the respective totalCredit or totalDebit
//     if (debtorLedger.dr_cr === "Debit") {
//       totalDebit += debtorLedger.ledger_OpnBal;
//     } else if (debtorLedger.dr_cr === "Credit") {
//       totalCredit += debtorLedger.ledger_OpnBal;
//     }
//   }
//   // ledgers.forEach((ledger) => {
//   //   if(ledger.under === "Sundry-Debtor" && ledger.name.toLowerCase() === debtorName.toLowerCase())
//   // })

//   entries.forEach((entry) => {
//     const debitEntry =
//       entry.saleType === "Cash" ||
//       entry.saleType === "Bill" ||
//       entry.type === "Cash-Payment" ||
//       entry.type === "Bank-Payment";
//     const creditEntry =
//       entry.purchaseType === "Cash" ||
//       entry.purchaseType === "Bill" ||
//       entry.type === "Cash-Receipt" ||
//       entry.type === "Bank-Receipt";

//     const nameMatches = entry.name.toLowerCase() === debtorName.toLowerCase();

//     if (nameMatches) {
//       if (debitEntry) {
//         totalDebit += entry.amount;
//       }
//       if (creditEntry) {
//         totalCredit += entry.amount;
//       }
//     }
//     // console.log("total Debit", totalDebit);
//     // console.log("total Credit", totalCredit);
//   });

//   // Calculate the closing balance

//   // return { closingBalance, totalDebit, totalCredit };
//   return { totalDebit, totalCredit };
// };

// function formatIndianCurrency(amount) {
//   const formatter = new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//   });
//   return formatter.format(amount);
// }
