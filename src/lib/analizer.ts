import { SaunaIkitaiPost, SaunaIkitaiSummary } from "../＠types";

const RANKING_MAX = 10;

/**
 * スクレイピング結果から、解析を行う
 * @param postList 
 * @returns 
 */
export const analize = async (postList: SaunaIkitaiPost[]): Promise<SaunaIkitaiSummary> => {
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