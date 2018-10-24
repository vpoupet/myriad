# Description

Lightweight CSS/Javascript library for preparing presentation slides in HTML.


# How to use

A presentation is written as a single HTML file. It should contain a reference to the `slides.css` and `myriad.js` for
basic slides functionality, as well as theme CSS and Javascript files (theme files should appear after as they might
override functions or style rules): 

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="./css/slides.css">
    <link rel="stylesheet" href="./css/myriad.css">
    <title>Awesome Presentation</title>
</head>
<body>

<script src="./js/styles.js"></script>
<script src="./js/myriad.js"></script>
</body>
</html>
```

Slides of the presentation correspond to `section` elements in the HTML.

# General slides functionality


## Structure of a slide

The title of the slide should appear in a `h1` element. The rest of the element will be used as content for the slide.

A _header_ and a _footer_ will be added automatically. It is possible to override the `header()` and `footer()` methods
in the `Slides` prototype to modify header and footer content (by default there is no header, and the footer contains
the page counter).

## Configuration

* The function `count_as_page(section)` can be redefined to specify which slides count in the page numbering (depending on the
contents of their section).

* Methods `header()`, `footer()` and `page_counter()` of `Slide.prototype` can be redefined to
modify the contents of the header, footer and page counter respectively. These methods should return an HTML element or
`null`.

* If the `window.onload` function is redefined, it should explicitely call `process_slides()`.


## Dynamic elements

Slides might feature _dynamic_ elements that appear or disappear in several _steps_. These can be controlled with the
classes `uncover` and `only`:
* `uncover` elements are hidden when not active, but still occupy space on the slide
* `only` elements are not represented at all while not active (don't take space at all)

To control the steps at which dynamic elements are displayed (active), use attributes `data-start`, `data-end` and 
`data-step`. These attributes should have non-negative integer values corresponding to steps of the current slide
(first step is numbered 0):
* `data-start` indicates the first step (inclusive) at which the element is active
* `data-end` indicates the last step (inclusive) at which the element is active
* if `data-step` is given, `data-start` and `data-end` are set to its value (used for elements active for only one step)

If `data-start` is given but not `data-end` the element is active for all steps of the current slide after the starting
one. If `data-end` is given but not `data-start`, the element is active from the first step until the indicated end.

Lastly, if neither `data-start` nor `data-end` is given (and no `data-step` since it corresponds to both start and end),
the element will be active from the step following the last referenced step. If the element is of class `only`, it 
will be active for one step only, if it is of class `uncover` it will remain active until the end of the slide. This 
enables series of consecutive dynamic elements without explicitely giving start and end steps.

For instance, to represent an animation of successive images replacing each other, starting from step 0:
```html
<img src="file01.jpg" class="only" data-start="0">
<img src="file02.jpg" class="only">
<img src="file03.jpg" class="only">
```
or for uncovering a list of items at successive steps (if no dynamic element was referenced before the first list 
item will be uncovered at step 1):
```html
<ul>
<li class="uncover">First item</li>
<li class="uncover">Second item</li>
<li class="uncover">Third item</li>
</ul>
```

## Navigation

Slides are automatically scaled to fill the screen and scrolling is disabled by the CSS (only mouse scrolling, finger
scrolling on touch devices still works) to maintain alignment of the slides.

**Note:** Because slides are represented vertically, if the window has a width/height ratio less than 4/3, parts of the 
next slide will appear under the current slide (so it looks better with an aspect ratio >= 4/3). Ratio of slides can 
be changed by editing the values in `slides.css`. 

Navigation can be done with keyboard or mouse:
* <kbd>&rarr;</kbd>, <kbd>D</kbd> or <kbd>space</kbd>: next step
* <kbd>&larr;</kbd> or <kbd>Q</kbd>: previous step
* <kbd>&darr;</kbd> or <kbd>S</kbd>: next slide (first step)
* <kbd>&uarr;</kbd> or <kbd>Z</kbd>: previous slide (first step)
* <kbd>J</kbd>: jump to a page number (prompts the user for a number)
* <kbd>X</kbd>: realign scrolling to current slide
* click on left third of current slide: previous step
* click on rest of current slide: next step

# Themes

Themes can be created by adding CSS stylesheets and (optionally) redefining some of the _Javascript_ functions.

## Myriad

Myriad is a black and white theme to be used with `slides.js` and `slides.css`. It defines 4 types of slides

### Title Slide

`section` elements with the class `title` will be styled as title slides. These may have:
* an `h1` element for the title of the presentation
* an `h2` element for an optional subtitle
* a `div` element with class `author` for the author of the presentation
* a `div` element with class `context` for the context in which the presentation is given (conference name, course 
title, etc.)
* a `time` element for the date

All other elements of a title slide (for instance an image) should be manually placed with absolute position.

### Single slides

`section` elements with the `single` class are styled as slides with a single block of content. It is recommended to
group the contents of the slide (other than the title) in a `div` element.

### Split slides

`section` elements with the `split` class are styled as two column slides. The left side has white background and the 
right one has black background.

The content of the left side should be placed in a `div` with class `leftside`, whereas the content of the right
column should be placed in a `div` with class `rightside`.

### Blank slides

`section` elements with no styling class will be represented as blank slides with plain white background. They might
have a title (`h1`) as other slides. By default blank slides will also have a page counter but this might be avoided
using the class `"no_page_counter"` (for instance to display a fullscreen image with no extra element on top).

# Examples

## Architecture et programmation bas niveau

1. [Introduction au C](./archi2/cours01.html)
1. [Appels systèmes et entrée / sortie](./archi2/cours02.html)
1. [Processus](./archi2/cours03.html)
1. [Création de processus](./archi2/cours04.html)
1. [Processus légers](./archi2/cours05.html)
1. [Communication entre processus](./archi2/cours06.html)
