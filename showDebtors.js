const debtorsList = document.getElementById("debtorsData");
async function loadDebtors() {
  debtorsList.innerHTML = "";
  try {
    const debtors = await window.api.getDebtors();
    debtors.forEach((debtor) => {
      const tr = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.className = "px-6 py-3";
      idCell.textContent = debtor.id;
      tr.appendChild(idCell);

      const nameCell = document.createElement("td");
      nameCell.className = "px-6 py-3";
      nameCell.textContent = debtor.name;
      tr.appendChild(nameCell);

      const openingBalCell = document.createElement("td");
      openingBalCell.className = "px-6 py-3";
      openingBalCell.textContent = debtor.ledger_OpnBal;
      tr.appendChild(openingBalCell);

      debtorsList.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading creditors: ", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadDebtors();
});

function createDeleteButton(row) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className =
    "bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-2 rounded-md";
  deleteButton.addEventListener("click", () => {
    // Handle the delete action here
    // You can use the row data to identify which row to delete
    const idToDelete = row.querySelector("td:first-child").textContent; // Assuming the first column is the ID
    // Call a function to delete the data based on the ID
    window.api.deleteLedgers(idToDelete);
    // Remove the row from the table
    row.remove();
  });

  return deleteButton;
}

const searchInput = document.getElementById("searchDebtor");

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();

  const debtorRows = Array.from(debtorsList.querySelectorAll("tr"));

  debtorRows.forEach((row) => {
    const debtorName = row
      .querySelector("td:nth-child(2)")
      .textContent.toLowerCase();
    const isMatch = debtorName.includes(searchTerm);

    row.style.display = isMatch ? "table-row" : "none";
  });
});
