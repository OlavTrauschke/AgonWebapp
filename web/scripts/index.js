var activeButtons = [];

function markThis() {mark(this);}
function unmarkThis() {unmark(this);}
function mark(button) {
    button.style.color = "#FCD100";
    button.style.opacity = 1;
}
function unmark(button) {
    button.style.color = "white";
    button.style.opacity = 0.7;
}

function markMenuItemThis() {markMenuItem(this);}
function unmarkMenuItemThis() {unmarkMenuItem(this);}
function markMenuItem(menuItem) {
    menuItem.style.opacity = 1;
}
function unmarkMenuItem(menuItem) {
    menuItem.style.opacity = 0.7;
}

function init() {
    document.body.addEventListener("keydown", goToHomeOnDownArrow);
    document.body.addEventListener("wheel", goToHomeOnScrollDown);
    addEventListener("hashchange", navigate);
    addMarkOnHover();
    addSubmenus();
    navigate();
}

function addMarkOnHover() {
    var markableItems = [].slice.call(document.getElementsByClassName("markable"));
    for (var i = 0; i < markableItems.length; i++) {
        var markableItem = markableItems[i];
        markableItem.addEventListener("mouseover", markThis);
        markableItem.addEventListener("mouseout", unmarkThis);
    }
    var menuItems = [].slice.call(document.getElementsByClassName("menuItem"));
    for (var i = 0; i < menuItems.length; i++) {
        var menuItem = menuItems[i];
        menuItem.addEventListener("mouseover", markMenuItemThis);
        menuItem.addEventListener("mouseout", unmarkMenuItemThis);
    }
}

function addSubmenus() {
    var menuItem2 = document.getElementById("menuItem2");
    menuItem2.addEventListener("mouseover", function() {show("submenu2");});
    menuItem2.addEventListener("mouseout", function() {hide("submenu2");});
    
    var menuItem4 = document.getElementById("menuItem4");
    menuItem4.addEventListener("mouseover", function() {show("submenu4");});
    menuItem4.addEventListener("mouseout", function() {hide("submenu4");});
    
    var menuItem6 = document.getElementById("menuItem6");
    menuItem6.addEventListener("mouseover", function() {show("submenu6");});
    menuItem6.addEventListener("mouseout", function() {hide("submenu6");});
}

function show(id) {
    document.getElementById(id).style.display = "initial";
}
function hide(id) {
    document.getElementById(id).style.display = "none";
}

function navigate() {
    var destination = window.location.hash;
    if (destination !== "") {
        destination = destination.substring(1);
        goTo(document.getElementById(destination));
    }
}

function goToHomeOnDownArrow(e) {
    e = e || window.event;
    if (e.keyCode === 40) {
        goToHome();
    }
}
function goToHomeOnScrollDown(e) {
    e = e || window.event;
    if (e.deltaY > 0) {
        goToHome();
    }
}
function goToHome() {
    window.location.hash = "Home";
}

function goTo(button) {
    var frame = document.getElementById("mainFrame");
    var destination = button.getAttribute("data-destination");
    frame.src = destination;
    if (activeButtons.length === 0) {
        leaveWelcome();
    }
    inactivateActiveButtons();
    while (!button.classList.contains("markable")) {
        button = button.parentElement;
    }
    activeButtons = [button];
    if (button.classList.contains("mainMenuItem")) {
        activeButtons.push(button.parentElement);
    }
    else if (button.classList.contains("submenuItem")) {
        var grandparent = button.parentElement.parentElement;
        activeButtons.push(grandparent);
        var grandparentsChildren = grandparent.children;
        for (var i = 0; i < grandparentsChildren.length; i++) {
            var child = grandparentsChildren[i];
            if (child.classList.contains("mainMenuItem")) {
                activeButtons.push(child);
                break;
            }
        }
    }
    activateActiveButtons();
}

function leaveWelcome() {
    document.body.removeEventListener("keydown", goToHomeOnDownArrow);
    document.body.removeEventListener("wheel", goToHomeOnScrollDown);
    document.getElementById("mainFrame").style.height = "95%";
    var socialMediaBar = document.getElementById("socialMediaBar");
    socialMediaBar.style.display = "initial";
    socialMediaBar.style.height = (socialMediaBar.clientHeight - 1) + "px";
    
}

function inactivateActiveButtons() {
    for (var i = 0; i < activeButtons.length; i++) {
        var activeButton = activeButtons[i];
        if (activeButton.classList.contains("markable")) {
            activeButton.addEventListener("mouseover", markThis);
            activeButton.addEventListener("mouseout", unmarkThis);
        }
        if (activeButton.classList.contains("menuItem")) {
            activeButton.addEventListener("mouseover", markMenuItemThis);
            activeButton.addEventListener("mouseout", unmarkMenuItemThis);
        }
        unmark(activeButton);
    }
}

function activateActiveButtons() {
    for (var i = 0; i < activeButtons.length; i++) {
        var activeButton = activeButtons[i];
        if (activeButton.classList.contains("markable")) {
            activeButton.removeEventListener("mouseover", markThis);
            activeButton.removeEventListener("mouseout", unmarkThis);
        }
        if (activeButton.classList.contains("menuItem")) {
            activeButton.removeEventListener("mouseover", markMenuItemThis);
            activeButton.removeEventListener("mouseout", unmarkMenuItemThis);
        }
        mark(activeButton);
    }
}

function goToContactgegevens() {
    window.location.hash = "ContactContactgegevens";
}

function goToContactformulier() {
    window.location.hash = "ContactContactformulier";
}

function goToInschrijfformulier() {
    window.location.hash = "VerenigingWordLid";
}
