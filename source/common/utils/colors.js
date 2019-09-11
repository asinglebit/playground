/**
 * Get a random color
 */

export function get_random_color() {
    return new Float32Array([
        Math.random(),
        Math.random(),
        Math.random(),
        1.0,
    ]);
}

export function hex_to_rgba(hex) {
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        let c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return new Float32Array([
            ((c >> 16) & 255) / 255,
            ((c >> 8) & 255) / 255,
            (c & 255) / 255,
            1.0
        ]);
    }
    return new Float32Array([0.0, 0.0, 0.0, 1.0]);
}