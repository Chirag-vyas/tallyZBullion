const receivableList = document.getElementById("receivableData");
async function loadReceivables() {
  receivableList.innerHTML = "";
  try {
    const receivables = await window.api.getOutstandingReceipts();
    const receipts = await window.api.getReceipts();

    updateReceivedAmount(receivables, receipts);
    receivables.forEach((receivable) => {
      const tr = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.className = "px-6 py-3";
      idCell.textContent = receivable.id;
      tr.appendChild(idCell);

      const dateCell = document.createElement("td");
      dateCell.className = "px-6 py-3";
      dateCell.textContent = receivable.date;
      tr.appendChild(dateCell);

      const nameCell = document.createElement("td");
      nameCell.className = "px-6 py-3";
      nameCell.textContent = receivable.name;
      tr.appendChild(nameCell);

      const outstandingCell = document.createElement("td");
      outstandingCell.className = "px-6 py-3";
      outstandingCell.textContent = receivable.outstanding;
      tr.appendChild(outstandingCell);

      const receivableCell = document.createElement("td");
      receivableCell.className = "px-6 py-3";
      if (receivable.receivedCell) {
        tr.appendChild(receivable.receivedCell);
      }

      receivableList.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading receivables: ", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadReceivables();
});

function updateReceivedAmount(receivables, receipts) {
  receivables.forEach((receivable) => {
    const matchingReceipts = receipts.filter(
      (receipt) => receipt.billNo === receivable.id
    );

    console.log("matching receipts", matchingReceipts);

    if (matchingReceipts.length > 0) {
      let totalReceived = 0;

      matchingReceipts.forEach((receipt) => {
        totalReceived += receipt.amount;
      });

      const receivedCell = document.createElement("td");
      receivedCell.className = "px-6 py-3";

      if (totalReceived > receivable.outstanding) {
        receivedCell.textContent = totalReceived;
        receivedCell.classList.add("text-red-500");
      } else {
        receivedCell.textContent = totalReceived;
        receivedCell.classList.remove("text-red-500");
      }

      receivable.receivedCell = receivedCell; // Store the receivedCell in the receivable object
    }
  });
}
