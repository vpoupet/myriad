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

## Units

Because slides are automatically scaled to fit the view port, regular length units should be avoided (for font sizes,
margins, positions, etc.). The stylesheet `slides.css` defines several variables that can be used as units :
- `--width` and `--height` correspond to the width and height of a slide (one of them should be equal to one of the
view port dimensions, the other is set to match the 4:3 ratio)
- `--mm` corresponds to a millimeter if the slides are set to be 96mm x 128mm. This is the dimension of Beamer slides
(a popular LaTeX style) and is chosen to be compatible with usual text font sizes (8 - 12pt)
- `--pt` corresponds to 1pt if the slides are set to be 96mm x 128mm. Because of the chosen size, typical font size for
slides should be around 10 times the value of `--pt`.

These units should be used in the styling CSS instead of regular units. They can be used with the `calc` and `var`
keywords. For instance, for setting a font size of 12pt for the whole document, one should use the rule
```CSS
html {
  font-size: calc(12 * var(--pt));
}
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
* click on top-left corner of current slide: previous step
* click on top-right corner of current slide: next step

# Themes

Themes can be created by adding CSS stylesheets and (optionally) redefining some of the _Javascript_ functions.

## Myriad

Myriad is a black and white theme to be used with `slides.js` and `slides.css`.

### Slide Types

Myriad defines 5 types of slides
 
#### Title Slides

`section` elements with the class `title` will be styled as title slides. These may have:
* an `h1` element for the title of the presentation
* an `h2` element for an optional subtitle
* a `div` element with class `author` for the author of the presentation
* a `div` element with class `context` for the context in which the presentation is given (conference name, course 
title, etc.)
* a `time` element for the date

All other elements of a title slide (for instance an image) should be manually placed with absolute position.

#### Section Slides

`section` elements with the class `section` will be styled as (presentation) sections markers. These slides should only
have a main title `h1` and optionally a subtitle `h2`. Sections are automatically counted and numbered in capital roman
numerals before the title.

#### Single Slides

`section` elements with the `single` class are styled as slides with a single block of content. It is recommended to
group the contents of the slide (other than the title) in a `div` element.

#### Split Slides

`section` elements with the `split` class are styled as two column slides. The left side has white background and the 
right one has black background.

The content of the left side should be placed in a `div` with class `leftside`, whereas the content of the right
column should be placed in a `div` with class `rightside`.

#### Blank Slides

`section` elements with no styling class will be represented as blank slides with plain white background. They might
have a title (`h1`) as other slides. By default blank slides will also have a page counter but this might be avoided
using the class `"no-page-counter"` (for instance to display a fullscreen image with no extra element on top).

### Styling Classes

Some classes are provided to style some elements on the slides&nbsp;:

#### Boxes

The class `box` (to be used on a `div` element) defines a "text box" that is represented with enclosing top and bottom
borders. The box can have a title (optional), enclosed in an element of class `box-title`, and the content of the box should be in
an element of class `box-content` (separate from the `.box` element).

Example&nbsp;:
```HTML
<div class="box">
    <div class="box-title">Theorem (Euclid)</div>
    <div class="box-content">
        There exist infinitely many prime numbers.
    </div>
</div>
```

#### Other Classes

* `.no-display` for elements that should not be displayed (not rendered)
* `.hidden` for elements that should be hidden (but use space)
* `.highlight` highlights text with a yellow background
* `.center` centers horizontally the contents of the element (vertical flex)
* `.underline` underlines text

# Examples

## Architecture et programmation bas niveau

1. [Introduction au C](https://vpoupet.github.io/myriad/examples/archi2/cours01.html)
1. [Appels systèmes et entrée / sortie](https://vpoupet.github.io/myriad/examples/archi2/cours02.html)
1. [Processus](https://vpoupet.github.io/myriad/examples/archi2/cours03.html)
1. [Création de processus](https://vpoupet.github.io/myriad/examples/archi2/cours04.html)
1. [Processus légers](https://vpoupet.github.io/myriad/examples/archi2/cours05.html)
1. [Communication entre processus](https://vpoupet.github.io/myriad/examples/archi2/cours06.html)

## Single Presentations

* [A Linear Acceleration for all Neighborhoods on 2D Cellular Automata](https://vpoupet.github.io/myriad/examples/acclin/acclin.html)
* [An Introduction to iOS Development](https://vpoupet.github.io/myriad/examples/ios/ios.html)