// AR Native:
import Scene from 'Scene';
import Networking from 'Networking';
import Diagnostics from 'Diagnostics';

    
function retrieveImage(code)
{
    var api = "https://test.website";

    const url = api + "/api/maniac/retrieve?code=" + code;
    
    return Networking.fetch(url).then((result) => {
        if ((result.status >= 200) && (result.status < 300)) {
            return result.json();
        }
        // throw new Error("HTTP status code " + result.status);
    })
};

export default retrieveImage;