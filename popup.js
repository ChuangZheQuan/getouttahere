
function increaseValue() {
    var value = parseInt(document.getElementById("number").value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById("number").value = value;
    storage.remove("time", () => {
        storage.set({"time": value});
    })
    location.reload();
}
  
function decreaseValue() {
    var value = parseInt(document.getElementById("number").value, 10);
    value = isNaN(value) ? 0 : value;
    value < 1 ? value = 1 : '';
    value--;
    document.getElementById("number").value = value;
    storage.remove("time", () => {
        storage.set({"time": value});
    })
    location.reload();
}

function redirect(page){
    if (page == "websites"){
        //redirect to websites page
        location.href = "/screens/websites.html"
    } else {
        console.log("error");
    }
}

function pause_resume(){
    // 0 is for pause, 1 is for resume
    let val = document.getElementById("pause-resume-label").value;
    if (val === 0) {
        // pause background.js
        document.getElementById("pause-resume-label").value = 1;
        document.getElementById("pause-resume-button").className = "fas fa-play";
        storage.remove("pause-resume-label", () => {
            storage.set({"pause-resume-label": 1})
        })
        
    } else if (val === 1) {
        // resume background.js
        document.getElementById("pause-resume-label").value = 0;
        document.getElementById("pause-resume-button").className = "fas fa-pause";
        storage.remove("pause-resume-label", () => {
            storage.set({"pause-resume-label": 0})
        })
        
    }
    location.reload();
}

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("decrease").addEventListener("click", decreaseValue);
    document.getElementById("increase").addEventListener("click", increaseValue);
    document.getElementById("websites").addEventListener("click", () => redirect('websites'));
    document.getElementById("pause-resume").addEventListener("click", pause_resume);
});

//WHEN PAGE IS BEING RELOADED
document.addEventListener("DOMContentLoaded", function(){
    storage.get("time", (result) => {
        if (result["time"] === undefined){
            document.getElementById("number").value = 5;
        } else {
            console.log("result equals: " + result["time"]);
            document.getElementById("number").value = result["time"]; 
        }
    })
    
    // 1 is paused, 0 is resumed
    storage.get("pause-resume-label", (result) => {
        console.log(result["pause-resume-label"]);
        if (result["pause-resume-label"] === 1){ 
            // pause background.js
            document.getElementById("pause-resume-label").value = 1;
            document.getElementById("pause-resume-button").className = "fas fa-play";
        } else if (result["pause-resume-label"] === 0){
            // resume background.js
            document.getElementById("pause-resume-label").value = 0;
            document.getElementById("pause-resume-button").className = "fas fa-pause";
        } else {
            // resume background.js
            document.getElementById("pause-resume-label").value = 1;
            document.getElementById("pause-resume-button").className = "fas fa-pause";
        }
    })
})

