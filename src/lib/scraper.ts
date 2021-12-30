import { SaunaIkitaiPost } from "../＠types";
import { SAUNNER_ID } from "./const";
import { log } from "./logger";
import { parsePage } from "./puppeteer";

export const scrape = async (): Promise<SaunaIkitaiPost[]> => {
    const resultList: SaunaIkitaiPost[] = [];
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
    return resultList;
}