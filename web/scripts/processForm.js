function processForm(event, form) {
    event = event || window.event;
    event.preventDefault();
    
    form.style.display = "none";
    
    $.ajax(form.action, {method: "POST", data: $(form).serialize(),
                        error: display("formError"), success: display("formSuccess")});
}

function display(id) {
    document.getElementById(id).style.display = "block";
}
