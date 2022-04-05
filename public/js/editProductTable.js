const productId = document.querySelector("#productId");

const productQuantity = document.querySelector("#productQuantity");
const productPrice = document.querySelector("#productPrice");
const localTable = document.querySelector("h2").innerHTML;

const productSaleId = document.querySelector("h3").innerHTML;

const data = {
  productSaleId,
};

const getEditProductTable = () => {
  // console.log(productSaleId);

  axios.get(`/tables/products/edit/${productSaleId}`).then(
    (value) => {
      document.getElementById(`${value.data.product_id}`).selected = "selected";
      productQuantity.value = value.data.quantity;
      productPrice.value = value.data.sale_price;
    },
    (reason) => {
      console.log(reason);
    }
  );
};

window.onload = getEditProductTable();

const editProductTablePut = (e) => {
  e.preventDefault();
  const data = {
    productSaleId,
    productId: productId.value,
    productQuantity: productQuantity.value,
    productPrice: productPrice.value,
  };

  axios.put(`/tables/product`, data).then(
    (value) => {
      // console.log(value);
      window.location = `/tables/edit/${value.data.sale_id}`;
    },
    (reason) => {
      console.log(reason);
    }
  );
};

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
