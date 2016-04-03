function init() {
    var sendDateField = document.getElementById("datumVersturen");
    var currentDate = new Date().toISOString();
    sendDateField.value = currentDate.substr(0,10);
}
