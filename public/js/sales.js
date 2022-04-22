const numberFormat = () => {
  const totalsCollection = document.getElementsByClassName("total");

  const totals = [...totalsCollection];

  totals.forEach((element) => {
    element.innerHTML = (element.innerHTML * 1).toLocaleString("de-DE");
  });

  const totalSales = document.getElementById("total-sales");

  totalSales.innerHTML = (totalSales.innerHTML * 1).toLocaleString("de-DE");

  const totalPaymentType = document.getElementById("total-payment-type");

  totalPaymentType.innerHTML = (totalPaymentType.innerHTML * 1).toLocaleString(
    "de-DE"
  );
};

window.onload = numberFormat();
