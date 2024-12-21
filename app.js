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
        <div id="profiles"></div>
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
}

function renderProfiles() {
    $("#profiles").html("")
    for (user of states.users) {
        $("#profiles").append(`<div class="profile">
            <button type="button">X</button>
            <i class="fa-solid fa-user fa-xl"></i>
            <span>${user.name}</span></div>`)
    }
}

$(".profile").on("click", function() {
    current_profile = $(this).children("span").text()
    update([renderProfile])
})

$("#profiles").on("click", ".profile button", function(e) {
    states.users = states.users.filter(user => user.name !== $(this).parent().children("span").text())
    console.log(e)
    e.stopPropagation()
    update([renderProfiles])
})

$("main").on("click", "#footer button", function() {
    let name = prompt("Enter user name")
    user = {name: name, wallet: {cash: 1000}}
    states.users.push(user)
    update([renderProfiles])
})