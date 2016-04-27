function init() {
    var sendDateField = document.getElementById("datumVersturen");
    var currentDate = new Date().toISOString();
    var currentDateString = currentDate.substr(0,10);
    sendDateField.value = currentDateString;
    
    var joinDateField = document.getElementById("datumInschrijving");
    joinDateField.value = currentDateString;
}
