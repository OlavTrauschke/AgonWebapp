var activeButtons = [];
var menuItemsWithSubMenus = ["2","4","6"];
var windowWidth;
var windowHeight;

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
    window.addEventListener("resize", function() {
        //TODO fix automatic reloading by more subtle approach
        if (windowWidth !== window.clientWidth
                || windowHeight !== window.clientHeight)
        {
            window.location.reload();
            windowWidth = window.clientWidth;
            windowHeight = window.clientHeight;
        }
    });
    document.getElementById("onlyIfScriptNotSupported").style.display = "none";
    document.getElementById("onlyIfScriptSupported").style.display = "block";
    
    var mainFrame = document.getElementById("mainFrame");
    
    document.addEventListener("touchmove", function(e) {
        //TODO remove test
        alert('Touchmove on  index');
        //TODO remove test
        var eClone = cloneObject(e);
        mainFrame.contentDocument.dispatchEvent(eClone);
        e.preventDefault();
    });
    
    //TODO remove test
    mainFrame.addEventListener("load", function() {
        mainFrame.contentDocument.addEventListener("touchmove", function(e) {
            alert('Touchmove on frame');
        });
    });
    //TODO remove test
    
    if (isWideScreen()) {
        mainFrame.src = "/test/pages/welcome.html";
        addEventListener("keydown", goToHomeOnDownArrow);
        document.getElementById("content").addEventListener("wheel", goToHomeOnScrollDown);
        addMarkOnHover();
        addEventListener("hashchange", navigate);
    }
    else
    {
        mainFrame.src = "/test/pages/home.html";
        var socialMediaBar = document.getElementById("socialMediaBar");
        document.getElementById("mainFrame").style.height = "95%";
        socialMediaBar.style.display = "block";
        //TODO uncomment if necessary socialMediaBar.style.height = (socialMediaBar.clientHeight - 1) + "px";
        addEventListener("hashchange", closeHamburgerMenuAndNavigate);
    }
    addSubmenus();
    mainFrame.addEventListener("load", resizeMenu);
    initMenu();
    windowWidth = window.clientWidth;
    windowHeight = window.clientHeight;
    navigate();
}

//Source: Rustam, November 5, 2012, http://stackoverflow.com/questions/11974262/how-to-clone-or-re-dispatch-dom-events
function cloneObject(obj) {
    if (obj === null || typeof(obj) !== 'object')
    {
        return obj;
    }
    else
    {
        var clone = new obj.constructor();
        for(var key in obj) {
            clone[key] = cloneObject(obj[key]);
        }
        return clone;
    }
}

function isWideScreen() {
    var mediaQuery = window.matchMedia("only screen and (min-width: 900px)");
    return mediaQuery.matches;
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
    for (var i = 0; i < menuItemsWithSubMenus.length; i++) {
        var menuItemIdNumber = menuItemsWithSubMenus[i];
        var menuItem = document.getElementById("menuItem" + menuItemIdNumber);
        if (isWideScreen()) {
            var showHandle = function(id) {show(id);};
            var hideHandle = function(id) {hide(id);};
            menuItem.addEventListener("mouseover",
                showHandle.bind(this, "submenu" + menuItemIdNumber));
            menuItem.addEventListener("mouseout",
                hideHandle.bind(this, "submenu" + menuItemIdNumber));
        }
        else {
            var toggleHandle = function(id) {toggle(id);};
            menuItem.addEventListener("click",
                toggleHandle.bind(this, "submenu" + menuItemIdNumber));
        }
    }
}

function show(id) {
    document.getElementById(id).style.display = "block";
}
function hide(id) {
    document.getElementById(id).style.display = "none";
}

function toggle(id) {
    var element = document.getElementById(id);
    var oldDisplay = getComputedStyle(element).display;
    element.style.display = oldDisplay === "none" ? "block" : "none";
}

function toggleHamburger() {
    var actualMenuStyle = document.getElementById("actualMenu").style;
    var actualMenuOldDisplay = actualMenuStyle.display;
    actualMenuStyle.display = actualMenuOldDisplay === "none" ? "inline-block" : "none";
    
    document.getElementById("menu").style.backgroundColor =
            actualMenuOldDisplay === "none"
            ? "rgba(27, 46, 161, 1)"
            : "rgba(27, 46, 161, 0.7)";
}

function closeHamburger() {
    document.getElementById("actualMenu").style.display = "none";
    document.getElementById("menu").style.backgroundColor = "rgba(27, 46, 161, 0.7)";
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
    if (isWideScreen()) {
        document.getElementById("hamburgerButton").style.display = "none";
    }
    else {
        var menuHeight = document.getElementById("menuItem1").clientHeight;
        var buttonHeight = Math.round(0.9 * menuHeight);
        var padding = Math.floor((menuHeight - buttonHeight) / 2);
        var button = document.getElementById("hamburgerButtonIcon");
        button.style.height = buttonHeight + "px";
        button.style.paddingTop = padding + "px";
        button.style.paddingRight = padding + "px";
        document.getElementById("actualMenu").style.display = "none";
        document.getElementById("hamburgerButtonLink").style.height = menuHeight + "px";
    }
}

function closeHamburgerMenuAndNavigate() {
    closeHamburger();
    navigate();
}

function navigate() {
    var destination = window.location.hash;
    if (destination !== "") {
        destination = destination.substring(1);
    }
    var destinationHead =  destination.charAt(0).toUpperCase();
    var destinationTail = destination.substring(1, destination.length);
    destination = destinationHead + destinationTail;
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
    //TODO uncomment if necessary socialMediaBar.style.height = (socialMediaBar.clientHeight - 1) + "px";
    
    var emailButton = document.getElementById("emailButton");
    var nameText = document.getElementById("nameText");
    var shield = document.getElementById("shield");
    if (emailButton.offsetTop < shield.offsetTop) {
        nameText.style.display = "none";
    }
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

function goToAanmeldingActiviteit() {
    window.location.hash = "ContactAanmeldenActiviteit";
}

function showSocialMediaBarLocation() {
    var result = showPosition(document.getElementById("socialMediaBar"), "socialMediaBar") + "\n"
        + showPosition(document.getElementById("onlyIfScriptSupported"), "onlyIfScriptSupported") + "\n"
        + showPosition(document.getElementById("content"), "content") + "\n"
        + showPosition(document.body, "body") + "\n"
        + showPosition(document.documentElement, "document") + "\n"
        + "window client: " + window.clientWidth + "," + window.clientHeight + ","
        + " scrollY " + window.scrollY;
    alert(result);
}

function showPosition(element, name) {
    var style = window.getComputedStyle(element);
    return name + ": set: "
        + style.getPropertyValue("position") + ","
        + style.getPropertyValue("top") + ","
        + style.getPropertyValue("left") + ","
        + style.getPropertyValue("width") + ","
        + style.getPropertyValue("height")
        + " client: "
        + element.clientTop + ","
        + element.clientLeft + ","
        + element.clientWidth + ","
        + element.clientHeight
        + " offset: "
        + element.offsetTop + ","
        + element.offsetLeft + ","
        + element.offsetWidth + ","
        + element.offsetHeight
        + " scrollTop: "
        + element.scrollTop;
}
