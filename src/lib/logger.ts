import { DEBUG } from "./const";

export const log = message => {
    if (DEBUG) {
        console.log(message);  
    }
};