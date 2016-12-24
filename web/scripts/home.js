function init() {
    var photos = [].slice.call(document.getElementsByClassName("newsPhoto"));
    for (var i = 0; i < photos.length; i++) {
        var photo = photos[i];
        var text = photo.parentElement.getElementsByClassName("articleContent")[0];
        var width = 0;
        var height = 0;
        //Fixpoint because text height may increase with photo width due to wrapping
        //Checks for difference larger than 1px because of rounding
        while (Math.abs(width - 0.49 * text.clientWidth) > 1
                && Math.abs(height - text.clientHeight) > 1)
        {
            var photoDimensions = calculatePhotoDimensions(photo, text);
            width = photoDimensions[0];
            height = photoDimensions[1];
        }
    }
}

function calculatePhotoDimensions(photo, text) {
    var factor = Math.min(
        ((0.49 * text.clientWidth) / photo.naturalWidth),
        (text.clientHeight / photo.naturalHeight)
    );
    var width = Math.round(factor * photo.naturalWidth);
    var height = Math.round(factor * photo.naturalHeight);
    photo.style.width = width + "px";
    photo.style.height = height + "px";
    photo.style.display = "block";
    return [width, height];
}
