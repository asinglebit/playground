/**
 * Libraries
 */

import * as R from "ramda";

/**
 * Create enumeration that starts from 1
 */

export const enumerate = (...labels) => {
    const enumeration = {};
    labels.map((label, index) => {
        enumeration[enumeration[label] = index + 1] = label;
    });
    enumeration.length = labels.length;
    enumeration.toList = () => labels.map(
        (value) => {
            return {
                Id: enumeration[value],
                Name: value
            }
        }
    );
    return enumeration;
};

/**
 * Create manual enumeration
 */

export const enumerateManually = (map) => {
    const keys = R.keys(map);
    const enumeration = keys
        .reduce((accumulator, key) => {
            const property = {};
            property[property[map[key]] = +key] = map[key];
            return {
                ...accumulator,
                ...property
            };
        }, {});
    enumeration.length = keys.length;
    enumeration.toList = () => {
        return keys.map(key => {
            return {
                Id: key,
                Name: map[key]
            }
        });
    };
    return enumeration;
};
