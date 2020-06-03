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
window.addEventListener("scroll", fadeEffect);
window.addEventListener("loadend", fadeEffect);

function fadeEffect(e) {
    // console.log(document.querySelector(".fade").getBoundingClientRect().top);
    // console.log(window.innerHeight);
    var num = document.querySelectorAll(".fade");
    var fadePoint = window.innerHeight / 1.4;
    var num2 = 0;

    for (let i = 0; i < num.length; i++) {
        if (num[i].getBoundingClientRect().top <= fadePoint) {
            // var x = document.querySelectorAll(".project");
            // for (var i = 0; i < x.length; i++) {
            //     x[i].classList.add("apear");
            // }
            num[i].classList.remove("fade");
            num[i].classList.add("apear");
            num2++;
            console.log("done");
            // this.removeEventListener("scroll", run);
        }

    }
    if (num2 === num.length) {
        window.removeEventListener("scroll", fadeEffect);
        console.log("donee");
    }
}
//navbtn

document.getElementById("navBtn").addEventListener("click", (e) => {
    let target = document.getElementById("navBtn").getAttribute("trgt");
    document.getElementById(target).classList.toggle("navBar-fade");
    document.getElementById(target).classList.toggle("navBar-apear");
})






$(document).ready(() => {
    var state = {
        'querySet': undefined,
        'page': 1,
        'rows': 10,
        'window': 3

    }
    getData();
    getGlobalData();
    topTenCountries();
    //ajax start////////
    async function getData() {
        try {

            let data = await fetch("https://api.coronatracker.com/v3/stats/worldometer/country");

            if (data.status == 200) {
                console.log("get data");
                console.log("yesss");
                data = await data.json();
                state.querySet = data;

                console.log(data);
                insert();
                search(data);
                getLocationAndInsertIt(data);



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
              <td class="text-center align-middle table-total">${total}</td>
              <td class="text-center align-middle table-death">${death} <span class="badge badge-danger">${getPercent(total,death)}%</span></td>
              <td class="text-center align-middle table-recovered">${recovered} <span class="badge badge-success">${getPercent(total,recovered)}%</span></td>
              <td class="text-center align-middle table-active">${active} <span class="badge badge-warning text-white">${getPercent(total,active)}%</span></td>
              <td class="text-center align-middle table-death">${critical} <span class="badge badge-danger">${getPercent(active,critical)}%</span></td>
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

            if (data.status == 200) {
                data = await data.json();
                console.log("ten")
                for (let i = 0; i < data.length; i += 2) {
                    let html = `<div class="col col-lg-6 mx-auto row d-flex flex-column flex-sm-column flex-md-row">

                <div class="col mb-3">
                    <div class="card shadow rounded h-100 fade">
                    <div class="card-body text-center">
                    <p class="h3 font-weight-light">${data[i].country}</p>
                    <p class="h4 font-weight-light text-primary">Total ${data[i].totalConfirmed}</p>
                    <p class="h4 font-weight-light text-warning">Active ${data[i].activeCases} <span class="badge badge-warning">${getPercent(data[i].totalConfirmed,data[i].activeCases)}%</span></p>
                    <p class="h4 font-weight-light text-danger">Death  ${data[i].totalDeaths} <span class="badge badge-danger">${getPercent(data[i].totalConfirmed,data[i].totalDeaths)}%</span></p>
                    <p class="h4 font-weight-light text-success">Recoverd ${data[i].totalRecovered} <span class="badge badge-success">${getPercent(data[i].totalConfirmed,data[i].totalRecovered)}%</span></p>
                </div>
                    </div>
                </div>
                <div class="col mb-3">
                    <div class="card shadow h-100 rounded fade">
                    <div class="card-body text-center">
                    <p class="h3 font-weight-light">${data[i+1].country}</p>
                    <p class="h4 font-weight-light text-primary">Total ${data[i+1].totalConfirmed}</p>
                    <p class="h4 font-weight-light text-warning">Active ${data[i+1].activeCases} <span class="badge badge-warning">${getPercent(data[i+1].totalConfirmed,data[i+1].activeCases)}%</span></p>
                    <p class="h4 font-weight-light text-danger">Death  ${data[i+1].totalDeaths} <span class="badge badge-danger">${getPercent(data[i+1].totalConfirmed,data[i+1].totalDeaths)}%</span></p>
                    <p class="h4 font-weight-light text-success">Recoverd ${data[i+1].totalRecovered} <span class="badge badge-success">${getPercent(data[i+1].totalConfirmed,data[i+1].totalRecovered)}%</span></p>
                </div>
                    </div>
                </div>
                
                </div>`
                    $("#top-ten").append(html)
                }
                console.log(data);
            } else {
                console.log("NOo")
                topTenCountries();
            }
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
                let country;
                let total;
                let active;
                let death;
                let recoverd;
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
                            country = data[i].country;
                            total = data[i].totalConfirmed;
                            active = data[i].activeCases;
                            death = data[i].totalDeaths;
                            recoverd = data[i].totalRecovered;
                            console.log("country")
                            res = true;
                        }
                    }

                }
                console.log(countryCode)
                if (res) {
                    $(".client-country-card").empty();
                    let html = `<div class="card shadow rounded fade">
                    <div class="card-body text-center">
                        <p class="h3 font-weight-light">${country}</p>
                        <p class="h4 font-weight-light text-primary">Total ${total}</p>
                        <p class="h4 font-weight-light text-warning">Active ${active} <span class="badge badge-warning">${getPercent(total,active)}%</span></p>
                        <p class="h4 font-weight-light text-danger">Death ${death} <span class="badge badge-danger">${getPercent(total,death)}%</span></p>
                        <p class="h4 font-weight-light  text-success">Recoverd ${recoverd} <span class="badge badge-success">${getPercent(total,recoverd)}%</span></p>
                    </div>
                </div>`;
                    $(".client-country-card").append(html);
                    insertCountryDataChart(countryCode, 'canvas-client-country-data');
                    $(".loader").fadeOut(600);
                    document.getElementById("body").classList.remove("overflow");
                } else {
                    $("#client-country-data").hide();
                    $(".loader").fadeOut(800);
                    document.getElementById("body").classList.remove("overflow");
                }
            }, (rejRes) => {
                console.log("msg3rej");
                $("#client-country-data").hide();
                $(".loader").fadeOut(800);
                document.getElementById("body").classList.remove("overflow");
            })

        } else {
            $("#client-country-data").hide();
            $(".loader").fadeOut(800);
            document.getElementById("body").classList.remove("overflow");
        }

    }


    /////
    //global data//
    async function getGlobalData() {
        try {
            let data = await fetch("https://api.coronatracker.com/v3/stats/worldometer/global");
            if (data.status == 200) {
                console.log("get data global");
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
        $("#total-death-number-percent").html(`<span class="badge badge-danger">${getPercent(total, death) }%</span>`)
        $("#total-recovered-number").text(recovered)
        $("#total-recovered-number-percent").html(`<span class="badge badge-success">${getPercent(total, recovered)}%</span>`)
        $("#total-active-number").text(active)
        $("#total-active-number-percent").html(`<span class="badge badge-warning text-white">${getPercent(total, active) }%</span>`)
        createChartBar(total, death, recovered, active);

    }
    //client country data
    async function insertCountryDataChart(countryCode, canvas) {
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
                if (canvas == 'search-canvas') {
                    $(".loader-search").fadeOut(600);
                }
                createCharLine(date, death, recoverd, total, canvas);
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
                labels: ['World status'],
                datasets: [{

                    label: 'Total',
                    data: [total],
                    backgroundColor: [
                        "rgba(0, 123, 255,0.7)"
                    ],
                    borderColor: [
                        "rgb(0, 123, 255)",
                    ],
                    borderWidth: 1,

                }, {

                    label: 'Death',
                    data: [death],
                    backgroundColor: [
                        "rgba(220, 53, 69,0.7)"
                    ],
                    borderColor: [
                        "rgba(220, 53, 69,0.8)"
                    ],
                    borderWidth: 1,

                }, {

                    label: 'Recoverd',
                    data: [recoverd],
                    backgroundColor: [
                        "rgba(40, 167, 69,0.7)"
                    ],
                    borderColor: [
                        "rgba(40, 167, 69,0.8)"
                    ],
                    borderWidth: 1,

                }, {

                    label: 'Active',
                    data: [active],
                    backgroundColor: [
                        "rgba(255, 193, 7,0.7)"
                    ],
                    borderColor: [
                        "rgba(255, 193, 7,0.8)"
                    ],
                    borderWidth: 1,

                }]
            },
            options: {
                responsive: true,
                defaultFontSize: 22,
                aspectRatio: aspectRatio,

                legend: {
                    display: false,
                    labels: {

                        fontColor: 'black',
                    }
                },

                title: {
                    display: false,
                    text: 'World status',
                    fontFamily: 'Raleway',

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
    function createCharLine(date, death, recoverd, total, canvas) {

        var ctx = document.getElementById(canvas).getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: date,
                datasets: [{
                    backgroundColor: "rgba(255,55,55,0)",
                    label: 'Death',
                    data: death,
                    backgroundColor: [
                        "rgba(255, 0, 0, 0.87)"
                    ],
                    borderColor: [
                        "rgba(233, 10, 10, 0.87)"
                    ],
                    borderWidth: 1,
                    order: 1
                }, {
                    backgroundColor: "rgba(255,55,55,0)",
                    label: 'Recoverd',
                    data: recoverd,
                    backgroundColor: [
                        "rgba(21, 212, 65, 0.88)"
                    ],
                    borderColor: [
                        "rgba(21, 212, 65, 0.7)"
                    ],
                    borderWidth: 1,
                    order: 2
                }, {
                    backgroundColor: "rgba(255,55,55,0)",
                    label: 'Active',
                    data: total,
                    backgroundColor: [
                        "rgba(255, 238, 0, 0.8)"
                    ],
                    borderColor: [
                        "rgba(255, 238, 0, 0.84)"
                    ],
                    borderWidth: 1,
                    order: 1
                }]
            },
            options: {
                tooltips: {
                    enabled: false,
                    backgroundColor: "rgba(0,0,0,0)"
                },
                responsive: true,

                aspectRatio: aspectRatio,
                title: {
                    display: false,
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
        console.log(myChart);
    }
    //search start///
    function search(data) {
        $(".search-canvas").hide();
        $("#search-card").hide();
        document.querySelector("#btn-search").addEventListener("click", () => {
            $("#search-card").empty();
            $(".search-canvas").hide();
            $(".loader-search").fadeIn(600);
            let code = document.getElementById("textBox").value.toUpperCase();
            let condition = false;
            if (code != "") {
                for (let i = 0; i < data.length; i++) {
                    if (code === data[i].countryCode) {
                        condition = true;
                        let country = data[i].country;
                        let total = data[i].totalConfirmed;
                        let death = data[i].totalDeaths;
                        let critical = data[i].totalCritical;
                        let recovered = data[i].totalRecovered;
                        let active = data[i].activeCases;
                        console.log(country);
                        $(".search-canvas").show();
                        insertCountryDataChart(data[i].countryCode, 'search-canvas');
                        let card = `<div class="card shadow rounded apear">
                        <div class="card-body text-center mt-3" id="search-card-body">
                        <p class="h3 font-weight-light">${country}</p>
                        <p class="h4 font-weight-light text-primary">Total : ${total}</p>
                        <p class="h4 font-weight-light text-warning">Active ${active} <span class="badge badge-warning">${getPercent(total,active)}%</span></p>
                        <p class="h4 font-weight-light text-danger">Death ${death} <span class="badge badge-danger">${getPercent(total,death)}%</span></p>
                        <p class="h4 font-weight-light text-success">Recoverd ${recovered} <span class="badge badge-success">${getPercent(total,recovered)}%</span></p>
                          </div>
                         </div>`;
                        $("#search-card").append(card);
                        $("#search-card").fadeIn(600);
                    }
                }
                if (!condition) {
                    $("#search-card").html('<p class="text-center font-weight-light text-danger">Sorry! country not found </p>');
                    $(".search-canvas").hide();
                }
            } else {
                $("#search-card").html('<p class="text-center font-weight-light text-danger">Please type a country name or country code</p>');
                $(".search-canvas").hide();
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