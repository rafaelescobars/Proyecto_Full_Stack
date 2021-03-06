const addProductTableClick = (e, productTableId, saleId) => {
  e.preventDefault();
  // console.log(document.getElementById(`${productTableId}`).id);
  const data = {
    productTableId,
  };
  axios.put("/tables/product/add", data).then(
    (value) => {
      window.location = `/tables/pay/${saleId}`;
    },
    (reason) => {
      console.log(reason);
    }
  );
};

const subProductTableClick = (e, productTableId, saleId) => {
  e.preventDefault();
  // console.log(document.getElementById(`${productTableId}`).id);
  const data = {
    productTableId,
    saleId,
  };

  axios.get(`/tables/product/${productTableId}`).then(
    (valueGet) => {
      // console.log(valueGet.data.quantity);
      if (valueGet.data.quantity > 1) {
        axios.put("/tables/product/sub", data).then(
          (value) => {
            window.location = `/tables/pay/${saleId}`;
          },
          (reason) => {
            console.log(reason);
          }
        );
      } else {
        axios.delete(`/tables/product`, { data }).then(
          (value) => {
            window.location = `/tables`;
          },
          (reason) => {
            console.log(reason);
          }
        );
      }
    },
    (reason) => {
      console.log(reason);
    }
  );

  // const quantitiesCollection = document.getElementsByClassName("quantity");

  // const quantities = [...quantitiesCollection];

  // quantities.forEach((element) => {
  //   if (element.innerHTML * 1 > 1) {
  //     console.log("ok");
  //     axios.put("/tables/product/sub", data).then(
  //       (value) => {
  //         window.location = `/tables/pay/${saleId}`;
  //       },
  //       (reason) => {
  //         console.log(reason);
  //       }
  //     );
  //   } else {
  //     axios.delete(`/tables/product`, { data }).then(
  //       (value) => {
  //         window.location = `/tables`;
  //       },
  //       (reason) => {
  //         console.log(reason);
  //       }
  //     );
  //   }
  // });
};

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

const numberFormat = () => {
  const pricesCollection = document.getElementsByClassName("price");

  const prices = [...pricesCollection];

  prices.forEach((element) => {
    element.innerHTML = (element.innerHTML * 1).toLocaleString("de-DE");
  });

  const totalsCollection = document.getElementsByClassName("total");

  const totals = [...totalsCollection];

  totals.forEach((element) => {
    element.innerHTML = (element.innerHTML * 1).toLocaleString("de-DE");
  });

  const tdTotal = document.getElementById("total");

  tdTotal.innerHTML = (tdTotal.innerHTML * 1).toLocaleString("de-DE");
};

window.addEventListener("load", numberFormat());
