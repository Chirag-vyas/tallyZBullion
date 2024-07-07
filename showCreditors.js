const creditorsList = document.getElementById("creditorData");
async function loadCreditors() {
  creditorsList.innerHTML = "";
  try {
    const creditors = await window.api.getCreditors();
    creditors.forEach((creditor) => {
      const tr = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.className = "px-6 py-3";
      idCell.textContent = creditor.id;
      tr.appendChild(idCell);

      const nameCell = document.createElement("td");
      nameCell.className = "px-6 py-3";
      nameCell.textContent = creditor.name;
      tr.appendChild(nameCell);

      const openingBalCell = document.createElement("td");
      openingBalCell.className = "px-6 py-3";
      openingBalCell.textContent = creditor.ledger_OpnBal;
      tr.appendChild(openingBalCell);

      creditorsList.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading creditors: ", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadCreditors();
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

const searchInput = document.getElementById("searchCreditor");

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();

  const creditorRows = Array.from(creditorsList.querySelectorAll("tr"));

  creditorRows.forEach((row) => {
    const creditorName = row
      .querySelector("td:nth-child(2)")
      .textContent.toLowerCase();
    const isMatch = creditorName.includes(searchTerm);

    row.style.display = isMatch ? "table-row" : "none";
  });
});
