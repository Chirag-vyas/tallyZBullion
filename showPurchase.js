const purchaseList = document.getElementById("purchaseData");
let totalFineWeight = 0;
let totalReFineWeight = 0;
let totalAmount = 0;
let totalGrossWeight = 0;
async function loadPurchases() {
  purchaseList.innerHTML = "";
  try {
    const purchases = await window.api.getPurchases();
    console.log("purchases", purchases);
    purchases.forEach((purchase) => {
      // totalFineWeight = totalFineWeight + purchase.fine_weight;
      // totalAmount = totalAmount + purchase.amount;

      // totalGrossWeight = totalGrossWeight + purchase.gross_weight;

      const tr = document.createElement("tr");
      tr.className = "text-xl border-b-2 border-gray-300 hover:bg-blue-300";

      const typeCell = document.createElement("td");
      typeCell.className = "px-6 py-3";
      typeCell.textContent = purchase.purchaseType;
      tr.appendChild(typeCell);

      const idCell = document.createElement("td");
      idCell.className = "px-6 py-3";
      idCell.textContent = purchase.id;
      tr.appendChild(idCell);

      const dateCell = document.createElement("td");
      dateCell.className = "px-6 py-3";
      dateCell.textContent = purchase.date;
      tr.appendChild(dateCell);

      const nameCell = document.createElement("td");
      nameCell.className = "px-6 py-3";
      nameCell.textContent = purchase.name;
      tr.appendChild(nameCell);

      const productCell = document.createElement("td");
      productCell.className = "px-6 py-3";
      productCell.textContent = purchase.item;
      tr.appendChild(productCell);

      const grossWeightCell = document.createElement("td");
      grossWeightCell.className = "px-6 py-3 text-right";
      grossWeightCell.textContent = purchase.gross_weight;
      tr.appendChild(grossWeightCell);

      const purityCell = document.createElement("td");
      purityCell.className = "px-6 py-3 text-right";
      purityCell.textContent = purchase.purity;
      tr.appendChild(purityCell);

      const fineWeightCell = document.createElement("td");
      fineWeightCell.className = "px-6 py-3 text-right";
      fineWeightCell.textContent = purchase.fine_weight;
      tr.appendChild(fineWeightCell);

      const refineWeightCell = document.createElement("td");
      refineWeightCell.className = "px-6 py-3 text-right";
      refineWeightCell.textContent = purchase.refine_weight;
      tr.appendChild(refineWeightCell);

      const priceCell = document.createElement("td");
      priceCell.className = "px-6 py-3 text-right";
      priceCell.textContent = formatIndianCurrency(purchase.rate);
      tr.appendChild(priceCell);

      const amountCell = document.createElement("td");
      amountCell.className = "px-6 py-3 text-right";
      amountCell.textContent = formatIndianCurrency(purchase.amount);
      tr.appendChild(amountCell);

      const narrationCell = document.createElement("td");
      narrationCell.className = "px-6 py-3 text-right";
      narrationCell.textContent = purchase.narration;
      tr.appendChild(narrationCell);

      const deleteCell = document.createElement("td");
      deleteCell.className = "px-6 py-3 text-center";
      deleteCell.appendChild(createDeleteButton(tr));
      tr.appendChild(deleteCell);

      purchaseList.appendChild(tr);

      // document.getElementById("totalFineWeight").textContent =
      //   totalFineWeight.toFixed(2) + " gms";
      // document.getElementById("totalGrossWeight").textContent =
      //   totalGrossWeight.toFixed(2) + " gms";
      // document.getElementById("totalAmount").textContent =
      //   formatIndianCurrency(totalAmount);
    });
  } catch (error) {
    console.error("Error loading purchases: ", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadPurchases();
});

// function createDeleteButton(row) {
//   const deleteButton = document.createElement("button");
//   deleteButton.textContent = "Delete";
//   deleteButton.className =
//     "bg-red-500 hover:bg-red-900 text-white text-xs font-semibold py-1 px-2 rounded-md";
//   deleteButton.addEventListener("click", () => {
//     // Handle the delete action here
//     // You can use the row data to identify which row to delete
//     console.log(row);
//     const idToDelete = row.querySelector("td:nth-child(2)").textContent; // Assuming the first column is the ID
//     console.log(idToDelete);
//     // Call a function to delete the data based on the ID
//     window.api.deletePurchase(idToDelete);
//     // Remove the row from the table
//     row.remove();
//   });

//   return deleteButton;
// }

function createDeleteButton(row) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className =
    "bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2 rounded-md";

  deleteButton.addEventListener("click", () => {
    // Show confirmation dialog
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (shouldDelete) {
      // Handle the delete action here
      // You can use the row data to identify which row to delete
      console.log(row);
      const idToDelete = row.querySelector("td:nth-child(2)").textContent; // Assuming the first column is the ID
      console.log(idToDelete);
      // Call a function to delete the data based on the ID
      window.api.deletePurchase(idToDelete);
      // Remove the row from the table
      row.remove();
    }
  });

  return deleteButton;
}

const searchInput = document.getElementById("searchPurchase");

// document.addEventListener("keydown", (event) => {
//   const isAlphabetKey = /[a-zA-Z]/.test(event.key);
//   if (isAlphabetKey) {
//     searchInput.focus(); // Use focus() instead of select()
//   }
// });

// searchInput.addEventListener("input", () => {
//   const searchTerm = searchInput.value.toLowerCase();

//   const purchaseRows = Array.from(purchaseList.querySelectorAll("tr"));

//   purchaseRows.forEach((row) => {
//     const ledgerName = row
//       .querySelector("td:nth-child(4)")
//       .textContent.toLowerCase();
//     const isMatch = ledgerName.includes(searchTerm);

//     row.style.display = isMatch ? "table-row" : "none";
//   });
// });

document.getElementById("searchBtn").addEventListener("click", async () => {
  totalFineWeight = 0;
  totalReFineWeight = 0;
  totalAmount = 0;
  totalGrossWeight = 0;
  const typeFilter = document.getElementById("type").value.toLowerCase();
  const itemsFilter = document.getElementById("items").value.toLowerCase();
  const fromDateFilter = document
    .getElementById("fromDate")
    .value.toLowerCase();
  const toDateFilter = document.getElementById("toDate").value.toLowerCase();
  const searchPurchaseFilter = document
    .getElementById("searchPurchase")
    .value.toLowerCase();

  const purchaseRows = Array.from(purchaseList.querySelectorAll("tr"));

  purchaseRows.forEach(async (row) => {
    const typeValue = row
      .querySelector("td:nth-child(1)")
      .textContent.toLowerCase();
    const itemsValue = row
      .querySelector("td:nth-child(5)")
      .textContent.toLowerCase();
    const dateValue = row
      .querySelector("td:nth-child(3)")
      .textContent.toLowerCase();

    const nameValue = row
      .querySelector("td:nth-child(4)")
      .textContent.toLowerCase();

    const isTypeMatch = typeFilter === "all" || typeValue.includes(typeFilter);
    const isItemsMatch =
      itemsFilter === "all" || itemsValue.includes(itemsFilter);
    const isDateMatch =
      fromDateFilter === "" ||
      toDateFilter === "" ||
      (dateValue >= fromDateFilter && dateValue <= toDateFilter);
    const isNameMatch =
      searchPurchaseFilter === "" || nameValue.includes(searchPurchaseFilter);

    const isMatch = isTypeMatch && isItemsMatch && isDateMatch && isNameMatch;

    row.style.display = isMatch ? "table-row" : "none";
    if (isMatch) {
      const fineWeight = parseFloat(
        row.querySelector("td:nth-child(8)").textContent
      );
      const refineWeight = parseFloat(
        row.querySelector("td:nth-child(9)").textContent
      );
      const grossWeight = parseFloat(
        row.querySelector("td:nth-child(6)").textContent
      );
      const amount = parseIndianCurrency(
        row.querySelector("td:nth-child(11)").textContent
      );

      totalFineWeight += fineWeight;
      totalReFineWeight += refineWeight;
      totalAmount += amount;
      totalGrossWeight += grossWeight;
    }
    console.log("totalReFineWeight", totalReFineWeight);
  });
  document.getElementById("totalGrossWeight").textContent =
    totalGrossWeight.toFixed(3) + " gms";
  document.getElementById("totalFineWeight").textContent =
    totalFineWeight.toFixed(3) + " gms";
  document.getElementById("totalReFineWeight").textContent =
    totalReFineWeight.toFixed(3) + " gms";

  document.getElementById("totalAmount").textContent =
    formatIndianCurrency(totalAmount);
});

function formatIndianCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(amount);
}

function parseIndianCurrency(currencyFormattedString) {
  // Remove currency symbol and commas
  const cleanedString = currencyFormattedString.replace(/[₹,]/g, "").trim();

  // Parse the cleaned string into a floating-point number
  const parsedValue = parseFloat(cleanedString);

  // If parsing is successful, return the parsed value, otherwise return 0
  return isNaN(parsedValue) ? 0 : parsedValue;
}
