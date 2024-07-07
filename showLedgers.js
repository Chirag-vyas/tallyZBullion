const ledgerList = document.getElementById("ledgerData");
async function loadLedgers() {
  ledgerList.innerHTML = "";
  try {
    const ledgers = await window.api.getLedgers();
    ledgers.forEach((ledger) => {
      const tr = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.className = "px-6 py-3";
      idCell.textContent = ledger.id;
      tr.appendChild(idCell);

      const nameCell = document.createElement("td");
      nameCell.className = "px-6 py-3";
      nameCell.textContent = ledger.name;
      tr.appendChild(nameCell);

      const underCell = document.createElement("td");
      underCell.className = "px-6 py-3";
      underCell.textContent = ledger.under;
      tr.appendChild(underCell);

      const openingBalCell = document.createElement("td");
      openingBalCell.className = "px-6 py-3 text-right";
      openingBalCell.textContent = formatIndianCurrency(ledger.ledger_OpnBal);
      tr.appendChild(openingBalCell);

      const DrCrCell = document.createElement("td");
      DrCrCell.className = "px-6 py-3 text-center";
      DrCrCell.textContent = ledger.dr_cr;
      tr.appendChild(DrCrCell);

      const deleteCell = document.createElement("td");
      deleteCell.className = "text-center";
      deleteCell.appendChild(createDeleteButton(tr));
      tr.appendChild(deleteCell);

      ledgerList.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading sales: ", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadLedgers();
});

function createDeleteButton(row) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className =
    "bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2 rounded-md";
  deleteButton.addEventListener("click", () => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (shouldDelete) {
      // Handle the delete action here
      // You can use the row data to identify which row to delete
      const idToDelete = row.querySelector("td:first-child").textContent; // Assuming the first column is the ID
      // Call a function to delete the data based on the ID
      window.api.deleteLedgers(idToDelete);
      // Remove the row from the table
      row.remove();
    }
  });

  return deleteButton;
}

const searchInput = document.getElementById("searchLedgers");

document.addEventListener("keydown", (event) => {
  const isAlphabetKey = /[a-zA-Z]/.test(event.key);
  if (isAlphabetKey) {
    searchInput.focus(); // Use focus() instead of select()
  }
});

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();

  const ledgerRows = Array.from(ledgerList.querySelectorAll("tr"));

  ledgerRows.forEach((row) => {
    const ledgerName = row
      .querySelector("td:nth-child(2)")
      .textContent.toLowerCase();
    const isMatch = ledgerName.includes(searchTerm);

    row.style.display = isMatch ? "table-row" : "none";
  });
});

function formatIndianCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(amount);
}
