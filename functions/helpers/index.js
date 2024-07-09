const dayjs = require('dayjs');

exports.currentTime = {
    pretty: dayjs().format("MMM DD, YYYY. hh:mmA"),
    time: Date.now()
}

