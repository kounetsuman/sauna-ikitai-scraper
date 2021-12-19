import { SAUNNER_ID } from "./lib/const";
import { log } from "./lib/logger";
import { parsePage } from "./lib/puppeteer";

const command = async () => {
    const resultList = [];
    try {
        let counter = 1;
        while (true) {
            const result = await parsePage(SAUNNER_ID, counter);
            resultList.push(...result);
            counter++;
        }
    } catch (message) {
        log(message);
    } finally {
        log('end!');
    }
    return JSON.stringify(resultList);
}

(async function () {
    const result = await command();
    console.log(result);
    process.exit(1);
}());