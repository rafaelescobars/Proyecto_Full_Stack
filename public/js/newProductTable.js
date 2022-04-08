const getProductPrice = () => {
  const id = document.querySelector("#productId").value;
  const price = document.querySelector("#productPrice");

  axios.get(`/tables/product/price/${id}`, { id }).then(
    (value) => {
      price.value = value.data.price;
    },
    (reason) => {
      console.log(reason);
    }
  );
};

window.onload = getProductPrice();

const newProductTablePost = (e) => {
  e.preventDefault();
  const productId = document.querySelector("#productId").value;
  const productQuantity = document.querySelector("#productQuantity").value;
  const productPrice = document.querySelector("#productPrice").value;
  const localTable = document.querySelector("h2").innerHTML;
  const saleId = document.querySelector("h3").innerHTML;
  const userId = document.querySelector("#userId").innerHTML;

  console.log(saleId);

  const data = { saleId, productId, productQuantity, productPrice };

  axios.post(`/tables/product/new`, data).then((value) => {
    console.log(value);
    window.location = `/tables/edit/${value.data.sale_id}`;
  });
};
