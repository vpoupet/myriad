function randomSquare(minX, maxX, minY, maxY, minSize, maxSize, minAngle = undefined, maxAngle = undefined, minDur = 10, maxDur = 40) {
    const cx = minX + Math.random() * (maxX - minX);
    const cy = minY + Math.random() * (maxY - minY);
    const size = minSize + Math.random() * (maxSize - minSize);
    const rotationTime = minDur + Math.random() * (maxDur - minDur);
    if (minAngle === undefined) {
        const angleStart = Math.random() * 90;
        const rotationDirection = Math.random() < .5 ? 1 : -1;
        return SVG.Rect(cx - size / 2, cy - size / 2, size, size).add(
            SVG.new("animateTransform").update({
                attributeName: "transform",
                type: "rotate",
                from: `${angleStart} ${cx} ${cy}`,
                to: `${angleStart + rotationDirection * 180} ${cx} ${cy}`,
                dur: `${rotationTime}s`,
                repeatCount: "indefinite",
            })
        )
    } else {
        const angleStart = minAngle + Math.random() * (maxAngle - minAngle);
        const angleEnd = minAngle + Math.random() * (maxAngle - minAngle);
        return SVG.Rect(cx - size / 2, cy - size / 2, size, size).add(
            SVG.new("animateTransform").update({
                attributeName: "transform",
                type: "rotate",
                values: `${angleStart} ${cx} ${cy}; ${angleEnd} ${cx} ${cy}; ${angleStart} ${cx} ${cy}`,
                dur: `${rotationTime}s`,
                repeatCount: "indefinite",
            })
        )
    }
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
    const bg_title = SVG.Group().update({filter: "url(#shadow-filter)"});
    bg_title.appendChild(SVG.Polyline([new Point(0, 25), new Point(128, 5), new Point(128, 71), new Point(0, 91)], true));
    const slope = 20 / 128;
    for (let i = 0; i <= 128; i += 8) {
        bg_title.appendChild(randomSquare(i, i + 2, 23 - slope * i, 27 - slope * i, 8, 10));
        bg_title.appendChild(randomSquare(i, i + 2, 89 - slope * i, 93 - slope * i, 8, 10));
    }
    for (let i = 0; i <= 128; i += 8) {
        bg_title.appendChild(randomSquare(i, i + 2, 18 - slope * i, 22 - slope * i, 4, 5));
        bg_title.appendChild(randomSquare(i, i + 2, 98 - slope * i, 94 - slope * i, 4, 5));
    }
    for (let i = 0; i <= 128; i += 6) {
        bg_title.appendChild(randomSquare(i, i + 4, 14 - slope * i, 18 - slope * i, 1.5, 2));
        bg_title.appendChild(randomSquare(i, i + 4, 98 - slope * i, 102 - slope * i, 1.5, 2));
    }
    return SVG.Image(128, 96)
        .add(SVG.new("defs").add(shadow_filter()))
        .add(SVG.Rect(0, 0, 128, 96).update({fill: "white"}))
        .add(bg_title)
    // .add(SVG.Line(0, 25, 128, 5).update({stroke: "red", stroke_width: .1}))
    // .add(SVG.Line(0, 91, 128, 71).update({stroke: "red", stroke_width: .1}));
}

function make_section_bg() {
    const bg_section = SVG.Group().update({filter: "url(#shadow-filter)"});
    bg_section.appendChild(SVG.Rect(67, 0, 64, 96));
    for (let i = 0; i <= 96; i += 8) {
        bg_section.appendChild(randomSquare(1.5, 2.5, i - .5, i + .5, 1.5, 2, -45, 45, 4, 8));
    }
    for (let i = 4; i <= 96; i += 8) {
        bg_section.appendChild(randomSquare(5.5, 6.5, i - .5, i + .5, 2.5, 3, -30, 30, 2, 4));
    }
    for (let i = 0; i <= 96; i += 8) {
        bg_section.appendChild(randomSquare(9.5, 10.5, i - .5, i + .5, 3.5, 4, -15, 15, 1, 2));
    }
    for (let i = 4; i <= 96; i += 8) {
        bg_section.appendChild(SVG.Rect(12, i - 2, 4, 4));
    }
    const bg_section_mask = SVG.new("mask").update({id: "section-mask"});
    bg_section_mask.appendChild(SVG.Rect(16, 0, 128, 96).update({fill: "white"}));
    for (let i = 4; i <= 96; i += 8) {
        bg_section_mask.appendChild(SVG.Rect(16, i - 2, 4, 4).update({fill: "black"}));
    }
    for (let i = 0; i <= 96; i += 8) {
        bg_section_mask.appendChild(randomSquare(21.5, 22.5, i - .5, i + .5, 3.5, 4, -10, 10, 1, 2).update({fill: "black"}));
    }
    for (let i = 4; i <= 96; i += 8) {
        bg_section_mask.appendChild(randomSquare(25.5, 26.5, i - .5, i + .5, 2.5, 3, -20, 20, 2, 4).update({fill: "black"}));
    }
    for (let i = 0; i <= 96; i += 8) {
        bg_section_mask.appendChild(randomSquare(29.5, 30.5, i - .5, i + .5, 1.5, 2, -40, 40, 4, 8).update({fill: "black"}));
    }
    bg_section.appendChild(SVG.Rect(16, 0, 128, 96).update({mask: "url(#section-mask)"}));

    return SVG.Image(128, 96)
        .add(SVG.new("defs").add(shadow_filter()).add(bg_section_mask))
        .add(SVG.Rect(0, 0, 128, 96).update({fill: "white"}))
        .add(bg_section)
    // .add(SVG.Line(31, 0, 32, 96).update({stroke: "red", stroke_width: .1}));
}

function make_single_bg() {
    const bg_single = SVG.Group().update({filter: "url(#shadow-filter)"});
    for (let i = 0; i <= 128; i += 8) {
        bg_single.appendChild(randomSquare(i, i + 1, -1, 0, 7, 10));
    }
    for (let i = 0; i < 128; i += 6) {
        bg_single.appendChild(randomSquare(i, i + 3, 4, 6, 3, 4));
    }
    for (let i = 0; i < 128; i += 3) {
        bg_single.appendChild(randomSquare(i, i + 3, 7, 9, 1, 1.5));
    }

    return SVG.Image(128, 96)
        .add(SVG.new("defs").add(shadow_filter()))
        .add(SVG.Rect(0, 0, 128, 96).update({fill: "white"}))
        .add(bg_single)
    // .add(SVG.Line(0, 10, 128, 10).update({stroke: "red", stroke_width: .1}));
}

function make_split_bg() {
    const bg_split = SVG.Group().update({filter: "url(#shadow-filter)"});
    bg_split.appendChild(SVG.Rect(67, 0, 64, 96));
    for (let i = 0; i <= 128; i += 3) {
        bg_split.appendChild(randomSquare(67, 69, i, i + 2, 4, 5,))
    }
    for (let i = 0; i <= 128; i += 4) {
        bg_split.appendChild(randomSquare(63, 66, i, i + 3, 1.5, 3))
    }
    for (let i = 0; i <= 128; i += 4) {
        bg_split.appendChild(randomSquare(62, 63, i, i + 3, 1, 1.5))
    }

    return SVG.Image(128, 96)
        .add(SVG.new("defs").add(shadow_filter()))
        .add(SVG.Rect(0, 0, 128, 96).update({fill: "white"}))
        .add(bg_split)
    // .add(SVG.Line(61, 0, 61, 96).update({stroke: "red", stroke_width: .1}))
    // .add(SVG.Line(67, 0, 67, 96).update({stroke: "red", stroke_width: .1}));
}

window.onload = function () {
    document.body.append(make_title_bg());
    document.body.append(make_section_bg());
    document.body.append(make_single_bg());
    document.body.append(make_split_bg());

};