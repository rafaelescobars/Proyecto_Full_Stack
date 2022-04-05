const loginPost = (e) => {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const data = {
    email,
    password,
  };
  axios.post("/login", data).then(
    (value) => {
      window.location = "/";
    },
    (reason) => {
      console.log(reason);
    }
  );
};
