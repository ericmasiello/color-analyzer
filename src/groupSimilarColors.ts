import convert from 'color-convert';
import { deltaE } from './colorDelta';

export type MappedColors = Map<string, Array<string>>;

export const groupSimilarColors = (options: { colors: Array<string>, threshold?: number }): MappedColors => {
    const { colors: unprocessedColors, threshold = 2 } = options;
    const processedColorMap: MappedColors = new Map();

    do {
        // take the first color of the list
        const checkColor = unprocessedColors.shift();

        // compare it to all other colors in the list
        const similarColorsIndecies = unprocessedColors.reduce((indexSet, compaeColor, index) => {
            if (deltaE(convert.hex.rgb(checkColor), convert.hex.rgb(compaeColor)) < threshold) {
                indexSet.push(index);
            }
            return indexSet;
        }, [] as Array<number>);

        // create list of similar colors
        const similarColors = [checkColor].concat(unprocessedColors.filter((_, index) => similarColorsIndecies.includes(index))).sort();

        // reverse the indecies list
        // this is necessary so that you don't change the size of the list while iterating over it
        similarColorsIndecies.sort((a, b) => b - a);

        // remove the similar colors from the unprocessedColors list
        similarColorsIndecies.forEach(index => {
            unprocessedColors.splice(index, 1);
        });

        // make the color that's in the middle of the list be the shared/merged color
        const middleIndex = Math.floor(similarColors.length / 2);
        const sharedColor = similarColors[middleIndex];
        similarColors.splice(middleIndex, 1);

        processedColorMap.set(sharedColor, similarColors);
    } while (unprocessedColors.length > 0);


    return processedColorMap;
};
