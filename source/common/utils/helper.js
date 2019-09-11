/**
 * Link the child objects prototype to the parent objects prototype
 */

export function inherit(child, parent) {
    for (var property in parent) {
        if (parent.hasOwnProperty(property)) {
            child[property] = parent[property];
        }
    }

    function extend() {
        this.constructor = child;
    }
    extend.prototype = parent.prototype;
    child.prototype = new extend();
};

/**
 * Get base prototype
 */

export function base_name(object) {
    object = object.__proto__.constructor;
    while (object.prototype.__proto__.constructor.name !== 'Object') {
        object = object.prototype.__proto__.constructor;
    }
    return object.name;
}

/**
 * Decompose color string into components
 */

export function decompose_color(color) {
    color = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(/,\s*/);
    for (let i = 0; i < color.length; ++i) {
        color[i] = +color[i];
    }
    return color;
}

/**
 * Decompose a text string into an array of unicode character codes
 */

export function decompose_text(text) {
    const characters = [];
    for (let i = 0; i < text.length; ++i) {
        characters.push(text.charCodeAt(i));
    }
    return characters;
}

/**
 * Compose an array of unicode character codes into a text string
 */

export function compose_text(characters) {
    let text = '';
    for (let i = 0; i < characters.length; ++i) {
        text += String.fromCharCode(characters[i]);
    }
    return text;
}

/**
 * Get a random unicode character
 */

export function random_character() {
    return String.fromCharCode(0x30A0 + Math.random() * (0x30FF - 0x30A0 + 1));
}