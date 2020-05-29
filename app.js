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
        data = await data.json();
        console.log(data);
        insert(data);
        search(data);
        //close btn event listenner
        console.log("slide"+slide)
        if(slide){
            $(".country-info").slideUp();
            $(".btn-x").click((e)=>{
                let id=e.target.parentNode.getAttribute("target-tab");
                console.log(e.target.parentNode);
                console.log(id)
                $(`#${id}`).slideToggle();
                });
        }else{
            $(".btn-x").hide();
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
       textData+=`<!-- country -->
       <div class="country">
           <div class="country-control">
               <h3 class="country-name" >${data.Countries[index].Country}</h3>
               <button class="btn-x" target-tab="${data.Countries[index].CountryCode}">
                   <span>x</span>
               </button>
           </div>
           <div class="country-info" id="${data.Countries[index].CountryCode}">
               <div class="country-info-para">
                   <div class="active country-info-para-date">
                       <p class=>confirmed :</p>
                       <p class="yellowText">${data.Countries[index].TotalConfirmed}</p>
                       <p class="yellowText">45%</p>
                   </div>
                   <div class="death country-info-para-date">
                    <p class=>Death :</p>
                    <p class="redText">${data.Countries[index].TotalDeaths}</p>
                    <p class="redText">45%</p>
                   </div>
                  <div class="recoverd country-info-para-date">
                    <p class=>Recoverd :</p>
                    <p class="greenText">${data.Countries[index].TotalRecovered}</p>
                    <p class="greenText">45%</p>
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
   datalist+=`<option value="${data.Countries[i].CountryCode}">${data.Countries[i].Country}</option>`
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
      <p class="para">${country.TotalDeaths}&nbsp;<span class="badge badge-red">23%</span></p>
    </td>
    <td class="td">
      <p class="para">${country.TotalRecovered} 	&nbsp;<span class="badge badge-green">23%</span></p>
    </td>
    </tr>`;
    $(".tbody").append(trow);
})}



///search end///
})
