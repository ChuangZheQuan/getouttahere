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
        //console.warn("error");
    }
}

async function close_tab_after_timeout(){
    // 0 close active tab, 1 dont close active tab
    let val = document.getElementById("close-tab").value;
    if (val === '1') { 
        document.getElementById("close-tab").value = 1;
        document.getElementById("close-tab-label").innerHTML = "Don't close active tab";
        await storage.remove("close-tab", async () => {
            await storage.set({"close-tab": 0});
        })      
    } else if (val === '0') { // initially don't close active tab, change to close active tab   
        // resume background.js
        document.getElementById("close-tab").value = 0;
        document.getElementById("close-tab-label").innerHTML = "Close active tab";
        await storage.remove("close-tab", async () => {
            await storage.set({"close-tab": 1});
        })
    }
    location.reload();
}

document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("decrease").addEventListener("click", decreaseValue);
    document.getElementById("increase").addEventListener("click", increaseValue);
    document.getElementById("websites").addEventListener("click", () => redirect('websites'));
    document.getElementById("close-tab").addEventListener("click", close_tab_after_timeout);
})

//WHEN POPUP PAGE IS BEING RELOADED
document.addEventListener("DOMContentLoaded", function(){
    storage.get("time", (result) => {
        if (result["time"] === undefined){
            document.getElementById("number").value = 5;
        } else {
            document.getElementById("number").value = result["time"]; 
        }
    })

    storage.get("close-tab", (result) => {
        document.getElementById("close-tab").value = result["close-tab"];
        document.getElementById("close-tab-label").innerHTML = result["close-tab"] == 0
                                                            ? "Close active tab" : "Don't close active tab";
    })
})


