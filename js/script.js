const form = document.getElementById("form-cep");
const cep = document.getElementById("cep");
const tbody = document.getElementById("enderecos-tbody");
const table = document.getElementById("table-enderecos");
const clean = document.getElementById("btn-clean");
const message = document.getElementById("start-wrapper");

const base_uri = "https://viacep.com.br/ws/";

function clearData(data) {
  const { cep, logradouro, bairro, localidade, uf } = data;
  const values = [cep, logradouro, bairro, localidade + "/" + uf];
  return values;
}

// function toLocalStorage(incomingData) {
//   let data = JSON.parse(localStorage.getItem("ceps"));
//   data.push(clearData(incomingData));
//   localStorage.setItem("ceps", JSON.stringify(data));
// }

function showTable() {
  if (localStorage.getItem("ceps") === null) {
    table.style.visibility = "hidden";
    clean.style.visibility = "hidden";
    message.style.visibility = "visible";
  } else {
    table.style.visibility = "visible";
    clean.style.visibility = "visible";
    message.style.visibility = "hidden";
  }
}

function addRow(data) {
  const values = clearData(data);

  const row = document.createElement("tr");

  values.forEach((elm) => {
    const cell = document.createElement("td");
    const cellText = document.createTextNode(elm);
    cell.appendChild(cellText);
    row.appendChild(cell);
  });

  tbody.appendChild(row);
}

function fetch_data() {
  const pattern = /[0-9]{2}(.|\s)?[0-9]{3}(.|\s)?[0-9]{2}\n/gm;
  const ok = cep.value.match(pattern);
  if (ok) {
    fetch(base_uri + cep.value + "/json/")
      .then((response) => response.json())
      .then((data) => {
        addRow(data);
        localStorage.setItem("ceps", JSON.stringify(clearData(data)));
        showTable();
      });
  } else {
    window.alert("CEP inválido");
  }
}

// search
if (form.addEventListener) {
  form.addEventListener(
    "submit",
    function (e) {
      e.preventDefault();
      fetch_data();
      cep.value = "";
    },
    false
  );
}

// clean
if (clean.addEventListener) {
  clean.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.clear();
    tbody.innerHTML = "";
    showTable();
  });
}

showTable();
