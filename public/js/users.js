const newUserPost = (e) => {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const password2 = document.querySelector("#password2").value;

  const newUser = {
    email,
    password,
  };

  if (password == password2 && password != "") {
    axios.post("/users/new", newUser).then(
      (values) => {
        window.location = "/users";
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
};

const editUserPut = (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const password2 = document.querySelector("#password2").value;
  const id = document.querySelector("h2").innerHTML;
  console.log(id);
  const data = {
    id,
    email,
    password,
  };

  if (password == password2 && password != "") {
    axios.put("/users/edit", data).then(
      (value) => {
        window.location = "/users";
      },
      (reason) => {
        console.log(reason);
      }
    );
  } else {
    alert("Las contraseñas deben existir y coincidir.");
  }
};

const deleteUserClick = (e, id) => {
  e.preventDefault();

  console.log(id);

  axios.delete(`/users/delete/${id}`).then(
    (value) => {
      window.location.href = "/users";
    },
    (reason) => {
      console.log(reason);
    }
  );
};
