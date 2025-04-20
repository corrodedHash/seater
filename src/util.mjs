/**
 * @param {string[]} choices
 * @param {string[]} existing
 */
export function unique_identifier(choices, existing) {
    // Function to get a random element from the array
    /**
     * @param {any[]} arr
     */
    function getRandomElement(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    // Get a random element
    const randomElement = getRandomElement(choices);

    if (existing.find(x => x === randomElement) === undefined) {
        return randomElement
    } else {
        const suffixes = existing
            .filter(x => x.startsWith(randomElement))
            .map(x => x.slice(randomElement.length + 1))
            .map(parseInt)
            .filter(x => !Number.isNaN(x))
        return randomElement + " " + (Math.max(0, ...suffixes) + 1).toString()
    }
}