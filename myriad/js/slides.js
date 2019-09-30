/**
 * List of slides
 * @type {Slide[]}
 */
let _slides;

/**
 * Dictionary of slides that have an id
 * @type {Object.<string, Slide>}
 */
let _slideLabels = {};

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
 * - section: the HTML section that contains the data for the slide
 * - last_step: the index of the last valid step of the slide
 * - index: slide's index in the global array slides
 * - page_number: the page number of the slide if it is a numbered slide (undefined otherwise)
 *
 * @param section {HTMLElement} the section element that contains the information of the slide
 * @constructor
 */
class Slide {
    constructor(section) {
        this.section = section;

        // events handlers
        section.addEventListener('click', handle_click);

        this.parseDynamicElements();
        this.page_number = page_number;

        // add header and footer
        let header = this.header();
        if (header) {
            section.insertBefore(this.header(), section.firstChild);
        }
        let footer = this.footer();
        if (footer) {
            section.appendChild(this.footer());
        }

        if (section.id !== "") {
            let id = section.id;
            _slideLabels[id] = this;
        }

        this.index = _slides.length;
        section.classList.add("no-display");
        this.display_step(0);
    }

    parseDynamicElements() {
        // prepare dynamic elements (steps)
        let last_step = 0;
        let active_step = 0;
        let dynamic_elements = this.section.querySelectorAll('.uncover, .only');

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
        this.last_step = last_step;
    }

    onload(){}

    onunload(){}

    /**
     * Shows and hides dynamic elements to reflect the state of the slide at step n
     * @param n {number} step number to display
     */
    display_step(n) {
        this.current_step = n;
        let dynamic_elements = this.section.querySelectorAll('.uncover, .only');

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
    }

    /**
     * Return the header to be appended to the slide (`null` if no header)
     * This function can be redefined by themes.
     *
     * @returns {HTMLElement} element to be used as header (inserted before the slide content)
     */
    header() {
        return null;
    }

    /**
     * Return an HTML element to be appended to the section as page counter.
     * This function can be redefined by themes.
     *
     * @returns {HTMLElement}
     */
    page_counter() {
        let counter_div = document.createElement('div');
        counter_div.classList.add('page-counter');
        counter_div.innerText = this.page_number + ' / ' + nb_pages;
        return counter_div;
    }

    /**
     * Return the footer to be appended to the slide (`null` if no footer)
     * This function can be redefined by themes.
     *
     * @returns {HTMLElement} element to be used as footer (inserted after the slide content)
     */
    footer() {
        let page_counter = this.page_counter();
        if (page_counter) {
            let footer_div = document.createElement('div');
            footer_div.classList.add('slide-footer');
            footer_div.appendChild(this.page_counter());
            return footer_div;
        }
        return null;
    }
}


/**
 * Displays a specific slide
 *
 * @param slide {Slide} slide to display
 * @param end {boolean} whether the last step (true) or the first step (false) of the slide should be displayed
 */
function display_slide(slide, end=false) {
    sessionStorage.slideIndex = slide.index;

    if (current_slide !== undefined) {
        // unload and hide the previous slide
        current_slide.display_step(0);
        current_slide.onunload();
        current_slide.section.classList.add("no-display");
        current_slide = slide;
    }

    // show and load the new slide
    current_slide.section.classList.remove("no-display");
    current_slide.onload();

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
    if (index + 1 < _slides.length) {
        // move to next slide
        display_slide(_slides[index + 1]);
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
        display_slide(_slides[index - 1], end);
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


/**
 * Initial setup. Parses all slides, counts pages, prepares steps, etc.
 * Should be called in `window.onload`.
 */
function process_slides() {
    _slides = [];
    let sections = document.querySelectorAll('section');

    // count number of pages
    nb_pages = 0;
    for (let section of sections) {
        if (count_as_page(section)) {
            nb_pages += 1;
        }
    }

    page_number = 0;
    for (let section of sections) {
        if (count_as_page(section)) {
            page_number += 1;
        }
        let slide = new Slide(section);
        _slides.push(slide);
    }

    // transform short dates into detailed dates
    fixDate();

    let index = sessionStorage.slideIndex;
    current_slide = _slides[index];
    if (current_slide === undefined) {
        current_slide = _slides[0];
    }
    display_slide(current_slide);
}


/**
 * Parses all `time` HTML elements and replaces the textContent of the ones containing a short date (YYYY-MM-DD,
 * YYYY-MM or YYYY) by the corresponding full date (with month name). If a replacement occurs, the `datetime` attribute
 * of the element is set as the short date.
 */
function fixDate() {
    let months;
    let language = document.documentElement.lang;
    if (language === "fr") {
        months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    } else {
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    }

    for (let timeElement of document.getElementsByTagName("time")) {
        let date = timeElement.textContent;
        let fullDate;
        if (/^\d{4}(-\d{1,2}){0,2}$/.test(date)) {
            let [year, month, day] = date.split('-').map(x => parseInt(x));
            if (month === undefined) {
                fullDate = `${year}`;
            } else if (day === undefined) {
                if (1 <= month && month <= 12) {
                    fullDate = `${months[month - 1]} ${year}`;
                }
            } else {
                if (1 <= month && month <= 12 && 1 <= day && day <= 31) {
                    if (language === "fr") {
                        fullDate = `${day} ${months[month - 1]} ${year}`;
                    } else {
                        fullDate = `${months[month - 1]} ${day}, ${year}`;
                    }
                }
            }
        }

        if (fullDate !== undefined) {
            timeElement.setAttribute("datetime", date);
            timeElement.textContent = fullDate;
        }
    }
}


/**
 * React to click event:
 *   - in bottom-left corner: previous step
 *   - in bottom-right corner: next step
 *
 * @param event {MouseEvent} click event
 */
function handle_click(event) {
    let rect = current_slide.section.getBoundingClientRect();

    let x = (event.clientX - rect.left) / rect.width; //x position within the element.
    let y = (event.clientY - rect.top) / rect.height; //y position within the element.
    if (y > .95) {
        if (x <= .1) {
            prev_step();
        } else if (x >= .9) {
            next_step();
        }
    }
}

/**
 * React to key presses. Available actions:
 *   - Q or Left Arrow: previous step
 *   - D, Right Arrow or Space: next step
 *   - S or Down Arrow: next slide
 *   - Z or Up Arrow: previous slide
 *   - J: jump to a specific page (prompts user for page number)
 */
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
        case "j":
            let n = parseInt(window.prompt("Go to page"));
            if (Number.isInteger(n)) {
                goto(n);
            }
            break;
    }
});


/**
 * Jump to the first slide with given page number
 *
 * @param n {number} page number to jump to
 */
function goto(n) {
    if (n <= 0) {
        display_slide(_slides[0]);
    } else if (n > nb_pages) {
        display_slide(_slides[_slides.length - 1]);
    } else {
        for (let i = 0; i < _slides.length; i++) {
            if (_slides[i].page_number === n) {
                return display_slide(_slides[i]);
            }
        }
    }
}


/**
 * Transform the presentation into a pure HTML/CSS presentation by flattening all slide steps:
 *   - each slide is replaced by a sequence of slides corresponding to each of its display steps
 *   - elements that are not displayed in a step (class `only`) are removed from the DOM
 *   - anchors are added before each slide
 *   - links to previous and next slides are added on top of each slide
 *   - `script` elements are removed from the DOM
 *
 * Note: This function is not used automatically (can be used from the console or in a custom script)
 */
function flatten() {
    let step_counter = 0;
    for (let i = 0; i < _slides.length; i++) {
        let slide = _slides[i];
        slide.section.classList.remove("no-display");
        for (let j = 0; j <= slide.last_step; j++) {
            slide.display_step(j);
            let section = slide.section.cloneNode(true);
            let anchor = document.createElement('a');
            anchor.id = "slide_anchor" + step_counter;
            let prev_link = document.createElement('a');
            prev_link.href = '#slide_anchor' + (step_counter - 1);
            prev_link.classList.add('prev_flat_link');
            section.appendChild(prev_link);
            let next_link = document.createElement('a');
            next_link.href = '#slide_anchor' + (step_counter + 1);
            next_link.classList.add('next_flat_link');
            section.appendChild(next_link);
            step_counter += 1;
            document.body.insertBefore(anchor, slide.section);
            document.body.insertBefore(section, slide.section);
        }
        slide.section.remove();
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


/**
 * Whether the slide represented by the given section is counted as a page for numbering
 * This function can be redefined by themes.
 *
 * @param section {HTMLElement} a section element representing a slide
 * @returns {boolean}
 */
function count_as_page(section) {
    return !section.classList.contains('not-page');
}

window.addEventListener("load", process_slides, false);
