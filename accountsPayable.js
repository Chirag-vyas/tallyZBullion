const payableList = document.getElementById("payableData");
async function loadPayables() {
  payableList.innerHTML = "";
  try {
    const payables = await window.api.getOutstandingPayments();
    const payments = await window.api.getPayments();

    updatePaidAmount(payables, payments);
    payables.forEach((payable) => {
      const tr = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.className = "px-6 py-3";
      idCell.textContent = payable.id;
      tr.appendChild(idCell);

      const dateCell = document.createElement("td");
      dateCell.className = "px-6 py-3";
      dateCell.textContent = payable.date;
      tr.appendChild(dateCell);

      const nameCell = document.createElement("td");
      nameCell.className = "px-6 py-3";
      nameCell.textContent = payable.name;
      tr.appendChild(nameCell);

      const outstandingCell = document.createElement("td");
      outstandingCell.className = "px-6 py-3";
      outstandingCell.textContent = payable.outstanding;
      tr.appendChild(outstandingCell);

      const payableCell = document.createElement("td");
      payableCell.className = "px-6 py-3";
      if (payable.paidCell) {
        tr.appendChild(payable.paidCell);
      }

      payableList.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading payables: ", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadPayables();
});

function updatePaidAmount(payables, payments) {
  payables.forEach((payable) => {
    const matchingPayments = payments.filter(
      (payment) => payment.billNo === payable.id
    );

    console.log("matching payments", matchingPayments);

    if (matchingPayments.length > 0) {
      let totalpaid = 0;

      matchingPayments.forEach((payment) => {
        totalpaid += payment.amount;
      });

      console.log("total paid", totalpaid);

      const paidCell = document.createElement("td");
      paidCell.className = "px-6 py-3";

      if (totalpaid > payable.outstanding) {
        paidCell.textContent = totalpaid;
        paidCell.classList.add("text-red-500");
      } else {
        paidCell.textContent = totalpaid;
        paidCell.classList.remove("text-red-500");
      }

      payable.paidCell = paidCell; // Store the paidCell in the payable object
    }
  });
}
