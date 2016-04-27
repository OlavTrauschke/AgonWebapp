function createNames() {
    var inputs = [].slice.call(document.getElementsByTagName("input"));
    var textareas = [].slice.call(document.getElementsByTagName("textarea"));
    var allInputs = inputs.concat(textareas);
    for (var i = 0; i < allInputs.length; i++) {
        var input = allInputs[i];
        if (input.name === "" && input.id !== null && input.id !== "") {
            input.name = input.id;
        }
    }
}

function processForm(event, form) {
    event = event || window.event;
    event.preventDefault();
    
    form.style.display = "none";
    
    $.ajax(form.action, {method: "POST", data: $(form).serialize(),
                        error: function() {display("formError");},
                        success: function() {display("formSuccess");}});
}

function display(id) {
    document.getElementById(id).style.display = "block";
}
