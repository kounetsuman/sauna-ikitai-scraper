import { analize } from "./lib/analizer";
import { DEBUG } from "./lib/const";
import { scrape } from "./lib/scraper";
import { SaunaIkitaiSummary } from "./＠types";

const fs = require('fs');

export default async function sauna() {
    const postList = await scrape();
    const summary = await analize(postList);
    return summary;
}

(async function () {
    console.log('all start');
    const saveFilePath = process.argv[2];
    console.log(saveFilePath);
    if (!saveFilePath) {
        console.log('ERROR!!!: 引数に出力先ファイルパスを指定してください。');
    } else if (fs.existsSync(saveFilePath)) {
        console.log('ERROR!!!: 指定したファイルパスはすでに存在します。');
    } else if (saveFilePath.indexOf('/') !== 0) {
        console.log('ERROR!!!: パスは絶対パスで指定してください。');
    } else if (saveFilePath.indexOf('.') === -1) {
        console.log('ERROR!!!: パスには拡張子をつけてください。');
    } else if (saveFilePath.indexOf('.json') === -1) {
        console.log('ERROR!!!: パスにはjsonをつけてください。');
    } else {
        fs.writeFileSync(saveFilePath, '');
        console.log('scripe start');
        const postList = await scrape();
        const summary = await analize(postList);
        output(summary);
        fs.writeFileSync(saveFilePath, JSON.stringify(summary));
    }
    console.log('all end');
}());

const output = (summary: SaunaIkitaiSummary) => {
    if (DEBUG) {
        console.log('■今までの総サ活回数');
        console.log(summary.visitedPosts);
        console.log('');
        console.log('■今までの総いいね数');
        console.log(summary.allLikes);
        console.log('');
        console.log('■今までの総コメント数');
        console.log(summary.allComments);
        console.log('');
        console.log('■施設に行った回数ランキング');
        summary.visitedFacilityTimes.forEach(it => {
            console.log(it.name);
            console.log(it.count);
        });
        console.log('');
        console.log('■サ活した地域ランキング');
        summary.visitedPrefectureTimes.forEach(it => {
            console.log(it.name);
            console.log(it.count);
        });
        console.log('');
        console.log('■いいねが多いサ活ランキング');
        summary.mostLikePost.forEach(it => {
            console.log(it.name);
            console.log(it.url);
            console.log(it.count);
        });
        console.log('');
        console.log('■コメントが多いサ活ランキング');
        summary.mostCommentPost.forEach(it => {
            console.log(it.name);
            console.log(it.url);
            console.log(it.count);
        });
    } else {
        console.log(JSON.stringify(summary));
    }
}