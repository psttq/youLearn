export let stringToColour = function (stringInput, coef=80) {
    let stringUniqueHash = [...stringInput].reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return `hsl(${stringUniqueHash % 126},  ${coef}%, 60.5%)`;
}

