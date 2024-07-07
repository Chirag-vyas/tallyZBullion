const grossWeightInput = document.getElementById("gross-weight");
const purityInput = document.getElementById("purity");
const rateInput = document.getElementById("rate");
const fineWeightInput = document.getElementById("fine-weight");
const amountInput = document.getElementById("amount");

grossWeightInput.addEventListener("input", calculateValues);
purityInput.addEventListener("input", calculateValues);
rateInput.addEventListener("input", calculateValues);

function calculateValues() {
  const grossWeightValue = parseFloat(grossWeightInput.value) || 0;
  const purityValue = parseFloat(purityInput.value) || 0;
  const rateValue = parseFloat(rateInput.value) || 0;

  const fineWeightValue = grossWeightValue * (purityValue / 100);
  const amountValue = fineWeightValue * rateValue;
  fineWeightInput.value = fineWeightValue.toFixed(2);
  amountInput.value = amountValue.toFixed(2);

  const formattedAmount = formatIndianCurrency(amountValue);
  document.getElementById("finalAmount").innerHTML = formattedAmount;
}

// Event listener for the submit button
const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", () => {
  const dateValue = document.getElementById("date").value;
  const nameValue = document.getElementById("name").value;
  const itemIdValue = document.getElementById("items").value;
  const salePurchaseValue = document.getElementById("sale-purchase").value;
  const grossWeightValue =
    parseFloat(document.getElementById("gross-weight").value) || 0;
  const purityValue = parseFloat(document.getElementById("purity").value) || 0;
  const rateValue = parseFloat(document.getElementById("rate").value) || 0;
  const fineWeightValue = parseFloat(fineWeightInput.value) || 0;
  const amountValue = parseFloat(amountInput.value) || 0;

  if (amountValue) {
    try {
      window.api.addTransaction(
        dateValue,
        nameValue,
        itemIdValue,
        salePurchaseValue,
        grossWeightValue,
        purityValue,
        fineWeightValue,
        rateValue,
        amountValue
      );
      resetInputFields();
      alert("Data added to the database");
    } catch (error) {
      console.log("Error adding data:", error);
    }
  }
});

function formatIndianCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(amount);
}

function resetInputFields() {
  const inputElements = document.querySelectorAll("input");
  inputElements.forEach((input) => {
    input.value = "";
  });

  const selectElement = document.getElementById("items");
  selectElement.selectedIndex = 0; // Reset the select box to the first option
}
