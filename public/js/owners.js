const newOwnerPost = (e) => {
  e.preventDefault();
  const name = document.querySelector("#name").value;

  const newOwner = {
    name,
  };

  axios.post("/owners/new", newOwner).then(
    (values) => {
      window.location = "/owners";
    },
    (reason) => {
      console.log(reason);
    }
  );
};

const editOwnerPut = (e) => {
  e.preventDefault();

  const name = document.querySelector("#name").value;
  const id = document.querySelector("h2").innerHTML;

  const data = {
    id,
    name,
  };

  axios.put("/owners/edit", data).then(
    (value) => {
      window.location = "/owners";
    },
    (reason) => {
      console.log(reason);
    }
  );
};

const deleteOwnerClick = (e, id) => {
  e.preventDefault();

  console.log(id);

  axios.delete(`/owners/delete/${id}`).then(
    (value) => {
      window.location.href = "/owners";
    },
    (reason) => {
      console.log(reason);
    }
  );
};
