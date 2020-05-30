$(document).ready(()=>{
    var slide;
    if(window.matchMedia("(min-width:600px)").matches){
      slide=false;
    }else{
        slide=true;
    }

//ajax start////////
async function getData() {
    try {
        let data = await fetch("https://api.covid19api.com/summary");
        // console.log(data);
        if (data.status==200) {
        console.log("yesss");
            data = await data.json();
            // console.log(data);
            insert(data);
            search(data);
            //close btn event listenner
            console.log("slide"+slide)
            $(".loader").fadeOut(800);
            if(slide){
                $(".country-info").slideUp(800);
                $(".btn-x").click((e)=>{
                    let id=e.target.parentNode.getAttribute("target-tab");
                    console.log(e.target.parentNode);
                    console.log(id)
                    $(`#${id}`).slideToggle();
                    });
            }else{
                $(".btn-x").hide();              
            }
           
                 
        }else{
           console.log("NOo")
           getData();
        }
         //////////////////////

    } catch (err) {
        console.error(err);
    }

}

function insert(data) {
   let index=0;
   for(let i=0;i<Math.floor(data.Countries.length/4);i++){
    let row=document.createElement("div");
    row.classList.add("row");
    let textData="";
    for(let j=0;j<3;j++){
        let country=data.Countries[index].Country;
        let totalActive=data.Countries[index].TotalConfirmed-(data.Countries[index].TotalDeaths+data.Countries[index].TotalRecovered);
        let countryCode=data.Countries[index].CountryCode;
        let totalConfirmed=data.Countries[index].TotalConfirmed;
        let totalDeath=data.Countries[index].TotalDeaths;
        let totalRecovered=data.Countries[index].TotalRecovered;
       textData+=`<!-- country -->
       <div class="country">
           <div class="country-control">
               <div class="country-name" >
               <img class="flag-icon" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/${countryCode.toLowerCase()}.svg" alt="${country}-flag" ><p>
               ${country}
             </p>
               </div>
               <button class="btn-x" target-tab="${countryCode}">
                   <span>x</span>
               </button>
           </div>
           <div class="country-info" id="${countryCode}">
               <div class="country-info-para">
                   <div class="active country-info-para-date">
                       <p class=>confirmed :</p>
                       <p class="">${totalConfirmed}</p>
                   </div>
                   <div class="active country-info-para-date">
                   <p class=>active :</p>
                   <p class="yellowText">${totalActive}</p>
                   <p class="yellowText">${
                       getPercent(totalConfirmed,totalActive)
                   }%</p>
               </div>
                   <div class="death country-info-para-date">
                    <p class=>Death :</p>
                    <p class="redText">${totalDeath}</p>
                    <p class="redText">${getPercent(totalConfirmed,totalDeath)}%</p>
                   </div>
                  <div class="recoverd country-info-para-date">
                    <p class=>Recoverd :</p>
                    <p class="greenText">${totalRecovered}</p>
                    <p class="greenText">${getPercent(totalConfirmed,totalRecovered)}%</p>
                  </div>
                </div>
           </div>
       </div>
     <!-- country -->`
     index++;
    //  console.log(index)
    }
    row.innerHTML=textData;
    $(".countries").append(row);
   }
//datalist part
var datalist="";
for(let i=0;i<data.Countries.length;i++){
   datalist+=`<option value="${data.Countries[i].CountryCode}"> <img class="flag-icon" src="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/${data.Countries[i].CountryCode.toLowerCase()}.svg" alt="${data.Countries[i].Country}-flag" >${data.Countries[i].Country}</option>`
}
$("#list").append(datalist);




}
getData();

////////ajax end/////
//search start///
function search(data){
    document.querySelector("#btn-search").addEventListener("click",()=>{
    let code=document.getElementById("textBox").value;
    var country;
    for(let i=0;i<data.Countries.length;i++){
       if (code===data.Countries[i].CountryCode) {
           country=data.Countries[i];
       }
    }

    console.log(country);
    let trow=`<tr>
    <td class="td">
       <p class="para"> ${country.Country}</p>
    </td>
    <td class="td">
      <p class="para">${country.TotalConfirmed}</p>
    </td>
    <td class="td">
      <p class="para">${country.TotalDeaths}&nbsp;<span class="badge badge-red">${getPercent(country.TotalConfirmed,country.TotalDeaths)}%</span></p>
    </td>
    <td class="td">
      <p class="para">${country.TotalRecovered} 	&nbsp;<span class="badge badge-green">${getPercent(country.TotalConfirmed,country.TotalRecovered)}%</span></p>
    </td>
    </tr>`;
    $(".tbody").append(trow);
})}


///search end///
})
function getPercent(total,current){
return ((100*current)/total).toFixed(1);
}