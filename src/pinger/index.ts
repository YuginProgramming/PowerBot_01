import * as config from '../../config';

const pingerFunc = () => {
    console.log('pinger running...');
};

const pingerSetIntervalId = setInterval(pingerFunc, config.pinger.interval * 1000);




export {
    pingerSetIntervalId
};
