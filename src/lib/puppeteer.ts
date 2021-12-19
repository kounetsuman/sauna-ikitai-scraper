/**
 * puppeteerのsauna-ikitai.comスクレイピング用ラッパー
 */

const puppeteer = require('puppeteer');
import { SaunaIkitaiPost } from "../＠types";
import { DEBUG } from "./const";
import { log } from "./logger";
import { sleepWhileCounting } from "./sleep";

const SELECTOR_MAP = {
    /**親セレクタ */
    BASE: 'div.p-postCard.js-postCard',
    /**サ活日時 */
    VISITED_AT: 'p.p-postCardUser_date',
    /**施設名+施設URL */
    FACILITY_NAME_URL: '.p-postCard_facility>a',
    /**施設所在都道府県 */
    FACILITY_CITY: 'p.p-postCard_address',
    /**いいね */
    LIKE: 'span.js-likeCount',
    /**いいね */
    COMMENT: 'span.js-commentCount',
    /**サ活URL */
    POST_URL: 'a.js-postCardLink',
    /**サ活本文 */
    POST_CONTENT: 'p.p-postCard_text',
};

export const parsePage = async (saunnerId: number, pageIndex: number) => new Promise(async (resolve: (value: SaunaIkitaiPost[]) => void, reject) => {
    const url = `https://sauna-ikitai.com/saunners/${saunnerId}?page=${pageIndex}`;
    log(`${ url } start...`);

    if (!saunnerId) {
        reject(`SAUNNER ID: "${saunnerId}" is invalid!`);
    }

    if (!pageIndex || pageIndex <= 0) {
        reject(`PAGE INDEX: "${pageIndex}" is invalid!`);
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await sleepWhileCounting(15, DEBUG);
    const rowList = await page.$$(SELECTOR_MAP.BASE);
    if (rowList.length === 0) {
        log('failed!');
        reject(`"${ url }" is not found.`);
    } else {
        const resultList = [];
        for (const row of rowList) {
            resultList.push({
                visitedAt: await _getData(row, SELECTOR_MAP.VISITED_AT, 'textContent'),
                facility: {
                    name: await _getData(row, SELECTOR_MAP.FACILITY_NAME_URL, 'textContent'),
                    url: await _getData(row, SELECTOR_MAP.FACILITY_NAME_URL, 'href'),
                    city: await _getData(row, SELECTOR_MAP.FACILITY_CITY, 'textContent'),
                },
                like: await _getData(row, SELECTOR_MAP.LIKE, 'textContent'),
                comment: await _getData(row, SELECTOR_MAP.COMMENT, 'textContent'),
                post: {
                    url: await _getData(row, SELECTOR_MAP.POST_URL, 'href'),
                    content: await _getData(row, SELECTOR_MAP.POST_CONTENT, 'textContent'),
                }
            });
        };
        log('succeeded!');
        resolve(resultList);
    }
});

const _getData = async (row: { $$: (arg0: string) => any; }, selector: string, target: string) => new Promise(async resolve => {
    const elementList = await row.$$(selector);
    if (elementList[0]) {
        const property = await elementList[0].getProperty(target);
        if (property) {
            const result = await (property).jsonValue();
            const parsed = String(result).replace(/　| |\n|\t/g, '')
            resolve(parsed);
        }
    }
    resolve(null);
});