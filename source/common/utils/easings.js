/**
 * Exports
 */

/**
 * t: Current time
 * b: Starting value
 * c: Value delta
 * d: Duration
 */

export function in_step_out_linear(t, b, c, d) {
    return b;
}

export function in_linear_out_step(t, b, c, d) {
    return c + b;
}

export function in_step_out_step(t, b, c, d) {
    return b;
}

export function in_linear_out_linear(t, b, c, d) {
    return t / d * c + b;
}

export function in_quadratic_out_linear(t, b, c, d) {
    return c * (t /= d) * t + b;
}

export function in_linear_out_quadratic(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
}

export function in_quadratic_out_quadratic(t, b, c, d) {
    if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b;
    }
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

export function in_cubic_out_linear(t, b, c, d) {
    return c * (t /= d) * t * t + b;
}

export function in_linear_out_cubic(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
}

export function in_cubic_out_cubic(t, b, c, d) {
    if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t + 2) + b;
}

export function in_quart_out_linear(t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
}

export function in_linear_out_quart(t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
}

export function in_quart_out_quart(t, b, c, d) {
    if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t + b;
    }
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
}

export function in_quint_out_linear(t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
}

export function in_linear_out_quint(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
}

export function in_quint_out_quint(t, b, c, d) {
    if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
}

export function in_sine_out_linear(t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
}

export function in_linear_out_sine(t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
}

export function in_sine_out_sine(t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
}

export function in_exponential_out_linear(t, b, c, d) {
    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
}

export function in_linear_out_exponential(t, b, c, d) {
    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
}

export function in_exponential_out_exponential(t, b, c, d) {
    if (t == 0) {
        return b;
    }
    if (t == d) {
        return b + c;
    }
    if ((t /= d / 2) < 1) {
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    }
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
}

export function in_circular_out_linear(t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
}

export function in_linear_out_circular(t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
}

export function in_circular_out_circular(t, b, c, d) {
    if ((t /= d / 2) < 1) {
        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    }
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
}

export function in_elastic_out_linear(t, b, c, d) {
    var s = 1.70158;
    let p = 0;
    let a = c;
    if (t == 0) {
        return b;
    }
    if ((t /= d) == 1) {
        return b + c;
    }
    if (!p) {
        p = d * 0.3;
    }
    if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
    } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
}

export function in_linear_out_elastic(t, b, c, d) {
    var s = 1.70158;
    let p = 0;
    let a = c;
    if (t == 0) {
        return b;
    }
    if ((t /= d) == 1) {
        return b + c;
    }
    if (!p) {
        p = d * 0.3;
    }
    if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
    } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
}

export function in_elastic_out_elastic(t, b, c, d) {
    var s = 1.70158;
    let p = 0;
    let a = c;
    if (t == 0) {
        return b;
    }
    if ((t /= d / 2) == 2) {
        return b + c;
    }
    if (!p) {
        p = d * (0.3 * 1.5);
    }
    if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
    } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    if (t < 1) {
        return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    }
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
}

export function in_back_out_linear(t, b, c, d, s) {
    if (s == undefined) {
        s = 1.70158;
    }
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
}

export function in_linear_out_back(t, b, c, d, s) {
    if (s == undefined) {
        s = 1.70158;
    }
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
}

export function in_back_out_back(t, b, c, d, s) {
    if (s == undefined) {
        s = 1.70158;
    }
    if ((t /= d / 2) < 1) {
        return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    }
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
}

export function in_bounce_out_linear(t, b, c, d) {
    return c - in_linear_out_bounce(d - t, 0, c, d) + b;
}

export function in_linear_out_bounce(t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
    } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
    }
    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;

}

export function in_bounce_out_bounce(t, b, c, d) {
    if (t < d / 2) {
        return in_bounce_out_linear(t * 2, 0, c, d) * 0.5 + b;
    }
    return in_linear_out_bounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
}
