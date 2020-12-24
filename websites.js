function redirect(page){
    if (page == "popup") {
        //return to popup page
        location.href = "/screens/popup.html";
    } else {
        console.log("error");
    }
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

function add_website_popup(){
    //create popup to ask for website url
    let input_url = prompt("Enter a website");
    chrome.storage.sync.get(null, (result) => {
        obj = Object.keys(result);
        var index = obj.length;
        if (validURL(input_url)){
            chrome.storage.sync.set({[index] : input_url});
            location.reload();
        } else if (input_url === null){
            return;
        } else {
            alert("Invalid URL");
            return;
        }
    });
}

function delete_website(index){
    try{
        chrome.storage.sync.remove([index]);
        location.reload();
    } catch (e) {
        console.log("No such data!");
    }
    
}
        
function load_naughty_list(tableBody){
    //get naughty list from chrome storage
    try{
        chrome.storage.sync.get(null, function (result){
            populateTable(tableBody, result);
        });
    } catch (e) {
        console.warn("Could not load data!");
    }
}

function populateTable(tableBody, data){
    //clears out table
    while (tableBody.firstChild){
        tableBody.removeChild(tableBody.firstChild);
    }
    //populate table
    let obj = Object.entries(data)
    var index = 1;
    for (row of obj) {
        if (!Number.isInteger(row[1])){
            const tr = document.createElement("tr");
            const index_td = document.createElement("td");
            index_td.textContent = index;
    
            const url_td = document.createElement("td"); 
            url_td.textContent = row[1];
    
            const del_td = document.createElement("td");
            const del_btn = document.createElement("input");
            del_btn.type = "button";
            del_btn.className = "menu-entry del-btn";
            del_btn.value = "Delete";
            del_btn.id = row[0];
            del_btn.onclick = () => delete_website(del_btn.id);
            del_td.appendChild(del_btn);
    
            tr.appendChild(index_td);
            tr.appendChild(url_td);   
            tr.appendChild(del_td);
            tableBody.appendChild(tr);
            index += 1;
        } else {}
    }
};

function clear_websites_table(){
    if (confirm("Remove all websites from naughty list?")){
        chrome.storage.sync.clear(() => console.log('cleared'));
        location.reload();
    } else {}
}

document.addEventListener("DOMContentLoaded", () => {
    let tableBody = document.querySelector("tbody");
    load_naughty_list(tableBody);
    //Listener to go back to main page
    document.getElementById("popup").addEventListener("click", () => redirect('popup'));

    //Listener for the Add Button
    document.getElementById("add-btn").addEventListener("click", add_website_popup);

    //Listener to delete all websites from chrome storage
    document.getElementById("clear-btn").addEventListener("click", clear_websites_table);
});


 
