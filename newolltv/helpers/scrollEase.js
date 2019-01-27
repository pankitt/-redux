
export default function ease(t1, b, c, d) {
    let t = t1 / d - 1;
    return -c * (t * t * t * t - 1) + b;
}

export function scrollTo(element, direction = 'vertical', to, duration = 500) {
    let start = direction === 'horizontal' ? element.scrollLeft : element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    let animateScroll = function () {
        currentTime += increment;
        let val = Math.easeInOutQuad(currentTime, start, change, duration);
        if (direction === 'horizontal') {
            element.scrollLeft = val;
        } else {
            element.scrollTop = val;
        }

        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};
