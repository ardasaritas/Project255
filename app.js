let states = {active: null}
console.log(states);
let current_profile = null

let storedData = localStorage.getItem("states") 
states =  storedData ? JSON.parse( storedData) :  { active: null, users : [] }
renderPage()

renderPage()
console.log("Loaded states:", states);
function update(fns) {
    for (fn of fns) {
        fn()
    }
    localStorage.setItem("states", JSON.stringify(states))
}

function renderPage() {
   $("#root").html(`
    <main>
        <div id="top">
            <div id="title">
                <h1>CTIS</h1>
                <h2>Crypto Trading Information System</h2>
            </div>
            <div id="user"></div>
        </div>
        <div id="tradingPage"></div>
        <div id="footer"><button type="button" id="profile">+ New Profile</button></div>
    </main>`)
    renderProfiles()
}

function renderTradingPage(user) {
    // Populate trading page with profile-specific data
    $("#tradingPage").css("flex-direction", "column")
                     .html(`
                        <div id="day"><p>Day ${user.currentDay}</p></div>
                        <div id="date"><p>${user.currentDate}</p></div>
                        
                        <div id="buttons">
                             <div id="nextDay" class = "button" ><i class="fas fa-fast-forward"></i> Next Day</div>
                             <div id="play" class = "button" ><i class="fa-solid fa-play"></i> Play</div>
                        </div>

                        <div id="cryptoContainer">
                            <div id = "coins">
                                <img src="./images/ada.png" id = "ada" data-name="Ada">
                                <img src="./images/avax.png" id = "avax" data-name="Avalanche">
                                <img src="./images/btc.png" id = "btc" data-name="Bitcoin">
                                <img src="./images/doge.png" id = "doge" data-name="Doge">
                                <img src="./images/eth.png" id = "eth" data-name = "Ethereum">
                                <img src="./images/pol.png" id = "pol" data-name = "Polygon">
                                <img src="./images/snx.png" id = "snx" data-name = "Synthetix">
                                <img src="./images/trx.png" id = "trx" data-name = "Tron">
                                <img src="./images/xrp.png" id = "xrp" data-name = "XRP">
                            </div>
    
                        <div id="curCoin"></div>
                        </div>
                     `);

    // renderCoins(user);
    // drawGraph(user);
    // updateDate(user);
}


function renderProfile() {
    if (current_profile !== null) {
        const user = states.users.find(user => user.name === current_profile);
        renderTradingPage(user)
        renderCurCoin("Bitcoin", "./images/btc.png");
        const $bitcoin = $("#coins img[src='./images/btc.png']"); 
        startPulsating($bitcoin);
        currentAnimatingCoin = $bitcoin;
        $("#user").html(`<i class="fa-solid fa-user fa-xs"></i>
            <span>${current_profile}</span>
            <button type="button">
                <i class="fa-solid fa-door-open fa-xs"></i>
                Logout
            </button>`)
        $("#footer *").remove()
    }
    else {
        $("#tradingPage").css("flex-direction", "row")
        $("#user *").remove()
        $("#footer").html(`<div id="footer"><button type="button" id="profile">+ New Profile</button></div>`)
        states.active = null
    }
}

function renderCurCoin(coinName, coinImg) {
    $("#curCoin").html(`
        <div id="curCoin">
            <img src="${coinImg}" alt="${coinName}" id="${coinName}">
            <p>${coinName}</p>
        </div>
    `);
}

function renderProfiles() {
    $("#tradingPage").html("")
    for (user of states.users) {
        $("#tradingPage").append(`<div class="profile">
            <button type="button">X</button>
            <i class="fa-solid fa-user fa-xl"></i>
            <span>${user.name}</span></div>`)
    }
}

$("main").on("click", ".profile", function() {
    current_profile = $(this).children("span").text()
    states.active = current_profile
    $("#tradingPage").html("")
    update([renderProfile])
})

$("#root").on("click", "#user button", function(e) {
    current_profile = null
    $("#tradingPage").html("")
    update([renderProfile, renderProfiles])
})

$("#tradingPage").on("click", ".profile button", function(e) {
    states.users = states.users.filter(user => user.name !== $(this).parent().children("span").text())
    e.stopPropagation()
    update([renderProfiles])
})

$("main").on("click", "#footer button", function() {
    $("#root").append(`<div id="prompt">
        <h3>New Profile</h3>
        <input type="text" name="new_profile" id="new_profile" placeholder="Enter new profile...">
        <button type="button">Add</button>
    </div>`)
    $("*:not(#prompt):not(#prompt *):not(.profile button)").css("background-color", "#3e3e3e")
    $("#prompt input").focus()
})

$("#root").on("keydown keyup", "#prompt input", function(e) {
    if (e.key == "Enter") {
        $(this).parent().children("button").click()
    }
})

$("#root").on("click", "#prompt button", function() {
    let name = $(this).parent().children("input").val()
    let user = {name, wallet: {cash: 1000}, currentDay : 1, currentDate : "1 January 2021", candleData : [0]}
    states.users.push(user)
    //localStorage.setItem(states, JSON.parse(states))
    $("*:not(#prompt):not(#prompt *):not(.profile button)").css("background-color", "");
    $("#prompt").remove()
    update([renderProfiles])
})

function getNextDate(currentDate) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1); // Increment the day
    return date.toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' });
}


$("#root").on("click", "#nextDay", function () {
    // Find the current user in states using current_profile
    const user = states.users.find(user => user.name === current_profile);

    if (user && user.currentDay < 365) {
        user.currentDay += 1; // Increment the day
        user.currentDate = getNextDate(user.currentDate);
        console.log(`Day updated to: ${user.currentDay}`);
        
        // Update the UI
        $("#day").html(`<p>Day ${user.currentDay}</p>`);
        $("#date").html(`<p>${user.currentDate}</p>`);

        // Save changes to states
        update([]);
    } else {
        console.error("No active user found for updating day.");
    }
});


$("#root").on("click", "#play", function () {
    const isPlaying = $(this).find("i").hasClass("fa-play");
    if (isPlaying) {
        $(this).html(`
            <i class="fa-solid fa-pause"></i> Pause
        `);
    } else {
        $(this).html(`
            <i class="fa-solid fa-play"></i> Play
        `);
    }
});

let currentAnimatingCoin = null; // Track the currently animating coin

$("#root").on("click", "#coins img", function () {
    const $selected = $(this);

    // Do nothing if the clicked coin is the same as the currently animating coin
    if (currentAnimatingCoin && currentAnimatingCoin.is($selected)) {
        return;
    }

    // Stop the current animating coin if it exists
    if (currentAnimatingCoin) {
        currentAnimatingCoin.stop(true, true); // Stop the animation
        currentAnimatingCoin.css("width", "30px"); // Reset its size
        currentAnimatingCoin.data("animating", false); // Clear its animating state
    }

    // Start animation for the clicked coin
    $selected.data("animating", true);  // Mark it as animating
    currentAnimatingCoin = $selected; // Update the current animating coin

    function animateLoop() {
        if ($selected.data("animating")) {
            $selected.animate({ "width": "40px" }, 500)
                     .animate({ "width": "30px" }, 500, animateLoop); // Recursive call
        }
    }

    animateLoop(); // Start the animation loop
});

function startPulsating($coin) {
    if ($coin) {
        $coin.data("animating", true);

        function animateLoop() {
            if ($coin.data("animating")) {
                $coin.animate({ "width": "40px" }, 500)
                     .animate({ "width": "30px" }, 500, animateLoop);
            }
        }

        animateLoop();
    }
}

$("#root").on("click", "#coins img", function () {
    const $clickedCoin = $(this);
    const coinId = $clickedCoin.attr("id"); // Get the coin's id (e.g., 'ada', 'avax', etc.)
    const coinName = $clickedCoin.data("name"); // Get the coin's name from data-name
    const coinImgSrc = $clickedCoin.attr("src");
    console.log(coinImgSrc)
    // Dynamically update the curCoin div
    renderCurCoin(coinName, coinImgSrc)

    console.log(`Updated curCoin: ${coinName} (${coinId})`);
});

