// Function to generate the ease-in-out vertical coordinates
let textLength = 50;

function generateEaseInOutCoordinates(min, max, steps) {
    let coordinates = [];

    // Generate steps from 0 to 1
    for (let i = 0; i <= steps; i++) {
        let t = i / steps;  // Normalize the index to a value between 0 and 1

        // Apply the ease-in-out function (cosine-based easing)
        let easedValue = 0.5 * (1 - Math.cos(Math.PI * t));

        // Scale the eased value to the desired range [min, max]
        let verticalCoordinate = min + easedValue * (max - min);

        // Push the value to the list
        coordinates.push(verticalCoordinate.toFixed(2));  // Round to 2 decimal places
    }

    return coordinates;
}

function getStyle(el, styleProp) {
    var value, defaultView = el.ownerDocument.defaultView;
    // W3C standard way:
    if (defaultView && defaultView.getComputedStyle) {
        // sanitize property name to css notation (hypen separated words eg. font-Size)
        styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
        return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
    } else if (el.currentStyle) { // IE
        // sanitize property name to camelCase
        styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
            return letter.toUpperCase();
        });
        value = el.currentStyle[styleProp];
        // convert other units to pixels on IE
        if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
            return (function(value) {
                var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
                el.runtimeStyle.left = el.currentStyle.left;
                el.style.left = value || 0;
                value = el.style.pixelLeft + "px";
                el.style.left = oldLeft;
                el.runtimeStyle.left = oldRsLeft;
                return value;
            })(value);
        }
        return value;
    }
}

function intro_anim(frameList, timeDelays) {
    document.documentElement.style.setProperty('--max-text-size', textLength);

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const animated = !(urlParams.get('anim') == "false")

    let currentFrameIndex = 0;

    // Function to show a frame and schedule the next one
    function displayNextFrame() {
        // Get the current frame and time delay
        const currentFrame = frameList[currentFrameIndex];
        const currentDelay = timeDelays[currentFrameIndex];

        let aspect_ratio = window.innerHeight / window.innerWidth;
        // Show the current frame
        if (currentFrameIndex >= frameList.length) {
            return;
        }
        if (aspect_ratio <= 0.8) {
            if (currentFrameIndex > 0) {
                // Hide the previous frame
                document.querySelector(`.frame-no-${frameList[currentFrameIndex - 1]}`).style.display = 'none';
                document.querySelector(`.alt-frame-no-${frameList[currentFrameIndex]}`).style.display = 'none';
                document.querySelector(`.alt-frame-no-${frameList[currentFrameIndex - 1]}`).style.display = 'none';
            }
            document.querySelector(`.frame-no-${currentFrame}`).style.display = 'block';
        } else {
            if (currentFrameIndex > 0) {
                // Hide the previous frame
                document.querySelector(`.alt-frame-no-${frameList[currentFrameIndex - 1]}`).style.display = 'none';
                document.querySelector(`.frame-no-${frameList[currentFrameIndex]}`).style.display = 'none';
                document.querySelector(`.frame-no-${frameList[currentFrameIndex - 1]}`).style.display = 'none';
            }
            document.querySelector(`.alt-frame-no-${currentFrame}`).style.display = 'block';
        }
        // Move to the next frame after the specified delay
        currentFrameIndex++;

        // If there are more frames to show, schedule the next one
        if (currentFrameIndex < frameList.length) {
            setTimeout(displayNextFrame, currentDelay*animated);
            return;
        }
        currentFrameIndex = 0;
        setTimeout(displayNextFrame2, 100*animated);
    }

    // Start displaying frames from the first one
    displayNextFrame();

    const steps = 50;
    let heights = generateEaseInOutCoordinates(0, 5, steps)

    let color = true;

    function cursorBlink() {
        let cursor = document.querySelector('.cursor');
        if (color)
        {
            cursor.style.color = getStyle(document.documentElement, "--primary-color");
            color = false;
            return;
        }
        cursor.style.color = getStyle(document.documentElement, "--background");
        color = true;
    }

    function displayNextFrame2() {
        const height = heights[currentFrameIndex];
        document.documentElement.style.setProperty('--offset-top', `-${height}vh`);
        currentFrameIndex++;

        if (currentFrameIndex < heights.length) {
            setTimeout(displayNextFrame2, 20*animated);
            return;
        }
        setTimeout(() => {
            document.querySelector('.enter-text').style.display = 'block';
            displayNextFrame3();
        }, 20*animated)
    }

    let interval_id = null;
    function displayNextFrame3() {
        let text = document.querySelector('.enter-text:not(.cursor)');
        let newOpacity = parseFloat(getStyle(text, 'opacity')) + 0.1
        text.style.opacity = newOpacity.toString();
        if (newOpacity < 1.0) {
            setTimeout(displayNextFrame3, 100*animated);
            return;
        }
        if (animated) cursorBlink();
        setTimeout(() => {
            if (animated) interval_id = setInterval(cursorBlink, 400);
            displayNextFrame4();
        }, 20*animated);
    }
    function displayNextFrame4() {
        let cursor_offset = getStyle(document.documentElement, '--cursor-offset');
        if (parseInt(cursor_offset) + 1 < textLength)
        {
            document.documentElement.style.setProperty('--cursor-offset', (parseInt(cursor_offset) + 1).toString());
            setTimeout(displayNextFrame4, (100 + Math.random() * 50) * animated);
            return;
        }
        clearInterval(interval_id);
        document.querySelector('.cursor').style.display = 'none';
        setTimeout(() => {
            let elements = Array.from(document.querySelectorAll('.website-link'));
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.textDecoration = 'underline';
            }
        }, 100 * animated)
    }
}

function on_resize(){
    let aspect_ratio = window.innerHeight / window.innerWidth;
    if (aspect_ratio <= 0.8) {
        let on_element = document.querySelector(`.logo-element[style="display: block;"]`);
        let selector = on_element.className.split(' ')[1];

        if (selector.includes("alt")) {
            on_element.style.display = 'none';
            document.querySelector(`.${selector.replace('alt-', '')}`).style.display = 'block';
        }
    }
    else {
        let on_element = document.querySelector(`.logo-element[style="display: block;"]`);
        let selector = on_element.className.split(' ')[1];

        if (!selector.includes("alt")) {
            on_element.style.display = 'none';
            document.querySelector(`.alt-${selector}`).style.display = 'block';
        }
    }
}

function on_mouse_move() {
    let all_links = Array.from(document.querySelectorAll('a.website-link'))
    for (let i = 0; i < all_links.length; i++) {
        let parent = all_links[i].parentNode;
        parent.querySelector('.around-link-left').innerHTML = '&nbsp;';
        parent.querySelector('.around-link-right').innerHTML = '&nbsp;';
    }
    let hovered_links = Array.from(document.querySelectorAll('a.website-link:hover'))
    for (let i = 0; i < hovered_links.length; i++) {
        let parent = hovered_links[i].parentNode;
        parent.querySelector('.around-link-left').innerHTML = '[';
        parent.querySelector('.around-link-right').innerHTML = ']';
    }
}

window.addEventListener('resize', on_resize);
window.addEventListener('mousemove', on_mouse_move);