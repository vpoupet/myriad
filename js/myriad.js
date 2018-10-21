/**
 * List of slides
 * @type {Slide[]}
 */
let slides = [];
/**
 * Currently active slide
 * @type {Slide}
 */
let current_slide;
/**
 * Total number of pages (number of slides that count as pages)
 * @type {number}
 */
let nb_pages;
/**
 * Current page number (used when parsing all slides to add number count)
 * @type {number}
 */
let page_number;


/**
 * Representation of a slide
 *
 * Attributes:
 * - article: the HTML article that contains the data for the slide
 * - last_step: the index of the last valid step of the slide
 * - index: slide's index in the global array slides
 * - page_number: the page number of the slide if it is a numbered slide (undefined otherwise)
 *
 * @param article {HTMLElement} the article element that contains the information of the slide
 * @constructor
 */
function Slide(article) {
    // events handlers
    article.addEventListener('click', handle_click);

    // prepare dynamic elements (steps)
    let last_step = 0;
    let active_step = 0;
    let dynamic_elements = article.querySelectorAll('.uncover, .only');

    for (let j = 0; j < dynamic_elements.length; j++) {
        let element = dynamic_elements[j];

        // fix start/end values for dynamic elements
        if ('step' in element.dataset) {
            // if step value, start and end are set to step
            element.dataset.start = element.dataset.step;
            element.dataset.end = element.dataset.step;
        }
        if (!('start' in element.dataset || 'end' in element.dataset)) {
            // if no step, start or end value, implement default behavior:
            // - "uncover" from (active_step + 1) until the end of the slide)
            // - "only" for (active_step + 1) only
            active_step += 1;
            element.dataset.start = String(active_step);
            if (element.classList.contains('only')) {
                element.dataset.end = String(active_step);
            }
        } else if ('start' in element.dataset) {
            // remember starting step for next default "uncover" and "only"
            active_step = parseInt(element.dataset.start);
        }

        // remember highest step
        if (element.dataset.start > last_step) {
            last_step = parseInt(element.dataset.start);
        }
        if (element.dataset.end > last_step) {
            last_step = parseInt(element.dataset.end);
        }
    }

    // add page number
    if (counts_as_page(article)) {
        this.page_number = page_number;
        let page_counter = document.createElement('div');
        page_counter.classList.add('page_count');
        page_counter.innerText = page_number + ' / ' + nb_pages;
        article.appendChild(page_counter);
    }

    this.last_step = last_step;
    this.article = article;
    this.index = slides.length;
    this.display_step(0);
}


/**
 * Shows and hides dynamic elements to reflect the state of the slide at step n
 * @param n {number} step number to display
 */
Slide.prototype.display_step = function(n) {
    this.current_step = n;
    let dynamic_elements = this.article.querySelectorAll('.uncover, .only');

    for (let i = 0; i < dynamic_elements.length; i++) {
        let element = dynamic_elements[i];
        if (n < element.dataset.start || element.dataset.end < n) {
            if (element.classList.contains('only')) {
                element.classList.add('no-display');
            } else {
                element.classList.add('hidden');
            }
        } else {
            if (element.classList.contains('only')) {
                element.classList.remove("no-display");
            } else {
                element.classList.remove("hidden");
            }
        }
    }
};


/**
 * Whether the given article is counted as a page for numbering
 *
 * @param article {HTMLElement}
 * @returns {boolean}
 */
function counts_as_page(article) {
    return !(article.classList.contains('title') || article.classList.contains('section') || article.classList.contains('not-page'));
}


/**
 * Displays a specific slide
 *
 * @param slide {Slide} slide to display
 * @param end {boolean} whether the last step (true) or the first step (false) of the slide should be displayed
 */
function display_slide(slide, end=false) {
    if (current_slide !== slide) {
        current_slide.display_step(0);
        current_slide = slide;
    }
    current_slide.article.scrollIntoView();
    if (end) {
        current_slide.display_step(slide.last_step);
    } else {
        current_slide.display_step(0);
    }
}


/**
 * Show next slide
 */
function next_slide() {
    let index = current_slide.index;
    if (index + 1 < slides.length) {
        // move to next slide
        display_slide(slides[index + 1]);
    } else {
        // jump to last step if last slide
        current_slide.display_step(current_slide.last_step);
    }
}


/**
 * Show previous slide
 * By default, the first step of the previous slide is displayed. If `end` parameter is true, display last step of
 * previous slide instead.
 */
function prev_slide(end=false) {
    let index = current_slide.index;
    if (index - 1 >= 0) {
        // move to previous slide
        display_slide(slides[index - 1], end);
    } else {
        // if already on first slide, jump to first step
        current_slide.display_step(0);
    }
}


/**
 * Show next step on current slide (or first step of next slide if last step)
 */
function next_step() {
    if (current_slide.current_step + 1 > current_slide.last_step) {
        next_slide();
    } else {
        current_slide.display_step(current_slide.current_step + 1);
    }
}


/**
 * Show previous step on current slide (or last step of previous slide if first step)
 */
function prev_step() {
    if (current_slide.current_step - 1 < 0) {
        prev_slide(true);
    } else {
        current_slide.display_step(current_slide.current_step - 1);
    }
}


window.onload = function() {
    // configure and run highlight.hs
    hljs.configure({
        languages: [],  // disable automatic language detection
    });
    hljs.initHighlighting();

    // process slides
    slides = [];
    let articles = document.querySelectorAll('article');

    // count number of pages
    nb_pages = 0;
    for (let i = 0; i < articles.length; i++) {
        if (counts_as_page(articles[i])) {
            nb_pages += 1;
        }
    }

    page_number = 0;
    for (let i = 0; i < articles.length; i++) {
        if (counts_as_page(articles[i])) {
            page_number += 1;
        }
        let slide = new Slide(articles[i]);
        slides.push(slide);
    }

    // uncomment for automatic flattening
    // flatten();
    // uncomment for regular behavior
    current_slide = slides[0];
    display_slide(current_slide);
};


function handle_click(event) {
    // get clicked article
    let article = event.target.closest('article');
    if (article !== current_slide.article) {
        for (let i = 0; i < slides.length; i++) {
            if (slides[i].article === article) {
                console.log(i);
                return display_slide(slides[i]);
            }
        }
    }
    let rect = current_slide.article.getBoundingClientRect();
    let x = (event.clientX - rect.left) / rect.width; //x position within the element.
    if (x <= .33) {
        prev_step();
    } else {
        next_step();
    }
}


document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case "q":
        case "ArrowLeft":
            event.preventDefault();
            prev_step();
            break;
        case " ":
        case "d":
        case "ArrowRight":
            event.preventDefault();
            next_step();
            break;
        case "s":
        case "ArrowDown":
            event.preventDefault();
            next_slide();
            break;
        case "z":
        case "ArrowUp":
            event.preventDefault();
            prev_slide();
            break;
        case "x":
            event.preventDefault();
            current_slide.article.scrollIntoView();
            break;
        case "j":
            let n = parseInt(window.prompt("Go to page"));
            if (Number.isInteger(n)) {
                goto(n);
            }
            break;
    }
});


function goto(n) {
    if (n <= 0) {
        display_slide(slides[0]);
    } else if (n > nb_pages) {
        display_slide(slides[slides.length - 1]);
    } else {
        for (let i = 0; i < slides.length; i++) {
            if (slides[i].page_number === n) {
                return display_slide(slides[i]);
            }
        }
    }
}


function flatten() {
    let step_counter = 0;
    for (let i = 0; i < slides.length; i++) {
        let slide = slides[i];
        for (let j = 0; j <= slide.last_step; j++) {
            slide.display_step(j);
            let article = slide.article.cloneNode(true);
            article.id = "slide" + step_counter;
            let prev_link = document.createElement('a');
            prev_link.href = '#slide' + (step_counter - 1);
            prev_link.classList.add('prev_link');
            article.appendChild(prev_link);
            let next_link = document.createElement('a');
            next_link.href = '#slide' + (step_counter + 1);
            next_link.classList.add('next_link');
            article.appendChild(next_link);
            step_counter += 1;
            document.body.insertBefore(article, slide.article);
        }
        slide.article.remove();
    }
    // remove all non-displayed elements
    let invisibles = document.getElementsByClassName('no-display');
    for (let i = invisibles.length - 1; i >= 0; i--) {
        invisibles[i].remove();
    }
    // remove all scripts from the page
    let scripts = document.getElementsByTagName('script');
    for (let i = scripts.length - 1; i >= 0; i--) {
        scripts[i].remove();
    }
}