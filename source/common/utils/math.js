/**
 * Convert degrees to radians
 */

export function deg_to_rad(degrees) {

    if (degrees > 0 && degrees % 360 === 0) {
        return trim_float(Math.PI * 2);
    }
    return trim_float(degrees % 360 * (Math.PI / 180));
}

/**
 * Convert degrees to radians
 */

export function rad_to_deg(radians) {
    let negative = radians < 0;
    if (negative) {
        return (~~((radians * (180 / Math.PI))) % 360);
    }
    return trim_float(Math.ceil((radians * (180 / Math.PI))) % 360);
}

/**
 * Trim floats to certain precision
 */

export function trim_float(float, digits = 5) {
    const trimmer = Math.pow(10, digits);
    return Math.round(float * trimmer) / trimmer;
}

/**
 * Trim angles
 */

export function trim_angle(angle) {
    if (angle > 360) {
        return angle % 360;
    } else {
        if (angle < 0) {
            return 360 + angle % 360;
        } else {
            return angle;
        }
    }
}

/**
 * Get value of a quadratic function by supplying control points and an interval
 */

export function get_quadratic_function_for(point_start, point_control, point_end, t) {
    const a = 1 - t;
    return point_start * a * a + point_control * 2 * a * t + point_end * t * t;
}

/**
 * Get an extrema for the given quadratic bezier function, by calculating
 * the root of its derivative
 */

export function get_quadratic_function_extrema_for(point_start, point_control, point_end) {
    const extremas = [];

    /**
     * If the extrema is within the boundary of zero and one, append it to
     * the array for further calculation of the bounding box
     */

    const t = (point_start - point_control) / (point_start - 2 * point_control + point_end);
    t >= 0 && t <= 1 && extremas.push(t);
    return extremas;
}

/**
 * Get value of a cubic function by supplying control points and an interval
 */

export function get_cubic_function_for(point_start, point_control_a, point_control_b, point_end, t) {
    const t2 = t * t;
    const a = 1 - t;
    const a2 = a * a;
    return point_start * a2 * a + point_control_a * 3 * a2 * t + point_control_b * 3 * a * t2 + point_end * t2 * t;
}

/**
 * Get extremas for the given cubic bezier function, by calculating the
 * roots of its derivatives
 */

export function get_cubic_function_extremas_for(point_start, point_control_a, point_control_b, point_end) {
    const extremas = [];

    /**
     * Compute components
     */

    const a = (point_control_b - 2 * point_control_a + point_start) - (point_end - 2 * point_control_b + point_control_a);
    const b = 2 * (point_control_a - point_start) - 2 * (point_control_b - point_control_a);
    const d = Math.sqrt(b * b - 4 * a * (point_start - point_control_a));

    /**
     * Compute intervals
     */

    let t1 = (-b + d) / 2 / a;
    let t2 = (-b - d) / 2 / a;
    Math.abs(t1) > "1e12" && (t1 = 0.5);
    Math.abs(t2) > "1e12" && (t2 = 0.5);

    /**
     * If the extremas are within the boundary of zero and one, append them to
     * the array for further calculation of the bounding box
     */

    t1 >= 0 && t1 <= 1 && extremas.push(t1);
    t2 >= 0 && t2 <= 1 && extremas.push(t2);
    return extremas;
};

/**
 * Calculate the projection matrix
 */

export function get_projection(_angle, a, min, max) {
    const angle = Math.tan((_angle * 0.5) * Math.PI / 180);
    return [
       0.5 / angle, 0 , 0, 0,
       0, 0.5 * a / angle, 0, 0,
       0, 0, - (max + min) / (max - min), -1,
       0, 0, (-2 * max * min) / (max - min), 0 
    ];
 }