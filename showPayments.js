const paymentList = document.getElementById("paymentData");
async function loadPayments() {
  paymentList.innerHTML = "";
  try {
    const payments = await window.api.getPayments();
    payments.forEach((payment) => {
      const tr = document.createElement("tr");
      tr.className = "text-xl border-b-2 border-gray-300 hover:bg-blue-300";

      const idCell = document.createElement("td");
      idCell.className = "px-6 py-3";
      idCell.textContent = payment.id;
      tr.appendChild(idCell);

      const typeCell = document.createElement("td");
      typeCell.className = "px-6 py-3";
      typeCell.textContent = payment.type;
      tr.appendChild(typeCell);

      const dateCell = document.createElement("td");
      dateCell.className = "px-6 py-3";
      dateCell.textContent = payment.date;
      tr.appendChild(dateCell);

      const nameCell = document.createElement("td");
      nameCell.className = "px-6 py-3";
      nameCell.textContent = payment.name;
      tr.appendChild(nameCell);

      const amountCell = document.createElement("td");
      amountCell.className = "px-6 py-3 text-right";
      amountCell.textContent = formatIndianCurrency(payment.amount);
      tr.appendChild(amountCell);

      const deleteCell = document.createElement("td");
      deleteCell.className = "px-6 py-3 text-center";
      deleteCell.appendChild(createDeleteButton(tr));
      tr.appendChild(deleteCell);

      paymentList.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading Payments: ", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadPayments();
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
//     const idToDelete = row.querySelector("td:first-child").textContent; // Assuming the first column is the ID
//     console.log(idToDelete);
//     // Call a function to delete the data based on the ID
//     window.api.deletePayments(idToDelete);
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
      const idToDelete = row.querySelector("td:nth-child(1)").textContent; // Assuming the first column is the ID
      console.log(idToDelete);
      // Call a function to delete the data based on the ID
      window.api.deletePayments(idToDelete);
      // Remove the row from the table
      row.remove();
    }
  });

  return deleteButton;
}

const searchInput = document.getElementById("searchPayments");
const type = document.getElementById("type");
// document.addEventListener("keydown", (event) => {
//   const isAlphabetKey = /[a-zA-Z]/.test(event.key);
//   if (isAlphabetKey) {
//     searchInput.focus(); // Use focus() instead of select()
//   }
// });

// searchInput.addEventListener("input", () => {
//   const searchTerm = searchInput.value.toLowerCase();

//   const paymentRows = Array.from(paymentList.querySelectorAll("tr"));

//   paymentRows.forEach((row) => {
//     const ledgerName = row
//       .querySelector("td:nth-child(3)")
//       .textContent.toLowerCase();
//     const isMatch = ledgerName.includes(searchTerm);

//     row.style.display = isMatch ? "table-row" : "none";
//   });
// });
let totalAmount = 0;
document.getElementById("searchBtn").addEventListener("click", () => {
  totalAmount = 0;
  const typeFilter = document.getElementById("type").value.toLowerCase();
  const fromDateFilter = document
    .getElementById("fromDate")
    .value.toLowerCase();
  const toDateFilter = document.getElementById("toDate").value.toLowerCase();
  const searchPaymentsFilter = document
    .getElementById("searchPayments")
    .value.toLowerCase();

  const paymentRows = Array.from(paymentList.querySelectorAll("tr"));

  paymentRows.forEach((row) => {
    const typeValue = row
      .querySelector("td:nth-child(2)")
      .textContent.toLowerCase();
    const dateValue = row
      .querySelector("td:nth-child(3)")
      .textContent.toLowerCase();

    const nameValue = row
      .querySelector("td:nth-child(4)")
      .textContent.toLowerCase();

    const isTypeMatch = typeFilter === "all" || typeValue.includes(typeFilter);
    const isDateMatch =
      fromDateFilter === "" ||
      toDateFilter === "" ||
      (dateValue >= fromDateFilter && dateValue <= toDateFilter);
    const isNameMatch =
      searchPaymentsFilter === "" || nameValue.includes(searchPaymentsFilter);

    const isMatch = isTypeMatch && isDateMatch && isNameMatch;

    row.style.display = isMatch ? "table-row" : "none";

    if (isMatch) {
      const amount = parseIndianCurrency(
        row.querySelector("td:nth-child(5)").textContent
      );
      totalAmount += amount;
    }
  });
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
