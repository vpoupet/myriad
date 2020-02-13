function count_as_page (section) {
    return !(section.classList.contains('not-page') ||
        section.classList.contains('title') ||
        section.classList.contains('section'));
}

function toggleAnimation() {
    document.body.classList.toggle("animated");
}

window.addEventListener(
    "load",
    function() {
        // add "single" or "split" class to sections with no explicit type
        for (let section of document.getElementsByTagName("section")) {
            if (!section.classList.contains("blank") &&
                !section.classList.contains("title") &&
                !section.classList.contains("section")) {
                if (section.getElementsByClassName("side").length > 0) {
                    section.classList.add("split");
                } else {
                    section.classList.add("single");
                }
            }
        }
        // make boxes
        let boxes = document.getElementsByClassName("box");
        for (let box of boxes) {
            let title = box.getElementsByClassName("box-title")[0];
            let content = box.getElementsByClassName("box-content")[0];
            let top = document.createElement("div");
            top.classList.add("box-top");
            let top_left = document.createElement("div");
            top_left.classList.add("box-top-left");
            let top_right = document.createElement("div");
            top_right.classList.add("box-top-right");
            let bottom = document.createElement("div");
            bottom.classList.add("box-bottom");
            top.appendChild(top_left);
            if (title !== undefined) top.appendChild(title);
            top.appendChild(top_right);
            box.insertBefore(top, content);
            box.appendChild(bottom);
        }
    },
    false
);