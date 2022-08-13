import convert from 'color-convert';
import { readFileSync } from "fs";
import { deltaE } from './colorDelta';


const text = readFileSync('colors.txt', 'utf8');

const colorMap = new Map<string, Array<string>>();

text.split('\n').map(line => line.split(' - ')).forEach(([hex, usage]) => {
    if (!colorMap.get(hex)) {
        colorMap.set(hex, []);
    }
    let listOfUsage = colorMap.get(hex);

    listOfUsage = listOfUsage.concat(usage.split(',').map(u => u.trim()));
    
    colorMap.set(hex, listOfUsage);
});

const sortedHexColors = Array.from(colorMap.keys()).sort();

let mergeCounter = 0;

type ColorRemapping = Map<string, Array<string>>;

const dropSimilarColors = (hexes: Array<string>, colorRemapping: ColorRemapping = new Map()): [Array<string>, ColorRemapping] => {
    console.log('running dropSimilarColors()');
    const reducedHexes: Array<string> = [];
    let reducationsFound = false;

    

    hexes.forEach((currentHex, index) => {
        if (index === 0) {
            reducedHexes.push(currentHex);
            return;
        }
        const prevHex = hexes[index - 1];
    
        const delta = deltaE(convert.hex.rgb(currentHex), convert.hex.rgb(prevHex));
    
        if (delta < 2) {
            mergeCounter += 1;
            reducationsFound = true;

            console.log(`\n--------------\nMerging ${mergeCounter}: ${prevHex} - ${currentHex}, deltaE value: ${delta}. Dropping ${currentHex} in favor of ${prevHex}`);

            if (!colorRemapping.get(prevHex)) {
                console.log(`Creating new entry for ${prevHex}`);
                colorRemapping.set(prevHex, []);
            }

            const list = colorRemapping.get(prevHex);

            colorRemapping.set(prevHex, [...list, currentHex]);
            console.log(`${prevHex} maps to ${colorRemapping.get(prevHex)}`);
            
            return;
        }
        console.log(`\n--------------\nSkippinging ${currentHex}`);
        // color is sufficiently different from previous one
        reducedHexes.push(currentHex);
    });

    if (reducationsFound) {
        return dropSimilarColors(reducedHexes.sort(), colorRemapping);
    }

    return [reducedHexes, colorRemapping];
}

const [finalHexColors, rawColorRemapping] = dropSimilarColors(sortedHexColors);

console.log(`Dropped ${sortedHexColors.length - finalHexColors.length} redundant colors.\n`);


console.log(finalHexColors);

// const reduceColorRemapping = (colorRemapping: ColorRemapping): ColorRemapping => {

//     // loop through each [key, removeColorList] pair in the colorRemapping map
//     // create a reverse map of the list e.g. { 'mapColor': 'newColor'}
//     // check if the key color is in the reverse map already
//     // 

    
//     const reverseMap = new Map<string, string>();
    
//     for (const [finalColor, remappedColors] of colorRemapping.entries()) {
//         if (reverseMap.get(finalColor)) {
//             colorRemapping.set(finalColor, [...colorRemapping.get(finalColor), ...remappedColors]);
//             colorRemapping.delete(reverseMap.get(finalColor));
//         }
//     }
    
    
//     return colorRemapping;
// }

//     // const reducedColorRemapping = new Map<string, Array<string>();
//     // colorRemapping.forEach((value, key) => {
//     //     if (value.length === 1) {
//     //         reducedColorRemapping.set(key, value);
//     //     }
//     // }
//     // );
//     // return reducedColorRemapping;
// }

// FIXME: the map suggests that more colors need to be merged/dropped from the list
// that or maybe just the map itself is wrong
console.log(`\n\FIXME: this map is not correct:`, rawColorRemapping)