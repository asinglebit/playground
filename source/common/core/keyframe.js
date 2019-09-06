/**
 * Keyframe constructor
 *
 * keyframe = {
 *     path: ['position', 'x'],
 *     value: 0,
 *     time: 0,
 *     in: Easings.CUBIC,
 *     out: Easings.CUBIC,
 *     updater: () => {},
 *     effects: () => {}
 * }
 */

export const Keyframe = (...path) => (in_curve, out_curve, time, value, effects) => {
    return {
        path,
        value: (typeof value === 'function') && value() || value,
        time,
        in_curve,
        out_curve,
        updater: (typeof value === 'function') && value || null,
        effects
    };
};
