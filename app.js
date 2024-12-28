let states = {active: null}
let current_profile = null

let storedData = localStorage.getItem("states")
states =  storedData ? JSON.parse( storedData) :  { active: null, users : [
    {name: "Işık Dönger", wallet: {cash: 1000,  Cordana: 0,
        Avalanche: 0,
        Bitcoin: 0,
        Dogecoin: 0,
        Ethereum: 0,
        Polygon: 0,
        Synthetix: 0,
        Tron: 0,
        Ripple: 0}, currentDay : 1, currentDate : "1 January 2021", market : []},
    {name: "İbrahim Can Doğan", wallet: {cash: 1000,  Cordana: 0,
        Avalanche: 0,
        Bitcoin: 0,
        Dogecoin: 0,
        Ethereum: 0,
        Polygon: 0,
        Synthetix: 0,
        Tron: 0,
        Ripple: 0}, currentDay : 1, currentDate : "1 January 2021", market : []},
    {name: "Arda Sarıtaş", wallet: {cash: 1000,  Cordana: 0,
        Avalanche: 0,
        Bitcoin: 0,
        Dogecoin: 0,
        Ethereum: 0,
        Polygon: 0,
        Synthetix: 0,
        Tron: 0,
        Ripple: 0}, currentDay : 1, currentDate : "1 January 2021", market : []},
    {name: "Yağız Çetin", wallet: {cash: 1000,  Cordana: 0,
        Avalanche: 0,
        Bitcoin: 0,
        Dogecoin: 0,
        Ethereum: 0,
        Polygon: 0,
        Synthetix: 0,
        Tron: 0,
        Ripple: 0}, currentDay : 1, currentDate : "1 January 2021", market : []}]}
localStorage.setItem("states", JSON.stringify(states))

// Renders page
renderPage()

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
                        <div class="chart"></div>
                        <h1 class="cashIs">$<span></span></h1>
                        <section>
                            <div class="trading">
                                <h3>Trading</h3>
                                <div class="buttons">
                                    <button type="button" class="buyTime" id="buy">Buy</button>
                                    <button type="button" id="sell">Sell</button>
                                </div>
                                <div class="inp">
                                    <input type="text"  placeholder="Amount">
                                    <div>=$<span></span></div>
                                </div>
                                <button id="buySell" class="buyTime" type="button">Buy</button>
                            </div>
                            <div class="wallet">
                                <h3>Wallet</h3>
                                <table class="wTable">
                                    <tr class="top">
                                        <td>Coin</td>
                                        <td>Amount</td>
                                        <td>Subtotal</td>
                                        <td>Last Close</td>
                                    </tr>
                                    <tr class="moneyinWallet">
                                        <td>Dollar</td>
                                        <td colspan="3">$<span></span></td>
                                    </tr>
                                </table>
                            </div>
                        </section>
                        </div>
                       
                     `);
    renderWalletDay(user) 
}


function renderProfile() {
    if (current_profile !== null) {
        const user = states.users.find(user => user.name === current_profile);
        renderTradingPage(user)
        renderCurCoin("btc", "Bitcoin", "./images/btc.png");
        const $bitcoin = $("#coins img[src='./images/btc.png']"); 
        renderWalletDay(user)
        startPulsating($bitcoin);
        currentAnimatingCoin = $bitcoin;
        // When the profile is opened, initialize it with btc
        if(user.currentDay < 120) {
            for (let i = 1; i <= Math.min(user.currentDay, 120); i++) {
                renderChartSliding("btc", i);
            }
        }
        else if (user.currentDay !== 365)
        {
            for (let i = user.currentDay - 365; i <= Math.min(user.currentDay, 365); i++) {
                renderChartSliding("btc", i);
            }
        }
        else {
            stopSimulation()
        }
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
 

function renderWalletDay(user) {
    console.log(user)
    let dayIndex = user.currentDay - 1;
    let coinData
    if (user.currentDay === 1) {
        coinData = market[dayIndex]
    }
    else  coinData = market[dayIndex-1];

    let walletCheck;
    if (user.currentDay === 1) {
        walletCheck =  user.wallet.cash
        + user.wallet.Cordana * coinData.coins[0].open
        + user.wallet.Avalanche * coinData.coins[1].open
        + user.wallet.Bitcoin * coinData.coins[2].open
        + user.wallet.Dogecoin * coinData.coins[3].open
        + user.wallet.Ethereum * coinData.coins[4].open
        + user.wallet.Polygon * coinData.coins[5].open
        + user.wallet.Synthetix * coinData.coins[6].open
        + user.wallet.Tron * coinData.coins[7].open
        + user.wallet.Ripple * coinData.coins[8].open
    }
    else {
        walletCheck =  user.wallet.cash
        + user.wallet.Cordana * coinData.coins[0].close
        + user.wallet.Avalanche * coinData.coins[1].close
        + user.wallet.Bitcoin * coinData.coins[2].close
        + user.wallet.Dogecoin * coinData.coins[3].close
        + user.wallet.Ethereum * coinData.coins[4].close
        + user.wallet.Polygon * coinData.coins[5].close
        + user.wallet.Synthetix * coinData.coins[6].close
        + user.wallet.Tron * coinData.coins[7].close
        + user.wallet.Ripple * coinData.coins[8].close
    }
   
    // Update total wallet value
    $("h1 span").text(parseFloat(walletCheck).toFixed(Math.max(0, 6 - Math.floor(walletCheck).toString().length)));
   
    // Update cash display
    $(".moneyinWallet td:last span").text(parseFloat(user.wallet.cash).toFixed(Math.max(0, 6 - Math.floor(user.wallet.cash).toString().length)));
    
    // Loop through all coins and handle their rows
    for (let i = 0; i < coins.length; i++) {
        let coinName = coins[i].name;
        let coinCode = coins[i].code;
        let coinAmount = user.wallet[coinName];  
        let closeData;
        if (user.currentDay === 1) {
            closeData = coinData.coins[i].open;
        }     
        else closeData = coinData.coins[i].close;
        let coinValue = coinAmount * closeData;
        

        // Check if the row for the coin exists
        let $existingRow = $(".wTable tr").filter(function () {
            return $(this).find("td:first").text().includes(coinName);
        });

        if (coinAmount === 0) {
            // Remove the row if the coin balance is zero
            if ($existingRow.length > 0) {
                $existingRow.remove();
            }
        } else if ($existingRow.length > 0) {
            // Update the row if it exists
            $existingRow.children().eq(1).text(parseFloat(coinAmount).toFixed(Math.max(0, 6 - Math.floor(coinAmount).toString().length))); // Update amount
            $existingRow.children().eq(2).text(parseFloat(coinValue).toFixed(Math.max(0, 6 - Math.floor(coinValue).toString().length))); // Update total value
            $existingRow.children().eq(3).text(closeData); // Update price
        } else {
            // Append a new row if it doesn't exist
            let newRow = 
                `<tr class="Added">
                    <td><img src="./images/${coinCode}.png">${coinName}</td>
                    <td>${parseFloat(coinAmount).toFixed(Math.max(0, 6 - Math.floor(coinAmount).toString().length))}</td>
                    <td>${parseFloat(coinValue).toFixed(Math.max(0, 6 - Math.floor(coinValue).toString().length))}</td>
                    <td>${closeData}</td>
                </tr>`;
            $(".wTable").append(newRow);
        }
    }
}


function renderTransactions () {
    const user = states.users.find(user => user.name === current_profile);

    let currentCoin = $("#curCoin img").attr("id");
    let dayIndex = user.currentDay - 1;
  
    let coinData;
    if (user.currentDay === 1) 
        coinData = market[dayIndex];
    else coinData = market[dayIndex-1];

    let num = (coinData.coins.length);
    let money;

    for (let i = 0; i < num; i++) {
        if(coinData.coins[i].code === currentCoin){
            coinData = coinData.coins[i];
            break;
        }
    }

    let closeData;
    if (user.currentDay === 1) {
        closeData = coinData.open
    }
    else closeData = coinData.close;

    money = Number($(".inp input").val()) * Number(closeData);
    $(".inp div span").html( parseFloat(money).toFixed(Math.max(0, 6 - Math.floor(money).toString().length)));
} 

function renderCurCoin(coinId, coinName, coinImg) {
    $("#curCoin").html(`
        <div id="curCoin">
            <img src="${coinImg}" data-name="${coinName}" id="${coinId}">
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

function renderChartSliding(selectedCoin, day) {
    const user = states.users.find(user => user.name === current_profile);
    const chartContainer = $(".chart");
    const chartHeight = 500; // Height of the chart container

    // Find the selected coin's data for all days to compute its range
    const allCoinData = market.map(dayData =>
        dayData.coins.find(coin => coin.code === selectedCoin)
    )

    const minPrice = Math.min(...allCoinData.map(coin => Math.min(coin.low, coin.open, coin.close)));
    const maxPrice = Math.max(...allCoinData.map(coin => Math.max(coin.high, coin.open, coin.close)));

    if (minPrice === maxPrice) {
        return;
    }

    // Normalize a given value to fit within the chart height
    const normalize = value => ((value - minPrice) / (maxPrice - minPrice)) * chartHeight;

    // If day > 120, sliding window
    if (day > 120) {
        chartContainer.children(".stick:first").remove();
        chartContainer.children(".bar:first").remove();

        chartContainer.children().each(function () {
            if(!($(this).hasClass("upperLabel") || $(this).hasClass("bottomLabel"))) {
                const currentLeft = parseInt($(this).css("left"), 10);
                $(this).css("left", `${currentLeft - 10}px`); // Shift left by 10px
            }
        });

        $(".upperLabel").css("left", "-10")
        $(".bottomLabel").css("left", "-10")
        

    }

    // Get data for the selected coin on the current day
    const dayData = market[day - 1];
    const coinData = dayData?.coins.find(coin => coin.code === selectedCoin);

    if (!coinData) {
        return;
    }

    const { open: entry, close: exit, high, low } = coinData;

    // Normalize values
    const normalizedLow = normalize(low);
    const normalizedHigh = normalize(high);
    const normalizedBarBottom = normalize(Math.min(entry, exit));
    const normalizedBarHeight = Math.abs(normalize(entry) - normalize(exit));

    const color = entry < exit ? "green" : "red";

    // Calculate X-position for the current day
    const x = day > 120 ? (120 - 1) * 10 + 5: (day - 1) * 10 + 5;

    // Add the stick
    chartContainer.append(
        `<div class='stick' style='height:${normalizedHigh - normalizedLow}px; bottom:${normalizedLow}px; left:${x}px;'></div>`
    );

    // Add the bar
    chartContainer.append(
        `<div class='bar' data-day="${day}" data-date="${user.currentDate}" style='background:${color}; bottom:${normalizedBarBottom}px; left:${x - 4}px; height:${normalizedBarHeight}px;'></div>`
    );


    // --- Add the grey line only if it doesn't exist ---
    if ($(".greyLine").length === 0) {
        const greyLine = $("<p>", {
            class: "greyLine",
            left: "0px"
        });

        // Append the grey line to the chart container
        chartContainer.append(greyLine);
    }

    let posGreyLine; 
    let text; 
    if (color == "green") {
        posGreyLine = normalizedBarBottom + normalizedBarHeight
        text = `$${entry} `
    }
    else {
        posGreyLine = normalizedBarBottom
        text = `$${exit} `
    }

    // --- Update the position of the grey line ---
    $(".greyLine").css("bottom", `${posGreyLine}px`)
                  .css("padding-right", "25px") // to increase the readability a little bit
                  .text(text)
                  .css("left", "0px")


    // Labels
    if ($(".upperLabel").length === 0) {
        const upperLbl = $("<div>", {
            class: "upperLabel",
            right: "0px"
        });

        chartContainer.append(upperLbl);
    }
      $(".upperLabel").css("top", "-10px")
                    .text(`$${maxPrice}`)
    // -------------------

    if ($(".bottomLabel").length === 0) {
        const bottomLbl = $("<div>", {
            class: "bottomLabel",
            right: "0px"
        });

        chartContainer.append(bottomLbl);

    }
    
    $(".bottomLabel").css("bottom", "-10px")
                   .text(`$${minPrice}`)
                   

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
    let user = {name, wallet: {cash: 1000,  Cordana: 0,
        Avalanche: 0,
        Bitcoin: 0,
        Dogecoin: 0,
        Ethereum: 0,
        Polygon: 0,
        Synthetix: 0,
        Tron: 0,
        Ripple: 0}, currentDay : 1, currentDate : "1 January 2021", market : []}
    states.users.push(user)
    $("*:not(#prompt):not(#prompt *):not(.profile button)").css("background-color", "");
    $("#prompt").remove()
    update([renderProfiles])
})

function getNextDate(currentDate) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);  
    return date.toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' });
}


$("#root").on("click", "#nextDay", function () {
    // Find the current user in states using current_profile
    const user = states.users.find(user => user.name === current_profile);

    if (user && user.currentDay < 365) {
        user.currentDay += 1; // Increment the day
        user.currentDate = getNextDate(user.currentDate);
    
        
        // Update the UI
        $("#day").html(`<p>Day ${user.currentDay}</p>`);
        $("#date").html(`<p>${user.currentDate}</p>`);

        const currentCoin = $("#curCoin img").attr("id"); // Get the currently selected coin
    
        if (currentCoin) {
            renderChartSliding(currentCoin, user.currentDay); // Re-render chart
            renderWalletDay(user);
        }

        // Save changes to states
        update([]);
    }
    else {
        stopSimulation()
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
        currentAnimatingCoin.data("animating", false);
    }

    // Start animation for the clicked coin
    $selected.data("animating", true); 
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
    const user = states.users.find(user => user.name === current_profile);
    const $clickedCoin = $(this);
    const coinId = $clickedCoin.attr("id"); // Get the coin's id 
    const coinName = $clickedCoin.data("name"); // Get the coin's name from data-name
    const coinImgSrc = $clickedCoin.attr("src");
    // Update the curCoin div
    renderCurCoin(coinId, coinName, coinImgSrc)
     // Clear the chart and render all bars for the selected coin
    $(".chart").empty();
    
    if(user.currentDay < 120) {
         for (let i = 1; i <= Math.min(user.currentDay, 120); i++) {
            renderChartSliding(coinId, i);
         }
     }
     else {
         for (let i = user.currentDay - 365; i <= Math.min(user.currentDay, 365); i++) {
            renderChartSliding(coinId, i);
         }
     }
   
});

// Add a mouseover event listener for each bar in the chart
$("#root").on("mouseover", ".bar", function () {
    const user = states.users.find(user => user.name === current_profile);
    
    const currentCoin = $("#curCoin img").attr("id");
    
    const day = $(this).data("day");
    const date = $(this).data("date");

    const dayData = market[day - 1];
    const coinData = dayData?.coins.find(coin => coin.code === currentCoin);
    
    const { open: entry, close: exit, high, low } = coinData;
    
    
    $("#curCoin p").after(`<p id = "coinData">Date: ${date} Open: $${entry} Close: $${exit} High: $${high} Low: $${low}</p>`)

});

// Add mouseout event to reset the currentCoin div when the mouse leaves the bar
$("#root").on("mouseout", ".bar", function () {
    const currentCoin = $("#curCoin img");
    const coinId = currentCoin.attr("id"); // Get the coin's id
    const coinName = currentCoin.data("name"); // Get the coin's name from data-name
    const coinImgSrc = currentCoin.attr("src");
    renderCurCoin(coinId, coinName, coinImgSrc)
});


$("#root").on("click", "#buy" ,function () {
    $(this).addClass("buyTime");
    $("#sell").removeClass();
    
    $("#buySell").removeClass("sellTime")
                 .addClass("buyTime")
                 .html("Buy");
})

$("#root").on("click", "#sell",function () {
    $(this).addClass("sellTime");
    $("#buy").removeClass();
    $("#buySell").removeClass("buyTime")    
                 .addClass("sellTime")
                 .html("Sell");
})

$("#root").on("input", ".inp input" , function () {
    renderTransactions();
});

$("#root").on("click", "#buySell", function () {
    const user = states.users.find(user => user.name === current_profile);

    if ( $(this).hasClass("buyTime")) {
        if ($(".inp div span").text() === "") 
            alert("Input data");
        else if (Number($(".inp div span").text()) > user.wallet.cash)
            alert("Not enough cash to buy");
        else {
            let coinCode = $("#curCoin img").attr("id");
            let dayIndex = user.currentDay - 1;
            let coinData;
            if (user.currentDay === 1)  {
                coinData = market[dayIndex];
            }
            else {coinData = market[dayIndex-1];}

            let num = (coinData.coins.length);
            let cname;
            let money;
          
            for (let c of coins) {
                if (c.code === coinCode) {
                    cname = c.name;
                    break;
                }
            }
           
            for (let i = 0; i < num; i++) {
                if(coinData.coins[i].code === coinCode){
                    coinData = coinData.coins[i];
                    break;
                }
            }

            let closeData;
            if (user.currentDay === 1) {
                closeData = coinData.open;
            }
            else closeData = coinData.close;

            let currentCoin = $("#curCoin img").attr("id"); 
            if ( $(".wTable tr").length > 2 ) {
                let check = 0;
                $(".wTable tr:gt(1)").each(function () {
                    if ($(this).children().eq(0).text() === cname) {
                        let sumA = Number(Number($(this).children().eq(1).text()) + Number($(".inp input").val()));
                        let sumS = Number(Number($(this).children().eq(2).text()) + Number($(".inp div span").text()));
                        $(this).children().eq(1).text(sumA);
                        $(this).children().eq(2).text(sumS);
                        $(this).children().eq(3).text(closeData);
                        check = 1;
                    }
                    else {
                        // console.log(check)
                        // if (check === 0) {
                        //     let newRow = 
                        //     `<tr class="Added">
                        //     <td><img src="./images/${currentCoin}.png">${cname}</td>
                        //     <td>${Number($(".inp input").val())}</td>
                        //     <td>${Number($(".inp div span").text())}</td>
                        //     <td>${coinData.open}</td>
                        //     </tr>`;

                        //     $(".wTable").append(newRow);
                        // }
                    }
                })
            }
            else {
                //  let newRow = 
                //  `<tr class="Added">
                //  <td><img src="./images/${currentCoin}.png">${cname}</td>
                //  <td>${Number($(".inp input").val())}</td>
                //  <td>${Number($(".inp div span").text())}</td>
                //  <td>${coinData.open}</td>
                //  </tr>`; 

                //  $(".wTable").append(newRow);
            }

            user.wallet.cash -= Number($(".inp div span").text());
            user.wallet[cname] +=  Number($(".inp input").val());
          
            update([]);
            renderWalletDay(user)
            $(".inp div span").html("");
            $(".inp input").val("");
            
        }
        
    }
    else if ( $(this).hasClass("sellTime")) {
        let coinCode = $("#curCoin img").attr("id");
        let cname;
        let money;

        for (let c of coins) {
            if (c.code === coinCode) {
                cname = c.name;
                break;
            }
        }

        if ($(".inp div span").text() === "") 
             alert("Input data");
        else if (user.wallet[cname] < Number($(".inp input").val())) {
            alert("Not enough coin to sell");
        }
        else {
            let dayIndex = user.currentDay - 1;
            let coinData
            if (user.currentDay === 1) {
                coinData = market[dayIndex];
            }
            else coinData = market[dayIndex-1];

            let num = (coinData.coins.length);
          
            for (let i = 0; i < num; i++) {
                if(coinData.coins[i].code === coinCode){
                    coinData = coinData.coins[i];
                    break;
                }
            }

            user.wallet.cash += Number($(".inp div span").text());
            user.wallet[cname] -=  Number($(".inp input").val());
            update([]);
            renderWalletDay(user)
            $(".inp div span").html("");
            $(".inp input").val("");
        }
        
    }
    
})        

let playInterval = null; // Variable to store the play interval
let isPlaying = false;   // State to track whether the simulation is running

function startPlay(user, $playButton) {
    if (isPlaying) return; // Prevents starting multiple intervals

    isPlaying = true;
    $playButton.html(`
        <i class="fa-solid fa-pause"></i> Pause
    `);

    playInterval = setInterval(() => {
        if (user.currentDay < 365) {
            $("#nextDay").click(); // Simulate the "Next Day" button
        } else {
            stopSimulation();
            pausePlay($playButton); // Ensure Play/Pause UI is updated
        }
    }, 100); // Fast-forward interval of 100ms
}

function pausePlay($playButton) {
    if (playInterval != null) {
        clearInterval(playInterval); // Stop the interval
        playInterval = null;
    }
    isPlaying = false;
    
}


$("#root").on("click", "#play", function () {
    const $playButton = $(this);
    const user = states.users.find(user => user.name === current_profile);

    if (isPlaying) {
        pausePlay($playButton);
    } else {
        startPlay(user, $playButton);
    }
});

function stopSimulation() {
    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
    }
    isPlaying = false;

    // Final wallet value display and animation
    $(".trading").remove();
    
    const $cashIs = $("#root").find(".cashIs");
    $cashIs.addClass("heartbeat");
    
    const $playButton =  $("#root").find("#play")
    $playButton.html(`<i class="fa-solid fa-play"></i> Play`)
}