const dotenv = require('dotenv');
dotenv.config();

/**
 * .envから取得した値を管理する
 */

export const SAUNNER_ID = Number(process.env.SIS_SAUNNER_ID) || 0;
export const DEBUG = String(process.env.SIS_DEBUG).toLowerCase() === "true";
export const WAIT_TIME = Number(process.env.SIS_WAIT_TIME) || 15;