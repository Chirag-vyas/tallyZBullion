const fineGold = document.getElementById("fine-gold");
const fineSilver = document.getElementById("fine-silver");
const goldLagadi = document.getElementById("gold-lagadi");
const silverGat = document.getElementById("silver-gat");

const stockReport = async () => {
  const goldPurchases = await window.api.getPurchasesGold();
  const silverPurchases = await window.api.getPurchasesSilver();
  const goldSales = await window.api.getSalesGold();
  const silverSales = await window.api.getSalesSilver();

  console.log("silver Purchases", silverPurchases);
  console.log("silver Sales", silverSales);

  window.api
    .getFineGold()
    .then((fineGold) => {
      goldPurchases.forEach((purchase) => {
        fineGold[0].fine_weight += purchase.fine_weight;
      });
      goldSales.forEach((sale) => {
        fineGold[0].fine_weight -= sale.fine_weight;
      });
      const fineGoldWeight = fineGold[0].fine_weight; // Assuming it returns an array
      document.getElementById("fine-gold").innerHTML =
        fineGoldWeight.toFixed(2) + " gms";
    })
    .catch((error) => {
      console.error("Error fetching fine gold: ", error);
    });

  window.api
    .getFineSilver()
    .then((fineSilver) => {
      silverPurchases.forEach((purchase) => {
        fineSilver[0].fine_weight += purchase.fine_weight;
      });
      silverSales.forEach((sale) => {
        fineSilver[0].fine_weight -= sale.fine_weight;
      });
      const fineSilverWeight = fineSilver[0].fine_weight; // Assuming it returns an array
      document.getElementById("fine-silver").innerHTML =
        fineSilverWeight.toFixed(2) + " gms";
      console.log("fineSilverWeight", fineSilverWeight);
    })
    .catch((error) => {
      console.error("Error fetching fine silver: ", error);
    });

  // window.api
  //   .getGoldLagadi()
  //   .then((goldLagadi) => {
  //     outstandingPurchases.forEach((purchase) => {
  //       goldLagadi[0].amount += purchase.outstanding;
  //     });
  //     amountPurchases.forEach((purchase) => {
  //       goldLagadi[0].amount += purchase.amount;
  //     });
  //     outstandingSales.forEach((sale) => {
  //       goldLagadi[0].amount -= sale.outstanding;
  //     });
  //     amountSales.forEach((sale) => {
  //       goldLagadi[0].amount -= sale.amount;
  //     });
  //     const goldLagadiAmt = goldLagadi[0].amount; // Assuming it returns an array
  //     const formattedAmt = formatIndianCurrency(goldLagadiAmt);
  //     document.getElementById("gold-lagadi").innerHTML = formattedAmt;
  //   })
  //   .catch((error) => {
  //     console.error("Error fetching fine gold: ", error);
  //   });

  // window.api;
  // .getSilverGat()
  // .then((silverGat) => {
  //   outstandingPurchases.forEach((purchase) => {
  //     silverGat[0].amount += purchase.outstanding;
  //   });
  //   amountPurchases.forEach((purchase) => {
  //     silverGat[0].amount += purchase.amount;
  //   });
  //   outstandingSales.forEach((sale) => {
  //     silverGat[0].amount -= sale.outstanding;
  //   });
  //   amountSales.forEach((sale) => {
  //     silverGat[0].amount -= sale.amount;
  //   });
  //   const silverGatAmt = silverGat[0].amount; // Assuming it returns an array
  //   const formattedAmt = formatIndianCurrency(silverGatAmt);
  //   document.getElementById("silver-gat").innerHTML = formattedAmt;
  // })
  // .catch((error) => {
  //   console.error("Error fetching silver gat: ", error);
  // });
};

stockReport();

function formatIndianCurrency(amount) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  return formatter.format(amount);
}
