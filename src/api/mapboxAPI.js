const baseUrl = 'http://timemap.us-west-2.elasticbeanstalk.com/api';
export function getDirection(lng1, lat1, lng2, lat2, profile, accessToken){
    const directionURL = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${lng1},${lat1};${lng2},${lat2}.json?access_token=${accessToken}`;
    console.log(`Making GET request to: ${directionURL}`);
    return fetch(directionURL, {
        headers: {
            'Accept': 'application/json'
        }
    }).then((res) => {
        return res.json()
    }).then((data) => {
        if(data.code !== "Ok")throw Error("Mapbox Direaction error");
        return {
            duration: data.routes[0].duration,
            distance: data.routes[0].distance
        };
    }).catch((err) => {
        throw err;
    });
}

export function getAccessToken() {
    let url = `${baseUrl}/accesstoken`;

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
