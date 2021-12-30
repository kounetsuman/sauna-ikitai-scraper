export as namespace SaunaIkitaiScraper;

export = SaunaIkitaiScraper;

declare namespace SaunaIkitaiScraper {
    function sauna(): Promise<SaunaIkitaiSummary>;
    /**
     * 集計結果
     */
    interface SaunaIkitaiSummary {
        /**今までの総サ活回数 */
        visitedPosts: number,
        /**今までの総いいね数 */
        allLikes: number,
        /**今までの総コメント数 */
        allComments: number,
        /**施設に行った回数ランキング */
        visitedFacilityTimes: {
            name: string;
            count: number;
        }[],
        /**サ活した地域ランキング */
        visitedPrefectureTimes: {
            name: string;
            count: number;
        }[],
        /**いいねが多いサ活ランキング */
        mostLikePost: {
            name: string;
            url: string;
            count: number;
        }[],
        /**コメントが多いサ活ランキング */
        mostCommentPost: {
            name: string;
            url: string;
            count: number;
        }[],
    }
    /**
     * スクレイピング結果
     */
    interface SaunaIkitaiPost {
        visitedAt: string,
        facility: {
            name: string,
            url: string, // url
            city: string,
        },
        like?: string, // number
        comment?: string, // number
        post: {
            url: string, // url
            content?: string,
        }
    }
}