var id = setInterval(run, 500);
var times = 1;

function run() {
    if (times >= 10) {
        clearInterval(id);
    } else {
        let btnX = document.querySelectorAll(".btn-x");
        for (let i = 0; i < btnX.length; i++) {
            btnX[i].addEventListener("click", (e) => {
                console.log(e.target);
                close(e.target);
            });
        }
        times++;
    }
}



function close(element) {
    let tab = element.getAttribute("target-tab");
    let tabDiv = document.getElementById(`${tab}`);
    let condition = tabDiv.getAttribute("close-tab");
    let speed = 50;
    if (condition === "yes") {
        //close
        let width = parseInt(tabDiv.style.height.slice(0, tabDiv.style.height.indexOf("p")));
        let id = setInterval(frame, speed);

        function frame() {
            if (width < 10) {
                clearInterval(id);

            } else {
                width -= 5;
                tabDiv.setAttribute("style", `height:${width}px`);
            }
        }

    } else if (condition === "no") {

        //open
        let width = parseInt(tabDiv.style.height.slice(0, tabDiv.style.height.indexOf("p")));
        let id = setInterval(frame, speed);

        function frame() {
            if (width > 90) {
                clearInterval(id);

            } else {
                width += 5;
                tabDiv.setAttribute("style", `height:${width}px`);
            }
        }

    }
    if (condition === "yes") {
        tabDiv.setAttribute("close-tab", "no");
    } else if (condition === "no") { tabDiv.setAttribute("close-tab", "yes"); }

    // tabDiv.getAttribute("close-tab") === "yes" ? tabDiv.setAttribute("close-tab", "no") : tabDiv.setAttribute("close-tab", "yes");

}