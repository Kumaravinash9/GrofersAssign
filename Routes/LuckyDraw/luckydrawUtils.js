/* eslint-disable no-var */
const checkvalidity = function (eventDate) {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    if (today.getFullYear() <= eventDate['year']) {
        if (today.getFullYear() < eventDate['year']) return true;
        if (today.getFullYear() === eventDate['year']) {
            if (today.getMonth() + 1 < eventDate['month']) return true;
            if (today.getMonth() + 1 === eventDate['month']) {
                if (today.getDay() < eventDate['day']) return true;
                if (today.getDay() === eventDate['day']) {
                    if (today.getHours() < eventDate['hour']) return true;
                    if (today.getHours() === eventDate['hour']) {
                        if (today.getMinutes() < eventDate['min']) return true;
                        if (today.getMinutes() === eventDate['min']) {
                            if (today.getSeconds() < eventDate['sec'])
                                return true;
                        }
                    }
                }
            }
        }
    }
    return false;
};

const sortluckyDraw = function (a, b) {
    console.log(a, b);
    if (a['event_date']['year'] <= b['event_date']['year']) {
        if (a['event_date']['year'] < b['event_date']['year']) return true;
        if (a['event_date']['year'] === b['event_date']['year']) {
            if (a['event_date']['month'] < b['event_date']['month'])
                return true;
            if (a['event_date']['month'] === b['event_date']['month']) {
                if (a['event_date']['day'] < b['event_date']['day'])
                    return true;
                if (a['event_date']['day'] === b['event_date']['day']) {
                    if (a['event_date']['hour'] < b['event_date']['hour'])
                        return true;
                    if (a['event_date']['hour'] === b['event_date']['hour']) {
                        if (a['event_date']['min'] < b['event_date']['min'])
                            return true;
                        if (a['event_date']['min'] === b['event_date']['min']) {
                            if (a['event_date']['sec'] < b['event_date']['sec'])
                                return true;
                        }
                    }
                }
            }
        }
    }
    return false;
};

const getoneweekcheck = function (eventDate) {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const dateoneweek = new Date();
    dateoneweek.setDate(dateoneweek.getDate() - 7);
    if (
        eventDate['year'] !== dateoneweek.getFullYear() &&
        eventDate['year'] !== today.getFullYear()
    )
        return false;
    if (
        eventDate['month'] !== dateoneweek.getMonth() + 1 &&
        eventDate['month'] !== today.getMonth() + 1
    )
        return false;
    if (dateoneweek.getDay() > today.getDay()) {
        if (
            eventDate['day'] >= dateoneweek.getDay() ||
            eventDate['day'] <= today.getDay()
        )
            return true;
        return false;
    } else {
        if (
            eventDate['day'] >= dateoneweek.getDay() &&
            eventDate['day'] <= today.getDay()
        )
            return true;
        return false;
    }
    return true;
};

const checkParticipation = function (UserticketList, userId) {
    for (var i = 0; i < UserticketList.length; i++)
        if (JSON.stringify(UserticketList[i]) === JSON.stringify(userId))
            return false;
    return true;
};

const checkalreadyhaveticket = function (UserticketList, ticketId) {
    for (var i = 0; i < UserticketList.length; i++)
        if (JSON.stringify(UserticketList[i]) === JSON.stringify(ticketId))
            return false;

    return true;
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

const getoneweek = function (luckdraw) {
    const result = [];
    luckdraw.forEach((e) => {
        if (e.isvalid) e.isvalid = checkvalidity(e['event_date']);
        const check = getoneweekcheck(e['event_date']);
        if (check) {
            if (
                e['winners']['first_postion']['name'] === undefined &&
                e['participated_users'].length
            ) {
                const firstnum = firstrandomNumber(
                    0,
                    e['participated_users'].length > 0
                );
                e['winners']['first_postion'] =
                    e['participated_users'][firstnum];
                if (e['participated_users'].length > 1) {
                    // eslint-disable-next-line no-var
                    var secondnum = secondrandomNumber(
                        0,
                        e['participated_users'].length,
                        firstnum
                    );
                    e['winners']['second_position'] =
                        e['participated_users'][secondnum];
                }
                if (e['participated_users'].length > 2) {
                    var thirdnum = thirdrandomNumber(
                        0,
                        e['participated_users'].length,
                        firstnum,
                        secondnum
                    );
                    e['winners']['third_position'] =
                        e['participated_users'][thirdnum];
                }
                e.save(function (err, done) {
                    if (err) console.log(err);
                    else console.log(done);
                });
            }
            result.push(e);
        }
    });
    return result;
};

/**
 * @type {Utils}
 */

module.exports = {
    checkvalidity,
    sortluckyDraw,
    checkParticipation,
    firstrandomNumber,
    secondrandomNumber,
    thirdrandomNumber,
    checkalreadyhaveticket,
    getoneweek,
    getoneweekcheck,
};
