const express = {
    PORT: 3000
};

const crawler = {};

const pinger = {
    interval: 1000
};

const models = [
    'channels',
    'logs',
    'pingers',
    'statuses'
];

export {
    express,
    crawler,
    pinger,
    models
};