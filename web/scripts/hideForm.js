function hideForm(event, form) {
    event = event || window.event;
    event.preventDefault();
    
    form.style.display = "none";
    document.getElementById("formAlt").style.display = "initial";
    
    $.ajax(form.action, {method: "POST", data: $(form).serialize()});
}
