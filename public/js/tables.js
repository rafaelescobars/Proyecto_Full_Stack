const getOcupiedTables = () => {
  const localTablesCollection = document.getElementsByClassName("local-table");

  const localTables = [...localTablesCollection];

  axios.get("/tables/ocupied").then(
    (value) => {
      // console.log(value.data);
      localTables.forEach((localTableElement) => {
        value.data.forEach((ocupiedTableElement) => {
          if (localTableElement.id == ocupiedTableElement.local_table) {
            const saleId = ocupiedTableElement.id;
            const localTable = ocupiedTableElement.local_table;
            const email = ocupiedTableElement.email;
            const total = ocupiedTableElement.total;
            if (ocupiedTableElement.status == false) {
              const status = "Pendiente";
              localTableElement.innerHTML = `
            <td class="d-none" >${saleId}</td>
            <td>${localTable}</td>
            <td>${email}</td>
            <td>${(total * 1).toLocaleString("de-DE")}</td>
            <td>${status}</td>
            <td>
              <a href="/tables/edit/${saleId}" type="button" class="btn btn-primary">
                Ver/Editar
              </a>
              <a href="/tables/pay/${saleId}" type="button" class="btn btn-warning">
              Pagar
            </a>
            </td>`;
            }
          }
        });
      });
    },
    (reason) => {}
  );
};

window.onload = getOcupiedTables();
