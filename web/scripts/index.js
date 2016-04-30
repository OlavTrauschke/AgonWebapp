var activeButtons = [];

function markThis() {mark(this);}
function unmarkThis() {unmark(this);}
function mark(button) {
    button.style.color = "#FCD100";
    button.style.backgroundColor = "#1B2EA1";
}
function unmark(button) {
    button.style.color = "white";
    button.style.backgroundColor = "transparent";
}

function markMenuItemThis() {markMenuItem(this);}
function unmarkMenuItemThis() {unmarkMenuItem(this);}
function markMenuItem(menuItem) {
    menuItem.style.backgroundColor = "#1B2EA1";
}
function unmarkMenuItem(menuItem) {
    menuItem.style.backgroundColor = "transparent";
}

function init() {
    addEventListener("keydown", goToHomeOnDownArrow);
    document.getElementById("content").addEventListener("wheel", goToHomeOnScrollDown);
    addEventListener("hashchange", navigate);
    addMarkOnHover();
    addSubmenus();
    var mainFrame = document.getElementById("mainFrame");
    mainFrame.addEventListener("load", resizeMenu);
    initMenu();
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
    document.getElementById(id).style.display = "block";
}
function hide(id) {
    document.getElementById(id).style.display = "none";
}

function resizeMenu() {
    var mainFrame = document.getElementById("mainFrame");
    var frameDocument = mainFrame.contentWindow.document;
    var frameContent = frameDocument.getElementById("content");
    var width = frameContent.clientWidth;
    var menu = document.getElementById("menu");
    menu.style.width = width + "px";
}

function initMenu() {
    var menuItem1 = document.getElementById("menuItem1");
    var height = menuItem1.clientHeight;
    var menu = document.getElementById("menu");
    menu.style.height = height + "px";
}

//TODO improve back-button support
function navigate() {
    var frame = document.getElementById("mainFrame");
    var destination = window.location.hash;
    if (destination !== "") {
        destination = destination.substring(1);
    }
    if (destination === "FyliWedstrijd") {
        frame.src = "/test/pages/fyli/wedstrijd.html";
        inactivateActiveButtons();
        activeButtons = [null];
    }
    if (destination === "FyliClinic") {
        frame.src = "/test/pages/fyli/clinic.html";
        inactivateActiveButtons();
        activeButtons = [null];
    }
    if (destination === "FyliFestival") {
        frame.src = "/test/pages/fyli/festival.html";
        inactivateActiveButtons();
        activeButtons = [null];
    }
    var button = document.getElementById(destination);
    if (button !== null) {
        goTo(button);
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
    removeEventListener("keydown", goToHomeOnDownArrow);
    document.getElementById("content").removeEventListener("wheel", goToHomeOnScrollDown);
    document.getElementById("mainFrame").style.height = "95%";
    var socialMediaBar = document.getElementById("socialMediaBar");
    socialMediaBar.style.display = "block";
    socialMediaBar.style.height = (socialMediaBar.clientHeight - 1) + "px";
    
}

function inactivateActiveButtons() {
    for (var i = 0; i < activeButtons.length; i++) {
        var activeButton = activeButtons[i];
        if (activeButton === null) {
            continue;
        }
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

function goToVideos() {
    window.location.hash = "MediaVideos";
}

function goToAanmeldingWedstrijd() {
    window.location.hash = "FyliWedstrijd";
}

function goToAanmeldingClinic() {
    window.location.hash = "FyliClinic";
}

function goToAanmeldingFestival() {
    window.location.hash = "FyliFestival";
}
