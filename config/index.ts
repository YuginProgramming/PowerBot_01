const express = {
    PORT: 3000
};

const crawler = {};

const pinger = {
    interval: 1 // seconds
};

const models = {
    list:  [
        // 'channels',
        'logs',
        // 'pingers',
        'statuses'
    ]
};
    

export {
    express,
    crawler,
    pinger,
    models
};