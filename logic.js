// When page of active tab changes
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
    if (changeInfo.status == "complete"){
        chrome.tabs.query({'active':true, 'lastFocusedWindow': true, 'currentWindow': true}, async function (tabs){
            var activeTab = tabs[0].url;
            console.log(activeTab);
            await check_in_naughty_list(activeTab);
            console.log("running time: " + running_time.toString());
            
            if (running_time){
                run();
            } else if (!running_time && myTime !== null){
                stop();
            } else {
                running_time = false;
            }
        })
    }
})

//When user clicks on a different tab
chrome.tabs.onActiveChanged.addListener(function (){
    console.log('on active change');
    chrome.tabs.query({'active':true, 'lastFocusedWindow': true, 'currentWindow': true}, async function (tabs){
        var activeTab = tabs[0].url;
        console.log(activeTab);
        await check_in_naughty_list(activeTab);
        console.log("running time: " + running_time.toString());
        
        if (running_time){
            run();
        } else if (!running_time && myTime !== null){
            stop();
        } else {
            running_time = false;
        }
    })
})

async function run(){
    //when timeout, send alert and close the tab
    console.log("RUN");
    const t = await get_time_from_storage()
    console.log("time: " + t);
    myTime = setTimeout(close_active_tab, t); /* setTime returns a timeoutID (positive integer) */
}
function stop(){
    console.log("STOP");
    clearTimeout(myTime);
}

async function check_in_naughty_list(tab){
    //NEED TO FIND WAY TO RETURN BOOL
    const p = new Promise((resolve, reject) => {
        storage.get(null, (result) => {
            var entries = Object.entries(result);
            for (entry of entries) {
                if (!Number.isInteger(entry[1]) && compare_url(entry[1], tab)) {
                    console.log("compare url gives true");
                    resolve();
                    return;
                } else {
                    continue;
                }
            }
            console.log("compare url gives false");
            reject();
            return;
        })
    })
    await p.then(() => running_time = true).catch(() => running_time = false);
}

// compare active tab url to url in table
function compare_url(table_url, url){
    //WORKS 
    try{
        return url !== '' && (table_url.includes(url) || url.includes(table_url));
    } catch (e) {
        console.warn(e);
    }
}

async function get_time_from_storage(){//RESOLVE VALUE = NULL
    let time = 5; //default time
    const p = new Promise((resolve, reject) => {
        storage.get("time", (result) => {
            if (Number.isInteger(result["time"])){
                resolve(result["time"]);
            } else {
                reject("No data found!");
            }
        })
    })
    await p.then((message) => time = message).catch((message) => console.warn(message));
    return time * 60000;
}

//alert user that time is up 
function create_alert(){
    alert("times up!");
}

//close active tab that user is on
function close_active_tab(){
    //WORKS
    running_time = false;
    create_alert();
    chrome.tabs.getSelected(function(tab) {
        chrome.tabs.remove(tab.id);
    });

}


