var aspectRatio = 2;
window.addEventListener("load", () => {
    if (window.innerWidth <= 767) {
        aspectRatio = 1;
    } else if (window.innerWidth > 767) {
        aspectRatio = 2;
    }
})

window.addEventListener("resize", () => {
    if (window.innerWidth <= 767) {
        aspectRatio = 1;
    } else if (window.innerWidth > 767) {
        aspectRatio = 2;
    }
})

$(document).ready(() => {
    var state = {
        'querySet': undefined,
        'page': 1,
        'rows': 10,
        'window': 3

    }
    getData();
    //ajax start////////
    async function getData() {
        try {

            let data = await fetch("https://api.coronatracker.com/v3/stats/worldometer/country");

            if (data.status == 200) {
                console.log("yesss");
                data = await data.json();
                state.querySet = data;
                getGlobalData();
                console.log(data);
                insert();
                search(data);
                getLocationAndInsertIt(data);
                topTenCountries();


            } else {
                console.log("NOo")
                getData();
            }
            //////////////////////

        } catch (err) {
            console.error(err);
        }

    }

    function insert() {
        let newData = pagination(state.querySet, state.page, state.rows);
        let data = newData.querySet;
        for (let i = 0; i < data.length; i++) {
            if (data[i].countryCode == null) {
                continue;
            } else {
                let country = data[i].country;
                let total = data[i].totalConfirmed;
                let death = data[i].totalDeaths;
                let critical = data[i].totalCritical;
                let recovered = data[i].totalRecovered;
                let active = data[i].activeCases;

                let html = `<tr class="tr">
              <td class="text-center align-middle">${country}</td>
              <td class="text-center align-middle">${total}</td>
              <td class="text-center align-middle">${death} <span class="badge badge-danger">${getPercent(total,death)}%</span></td>
              <td class="text-center align-middle">${critical} <span class="badge badge-danger">${getPercent(active,critical)}%</span></td>
              <td class="text-center align-middle">${recovered} <span class="badge badge-success">${getPercent(total,recovered)}%</span></td>
              <td class="text-center align-middle">${active} <span class="badge badge-warning">${getPercent(total,active)}%</span></td>
          </tr>`
                $("#all-countries").append(html);
            }

        }
        paginationBtns(newData.pages, state.page);
        //datalist part
        var datalist = "";
        for (let i = 0; i < data.length; i++) {
            if (data[i].countryCode == null) {
                continue;
            } else {
                datalist += `<option value="${data[i].countryCode}"> <img class="flag-icon" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/${data[i].countryCode.toLowerCase()}.svg" alt="${data[i].country}-flag" >${data[i].country}</option>`
            }
        }
        $("#list").append(datalist);
    }


    ////////ajax end/////
    //top ten countries//
    async function topTenCountries() {

        try {
            let data = await fetch("https://api.coronatracker.com/v3/stats/worldometer/topCountry?limit=8&sort=-confirmed");
            data = await data.json();

            for (let i = 0; i < data.length; i += 2) {
                let html = `<div class="col col-lg-6 mx-auto row d-flex flex-column flex-sm-column flex-md-row">

                <div class="col mb-3">
                    <div class="card shadow rounded">
                    <div class="card-body">
                    <p>${data[i].country}</p>
                    <p>total ${data[i].totalConfirmed}</p>
                    <p>active ${data[i].activeCases} <span class="badge badge-warning">${getPercent(data[i].totalConfirmed,data[i].activeCases)}%</span></p>
                    <p>death  ${data[i].totalDeaths}  <span class="badge badge-danger">${getPercent(data[i].totalConfirmed,data[i].totalDeaths)}%</span></p>
                    <p>Recoverd ${data[i].totalRecovered}  <span class="badge badge-success">${getPercent(data[i].totalConfirmed,data[i].totalRecovered)}%</span></p>
                </div>
                    </div>
                </div>
                <div class="col mb-3">
                    <div class="card shadow rounded">
                    <div class="card-body">
                    <p>${data[i+1].country}</p>
                    <p>total ${data[i+1].totalConfirmed}</p>
                    <p>active ${data[i+1].activeCases} <span class="badge badge-warning">${getPercent(data[i+1].totalConfirmed,data[i+1].activeCases)}%</span></p>
                    <p>death  ${data[i+1].totalDeaths}  <span class="badge badge-danger">${getPercent(data[i+1].totalConfirmed,data[i+1].totalDeaths)}%</span></p>
                    <p>Recoverd ${data[i+1].totalRecovered}  <span class="badge badge-success">${getPercent(data[i+1].totalConfirmed,data[i+1].totalRecovered)}%</span></p>
                </div>
                    </div>
                </div>
                
                </div>`
                $("#top-ten").append(html)
            }
            console.log(data);
        } catch (error) {
            console.log(error)
        }







    };



    ////////////////////
    //pagination///
    function pagination(querySet, page, rows) {
        var start = (page - 1) * rows;
        var end = start + rows;

        var trimedData = querySet.slice(start, end);
        var pages = Math.ceil(querySet.length / rows);
        return {
            'querySet': trimedData,
            'pages': pages
        }
    }

    function paginationBtns(pages, currentPage) {
        console.log("hellooooo")
        let tbl = $("#all-countries");
        // var ul = $("#pagination-ul");
        let ul = document.getElementById("pagination-ul")

        let maxLeft = (state.page - Math.floor(state.window / 2));
        let maxRight = (state.page + Math.floor(state.window / 2));

        if (maxLeft < 1) {
            maxLeft = 1;
            maxRight = state.window
        }
        if (maxRight > pages) {
            maxLeft = pages - (state.window - 1);
            maxRight = pages;
            if (maxLeft < 1) {
                maxLeft = 1;
            }
        }
        for (var i = maxLeft; i <= maxRight; i++) {
            if (i == currentPage) {
                ul.innerHTML += ` <li class="page-item btn-page active" ><button class="page-link" data-page="${i}">${i}</button></li>`;
            } else {
                ul.innerHTML += ` <li class="page-item btn-page" ><button class="page-link" href="" data-page="${i}">${i}</button></li>`;
            }

        }

        if (state.page != 1) {
            ul.innerHTML = ` <li class="page-item btn-page" ><button class="page-link"  data-page="1">first</button></li>` + ul.innerHTML;
        }

        if (state.page != pages) {
            ul.innerHTML += ` <li class="page-item btn-page" ><button class="page-link" href="" data-page="${pages}">last</button></li>`
        }


        $(".btn-page").click((e) => {
            // ulu.fadeOut(100);
            ul.innerHTML = "";
            tbl.empty();
            state.page = parseInt(e.target.getAttribute("data-page"));
            // console.log(state.page)
            // console.log(e.target)
            insert();
        })
    }


    // pagination end




    //geolocation//

    function getLocationAndInsertIt(data) {
        console.log("msg")
        if (navigator.geolocation) {
            console.log("msg2")
            let lat;
            let lng;
            let countryCode;
            navigator.geolocation.getCurrentPosition((alowRes) => {
                console.log("msg3")
                let res;
                lat = alowRes.coords.latitude.toFixed(2);
                lng = alowRes.coords.longitude.toFixed(2);
                console.log("msg4")
                for (let i = 0; i < data.length; i++) {
                    if (data[i].lat == null || data[i].lng == null) {
                        continue;
                    } else {
                        let dataLat = data[i].lat.toFixed(2);
                        let dataLng = data[i].lng.toFixed(2);
                        if (((lat + 4) >= dataLat && (lat - 4) <= dataLat) && (lng + 4) >= dataLng && (lng - 4) <= dataLng) {
                            countryCode = data[i].countryCode;
                            console.log("country")
                            res = true;
                        }
                    }

                }
                console.log(countryCode)
                if (res) {
                    insertClientCountryData(countryCode);
                    $(".loader").fadeOut(1000);
                } else {
                    $("#client-country-data").hide();
                    $(".loader").fadeOut(800);
                }
            }, (rejRes) => {
                console.log("msg3rej");
                $("#client-country-data").hide();
                $(".loader").fadeOut(800);
            })

        } else {
            $("#client-country-data").hide();
            $(".loader").fadeOut(800);
        }

    }


    /////
    //global data//
    async function getGlobalData() {
        try {
            let data = await fetch("https://api.coronatracker.com/v3/stats/worldometer/global");
            if (data.status == 200) {
                console.log("yesss");
                data = await data.json();
                // console.log(data);
                insertGlobalData(data)
            } else {
                console.log("NOo")
                getData();
            }
            //////////////////////

        } catch (err) {
            console.error(err);
        }
    }

    function insertGlobalData(allData) {
        let total = allData.totalConfirmed;
        let death = allData.totalDeaths;
        let recovered = allData.totalRecovered;
        let active = allData.totalActiveCases;
        $("#global-total-case").text(total)
        $("#total-death-number").text(death)
        $("#total-death-number-percent").text(getPercent(total, death) + "%")
        $("#total-recovered-number").text(recovered)
        $("#total-recovered-number-percent").text(getPercent(total, recovered) + "%")
        $("#total-active-number").text(active)
        $("#total-active-number-percent").text(getPercent(total, active) + "%")
        createChartBar(total, death, recovered, active);

    }
    //client country data
    async function insertClientCountryData(countryCode) {
        try {
            let data = await fetch(`https://api.coronatracker.com/v4/analytics/trend/country?countryCode=${countryCode}&startDate=2020-01-01&endDate=2020-09-01`);
            if (data.status == 200) {
                console.log("yesssClient");
                data = await data.json();
                console.log(data);
                let total = [];
                let death = [];
                let recoverd = [];
                let date = [];
                for (let i = 0; i < data.length; i++) {
                    total.push(data[i].total_confirmed);
                    death.push(data[i].total_deaths);
                    recoverd.push(data[i].total_recovered);
                    date.push(data[i].last_updated.slice(5, 10));
                }
                createCharLine(date, death, recoverd, total);
            } else {
                console.log("NOoClient")
                getData();
            }
            //////////////////////

        } catch (err) {
            console.error(err);
        }
    }
    // Bar chart
    function createChartBar(total, death, recoverd, active) {
        var ctx = document.getElementById('canvas-global-data').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    backgroundColor: "rgba(255,55,55,0)",
                    label: 'total',
                    data: [total],
                    backgroundColor: [
                        "rgba(0, 0, 0, 0.692)"
                    ],
                    borderColor: [
                        "rgba(0, 0, 0, 0.692)",
                    ],
                    borderWidth: 1,
                    order: 1
                }, {
                    backgroundColor: "rgba(255,55,55,0)",
                    label: 'death',
                    data: [death],
                    backgroundColor: [
                        "rgba(255, 0, 0, 0.815)"
                    ],
                    borderColor: [
                        "rgba(255, 0, 0, 0.815)"
                    ],
                    borderWidth: 1,
                    order: 1
                }, {
                    backgroundColor: "rgba(255,55,55,0)",
                    label: 'recoverd',
                    data: [recoverd],
                    backgroundColor: [
                        "rgba(31, 247, 78, 0.815)"
                    ],
                    borderColor: [
                        "rgba(31, 247, 78, 0.815)"
                    ],
                    borderWidth: 1,
                    order: 2
                }, {
                    backgroundColor: "rgba(255,55,55,0)",
                    label: 'active',
                    data: [active],
                    backgroundColor: [
                        "rgba(243, 247, 31, 0.815)"
                    ],
                    borderColor: [
                        "rgba(243, 247, 31, 0.815)"
                    ],
                    borderWidth: 1,
                    order: 1
                }]
            },
            options: {
                responsive: true,

                aspectRatio: aspectRatio,
                legend: {
                    display: false,
                    labels: {
                        // This more specific font property overrides the global property
                        fontColor: 'black',
                    }
                },

                title: {
                    display: true,
                    text: 'Custom Chart Title',
                    fontFamily: 'Raleway',
                    defaultFontSize: 20
                },
                animation: {
                    duration: 5000
                },

                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        })
    }
    //line chart
    function createCharLine(date, death, recoverd, total) {

        var ctx = document.getElementById('canvas-client-country-data').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: date,
                datasets: [{
                    backgroundColor: "rgba(255,55,55,0)",
                    label: 'death',
                    data: death,
                    backgroundColor: [
                        "rgba(255, 0, 0, 0.815)"
                    ],
                    borderColor: [
                        "rgba(255, 0, 0, 0.815)"
                    ],
                    borderWidth: 1,
                    order: 1
                }, {
                    backgroundColor: "rgba(255,55,55,0)",
                    label: 'recoverd',
                    data: recoverd,
                    backgroundColor: [
                        "rgba(31, 247, 78, 0.815)"
                    ],
                    borderColor: [
                        "rgba(31, 247, 78, 0.815)"
                    ],
                    borderWidth: 1,
                    order: 2
                }, {
                    backgroundColor: "rgba(255,55,55,0)",
                    label: 'active',
                    data: total,
                    backgroundColor: [
                        "rgba(243, 247, 31, 0.815)"
                    ],
                    borderColor: [
                        "rgba(243, 247, 31, 0.815)"
                    ],
                    borderWidth: 1,
                    order: 1
                }]
            },
            options: {
                responsive: true,

                aspectRatio: aspectRatio,
                title: {
                    display: true,
                    text: 'Custom Chart Title'
                },
                animation: {
                    duration: 2000
                },

                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        })

    }
    //search start///
    function search(data) {
        document.querySelector("#btn-search").addEventListener("click", () => {
            let code = document.getElementById("textBox").value;
            for (let i = 0; i < data.length; i++) {
                if (code === data[i].countryCode) {
                    let country = data[i].country;
                    let total = data[i].totalConfirmed;
                    let death = data[i].totalDeaths;
                    let critical = data[i].totalCritical;
                    let recovered = data[i].totalRecovered;
                    let active = data[i].activeCases;
                    console.log(country);

                    let card = `<div class="card shadow rounded">
                    <div class="card-body" id="search-card-body">
                    <p>${country}</p>
                    <p>total : ${total}</p>
                    <p>active ${active} <span class="badge badge-warning">${getPercent(total,active)}%</span></p>
                    <p>death ${death} <span class="badge badge-danger">${getPercent(total,death)}%</span></p>
                    <p>Recoverd ${recovered} <span class="badge badge-success">${getPercent(total,recovered)}%</span></p>
                      </div>
                     </div>`;
                    $("#search-card").append(card);
                }
            }
        })
    }
    ///search end///
})

function getPercent(total, current) {
    if (total == 0) {
        return "N/A";
    } else {
        return ((100 * current) / total).toFixed(1);
    }

}