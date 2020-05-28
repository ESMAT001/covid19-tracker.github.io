// async function getData() {
//     let data = await fetch("https://coronavirus-19-api.herokuapp.com/countries");
//     console.log(data);
//     let newData = await data.json();
//     console.log(newData);

// }
// var data1;
async function getData() {
    try {
        let data = await fetch("https://api.covid19api.com/summary");
        console.log(data);
        data = await data.json();
        console.log(data);
        // data1 = newData;
        insert(data);
    } catch (err) {
        alert(err);
    }

}
getData();

function insert(data) {
    const container = document.querySelector(".all-data");
    for (let i = 0; i < data.Countries.length; i++) {
        let div = document.createElement("div");


        // const data = `<tr>
        // <td>${data1.Countries[i].Country}</td>
        // <td>${data1.Countries[i].TotalConfirmed}</td>
        // <td>${data1.Countries[i].TotalDeaths}</td>
        // <td>${data1.Countries[i].TotalRecovered}</td>
        // </tr>`;
        let finalData = `<div class="country">
          <h2 class="country-name">${data.Countries[i].Country}<span><button href="#"  target-tab="${data.Countries[i].CountryCode}"class="btn-x">x</button></span></h2>
          <div class="country-info open" id="${data.Countries[i].CountryCode}" close-tab="yes" style="height: 100px;">
          <p>total confirmed:${data.Countries[i].TotalConfirmed}</p>
          <p>total deaths:${data.Countries[i].TotalDeaths}</p>
          <p>total Recoverd:${data.Countries[i].TotalRecovered}</p>
          </div>
          </div>`
        div.innerHTML = finalData;


        container.insertAdjacentElement("beforeend", div)

    }

}