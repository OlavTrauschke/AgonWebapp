function init() {
    var bodyHeight = document.body.clientHeight;
    var topFotoHeight = document.getElementById("topFoto").clientHeight;
    
    var content = document.getElementById("content");
    var contentPaddingTop = parseFloat(getComputedStyle(content).getPropertyValue("padding-top"));
    var contentPaddingBottom = parseFloat(getComputedStyle(content).getPropertyValue("padding-bottom"));
    
    var newCalendarHeight = (bodyHeight - topFotoHeight - contentPaddingTop - contentPaddingBottom) + "px";
    document.getElementById("calendar").style.height = newCalendarHeight;
    content.style.height = newCalendarHeight;
}