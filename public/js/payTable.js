const payTable = (e, saleId) => {
  e.preventDefault();

  const paymentType = document.getElementById("payment-type").value;

  const data = { saleId, paymentType };

  axios.put("/tables/pay", data).then(
    (value) => {
      window.location = "/sales";
    },
    (reason) => {
      console.log(reason);
    }
  );
};
