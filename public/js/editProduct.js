const getOwner = () => {
  const productId = document.querySelector("h2").innerHTML;
  axios.get(`/products/get/${productId}`).then(
    (value) => {
      document.getElementById(`${value.data.owner_id}`).selected = "selected";

      console.log(value);
    },
    (reason) => {
      console.log(reason);
    }
  );
};

window.onload = getOwner();
