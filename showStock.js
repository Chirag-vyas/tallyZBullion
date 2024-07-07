const stockList = document.getElementById("stockData");
async function loadStock() {
  stockList.innerHTML = "";
  try {
    const stock = await window.api.getStock();
    stock.forEach((item) => {
      const tr = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.className = "px-6 py-3";
      idCell.textContent = item.id;
      tr.appendChild(idCell);

      const dateCell = document.createElement("td");
      dateCell.className = "px-6 py-3";
      dateCell.textContent = item.date;
      tr.appendChild(dateCell);

      const productCell = document.createElement("td");
      productCell.className = "px-6 py-3";
      productCell.textContent = item.item;
      tr.appendChild(productCell);

      const grossWeightCell = document.createElement("td");
      grossWeightCell.className = "px-6 py-3";
      grossWeightCell.textContent = item.gross_weight;
      tr.appendChild(grossWeightCell);

      const purityCell = document.createElement("td");
      purityCell.className = "px-6 py-3";
      purityCell.textContent = item.purity;
      tr.appendChild(purityCell);

      const fineWeightCell = document.createElement("td");
      fineWeightCell.className = "px-6 py-3";
      fineWeightCell.textContent = item.fine_weight;
      tr.appendChild(fineWeightCell);

      const priceCell = document.createElement("td");
      priceCell.className = "px-6 py-3";
      priceCell.textContent = item.rate;
      tr.appendChild(priceCell);

      const amountCell = document.createElement("td");
      amountCell.className = "px-6 py-3";
      amountCell.textContent = item.amount;
      tr.appendChild(amountCell);

      const deleteCell = document.createElement("td");
      deleteCell.className = "px-6 py-3";
      deleteCell.appendChild(createDeleteButton(tr));
      tr.appendChild(deleteCell);

      stockList.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading purchases: ", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadStock();
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
      console.log(row);
      const idToDelete = row.querySelector("td:first-child").textContent; // Assuming the first column is the ID
      console.log(idToDelete);
      // Call a function to delete the data based on the ID
      window.api.deleteStock(idToDelete);
      // Remove the row from the table
      row.remove();
    }
  });

  return deleteButton;
}
