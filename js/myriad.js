function count_as_page (section) {
    return !(section.classList.contains('not-page') ||
        section.classList.contains('title') ||
        section.classList.contains('section'));
}

window.onload = function() {
    // configure and run highlight.hs
    hljs.configure({
        languages: [],  // disable automatic language detection
    });
    hljs.initHighlighting();

    // process slides
    process_slides();
    // flatten();
};