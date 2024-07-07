const silverSalesCashWeight = document.getElementById("silverSalesCashWeight");
const silverSalesCashAmount = document.getElementById("silverSalesCashAmount");
const silverSalesBillWeight = document.getElementById("silverSalesBillWeight");
const silverSalesBillAmount = document.getElementById("silverSalesBillAmount");

const silverPurchasesCashWeight = document.getElementById(
  "silverPurchasesCashWeight"
);
const silverPurchasesCashAmount = document.getElementById(
  "silverPurchasesCashAmount"
);
const silverPurchasesBillWeight = document.getElementById(
  "silverPurchasesBillWeight"
);
const silverPurchasesBillAmount = document.getElementById(
  "silverPurchasesBillAmount"
);

function formatIndianCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(amount);
}

let allSalesWeight = 0;
let allSalesAmount = 0;
let allPurchasesWeight = 0;
let allPurchasesAmount = 0;

const tallyZ = async () => {
  const salesSilverCashData = await window.api.getSalesSilverCash();
  console.log("Sales Silver Cash weight and amount: ", salesSilverCashData);
  let salesSilverCashWeight = 0;
  let salesSilverCashAmount = 0;
  salesSilverCashData.forEach((cashData) => {
    salesSilverCashWeight += cashData.fine_weight;
    salesSilverCashAmount += cashData.amount;
  });
  allSalesWeight += salesSilverCashWeight;
  allSalesAmount += salesSilverCashAmount;
  silverSalesCashWeight.textContent = salesSilverCashWeight.toFixed(2) + " gms";
  silverSalesCashAmount.textContent = formatIndianCurrency(
    salesSilverCashAmount
  );

  const salesSilverBillData = await window.api.getSalesSilverBill();
  console.log("salesSilverBill", salesSilverBillData);
  let salesSilverBillWeight = 0;
  let salesSilverBillAmount = 0;
  salesSilverBillData.forEach((billData) => {
    salesSilverBillWeight += billData.fine_weight;
    salesSilverBillAmount += billData.amount;
  });

  allSalesWeight += salesSilverBillWeight;
  allSalesAmount += salesSilverBillAmount;
  silverSalesBillWeight.textContent = salesSilverBillWeight.toFixed(2) + " gms";
  silverSalesBillAmount.textContent = formatIndianCurrency(
    salesSilverBillAmount
  );
  console.log("sales Silver Bill", salesSilverBillWeight);

  const purchasesSilverCashData = await window.api.getPurchasesSilverCash();
  let purchasesSilverCashWeight = 0;
  let purchasesSilverCashAmount = 0;
  purchasesSilverCashData.forEach((cashDataPurchase) => {
    purchasesSilverCashWeight += cashDataPurchase.fine_weight;
    purchasesSilverCashAmount += cashDataPurchase.amount;
  });
  allPurchasesWeight += purchasesSilverCashWeight;
  allPurchasesAmount += purchasesSilverCashAmount;
  silverPurchasesCashWeight.textContent =
    purchasesSilverCashWeight.toFixed(2) + " gms";
  silverPurchasesCashAmount.textContent = formatIndianCurrency(
    purchasesSilverCashAmount
  );

  const purchasesSilverBillData = await window.api.getPurchasesSilverBill();
  let purchasesSilverBillWeight = 0;
  let purchasesSilverBillAmount = 0;
  purchasesSilverBillData.forEach((cashDataPurchase) => {
    purchasesSilverBillWeight += cashDataPurchase.fine_weight;
    purchasesSilverBillAmount += cashDataPurchase.amount;
  });
  allPurchasesWeight += purchasesSilverBillWeight;
  allPurchasesAmount += purchasesSilverBillAmount;
  silverPurchasesBillWeight.textContent =
    purchasesSilverBillWeight.toFixed(2) + " gms";
  silverPurchasesBillAmount.textContent = formatIndianCurrency(
    purchasesSilverBillAmount
  );

  let openingSilverWeight = 0;
  let openingSilverAmount = 0;
  let closingSilverWeight = 0;
  let closingSilverAmount = 0;

  const openingSilver = await window.api.getFineSilver();

  openingSilver.forEach((silver) => {
    closingSilverWeight += silver.fine_weight;
    closingSilverAmount += silver.amount;
    openingSilverWeight += silver.fine_weight;
    openingSilverAmount += silver.amount;
  });

  document.getElementById("openingSilverWeight").textContent =
    openingSilverWeight + " gms";
  document.getElementById("openingSilverAmount").textContent =
    formatIndianCurrency(openingSilverAmount);

  purchasesSilverCashData.forEach((cashDataPurchase) => {
    closingSilverWeight += cashDataPurchase.fine_weight;
    closingSilverAmount += cashDataPurchase.amount;
  });

  purchasesSilverBillData.forEach((cashDataPurchase) => {
    closingSilverWeight += cashDataPurchase.fine_weight;
    closingSilverAmount += cashDataPurchase.amount;
  });

  salesSilverCashData.forEach((cashData) => {
    closingSilverWeight -= cashData.fine_weight;
    closingSilverAmount -= cashData.amount;
  });

  salesSilverBillData.forEach((billData) => {
    closingSilverWeight -= billData.fine_weight;
    closingSilverAmount -= billData.amount;
  });

  document.getElementById("closingSilverWeight").textContent =
    closingSilverWeight.toFixed(2) + " gms";
  document.getElementById("closingSilverAmount").textContent =
    formatIndianCurrency(closingSilverAmount);

  document.getElementById("subTotalSalesWeight").textContent =
    allSalesWeight.toFixed(2) + " gms";
  document.getElementById("subTotalSalesAmount").textContent =
    formatIndianCurrency(allSalesAmount);

  const tallyAmount = allSalesAmount - allPurchasesAmount;

  const tallyWeight = allSalesWeight - allPurchasesWeight;

  document.getElementById("netProfitAmount").textContent =
    formatIndianCurrency(tallyAmount);

  const allPurchasesAmountWithTally = allPurchasesAmount + tallyAmount;
  const allPurchasesWeightWithTally = allPurchasesWeight + tallyWeight;

  document.getElementById("subTotalPurchasesWeight").textContent =
    allPurchasesWeightWithTally.toFixed(2) + " gms";

  document.getElementById("subTotalPurchasesAmount").textContent =
    formatIndianCurrency(allPurchasesAmountWithTally);
};

tallyZ();
