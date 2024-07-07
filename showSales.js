const salesList = document.getElementById("salesData");
let totalFineWeight = 0;
let totalAmount = 0;
async function loadsales() {
  salesList.innerHTML = "";
  try {
    const sales = await window.api.getSales();
    sales.forEach((sale) => {
      const tr = document.createElement("tr");
      tr.className = "text-xl border-b-2 border-gray-300 hover:bg-blue-300";

      const typeCell = document.createElement("td");
      typeCell.className = "px-6 py-3";
      typeCell.textContent = sale.saleType;
      tr.appendChild(typeCell);

      const idCell = document.createElement("td");
      idCell.className = "px-6 py-3";
      idCell.textContent = sale.id;
      tr.appendChild(idCell);

      const dateCell = document.createElement("td");
      dateCell.className = "px-6 py-3";
      dateCell.textContent = sale.date;
      tr.appendChild(dateCell);

      const nameCell = document.createElement("td");
      nameCell.className = "px-6 py-3";
      nameCell.textContent = sale.name;
      tr.appendChild(nameCell);

      const productCell = document.createElement("td");
      productCell.className = "px-6 py-3";
      productCell.textContent = sale.item;
      tr.appendChild(productCell);

      const quantityCell = document.createElement("td");
      quantityCell.className = "px-6 py-3 text-right";
      quantityCell.textContent = sale.fine_weight;
      tr.appendChild(quantityCell);

      const priceCell = document.createElement("td");
      priceCell.className = "px-6 py-3 text-right";
      priceCell.textContent = formatIndianCurrency(sale.rate);
      tr.appendChild(priceCell);

      const amountCell = document.createElement("td");
      amountCell.className = "px-6 py-3 text-right";
      amountCell.textContent = formatIndianCurrency(sale.amount);
      tr.appendChild(amountCell);

      const narrationCell = document.createElement("td");
      narrationCell.className = "px-6 py-3 text-right";
      narrationCell.textContent = sale.narration;
      tr.appendChild(narrationCell);

      // const outstandingCell = document.createElement("td");
      // outstandingCell.className = "px-6 py-3";
      // outstandingCell.textContent = sale.outstanding;
      // tr.appendChild(outstandingCell);

      // const advanceCell = document.createElement("td");
      // advanceCell.className = "px-6 py-3";
      // advanceCell.textContent = sale.advance;
      // tr.appendChild(advanceCell);

      const deleteCell = document.createElement("td");
      deleteCell.className = "px-6 py-3 text-center";
      deleteCell.appendChild(createDeleteButton(tr));
      tr.appendChild(deleteCell);

      salesList.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading sales: ", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadsales();
});

// function createDeleteButton(row) {
//   const deleteButton = document.createElement("button");
//   deleteButton.textContent = "Delete";
//   deleteButton.className =
//     "bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2 rounded-md";
//   deleteButton.addEventListener("click", () => {
//     // Handle the delete action here
//     // You can use the row data to identify which row to delete
//     console.log(row);
//     const idToDelete = row.querySelector("td:nth-child(2)").textContent; // Assuming the first column is the ID
//     console.log(idToDelete);
//     // Call a function to delete the data based on the ID
//     window.api.deleteSale(idToDelete);
//     // Remove the row from the table
//     row.remove();
//   });

//   return deleteButton;
// }

// document.addEventListener("keydown", (event) => {
//   const isAlphabetKey = /[a-zA-Z]/.test(event.key);
//   if (isAlphabetKey) {
//     searchInput.focus(); // Use focus() instead of select()
//   }
// });

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
      window.api.deleteSale(idToDelete);
      // Remove the row from the table
      row.remove();
    }
  });

  return deleteButton;
}

const searchBtn = document.getElementById("searchBtn");

const type = document.getElementById("type");
const items = document.getElementById("items");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const searchInput = document.getElementById("searchSale");

// searchBtn.addEventListener("click", () => {
//   const searchTerm = searchInput.value.toLowerCase();

//   const typeValue = type.value;
//   const itemsValue = items.value;

//   const saleRows = Array.from(salesList.querySelectorAll("tr"));

//   console.log("items Value", itemsValue);

//   saleRows.forEach((row) => {
//     const ledgerName = row
//       .querySelector("td:nth-child(4)")
//       .textContent.toLowerCase();
//     const type = row.querySelector("td:nth-child(1)").textContent.toLowerCase();
//     const item = row.querySelector("td:nth-child(5)").textContent;
//     const fromDate = row
//       .querySelector("td:nth-child(3)")
//       .textContent.toLowerCase();
//     const toDate = row
//       .querySelector("td:nth-child(3)")
//       .textContent.toLowerCase();

//     // const isTypeMatch =
//     //   typeFilter === "all" ||
//     //   typeValue.includes(typeFilter) ||
//     //   (itemsFilter === "all" &&
//     //     (typeValue.includes("cash") || typeValue.includes("bill")));
//     // const isItemsMatch =
//     //   itemsFilter === "all" ||
//     //   itemsValue.includes(itemsFilter) ||
//     //   (typeFilter === "all" &&
//     //     (itemsValue.includes("cash") || itemsValue.includes("bill")));
//     let allTypes;
//     if (typeValue === "all") {
//       allTypes = ["cash", "bill"];
//     }

//     let allItems;
//     if (itemsValue === "all") {
//       allItems = ["Fine-Gold-Sale", "Fine-Silver-Sale"];
//     }

//     console.log("all types", allTypes);

//     const isMatch =
//       ledgerName.includes(searchTerm) &&
//       item.includes(itemsValue) &&
//       type.includes(typeValue);

//     row.style.display = isMatch ? "table-row" : "none";
//   });
// });

// document.getElementById("searchBtn").addEventListener("click", () => {
//   const typeFilter = document.getElementById("type").value;
//   const itemsFilter = document.getElementById("items").value;
//   const fromDateFilter = document
//     .getElementById("fromDate")
//     .value.toLowerCase();
//   const toDateFilter = document.getElementById("toDate").value.toLowerCase();
//   const searchSaleFilter = document
//     .getElementById("searchSale")
//     .value.toLowerCase();

//   const saleRows = Array.from(salesList.querySelectorAll("tr"));

//   saleRows.forEach((row) => {
//     const typeValue = row
//       .querySelector("td:nth-child(1)")
//       .textContent.toLowerCase();
//     const itemsValue = row
//       .querySelector("td:nth-child(5)")
//       .textContent.toLowerCase();
//     // const fromDateValue = row
//     //   .querySelector("td:nth-child(3)")
//     //   .textContent.toLowerCase();
//     // const toDateValue = row
//     //   .querySelector("td:nth-child(4)")
//     //   .textContent.toLowerCase();
//     // const nameValue = row
//     //   .querySelector("td:nth-child(5)")
//     //   .textContent.toLowerCase();

//     const filterOptions = {
//       type: {
//         all: ["cash", "bill"],
//         cash: ["cash"],
//         bill: ["bill"],
//       },
//       items: {
//         all: ["fine-gold", "fine-silver"],
//         fineGold: ["fine-gold"],
//         fineSilver: ["fine-silver"],
//       },
//       // Add more filters as needed
//     };

//     const isTypeMatch =
//       typeValue.includes(filterOptions.type[typeFilter]) ||
//       (typeFilter === "all" && filterOptions.type.all.includes(typeValue));
//     const isItemsMatch =
//       filterOptions.items[itemsFilter].includes(itemsValue) ||
//       (itemsFilter === "all" && filterOptions.items.all.includes(itemsValue));
//     // const isFromDateMatch = fromDateValue.includes(fromDateFilter);
//     // const isToDateMatch = toDateValue.includes(toDateFilter);
//     // const isNameMatch = nameValue.includes(searchSaleFilter);

//     const isMatch = isTypeMatch && isItemsMatch;
//     // isFromDateMatch &&
//     // isToDateMatch &&
//     // isNameMatch;

//     row.style.display = isMatch ? "table-row" : "none";
//   });
// });

document.getElementById("searchBtn").addEventListener("click", () => {
  totalFineWeight = 0;
  totalAmount = 0;
  const typeFilter = document.getElementById("type").value.toLowerCase();
  const itemsFilter = document.getElementById("items").value.toLowerCase();
  const fromDateFilter = document
    .getElementById("fromDate")
    .value.toLowerCase();
  const toDateFilter = document.getElementById("toDate").value.toLowerCase();
  const searchSaleFilter = document
    .getElementById("searchSale")
    .value.toLowerCase();

  const saleRows = Array.from(salesList.querySelectorAll("tr"));

  saleRows.forEach((row) => {
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
    // const isDateMatch = fromDateFilter && toDateFilter ?
    const isDateMatch =
      fromDateFilter === "" ||
      toDateFilter === "" ||
      (dateValue >= fromDateFilter && dateValue <= toDateFilter);
    const isNameMatch =
      searchSaleFilter === "" || nameValue.includes(searchSaleFilter);

    const isMatch = isTypeMatch && isItemsMatch && isDateMatch && isNameMatch;

    row.style.display = isMatch ? "table-row" : "none";
    if (isMatch) {
      const fineWeight = parseFloat(
        row.querySelector("td:nth-child(6)").textContent
      );

      const amount = parseIndianCurrency(
        row.querySelector("td:nth-child(8)").textContent
      );

      totalFineWeight += fineWeight;
      totalAmount += amount;
    }
  });
  document.getElementById("totalFineWeight").textContent =
    totalFineWeight.toFixed(2) + " gms";
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
