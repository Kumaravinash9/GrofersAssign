const checkvalidity = function (eventDate) {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    if (today.getFullYear() > eventDate['year']) return false;
    if (today.getMonth() > eventDate['month']) return false;
    if (today.getDay() > eventDate['day']) return false;
    if (today.getHours() > eventDate['hour']) return false;
    if (today.getMinutes() > eventData['min']) return false;
    if (today.getSeconds() > eventData['sec']) return false;
    return true;
};

const sortluckyDraw = function (a, b) {
    if (a['event_date']['year'] > b['event_date']['year']) return false;
    if (a['event_date']['month'] > b['event_date']['month']) return false;
    if (a['event_date']['day'] > b['event_date']['day']) return false;
    if (a['event_date']['hour'] > b['event_date']['hour']) return false;
    if (a['event_date']['min'] > b['event_date']['min']) return false;
    if (a['event_date']['sec'] > b['event_date']['sec']) return false;
    return true;
};

const timematch = function (luckydraw) {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    if (today.getFullYear() > luckydraw['eventDate']['year']) return true;
    if (today.getMonth() > luckydraw['eventDate']['month']) return true;
    if (today.getDay() > luckydraw['eventDate']['day']) return true;
    if (today.getHours() > luckydraw['eventDate']['hour']) return true;
    if (today.getMinutes() > luckydraw['eventDate']['min']) return true;
    if (today.getSeconds() > luckydraw['eventDate']['sec']) return true;
    return false;
};

const checkParticipation = function (users) {
    users.forEach((e) => {
        if (e.id === req.user._id) return false;
    });
    return true;
};

const checkalreadyhaveticket = function (UserticketList, ticketId) {
    UserticketList.forEach((e) => {
        if (e === ticketId) return true;
    });
    return false;
};

const firstrandomNumber = function (min, max) {
    const random = Math.floor(Math.random() * (max - min)) + min;
    return random;
};
const secondrandomNumber = function (min, max, firstNum) {
    let random;

    do {
        random = Math.floor(Math.random() * (max - min)) + min;
    } while (random === firstNum);
    return random;
};

const thirdrandomNumber = function (min, max, firstNum, secondnum) {
    let random;
    do {
        random = Math.floor(Math.random() * (max - min)) + min;
    } while (random === firstNum || random === secondnum);
    return random;
};

/**
 * @type {Utils}
 */

module.exports = {
    checkvalidity,
    sortluckyDraw,
    timematch,
    checkParticipation,
    firstrandomNumber,
    secondrandomNumber,
    thirdrandomNumber,
    checkalreadyhaveticket,
};
