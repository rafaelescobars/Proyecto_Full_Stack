const addProductTableClick = (e, productTableId, saleId) => {
  e.preventDefault();
  // console.log(document.getElementById(`${productTableId}`).id);
  const data = {
    productTableId,
  };
  axios.put("/tables/product/add", data).then(
    (value) => {
      window.location = `/tables/edit/${saleId}`;
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

  const quantitiesCollection = document.getElementsByClassName("quantity");

  const quantities = [...quantitiesCollection];

  quantities.forEach((element) => {
    if (element.innerHTML * 1 > 1) {
      // console.log("ok");
      axios.put("/tables/product/sub", data).then(
        (value) => {
          window.location = `/tables/edit/${saleId}`;
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
  });
};
