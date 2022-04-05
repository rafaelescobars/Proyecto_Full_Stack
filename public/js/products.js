const newProductPost = (e) => {
  e.preventDefault();
  const name = document.querySelector("#name").value;
  const description = document.querySelector("#description").value;
  const owner = document.querySelector("#owner").value;
  const price = document.querySelector("#price").value;

  const newUser = {
    name,
    description,
    owner,
    price,
  };

  axios.post("/products/new", newUser).then(
    (values) => {
      window.location = "/products";
    },
    (reason) => {
      console.log(reason);
    }
  );
};

const editProductPut = (e) => {
  e.preventDefault();

  const id = document.querySelector("h2").innerHTML;

  const name = document.querySelector("#name").value;
  const description = document.querySelector("#description").value;
  const owner = document.querySelector("#owner").value;
  const price = document.querySelector("#price").value;

  const editedProduct = {
    id,
    name,
    description,
    owner,
    price,
  };

  axios.put("/products/edit", editedProduct).then(
    (value) => {
      window.location = "/products";
    },
    (reason) => {
      console.log(reason);
    }
  );
};

const deleteProductClick = (e, id) => {
  e.preventDefault();

  axios.delete(`/products/delete/${id}`).then(
    (value) => {
      window.location.href = "/products";
    },
    (reason) => {
      console.log(reason);
    }
  );
};
