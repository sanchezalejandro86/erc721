const duration = {
    seconds: function (val) { return val; },
    minutes: function (val) { return val * this.seconds(60); },
    hours: function (val) { return val * this.minutes(60); },
    days: function (val) { return val * this.hours(24); },
    weeks: function (val) { return val * this.days(7); },
    years: function (val) { return val * this.days(365); },
};

const jsonrpc = '2.0';
const id = 0;
const send = (method, params = []) => web3.currentProvider.send({ id, jsonrpc, method, params });

const timeTravel = async seconds => {
    await send('evm_increaseTime', [seconds]);
    await send('evm_mine');
};

module.exports = {
    duration,
    timeTravel
};
