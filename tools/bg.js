const ANIMATE = false;

function randRange(min, max) {
    return min + Math.random() * (max - min);
}

function rotatingSquare(cx, cy, size, duration=undefined) {
    const angle = randRange(0, 90);
    if (duration === undefined) duration = randRange(10, 40);

    const rect = SVG.Rect(cx - size / 2, cy - size / 2, size, size);
    if (!ANIMATE) {
        rect.rotate(angle, cx, cy);
    } else {
        const rotationDirection = Math.random() < .5 ? 1 : -1;
        rect.add(
            SVG.new("animateTransform").update({
                attributeName: "transform",
                type: "rotate",
                from: `${angle} ${cx} ${cy}`,
                to: `${angle + rotationDirection * 180} ${cx} ${cy}`,
                dur: `${duration}s`,
                repeatCount: "indefinite",
            })
        );
    }
    return rect;
}

function wigglingSquare(cx, cy, size, angleMax, duration) {
    const angleStart = randRange(-angleMax, angleMax);
    const angleEnd = randRange(-angleMax, angleMax);

    const rect = SVG.Rect(cx - size / 2, cy - size / 2, size, size);
    if (!ANIMATE) {
        rect.rotate(angleStart, cx, cy);
    } else {
        rect.add(
            SVG.new("animateTransform").update({
                attributeName: "transform",
                type: "rotate",
                values: `${angleStart} ${cx} ${cy}; ${angleEnd} ${cx} ${cy}; ${angleStart} ${cx} ${cy}`,
                dur: `${duration}s`,
                repeatCount: "indefinite",
            })
        );
    }
    return rect;
}

function shadow_filter() {
    return SVG.new("filter")
        .update({id: "shadow-filter"})
        .add(
            SVG.new("feDropShadow").update({
                dx: ".6",
                dy: ".6",
                stdDeviation: "0.5",
                flood_opacity: .6,
            })
        );
}

function make_title_bg() {
    const main = SVG.Group().update({filter: "url(#shadow-filter)"});
    main.appendChild(SVG.Polyline([new Point(0, 25), new Point(128, 5), new Point(128, 71), new Point(0, 91)], true));
    const slope = 20 / 128;
    for (let i = 0; i <= 128; i += 8) {
        main.appendChild(rotatingSquare(randRange(i, i + 2), randRange(23 - slope * i, 27 - slope * i), randRange(8, 10)));
        main.appendChild(rotatingSquare(randRange(i, i + 2), randRange(89 - slope * i, 93 - slope * i), randRange(8, 10)));
    }
    for (let i = 0; i <= 128; i += 8) {
        main.appendChild(rotatingSquare(randRange(i, i + 2), randRange(18 - slope * i, 22 - slope * i), randRange(4, 5)));
        main.appendChild(rotatingSquare(randRange(i, i + 2), randRange(98 - slope * i, 94 - slope * i), randRange(4, 5)));
    }
    for (let i = 0; i <= 128; i += 6) {
        main.appendChild(rotatingSquare(randRange(i, i + 4), randRange(14 - slope * i, 18 - slope * i), randRange(1.5, 2)));
        main.appendChild(rotatingSquare(randRange(i, i + 4), randRange(98 - slope * i, 102 - slope * i), randRange(1.5, 2)));
    }
    return SVG.Image(128, 96)
        .add(SVG.new("defs").add(shadow_filter()))
        .add(SVG.Rect(0, 0, 128, 96).update({fill: "white"}))
        .add(main)
    // .add(SVG.Line(0, 25, 128, 5).update({stroke: "red", stroke_width: .1}))
    // .add(SVG.Line(0, 91, 128, 71).update({stroke: "red", stroke_width: .1}));
}

function make_section_bg() {
    const main = SVG.Group().update({filter: "url(#shadow-filter)"});
    const mask = SVG.new("mask").update({id: "section-mask"});
    mask.appendChild(SVG.Rect(16, 0, 128, 96).update({fill: "white"})); // mask background
    for (let i = 0; i <= 96; i += 8) {
        main.appendChild(wigglingSquare(randRange(1.5, 2.5), randRange(i - .5, i + .5), randRange(1.5, 2), 30, randRange(4, 8)));
        main.appendChild(wigglingSquare(randRange(5.5, 6.5), randRange(i + 3.5, i + 4.5), randRange(2.5, 3), 20, randRange(2, 4)));
        main.appendChild(wigglingSquare(randRange(9.5, 10.5), randRange(i - .5, i + .5), randRange(3.5, 4), 10, randRange(1, 2)));
        main.appendChild(SVG.Rect(12, i + 2, 4, 4)); //
        mask.appendChild(SVG.Rect(16, i + 2, 4, 4));
        mask.appendChild(wigglingSquare(randRange(21.5, 22.5), randRange(i - .5, i + .5), randRange(3.5, 4), 10, randRange(1, 2)));
        mask.appendChild(wigglingSquare(randRange(25.5, 26.5), randRange(i + 3.5, i + 4.5), randRange(2.5, 3), 20, randRange(2, 4)));
        mask.appendChild(wigglingSquare(randRange(29.5, 30.5), randRange(i - .5, i + .5), randRange(1.5, 2), 30, randRange(4, 8)));
    }
    main.appendChild(SVG.Rect(67, 0, 64, 96));
    main.appendChild(SVG.Rect(16, 0, 128, 96).update({mask: "url(#section-mask)"}));

    return SVG.Image(128, 96)
        .add(SVG.new("defs").add(shadow_filter()).add(mask))
        .add(SVG.Rect(0, 0, 128, 96).update({fill: "white"}))
        .add(main)
    // .add(SVG.Line(31, 0, 32, 96).update({stroke: "red", stroke_width: .1}));
}

function make_single_bg() {
    const main = SVG.Group().update({filter: "url(#shadow-filter)"});
    for (let i = 0; i <= 128; i += 8) {
        main.appendChild(rotatingSquare(randRange(i, i + 1), randRange(-1, 0), randRange(7, 10)));
    }
    for (let i = 0; i < 128; i += 6) {
        main.appendChild(rotatingSquare(randRange(i, i + 3), randRange(4, 6), randRange(3, 4)));
    }
    for (let i = 0; i < 128; i += 3) {
        main.appendChild(rotatingSquare(randRange(i, i + 3), randRange(7, 9), randRange(1, 1.5)));
    }

    return SVG.Image(128, 96)
        .add(SVG.new("defs").add(shadow_filter()))
        .add(SVG.Rect(0, 0, 128, 96).update({fill: "white"}))
        .add(main)
    // .add(SVG.Line(0, 10, 128, 10).update({stroke: "red", stroke_width: .1}));
}

function make_split_bg() {
    const bg_split = SVG.Group().update({filter: "url(#shadow-filter)"});
    bg_split.appendChild(SVG.Rect(67, 0, 64, 96));
    for (let i = 0; i <= 128; i += 3) {
        bg_split.appendChild(rotatingSquare(randRange(67, 69), randRange(i, i + 2), randRange(4, 5)));
    }
    for (let i = 0; i <= 128; i += 4) {
        bg_split.appendChild(rotatingSquare(randRange(63, 66), randRange(i, i + 3), randRange(1.5, 3)));
    }
    for (let i = 0; i <= 128; i += 4) {
        bg_split.appendChild(rotatingSquare(randRange(62, 63), randRange(i, i + 3), randRange(1, 1.5)));
    }

    return SVG.Image(128, 96)
        .add(SVG.new("defs").add(shadow_filter()))
        .add(SVG.Rect(0, 0, 128, 96).update({fill: "white"}))
        .add(bg_split)
    // .add(SVG.Line(61, 0, 61, 96).update({stroke: "red", stroke_width: .1}))
    // .add(SVG.Line(67, 0, 67, 96).update({stroke: "red", stroke_width: .1}));
}

window.onload = function () {
    const bgs = {
        BG_Title: make_title_bg(),
        BG_Section: make_section_bg(),
        BG_Single: make_single_bg(),
        BG_Split: make_split_bg(),
    };

    for (let name in bgs) {
        const button = document.createElement("button");
        button.innerText = name;
        button.addEventListener("click", () => {
            const serializer = new XMLSerializer();
            const svg_blob = new Blob([serializer.serializeToString(bgs[name])],
                {'type': "image/svg+xml"});
            const url = URL.createObjectURL(svg_blob);

            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = name + ".svg";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
        document.body.appendChild(button);
        document.body.appendChild(bgs[name]);
    }
};