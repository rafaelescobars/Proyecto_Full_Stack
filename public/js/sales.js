const numberFormat = () => {
  const totalsCollection = document.getElementsByClassName("total");

  const totals = [...totalsCollection];

  totals.forEach((element) => {
    element.innerHTML = (element.innerHTML * 1).toLocaleString("de-DE");
  });
};

window.onload = numberFormat();
