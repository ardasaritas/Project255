let states = {}
let current_profile = null

let storedData = localStorage.getItem("user_states")
states = storedData ? JSON.parse( storedData) : {active: null, users: [{name: "Işık Dönger", wallet: {cash: 1000}}, 
                                {name: "İbrahim Can Doğan", wallet: {cash: 1000}}, 
                                {name: "Arda Sarıtaş", wallet: {cash: 1000}}, 
                                {name: "Yağız Çetin", wallet: {cash: 1000}}]}

renderPage()

function update(fns) {
    for (fn of fns) {
        fn()
    }
    localStorage.setItem("user_states", JSON.stringify(states))
}

function renderPage() {
   $("#root").html(`<main>
        <div id="top">
            <div id="title">
                <h1>CTIS</h1>
                <h2>Crypto Trading Information System</h2>
            </div>
            <div id="user"></div>
        </div>
        <div id="middle"></div>
        <div id="footer"><button type="button" id="profile">+ New Profile</button></div>
    </main>`)
    renderProfiles()
}

function renderProfile() {
    if (current_profile !== null) {
        $("#user").html(`<i class="fa-solid fa-user fa-xs"></i>
            <span>${current_profile}</span>
            <button type="button">
                <i class="fa-solid fa-door-open fa-xs"></i>
                Logout
            </button>`)
    }
    else {
        $("#user *").remove()
    }
}

function renderProfiles() {
    $("#middle").html("")
    for (user of states.users) {
        $("#middle").append(`<div class="profile">
            <button type="button">X</button>
            <i class="fa-solid fa-user fa-xl"></i>
            <span>${user.name}</span></div>`)
    }
}

$("main").on("click", ".profile", function() {
    current_profile = $(this).children("span").text()
    $("#middle").html("")
    update([renderProfile])
})

$("#root").on("click", "#user button", function(e) {
    current_profile = null
    $("#middle").html("")
    update([renderProfile, renderProfiles])
})

$("#middle").on("click", ".profile button", function(e) {
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
    let user = {name, wallet: {cash: 1000}}
    states.users.push(user)
    //localStorage.setItem(states, JSON.parse(states))
    $("*:not(#prompt):not(#prompt *):not(.profile button)").css("background-color", "");
    $("#prompt").remove()
    update([renderProfiles])
})