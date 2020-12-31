var running_time = false;
var myTime;
const storage = chrome.storage.sync;
var prev_website_running = false;
var last_run;

//MAIN FLOW
//When page changes
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details){
    if(typeof last_run === 'undefined' || notRunWithinTheLastSecond(details.timeStamp)){
        last_run = details.timeStamp;
        chrome.tabs.get(details.tabId, function(tab){
            if (tab.url === details.url){
                chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, async function (tabs){
                    var activeTab = tabs[0].url;
                    //console.log(activeTab);
                    await check_in_naughty_list(activeTab);
                    //console.log("running time: " + running_time.toString());
                    if (running_time && prev_website_running){
        
                    } else if (running_time){
                        run();
                    } else if (!running_time && myTime !== null){
                        stop();
                    } else {
                        running_time = false;
                        prev_website_running = false;
                    }
                })
            }
        })
    }
})

const notRunWithinTheLastSecond = (dt) => {
    const diff = dt - last_run;
    if (diff < 1000){
      return false;
    } else {
      return true;
    }
}
 

//When user clicks on a different tab
chrome.tabs.onActiveChanged.addListener(function (){
    chrome.tabs.query({'active':true, 'lastFocusedWindow': true, 'currentWindow': true}, async function (tabs){
        var activeTab = tabs[0].url;
        //console.log(activeTab);
        await check_in_naughty_list(activeTab);
        //console.log("running time: " + running_time.toString());
        if (running_time && prev_website_running){

        } else if (running_time){
            run();
        } else if (!running_time && myTime !== null){
            stop();
        } else {
            running_time = false;
            prev_website_running = false;
        }
    })
})


//RUN TIMER
async function run(){
    //console.log("RUN");
    const t = await get_time_from_storage();
    //console.log("time: " + t);
    const f = await get_close_tab_status_from_storage() ? dont_close_active_tab : close_active_tab;
    myTime = setTimeout(f, t); /* setTime returns a timeoutID (positive integer) */
}

//STOP TIMER
function stop(){
    //console.log("STOP");
    clearTimeout(myTime);
}

//CHECK IF URL IN NAUGHTY LIST
async function check_in_naughty_list(tab){
    const p = new Promise((resolve, reject) => {
        storage.get(null, (result) => {
            var entries = Object.entries(result);
            for (entry of entries) {
                if (!Number.isInteger(entry[1]) && compare_url(entry[1], tab)) {
                    //("compare url gives true");
                    resolve();
                    return;
                } else {
                    continue;
                }
            } 
            //console.log("compare url gives false");
            reject();
            return;
        })
    })
    if (running_time){
        prev_website_running = true;
    } else {
        prev_website_running = false;
    }
    await p.then(() => running_time = true).catch(() => running_time = false);
}

// compare active tab url to url in table
function compare_url(table_url, url){
    try{
        return url !== '' && (table_url.includes(url) || url.includes(table_url));
    } catch (e) {
        console.warn(e);
    }
}

// CHECK IF CLOSE TAB AFTER TIME'S UP
async function get_close_tab_status_from_storage(){//RESOLVE VALUE = NULL
    var close_tab_status;
    const p = new Promise((resolve, reject) => {
        storage.get("close-tab", (result) => {
            if (result["close-tab"] === 0){
                resolve(true);
            } else {
                reject(false);
            }
        })
    })
    await p.then((message) => close_tab_status = message).catch((message) => close_tab_status = message);
    return close_tab_status;
}

async function get_time_from_storage(){ //RESOLVE VALUE = NULL
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

//ALERT USER TIME IS UP
function create_alert(){
    alert("Times up!");
}

//CLOSE TAB AFTER ALERT AND RESET MAIN FLOW
function close_active_tab(){
    //console.log("CLOSE");
    running_time = false;
    prev_website_running = false;
    create_alert();
    chrome.tabs.getSelected(function(tab) {
        chrome.tabs.remove(tab.id);
    });
}

//DON'T CLOSE TAB AFTER ALERT AND RESET MAIN FLOW
function dont_close_active_tab(){
    //console.log("DONT CLOSE");
    running_time = false;
    prev_website_running = false;
    create_alert();
}

//UPON INSTALLING ADD TIME AND CLOSE TAB STATUS TO STORAGE
chrome.runtime.onInstalled.addListener(function(details){
    if (details.reason == 'install'){
        storage.set({"time": 5});
        storage.set({"close-tab": 0});
    }
})


