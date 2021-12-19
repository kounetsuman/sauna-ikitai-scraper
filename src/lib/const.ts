const dotenv = require('dotenv');
dotenv.config();

/**
 * .envから取得した値を管理する
 */

export const SAUNNER_ID = Number(process.env.SAUNNER_ID);
export const DEBUG = String(process.env.DEBUG).toLowerCase() === "true";
export const JSON_PATH = String(process.env.JSON_PATH) || '';