import { Promise } from 'meteor/promise';
import Fingerprint2 from 'fingerprintjs2';

/**
 * Returns this browser's fingerprint as a promise.
 *
 * @returns {Promise}
 */
function getFingerprint() {
    return new Promise(function (resolve) {
        new Fingerprint2().get(function(result){
            resolve(result);
        });
    });
}

export { getFingerprint };
