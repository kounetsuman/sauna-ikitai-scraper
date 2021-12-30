import { analize } from "./lib/analizer";
import { DEBUG } from "./lib/const";
import { scrape } from "./lib/scraper";
import { SaunaIkitaiPost, SaunaIkitaiSummary } from "./＠types";

(async function () {
    const postList = await scrape();
    const summary = await analize(postList);
    output(summary);
    process.exit(1);
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