const typeInput = document.getElementById("type");
const dateInput = document.getElementById("date");
const nameInput = document.getElementById("name");
const suggestionsList = document.getElementById("suggestionsList");
const amountInput = document.getElementById("amount");
const billNoInput = document.getElementById("billNo");
const btn = document.getElementById("submitBtn");
const statusBar = document.getElementById("status-bar");
const statusMessage = document.getElementById("status-message");

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

  filteredLedgers.forEach((ledger, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = ledger.name;
    listItem.classList.add(
      "px-4",
      "py-2",
      "cursor-pointer",
      "hover:bg-blue-900",
      "hover:text-white"
    );

    ledgerList.appendChild(listItem);
  });

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

document.getElementById("name").addEventListener("keydown", (event) => {
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

document.getElementById("name").addEventListener("focus", () => {
  const ledgerList = document.getElementById("ledgerList");
  ledgerList.classList.remove("hidden");
});

const tallyZ = async () => {
  const ledgers = await window.api.getLedgers();
  const sales = await window.api.getSales();
  const purchases = await window.api.getPurchases();
  const receipts = await window.api.getReceipts();
  const payments = await window.api.getPayments();
  let totalDebit = 0;
  let totalCredit = 0;

  closingBox.textContent = "";

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

    // Check if the name matches
    const nameMatches = entry.name.toLowerCase().includes(enteredName);

    if (nameMatches) {
      console.log("name is matching");
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
    closingBox.textContent = formatIndianCurrency(0);
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
  if (totalCredit > totalDebit) {
    closingBalance = totalCredit - totalDebit;
    formattedClosing = formatIndianCurrency(closingBalance) + " cr";
  } else if (totalDebit > totalCredit) {
    closingBalance = totalDebit - totalCredit;
    formattedClosing = formatIndianCurrency(closingBalance) + " dr";
  } else if (totalCredit === totalDebit) {
    closingBalance = 0;
    formattedClosing = formatIndianCurrency(0);
  }
  closingBox.textContent = formattedClosing;
  const forbiddenNames = ["Cash", "C", "Ca", "Cas"];

  if (nameInput.value == "" || forbiddenNames.includes(nameInput.value)) {
    closingBox.textContent = formatIndianCurrency(0);
    console.log("empty text box");
  }
};

//input event displaying suggestions
// nameInput.addEventListener("input", () => {
//   suggestionsList.classList.remove("hidden");
//   if (nameInput.value != suggestionsList) {
//     nameInput.value = "";
//   }
//   const partialName = nameInput.value;
//   getSuggestionsFromDatabase(partialName, (err, suggestions) => {
//     if (err) {
//       console.log("Error:", err);
//     } else {
//       displaySuggestions(suggestions);
//     }
//   });
//   return;
// });

//add suggestion to the input box
// suggestionsList.addEventListener("click", function (event) {
//   if (event.target && event.target.nodeName === "LI") {
//     const clickedSuggestion = event.target.innerText;
//     nameInput.value = clickedSuggestion;
//     suggestionsList.classList.add("hidden");
//   }
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
//         "list-none text-blue-500 cursor-pointer hover:text-blue-700"
//       );*/
//     listItem.textContent = suggestion;
//     suggestionsList.appendChild(listItem);
//   });
// }

amountInput.addEventListener("input", calculateAmt);

function calculateAmt() {
  amt = amountInput.value;
  document.getElementById("finalAmount").textContent =
    formatIndianCurrency(amt);
}

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  const typeValue = document.getElementById("type").value;
  const dateValue = document.getElementById("date").value;
  const nameValue = document.getElementById("name").value;
  const amountValue = parseFloat(amountInput.value) || 0;
  // const billNo = billNoInput.value;

  if (!dateValue || !nameValue || !amountValue) {
    const message = `All fields required.`;
    const status = "Danger";
    showStatus(message, status);
    return;
  }

  try {
    await window.api.addPayments(typeValue, dateValue, nameValue, amountValue);
    const message = "Payment Successful.";
    const status = "Success";
    showStatus(message, status);
    resetInputFields();
    document.getElementById("name").focus();
  } catch (error) {
    console.log("Error adding payments: ", error);
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

// Use JavaScript to add the class to all input boxes
document.addEventListener("DOMContentLoaded", function () {
  var inputBoxes = document.querySelectorAll("input, select");

  inputBoxes.forEach(function (input) {
    input.classList.add("bg-blue-100");
  });
});
