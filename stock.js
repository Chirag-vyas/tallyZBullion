const dateInput = document.getElementById("date");
const itemInput = document.getElementById("items");
const grossWeightInput = document.getElementById("gross-weight");
const purityInput = document.getElementById("purity");
const fineWeightInput = document.getElementById("fine-weight");
const rateInput = document.getElementById("rate");
const amountInput = document.getElementById("amount");
const btn = document.getElementById("submitBtn");
const statusBar = document.getElementById("status-bar");
const statusMessage = document.getElementById("status-message");

//calculations
grossWeightInput.addEventListener("input", calculateValues);
purityInput.addEventListener("input", calculateValues);
rateInput.addEventListener("input", calculateValues);
amountInput.addEventListener("input", calculateValues);
itemInput.addEventListener("change", () => {
  const selectedItem = itemInput.value;
  if (selectedItem === "gold-lagadi" || selectedItem === "silver-gat") {
    grossWeightInput.parentElement.removeAttribute("style");
    purityInput.parentElement.removeAttribute("style");
  } else {
    grossWeightInput.parentElement.style.display = "none";
    purityInput.parentElement.style.display = "none";
  }
});

function calculateValues() {
  const selectedItem = itemInput.value;
  const grossWeightValue = parseFloat(grossWeightInput.value) || 0;
  const purityValue = parseFloat(purityInput.value) || 0;
  const rateValue = parseFloat(rateInput.value) || 0;
  if (selectedItem === "gold-lagadi" || selectedItem === "silver-gat") {
    grossWeightInput.parentElement.removeAttribute("style");
    const fineWeightValue = grossWeightValue * (purityValue / 100);
    const amountValue = fineWeightValue * rateValue;
    fineWeightInput.value = fineWeightValue.toFixed(2);
    const amountInput = document.getElementById("amount");
    amountInput.value = amountValue;
    const formattedAmount = formatIndianCurrency(amountValue);
    document.getElementById("finalAmount").innerHTML = formattedAmount;
  } else {
    grossWeightInput.parentElement.style.display = "none";
    const fineWeightValue = parseFloat(fineWeightInput.value) || 0;
    const rateValue = parseFloat(rateInput.value) || 0;
    const amt = fineWeightValue * rateValue;
    amountInput.value = amt;
    const formattedAmount = formatIndianCurrency(amt);
    document.getElementById("finalAmount").innerHTML = formattedAmount;
  }
}

//form submission
btn.addEventListener("click", async (e) => {
  e.preventDefault();
  const dateValue = document.getElementById("date").value;
  const itemsValue = document.getElementById("items").value;
  const gross_weight = document.getElementById("gross-weight").value;
  const purity = document.getElementById("purity").value;
  const fineWeightValue = parseFloat(fineWeightInput.value) || 0;
  const rateValue = parseFloat(document.getElementById("rate").value) || 0;
  const amountValue = amountInput.value || 0;
  if (!dateValue || !fineWeightValue || !rateValue) {
    const message = `All fields required.`;
    const status = "Danger";
    showStatus(message, status);
    return;
  }

  try {
    await window.api.addStock(
      dateValue,
      itemsValue,
      gross_weight,
      purity,
      fineWeightValue,
      rateValue,
      amountValue
    );
    const message = "Stock Added.";
    const status = "Success";
    showStatus(message, status);
    resetInputFields();
  } catch (error) {
    console.log("Error adding purchases: ", error);
  }
});

function showStatus(message, status) {
  statusMessage.textContent = message;
  if (status == "Success") {
    statusBar.classList.add("bg-green-500");
    statusBar.classList.remove("bg-red-500");
  } else {
    statusBar.classList.remove("bg-green-500");
    statusBar.classList.add("bg-red-500");
  }

  statusBar.style.display = "block";
  setTimeout(() => {
    hideStatus();
  }, 3000);
}

function hideStatus() {
  statusBar.style.display = "none";
}

function formatIndianCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(amount);
}

function resetInputFields() {
  const inputElements = document.querySelectorAll("input");
  document.getElementById("finalAmount").innerHTML = "";
  inputElements.forEach((input) => {
    if (input !== dateInput) {
      input.value = "";
    }
  });
}
