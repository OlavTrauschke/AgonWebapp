function init() {
    var docWidth = document.body.clientWidth;
    
    var shield = document.getElementById("shield");
    var xPosShield = Math.round((docWidth - shield.clientWidth) * 0.5);
    shield.style.left = xPosShield + "px";
    shield.style.visibility = "visible";
    
    var downArrow = document.getElementById("downArrow");
    var xPosDownArrow = Math.round((docWidth - downArrow.clientWidth) * 0.5);
    downArrow.style.left = xPosDownArrow + "px";
    downArrow.style.visibility = "visible";
    
    document.getElementById("content").addEventListener("wheel", handleScroll);
}

function goToHome() {
    window.parent.goToHome();
}

function handleScroll(e) {
    window.parent.goToHomeOnScrollDown(e);
}
