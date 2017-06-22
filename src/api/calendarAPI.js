import moment from 'moment';

const baseUrl = 'http://timemap.us-west-2.elasticbeanstalk.com/api';

export function addEvent(event) {
    let url = `${baseUrl}/events`;

    console.log(`Making POST request to: ${url}`);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...event
        })
    }).then((res) => {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);

        return res.json();
    });
}

export function setEvent(event, eventID) {
    let url = `${baseUrl}/events/${eventID}`;

    console.log(`Making POST request to: ${url}`);

    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...event
        })
    }).then((res) => {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);

        return res.json();
    });
}
export function deleteEvent(userId, eventId) {
    let url = `${baseUrl}/deleteevent?userId=${userId}&eventId=${eventId}`;
    console.log(`Making GET request to: ${url}`);

    return fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    }).then((res) => {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);
        return res.json();
    });
}

export function getDay(userId, year, month, day) {
    let startTime = moment({year, month:month-1, day}).format('YYYY-MM-DD ZZ');
    let endTime = moment({year, month:month-1, day});
    endTime = endTime.date(day+1).format('YYYY-MM-DD ZZ');
    let url = `${baseUrl}/day?userId=${userId}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`;

    console.log(`Making GET request to: ${url}`);

    return fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    }).then((res) => {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);

        return res.json();
    });
}

export function getMonth(userId, year, month) {
    let zone = moment().format('ZZ');
    let url = `${baseUrl}/month?userId=${userId}&year=${year}&month=${month}&zone=${encodeURIComponent(zone)}`;

    console.log(`Making GET request to: ${url}`);

    return fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    }).then((res) => {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);

        return res.json();
    });
}

export function getNextEvent(userId) {
    let url = `${baseUrl}/nextevent?userId=${userId}`;

    console.log(`Making GET request to: ${url}`);

    return fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    }).then((res) => {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);
        return res.json();
    }).then((array) => {
        return array[0];
    });
}

export function getEvent(userId) {
    let url = `${baseUrl}/events?userId=${userId}`;

    console.log(`Making GET request to: ${url}`);

    return fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    }).then((res) => {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);

        return res.json();
    });
}
