export const sleepWhileCounting = async (second: number, isMessage: boolean) => new Promise<void>(resolve => {
    let counter = 0;
    const intervalId = setInterval(() => {
        counter++;
        if (isMessage) {
            console.log(`${counter} second passed...`);
        }
    }, 1000);
    setTimeout(() => {
        clearTimeout(intervalId);
        resolve();
    }, (second + 1) * 1000);
});

export const sleep = async (second: number, isMessage: boolean) => new Promise(resolve => {
    if (isMessage) {
        console.log(`wait ${second} seconds...`);
    }
    setTimeout(resolve, second * 1000);
});