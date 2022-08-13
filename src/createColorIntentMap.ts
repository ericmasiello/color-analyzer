export const createColorIntentMap = (rawText: string) => {
    const colorIntentMap = new Map<string, Array<string>>();

    rawText.split('\n').map(line => line.split(' - ')).forEach(([hex, usage]) => {
        if (!colorIntentMap.get(hex)) {
            colorIntentMap.set(hex, []);
        }
        let listOfUsage = colorIntentMap.get(hex);

        listOfUsage = listOfUsage.concat(usage.split(',').map(u => u.trim()));

        colorIntentMap.set(hex, listOfUsage);
    });
    return colorIntentMap;
};
