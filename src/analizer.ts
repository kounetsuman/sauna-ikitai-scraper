import { DEBUG, JSON_PATH } from "./lib/const";
import { SaunaIkitaiPost, SaunaIkitaiSummary } from "./＠types";

const fs = require('fs');

const RANKING_MAX = 10;

const getSummary = async (path: string): Promise<SaunaIkitaiSummary> => {
    const file = fs.readFileSync(path, 'utf8');
    const postList: SaunaIkitaiPost[] = JSON.parse(file);
    
    const allPostRanking = {
        visitedPosts: 0,
        allLikes: 0,
        allComments: 0,
    };
    postList.forEach(post => {
        allPostRanking.visitedPosts++;
        allPostRanking.allLikes += Number(post.like) || 0;
        allPostRanking.allComments += Number(post.comment) || 0;
    });

    const visitedFacilityRanking = [];
    postList.forEach(post => {
        const visitedFacility = visitedFacilityRanking.find(it => it.name === post.facility.name);
        if (visitedFacility) {
            visitedFacility.count++;
        } else {
            visitedFacilityRanking.push({
                name: post.facility.name,
                count: 1,
            });
        }
    });
    visitedFacilityRanking.sort((a,b) => b.count - a.count);

    const visitedPrefectureRanking = [];
    postList.forEach(post => {
        const visitedPrefecture = visitedPrefectureRanking.find(it => it.name === post.facility.city);
        if (visitedPrefecture) {
            visitedPrefecture.count++;
        } else {
            visitedPrefectureRanking.push({
                name: post.facility.city,
                count: 1,
            });
        }
    });
    visitedPrefectureRanking.sort((a,b) => b.count - a.count);

    const mostLikePostRanking = postList.map((post: SaunaIkitaiPost) => ({
        name: post.facility.name,
        url: post.post.url,
        count: Number(post.like),
    }));
    mostLikePostRanking.sort((a,b) => b.count - a.count);

    const mostCommentPostRanking = postList.map((post: SaunaIkitaiPost) => ({
        name: post.facility.name,
        url: post.post.url,
        count: Number(post.comment),
    }));
    mostCommentPostRanking.sort((a,b) => b.count - a.count);
    
    return {
        ...allPostRanking,
        mostLikePost: mostLikePostRanking.slice(0, RANKING_MAX),
        mostCommentPost: mostCommentPostRanking.slice(0, RANKING_MAX),
        visitedFacilityTimes: visitedFacilityRanking.slice(0, RANKING_MAX),
        visitedPrefectureTimes: visitedPrefectureRanking.slice(0, RANKING_MAX),
    };
};

(async function () {
    const summary = await getSummary(JSON_PATH);
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