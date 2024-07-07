const dateInput = document.getElementById("date");
const nameInput = document.getElementById("name");
const suggestionsList = document.getElementById("suggestionsList");
const itemInput = document.getElementById("items");
const fineWeightInput = document.getElementById("fine-weight");
const rateInput = document.getElementById("rate");
const amountInput = document.getElementById("amount");
const totalInput = document.getElementById("total");
const narrationInput = document.getElementById("narration");
const advanceInput = document.getElementById("advance");
const btn = document.getElementById("submitBtn");
const statusBar = document.getElementById("status-bar");
const statusMessage = document.getElementById("status-message");
const typeInput = document.getElementById("saleType");

const closingCashBox = document.getElementById("closingCash");
const closingGoldBox = document.getElementById("closingGold");
const closingSilverBox = document.getElementById("closingSilver");

// document.querySelector("input").classList.add("bg-blue-100");

//input event capital letters
nameInput.addEventListener("input", function () {
  const inputValue = nameInput.value;
  const words = inputValue.split(" ");
  const capitalizedWords = words.map((word) => {
    // Capitalize the first letter of each word
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the capitalized words back into a sentence
  const capitalizedInput = capitalizedWords.join(" ");

  // Update the input field with the capitalized text
  nameInput.value = capitalizedInput;
  // const nameValue = nameInput.value;
  // calculateClosing(nameValue);
});

let selectedListItemIndex = -1;

const filterLedgers = async (event) => {
  const inputValue = event.target.value.toLowerCase();
  const ledgerList = document.getElementById("ledgerList");
  ledgerList.innerHTML = "";

  const ledgers = await window.api.getLedgerNames();

  const filteredLedgers = ledgers.filter(
    (ledger) =>
      ledger.name.toLowerCase().includes(inputValue) &&
      ledger.name.toLowerCase() !== "cash"
  );

  filteredLedgers.forEach(async (ledger, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = ledger.name;
    listItem.classList.add(
      "px-4",
      "py-2",
      "cursor-pointer",
      "hover:bg-blue-900",
      "hover:text-white"
    );

    // // Call the calculateClosing function with the ledger name
    // const closingBalance = await calculateClosing(ledger.name);

    // const closingBox = document.getElementById("closingBox");

    // // Append the closing balance to the list item
    // closingBox.textContent += ` - ${closingBalance}`;

    // calculateClosing();

    // listItem.addEventListener("click", (e) => {
    //   console.log("list clicked");
    //   const selectedListItem = document.querySelector(
    //     "#ledgerList li.bg-gray-500"
    //   );
    //   if (selectedListItem) {
    //     const selectedLedgerName = selectedListItem.textContent;
    //     document.getElementById("name").value = selectedLedgerName;
    //   }
    // });

    // nameInput.addEventListener("focus", () => {});
    ledgerList.appendChild(listItem);
  });

  // listItem.addEventListener("click", (e) => {
  //   console.log("list clicked");
  //   const selectedListItem = document.querySelector(
  //     "#ledgerList li.bg-gray-500"
  //   );
  //   if (selectedListItem) {
  //     const selectedLedgerName = selectedListItem.textContent;
  //     document.getElementById("name").value = selectedLedgerName;
  //   }
  // });

  const newlistItems = document.querySelectorAll("#ledgerList li");

  newlistItems.forEach((item) => {
    item.addEventListener("click", async () => {
      console.log("list item clicked");
      const selectedItem = document.querySelector(
        "#ledgerList li:hover"
      ).textContent;
      console.log("selected list item is: ", selectedItem);
      document.getElementById("name").value = selectedItem;
      tallyZ();
      ledgerList.classList.add("hidden");
    });
  });

  if (filteredLedgers.length > 0) {
    ledgerList.classList.remove("hidden");
    selectedListItemIndex = -1; // Reset selected item index
    updateSelectedListItem();
  } else {
    ledgerList.classList.add("hidden");
  }
};

const updateSelectedListItem = () => {
  const listItems = document.querySelectorAll("#ledgerList li");
  listItems.forEach((item, index) => {
    if (index === selectedListItemIndex) {
      item.classList.add("bg-blue-900", "text-white");
    } else {
      item.classList.remove("bg-blue-900", "text-white");
    }
  });
};

document.getElementById("name").addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const selectedListItem = document.querySelector(
      "#ledgerList li.bg-blue-900"
    );
    if (selectedListItem) {
      const selectedLedgerName = selectedListItem.textContent;
      document.getElementById("name").value = selectedLedgerName;
      tallyZ();
      ledgerList.classList.add("hidden");
    }
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    if (selectedListItemIndex > 0) {
      selectedListItemIndex--;
      updateSelectedListItem();
    }
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    const listItems = document.querySelectorAll("#ledgerList li");
    if (selectedListItemIndex < listItems.length - 1) {
      selectedListItemIndex++;
      updateSelectedListItem();
    }
  }
});

const tallyZ = async () => {
  const ledgers = await window.api.getLedgers();
  const sales = await window.api.getSales();
  const purchases = await window.api.getPurchases();
  const receipts = await window.api.getReceipts();
  const payments = await window.api.getPayments();
  // const cashAmountPayments = await window.api.getAmountPayments();
  // const cashAmountReceipts = await window.api.getAmountReceipts();

  let totalDebit = 0;
  let totalCredit = 0;
  let totalDebitGold = 0;
  let totalCreditGold = 0;
  let totalDebitSilver = 0;
  let totalCreditSilver = 0;

  let closingCashBal = 0;

  closingCashBox.textContent = "";
  closingGoldBox.textContent = "";
  closingSilverBox.textContent = "";

  const enteredName = document
    .getElementById("name")
    .value.trim()
    .toLowerCase();

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
    const goldCredit =
      entry.purchaseType === "Credit" &&
      (entry.item === "Fine-Gold-Purchase" ||
        entry.item === "Gold-Lagadi-Purchase");
    const goldDebit =
      entry.saleType === "Credit" && entry.item === "Fine-Gold-Sale";
    const silverCredit =
      entry.purchaseType === "Credit" &&
      (entry.item === "Fine-Silver-Purchase" ||
        entry.item === "Silver-Gat-Purchase");
    const silverDebit =
      entry.saleType === "Credit" && entry.item === "Fine-Silver-Sale";

    // Check if the name matches
    const nameMatches = entry.name.toLowerCase().includes(enteredName);

    if (nameMatches) {
      console.log("name is matching");
      if (debitEntry) {
        totalDebit += entry.amount; // Fixing to 3 decimal places before addition
      }
      if (creditEntry) {
        totalCredit += entry.amount; // Fixing to 3 decimal places before addition
      }
      if (goldCredit) {
        totalCreditGold += parseFloat(entry.fine_weight.toFixed(2)); // Fixing to 3 decimal places before addition
        totalCreditGold = parseFloat(totalCreditGold.toFixed(2)); // Fixing to 3 decimal places after addition
      }
      if (goldDebit) {
        totalDebitGold += parseFloat(entry.fine_weight.toFixed(2)); // Fixing to 3 decimal places before addition
        totalDebitGold = parseFloat(totalDebitGold.toFixed(2)); // Fixing to 3 decimal places after addition
      }
      if (silverCredit) {
        totalCreditSilver += parseFloat(entry.fine_weight.toFixed(2)); // Fixing to 3 decimal places before addition
        totalCreditSilver = parseFloat(totalCreditSilver.toFixed(2)); // Fixing to 3 decimal places after addition
      }
      if (silverDebit) {
        totalDebitSilver += parseFloat(entry.fine_weight.toFixed(2)); // Fixing to 3 decimal places before addition
        totalDebitSilver = parseFloat(totalDebitSilver.toFixed(2)); // Fixing to 3 decimal places after addition
      }
    }
  });

  // if (document.getElementById("name").textContent === "cash") {
  //   console.log("cash entry");
  //   cashAmountPayments.forEach((payment) => {
  //     closingCashBal -= payment.amount;
  //   });
  //   cashAmountReceipts.forEach((receipt) => {
  //     closingCashBal += receipt.amount;
  //   });
  //   closingBox.textContent = formatIndianCurrency(closingCashBal);
  // }

  let debitOpening = 0;
  let creditOpening = 0;

  if (enteredName === "") {
    closingBox.textContent = formatIndianCurrency(0);
    closingGoldBox.textContent = 0;
    closingSilverBox.textContent = 0;
  } else {
    ledgers.forEach((ledger) => {
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
    });
  }

  let closingBalance;
  let formattedClosing;
  let closingBalanceGold;
  let formattedClosingGold;
  let closingBalanceSilver;
  let formattedClosingSilver;

  // Cash closing box logic
  if (totalCredit > totalDebit) {
    closingBalance = totalCredit - totalDebit;
    formattedClosing = formatIndianCurrency(closingBalance) + " cr";
  } else if (totalDebit > totalCredit) {
    closingBalance = totalDebit - totalCredit;
    formattedClosing = formatIndianCurrency(closingBalance) + " dr";
  } else if (totalCredit === totalDebit) {
    closingBalance = 0;
    formattedClosing = formatIndianCurrency(0);
  } else {
    closingBalance = 0;
    formattedClosing = formatIndianCurrency(0);
  }
  // Gold closing box logic
  if (totalCreditGold > totalDebitGold) {
    closingBalanceGold = totalCreditGold - totalDebitGold;
    closingBalanceGold = closingBalanceGold.toFixed(2);
    formattedClosingGold = closingBalanceGold + " gms" + " cr";
  } else if (totalDebitGold > totalCreditGold) {
    closingBalanceGold = totalDebitGold - totalCreditGold;
    closingBalanceGold = closingBalanceGold.toFixed(2);
    formattedClosingGold = closingBalanceGold + " gms" + " dr";
  } else if (totalCreditGold === totalDebitGold || closingBalanceGold < 1) {
    closingBalanceGold = (0).toFixed(2) + " gms";
    formattedClosingGold = closingBalanceGold;
  } else {
    closingBalanceGold = closingBalanceGold.toFixed(2);
    closingBalanceGold = 0 + " gms";
    formattedClosingGold = closingBalanceGold;
  }
  // Silver closing box logic
  if (totalCreditSilver > totalDebitSilver) {
    closingBalanceSilver = totalCreditSilver - totalDebitSilver;
    closingBalanceSilver = closingBalanceSilver.toFixed(2);
    formattedClosingSilver = closingBalanceSilver + " gms" + " cr";
  } else if (totalDebitSilver > totalCreditSilver) {
    closingBalanceSilver = totalDebitSilver - totalCreditSilver;
    closingBalanceSilver = closingBalanceSilver.toFixed(2);
    console.log("total debit silver is greater", closingBalanceSilver);
    formattedClosingSilver = closingBalanceSilver + " gms" + " dr";
  } else if (
    totalCreditSilver === totalDebitSilver ||
    closingBalanceSilver < 1
  ) {
    closingBalanceSilver = (0).toFixed(2) + " gms";
    formattedClosingSilver = closingBalanceSilver;
  }

  closingCashBox.textContent = formattedClosing;
  closingGoldBox.textContent = formattedClosingGold;
  closingSilverBox.textContent = formattedClosingSilver;
  const forbiddenNames = ["Cash", "C", "Ca", "Cas"];

  if (nameInput.value == "" || forbiddenNames.includes(nameInput.value)) {
    closingCashBox.textContent = formatIndianCurrency(0);
    closingGoldBox.textContent = (0).toFixed(2) + " gms"; // Fixing to 3 decimal places before setting in the DOM
    closingSilverBox.textContent = (0).toFixed(2) + " gms"; // Fixing to 3 decimal places before setting in the DOM
    console.log("empty text box");
  }
};

// const handleKeyPress = (event) => {
//   console.log("Key pressed:", event.key);
//   const ledgerList = document.getElementById("ledgerList");
//   const items = ledgerList.querySelectorAll("li");

//   let selectedIndex = -1;

//   items.forEach((item, index) => {
//     if (item.classList.contains("selected")) {
//       selectedIndex = index;
//       return;
//     }
//   });

//   switch (event.key) {
//     case "ArrowUp":
//       selectedIndex = Math.max(selectedIndex - 1, 0);
//       break;
//     case "ArrowDown":
//       selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
//       break;
//     case "Enter":
//       event.preventDefault();
//       const selectedName = items[selectedIndex].textContent;
//       document.getElementById("name").value = selectedName;
//       ledgerList.classList.add("hidden");
//       break;
//     default:
//       break;
//   }

//   items.forEach((item, index) => {
//     if (index === selectedIndex) {
//       item.classList.add("selected");
//     } else {
//       item.classList.remove("selected");
//     }
//   });
// };

// document.getElementById("name").addEventListener("blur", async () => {
//   document.getElementById("closingBox").textContent = "";
//   // const ledgerList = document.getElementById("ledgerList");
//   // ledgerList.classList.add("hidden");
//   // const ledgers = await window.api.getLedgerNames();
//   // let enteredName = document.getElementById("name").value;
//   // ledgers.forEach((ledger) => {
//   //   if (ledger.name.toLowerCase().includes(enteredName)) {
//   //     document.getElementById("name").value = enteredName;
//   //   } else {
//   //     document.getElementById("name").value = "";
//   //     const message = `Ledger Name not available.`;
//   //     const status = "Danger";
//   //     showStatus(message, status);
//   //     return;
//   //   }
//   // });
// });

// //input event displaying suggestions
nameInput.addEventListener("focus", () => {
  const ledgerList = document.getElementById("ledgerList");
  ledgerList.classList.remove("hidden");

  // if (nameInput.value != suggestionsList) {
  //   nameInput.value = "";
  // }
  // const partialName = nameInput.value;
  // getSuggestionsFromDatabase(partialName, (err, suggestions) => {
  //   if (err) {
  //     console.log("Error:", err);
  //   } else {
  //     displaySuggestions(suggestions);
  //   }
  // });
  return;
});

// add suggestion to the input box
// suggestionsList.addEventListener("click", function (event) {
// if (event.target && event.target.nodeName === "LI") {
//   const clickedSuggestion = event.target.innerText;
//   nameInput.value = clickedSuggestion;
//   suggestionsList.classList.add("hidden");
// }
// });

// //database api call to get name suggestions from ledgers
// function getSuggestionsFromDatabase(partialName, callback) {
//   window.api.getSuggestions(partialName, (err, suggestions) => {
//     if (err) {
//       callback(err, null);
//     } else {
//       callback(null, suggestions);
//     }
//   });
// }

// //name suggestions function
// function displaySuggestions(suggestions) {
//   const suggestionsList = document.getElementById("suggestionsList");
//   suggestionsList.innerHTML = "";

//   suggestions.forEach((suggestion) => {
//     const listItem = document.createElement("li");
//     listItem.style.listStyle = "none";
//     listItem.style.cursor = "pointer";
//     /*listItem.classList.add(
//       "list-none text-blue-500 cursor-pointer hover:text-blue-700"
//     );*/
//     listItem.textContent = suggestion;
//     suggestionsList.appendChild(listItem);
//   });
// }

// nameInput.addEventListener("input", async () => {
//   const ledgers = await window.api.getLedgerNames();
//   ledgers.forEach((ledger) => {
//     if (ledger.name !== nameValue) {
//       document.getElementById("name").value = "";
//       const message = `Ledger Name not available.`;
//       const status = "Danger";
//       showStatus(message, status);
//       return;
//     }
//   });
// });

typeInput.addEventListener("change", () => {
  const selectedType = typeInput.value;
  if (selectedType === "Credit") {
    rateInput.parentElement.style.display = "none";
    totalInput.parentElement.style.display = "none";
  } else {
    rateInput.parentElement.removeAttribute("style");
    totalInput.parentElement.removeAttribute("style");
  }
});
fineWeightInput.addEventListener("input", calculateAmt);
rateInput.addEventListener("input", calculateAmt);
// amountInput.addEventListener("input", calculateAmt);
// advanceInput.addEventListener("input", calculateAmt);

//calculating the amount
function calculateAmt() {
  const fineWeightValue = parseFloat(fineWeightInput.value) || 0;
  const rateValue = parseFloat(rateInput.value) || 0;
  const amt = fineWeightValue * rateValue;

  // const amtInput = document.getElementById("amount").value;

  // outstandingAmt = amt - amtInput;

  // const advanceAmt = amtInput - amt;
  // advanceInput.value = advanceAmt.toFixed(2);
  // console.log("advance", advanceAmt);

  // if (advanceAmt <= 0) {
  //   document.getElementById("advance").value = 0;
  // }

  // if (outstandingAmt <= 5) {
  //   outstandingAmt = 0;
  // }
  // let roundedAmt = Math.floor(outstandingAmt / 10) * 10;
  // if (outstandingAmt % 10 > 5) {
  //   roundedAmt += 10;
  // }
  // // floorOutstanding = Math.ceil(outstandingAmt / 10) * 10;
  // document.getElementById("outstanding").value = roundedAmt.toFixed(2);

  let floorAmt = Math.floor(amt / 10) * 10;
  if (amt % 10 > 5) {
    floorAmt += 10;
  }

  document.getElementById("total").value = floorAmt.toFixed(0);
  const formattedAmount = formatIndianCurrency(floorAmt.toFixed(0));
  document.getElementById("finalAmount").innerHTML = formattedAmount;
}

//form submission
btn.addEventListener("click", async (e) => {
  e.preventDefault();

  const typeValue = document.getElementById("saleType").value;
  const dateValue = document.getElementById("date").value;
  const nameValue = document.getElementById("name").value;

  const itemsValue = document.getElementById("items").value;
  const fineWeightValue = parseFloat(fineWeightInput.value) || 0;
  const rateValue = parseFloat(document.getElementById("rate").value) || 0;
  const amountValue = document.getElementById("total").value || 0;
  // const outstandingValue =
  //   parseFloat(document.getElementById("outstanding").value) || 0;
  // const advanceValue = advanceInput.value;
  // console.log("advanceValue", advanceValue);

  // const ledgers = await window.api.getLedgerNames();
  // ledgers.forEach((ledger) => {
  //   if (ledger.name.toLowerCase().includes(nameValue)) {
  //     document.getElementById("name").value = ;
  //   } else {
  //     document.getElementById("name").value = "";
  //     const message = `Ledger Name not available.`;
  //     const status = "Danger";
  //     showStatus(message, status);
  //     return;
  //   }
  // });
  if (typeInput.value !== "Credit") {
    if (
      !typeValue ||
      !dateValue ||
      !nameValue ||
      !fineWeightValue ||
      !rateValue
    ) {
      const message = `All fields required.`;
      const status = "Danger";
      showStatus(message, status);
      return;
    }
  } else if (!dateValue || !nameValue || !fineWeightValue) {
    const message = `All fields required.`;
    const status = "Danger";
    showStatus(message, status);
    return;
  }
  try {
    await window.api.addSales(
      typeValue,
      dateValue,
      nameValue,
      itemsValue,
      fineWeightValue,
      rateValue,
      amountValue,
      narrationInput.value
      // outstandingValue,
      // advanceValue
    );
    const message = "Sale Made.";
    const status = "Success";
    showStatus(message, status);
    resetInputFields();
    document.getElementById("name").focus();
    text;
  } catch (error) {
    console.log("Error adding sales: ", error);
  }
});

function showStatus(message, status) {
  statusMessage.textContent = message;
  if (status == "Success") {
    statusBar.classList.add("bg-green-500");
    statusBar.classList.remove("bg-red-500");
  } else {
    statusBar.classList.remove("bg-green-500");
    statusBar.classList.add("bg-red-500");
  }

  statusBar.style.display = "block";
  setTimeout(() => {
    hideStatus();
  }, 3000);
}

function hideStatus() {
  statusBar.style.display = "none";
}

function formatIndianCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(amount);
}

function resetInputFields() {
  const inputElements = document.querySelectorAll("input");
  document.getElementById("finalAmount").innerHTML = "";
  inputElements.forEach((input) => {
    if (input !== dateInput) {
      input.value = "";
    }
  });
}
