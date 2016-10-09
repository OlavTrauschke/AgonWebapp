function goToContactgegevens() {
    if (window.top === window.self) {
        return true;
    }
    window.parent.goToContactgegevens();
    return false;
}

function goToContactformulier() {
    if (window.top === window.self) {
        return true;
    }
    window.parent.goToContactformulier();
    return false;
}

function goToInschrijfformulier() {
    if (window.top === window.self) {
        return true;
    }
    window.parent.goToInschrijfformulier();
    return false;
}

function goToVideos() {
    if (window.top === window.self) {
        return true;
    }
    window.parent.goToVideos();
    return false;
}

function goToAanmeldingActiviteit() {
    if (window.top === window.self) {
        return true;
    }
    window.parent.goToAanmeldingActiviteit();
    return false;
}
