const booksList = document.getElementById("booksData");
const searchBtn = document.getElementById("searchBtn");
const searchName = document.getElementById("searchName");

let totalDebit = 0;
let totalCredit = 0;

const tallyZ = async () => {
  booksList.innerHTML = "";
  totalDebit = 0;
  totalCredit = 0;

  const sales = await window.api.getSales();
  const purchases = await window.api.getPurchases();

  const entries = sales.concat(purchases);

  const enteredName = searchName.value.trim().toLowerCase();

  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;

  console.log("All entries", entries);
  entries.sort((a, b) => new Date(a.date) - new Date(b.date));

  const creditEntries = entries.filter((entry) => {
    return entry.saleType === "Credit" || entry.purchaseType === "Credit";
  });
  console.log("credit entries", creditEntries);

  creditEntries.forEach((entry) => {
    const creditSide =
      entry.item === "Fine-Gold-Purchase" ||
      entry.item === "Gold-Lagadi-Purchase";
    const debitSide = entry.item === "Fine-Gold-Sale";

    const goldEntries =
      entry.item === "Fine-Gold-Purchase" ||
      entry.item === "Fine-Gold-Sale" ||
      entry.item === "Gold-Lagadi-Purchase";

    const entryDate = new Date(entry.date);
    const nameMatches = entry.name.toLowerCase().includes(enteredName);
    const dateInRange =
      !fromDate ||
      !toDate ||
      (entryDate >= new Date(fromDate) && entryDate <= new Date(toDate));

    if (nameMatches && dateInRange && goldEntries) {
      const tr = document.createElement("tr");
      tr.className = "text-xl border-b-2 border-gray-300 hover:bg-yellow-300";

      const dateCell = document.createElement("td");
      dateCell.className = "px-3 py-3 border-r border-gray-300";
      dateCell.textContent = entry.date;
      tr.appendChild(dateCell);

      const nameCell = document.createElement("td");
      nameCell.className = "px-3 py-3 border-r border-gray-300";
      nameCell.textContent = entry.name;
      tr.appendChild(nameCell);

      const productCell = document.createElement("td");
      productCell.className = "px-6 py-3 border-r border-gray-300";
      productCell.textContent = entry.item || entry.type;
      tr.appendChild(productCell);

      if (creditSide) {
        const emptyCell = document.createElement("td");
        emptyCell.className = "text-right px-6 py-3 border-r border-gray-300";
        emptyCell.textContent = "";
        tr.appendChild(emptyCell);
      }

      const weightCell = document.createElement("td");
      weightCell.className = "text-right px-6 py-3 border-r border-gray-300";
      weightCell.textContent = entry.fine_weight.toFixed(2);
      tr.appendChild(weightCell);

      if (debitSide) {
        tr.removeChild(tr.lastElementChild);
        tr.appendChild(weightCell);
      }

      booksList.appendChild(tr);

      if (debitSide) {
        totalDebit += entry.fine_weight;
      }
      if (creditSide) {
        totalCredit += entry.fine_weight;
      }
    }
  });
  document.getElementById("totalDebit").textContent = totalDebit.toFixed(2);
  document.getElementById("totalCredit").textContent = totalCredit.toFixed(2);
  calcClosing();
};

tallyZ();

searchBtn.addEventListener("click", tallyZ);

const calcClosing = () => {
  if (totalCredit > totalDebit) {
    const closingCredit = totalCredit - totalDebit;
    document.getElementById("closingCredit").textContent =
      closingCredit.toFixed(2);
    document.getElementById("closingDebit").textContent = 0;
  } else if (totalCredit < totalDebit) {
    const closingDebit = totalDebit - totalCredit;
    document.getElementById("closingDebit").textContent =
      closingDebit.toFixed(2);
    document.getElementById("closingCredit").textContent = 0;
  } else {
    document.getElementById("closingCredit").textContent = 0;
    document.getElementById("closingDebit").textContent = 0;
  }
};
