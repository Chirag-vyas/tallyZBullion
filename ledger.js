const nameInput = document.getElementById("name");
const underInput = document.getElementById("under");
const openingBalInput = document.getElementById("openingBal");
const dr_crInput = document.getElementById("dr-cr");
const btn = document.getElementById("submitBtn");
const statusBar = document.getElementById("status-bar");
const statusMessage = document.getElementById("status-message");

const checkname = async () => {
  const inputValue = nameInput.value;
  await window.api.checkIfNameExists(inputValue, (err, exists) => {
    if (err) {
      console.log("Error:", err);
    } else {
      if (exists) {
        const message = `Ledger "${inputValue}" exists.`;
        // message.classList.add("text-sm");
        const status = "Danger";
        showStatus(message, status);
        resetInputFields();
      }
    }
  });
};

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

/*nameInput.addEventListener("input", async () => {
  const inputValue = nameInput.value;
  await window.api.checkIfNameExists(inputValue, (err, exists) => {
    if (err) {
      console.log("Error:", err);
    } else {
      if (exists) {
        const message = `Name "${inputValue}" exists in the ledger.`;
        showStatus(message);
      }
    }
  });
});*/

/*nameInput.addEventListener("input", async () => {
  try {
    const exists = await checkIfNameExists(nameInput.value);

    if (exists) {
      alert(`Name "${nameInput.value}" already exists in the ledger.`);
    } else {
      console.log(`Name "${nameInput.value}" does not exist in the ledger.`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});*/

nameInput.addEventListener("input", function () {
  const inputValue = nameInput.value;
  checkname();
  const words = inputValue.split(" ");
  const capitalizedWords = words.map((word) => {
    // Capitalize the first letter of each word
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the capitalized words back into a sentence
  const capitalizedInput = capitalizedWords.join(" ");

  // Update the input field with the capitalized text
  nameInput.value = capitalizedInput;
});

/*openingBalInput.addEventListener("input", () => {
  const opnBal = openingBalInput.value;
  const formattedBal = formatIndianCurrency(opnBal);
  openingBalInput.value = formattedBal;
});*/

/*openingBalInput.addEventListener("input", function () {
  let value = this.value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except for decimals
  value = parseFloat(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  this.value = value;
});*/

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  const name = nameInput.value;
  const under = underInput.value;
  const openingBal = openingBalInput.value || 0;
  const dr_cr = dr_crInput.value;
  if (!name) {
    nameInput.classList.add("border-red-500");
    setTimeout(() => {
      nameInput.classList.remove("border-red-500");
    }, 2000);
    const message = `Name required.`;
    const status = "Danger";
    showStatus(message, status);
    return;
  }
  try {
    await window.api.addLedgers(name, under, openingBal, dr_cr);
    const message = `Ledger Created.`;
    const status = "Success";
    showStatus(message, status);
    resetInputFields();
  } catch (error) {
    console.log("Error adding ledger: ", error);
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
}
