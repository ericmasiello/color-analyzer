import { readFileSync } from 'fs';
import { createColorIntentMap } from './createColorIntentMap';
import { groupSimilarColors, MappedColors } from './groupSimilarColors';

const validateResult = (originalColors: Array<string>, mappedColors: MappedColors) => {
    // flatten the mapped colors
    const mappedColorsFlat = Array.from(mappedColors.keys()).reduce((flattenedList, key) => {
        return [...flattenedList, key].concat(mappedColors.get(key));
    }, [] as string[]);

    // compare the contents of the lists
    const originalColorsAsString = originalColors.sort().join('|');
    const mappedColorsAsString = mappedColorsFlat.sort().join('|');

    if (originalColorsAsString !== mappedColorsAsString) {
        console.log(mappedColors);
        console.error(`Expected:\n\t${originalColorsAsString} \nbut got:\n\t${mappedColorsAsString}`);
        return false;
    }

    return true;
};

// reads from project <root>/colors.txt
const colorIntentMap = createColorIntentMap(readFileSync('colors.txt', 'utf8'));
const mappedColors = groupSimilarColors({ colors: Array.from(colorIntentMap.keys()), threshold: 2.5 });

if (validateResult(Array.from(colorIntentMap.keys()), mappedColors)) {
    console.log(mappedColors);
    console.log(
        `\n\nColors size reduced by ${colorIntentMap.size - mappedColors.size}. Total size now ${mappedColors.size}`,
    );
}
