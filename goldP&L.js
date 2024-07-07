const goldSalesCashWeight = document.getElementById("goldSalesCashWeight");
const goldSalesCashAmount = document.getElementById("goldSalesCashAmount");
const goldSalesBillWeight = document.getElementById("goldSalesBillWeight");
const goldSalesBillAmount = document.getElementById("goldSalesBillAmount");

const goldPurchasesCashWeight = document.getElementById(
  "goldPurchasesCashWeight"
);
const goldPurchasesCashAmount = document.getElementById(
  "goldPurchasesCashAmount"
);
const goldPurchasesBillWeight = document.getElementById(
  "goldPurchasesBillWeight"
);
const goldPurchasesBillAmount = document.getElementById(
  "goldPurchasesBillAmount"
);

// const openingBal = window.api.get

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
  const salesGoldCashData = await window.api.getSalesGoldCash();
  console.log("Sales Gold Cash weight and amount: ", salesGoldCashData);
  console.log("SalesGoldCashData", salesGoldCashData.fine_weight);
  let salesGoldCashWeight = 0;
  let salesGoldCashAmount = 0;
  salesGoldCashData.forEach((cashData) => {
    salesGoldCashWeight += cashData.fine_weight;
    salesGoldCashAmount += cashData.amount;
  });
  console.log("SalesGoldCashWeight", salesGoldCashWeight);
  allSalesWeight += salesGoldCashWeight;
  allSalesAmount += salesGoldCashAmount;
  goldSalesCashWeight.textContent = salesGoldCashWeight.toFixed(2) + " gms";
  goldSalesCashAmount.textContent = formatIndianCurrency(salesGoldCashAmount);

  const salesGoldBillData = await window.api.getSalesGoldBill();
  console.log("salesGoldBill", salesGoldBillData);
  let salesGoldBillWeight = 0;
  let salesGoldBillAmount = 0;
  salesGoldBillData.forEach((billData) => {
    salesGoldBillWeight += billData.fine_weight;
    salesGoldBillAmount += billData.amount;
  });
  allSalesWeight += salesGoldBillWeight;
  allSalesAmount += salesGoldBillAmount;
  goldSalesBillWeight.textContent = salesGoldBillWeight.toFixed(2) + " gms";
  goldSalesBillAmount.textContent = formatIndianCurrency(salesGoldBillAmount);
  console.log("sales Gold Bill", salesGoldBillWeight);

  const purchasesGoldCashData = await window.api.getPurchasesGoldCash();
  let purchasesGoldCashWeight = 0;
  let purchasesGoldCashAmount = 0;
  purchasesGoldCashData.forEach((cashDataPurchase) => {
    purchasesGoldCashWeight += cashDataPurchase.fine_weight;
    purchasesGoldCashAmount += cashDataPurchase.amount;
  });
  console.log("purchaseGoldCashWeight", purchasesGoldCashWeight);
  allPurchasesWeight += purchasesGoldCashWeight;
  allPurchasesAmount += purchasesGoldCashAmount;
  goldPurchasesCashWeight.textContent =
    purchasesGoldCashWeight.toFixed(2) + " gms";
  goldPurchasesCashAmount.textContent = formatIndianCurrency(
    purchasesGoldCashAmount
  );

  const purchasesGoldBillData = await window.api.getPurchasesGoldBill();
  let purchasesGoldBillWeight = 0;
  let purchasesGoldBillAmount = 0;
  purchasesGoldBillData.forEach((cashDataPurchase) => {
    purchasesGoldBillWeight += cashDataPurchase.fine_weight;
    purchasesGoldBillAmount += cashDataPurchase.amount;
  });
  allPurchasesWeight += purchasesGoldBillWeight;
  allPurchasesAmount += purchasesGoldBillAmount;
  goldPurchasesBillWeight.textContent =
    purchasesGoldBillWeight.toFixed(2) + " gms";
  goldPurchasesBillAmount.textContent = formatIndianCurrency(
    purchasesGoldBillAmount
  );

  let openingGoldWeight = 0;
  let openingGoldAmount = 0;
  let closingGoldWeight = 0;
  let closingGoldAmount = 0;

  const openingGold = await window.api.getFineGold();

  openingGold.forEach((gold) => {
    closingGoldWeight += gold.fine_weight;
    closingGoldAmount += gold.amount;
    openingGoldWeight += gold.fine_weight;
    openingGoldAmount += gold.amount;
  });

  document.getElementById("openingGoldWeight").textContent =
    openingGoldWeight + " gms";
  document.getElementById("openingGoldAmount").textContent =
    formatIndianCurrency(openingGoldAmount);

  purchasesGoldCashData.forEach((cashDataPurchase) => {
    closingGoldWeight += cashDataPurchase.fine_weight;
    closingGoldAmount += cashDataPurchase.amount;
  });

  purchasesGoldBillData.forEach((cashDataPurchase) => {
    closingGoldWeight += cashDataPurchase.fine_weight;
    closingGoldAmount += cashDataPurchase.amount;
  });

  salesGoldCashData.forEach((cashData) => {
    closingGoldAmount -= cashData.amount;
    closingGoldWeight -= cashData.fine_weight;
  });

  salesGoldBillData.forEach((billData) => {
    closingGoldWeight -= billData.fine_weight;
    closingGoldAmount -= billData.amount;
  });

  document.getElementById("closingGoldWeight").textContent =
    closingGoldWeight.toFixed(2) + " gms";
  document.getElementById("closingGoldAmount").textContent =
    formatIndianCurrency(closingGoldAmount);

  document.getElementById("subTotalSalesWeight").textContent =
    allSalesWeight.toFixed(2) + " gms";
  document.getElementById("subTotalSalesAmount").textContent =
    formatIndianCurrency(allSalesAmount);

  const tallyAmount = allSalesAmount - allPurchasesAmount;

  document.getElementById("netProfitAmount").textContent =
    formatIndianCurrency(tallyAmount);

  const tallyWeight = allSalesWeight - allPurchasesWeight;

  const allPurchasesWeightWithTally = allPurchasesWeight + tallyWeight;

  document.getElementById("subTotalPurchasesWeight").textContent =
    allPurchasesWeightWithTally.toFixed(2) + " gms";

  const allPurchasesAmountWithTally = allPurchasesAmount + tallyAmount;

  document.getElementById("subTotalPurchasesAmount").textContent =
    formatIndianCurrency(allPurchasesAmountWithTally);
};

tallyZ();
