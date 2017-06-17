const baseUrl = 'http://timemap.us-west-2.elasticbeanstalk.com/api';
export function getDirection(coords1, coords2, profile, accessToken){
    const directionURL = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coords1.lng},${coords1.lat};${coords2.lng},${coords2.lat}.json?access_token=${accessToken}`;
    console.log(`Making GET request to: ${directionURL}`);
    return fetch(directionURL, {
        headers: {
            'Accept': 'application/json'
        }
    }).then((res) => {
        if(res.json().code !== "Ok")throw Error("Mapbox Direaction error");
        return {
            duration: res.json().routes[0].duration,
            distance: res.json().routes[0].distance
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
