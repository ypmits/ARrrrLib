// AR Native:
import Scene from 'Scene';
import Networking from 'Networking';
import Diagnostics from 'Diagnostics';

    
function retrieveImage(code = 918003)
{
    var api = "https://test.website";

    const url = api + "/api/maniac/retrieve?code=" + code;
    Diagnostics.log(url);
    
    return Networking.fetch(url).then((result) => {
        if ((result.status >= 200) && (result.status < 300)) {
            return result.json();
        }
        throw new Error("HTTP status code " + result.status);
    }).then(json  => {
        return json.data.image; 
    }).catch(error => {
        Diagnostics.log("There was an issue with fetch operation: " + error);
    });
};

export default retrieveImage;