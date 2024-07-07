// document.getElementById("settingsCloseBtn").addEventListener("click", () => {
//   window.api.closeSettings();
// });

const companyName = document.getElementById("companyName").value;
const fromDate = document.getElementById("fromDate").value;
const toDate = document.getElementById("toDate").value;

const createCompanyBtn = document.getElementById("createCompanyBtn");

console.log("create database button clicked");

createCompanyBtn.addEventListener("click", async () => {
  await window.api.createNewDatabase(companyName, fromDate, toDate);
  try {
    console.log("Button Clicked!");
    // Your existing code...
  } catch (error) {
    console.error(error);
  }
});
