function init() {
    var photos = [].slice.call(document.getElementsByClassName("newsPhoto"));
    for (var i = 0; i < photos.length; i++) {
        var photo = photos[i];
        var text = photo.parentElement.getElementsByClassName("articleContent")[0];
        var factor = Math.min(
            ((0.49 * text.clientWidth) / photo.naturalWidth),
            (text.clientHeight / photo.naturalHeight)
        );
        var width = Math.round(factor * photo.naturalWidth);
        var height = Math.round(factor * photo.naturalHeight);
        photo.style.width = width + "px";
        photo.style.height = height + "px";
        photo.style.display = "block";
    }
}
