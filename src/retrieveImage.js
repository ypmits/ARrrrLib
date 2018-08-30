// AR Native:
import Scene from 'Scene';
import Networking from 'Networking';
import Diagnostics from 'Diagnostics';

//EXAMPLE CODES
// 015536 long name
// 918003 short name
function retrieveImage(code)
{
    var api = "https://website.test";

    const url = api + "/api/maniac/retrieve?code=" + code;
    
    return Networking.fetch(url).then((result) => {
        if ((result.status >= 200) && (result.status < 300)) {
            return result.json();
        }
        // throw new Error("HTTP status code " + result.status);
    })
};

export default retrieveImage;