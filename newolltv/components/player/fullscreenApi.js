/**
 * Fullscreen API polyfill
 */

/**
 * https://fullscreen.spec.whatwg.org
 * @type {Object}
 */
const APIS = {
    w3: {
        enabled: 'fullscreenEnabled',
        element: 'fullscreenElement',
        request: 'requestFullscreen',
        exit:    'exitFullscreen',
        events: {
            change: 'fullscreenchange',
            error:  'fullscreenerror',
        },
    },
    webkit: {
        enabled: 'webkitFullscreenEnabled',
        element: 'webkitCurrentFullScreenElement',
        request: 'webkitRequestFullscreen',
        exit:    'webkitExitFullscreen',
        events: {
            change: 'webkitfullscreenchange',
            error:  'webkitfullscreenerror',
        },
    },
    moz: {
        enabled: 'mozFullScreenEnabled',
        element: 'mozFullScreenElement',
        request: 'mozRequestFullScreen',
        exit:    'mozCancelFullScreen',
        events: {
            change: 'mozfullscreenchange',
            error:  'mozfullscreenerror',
        },
    },
    ms: {
        enabled: 'msFullscreenEnabled',
        element: 'msFullscreenElement',
        request: 'msRequestFullscreen',
        exit:    'msExitFullscreen',
        events: {
            change: 'MSFullscreenChange',
            error:  'MSFullscreenError',
        },
    },
};

class FullscreenAPIPolyfill {
    constructor(doc) {
        this.doc = doc;
        this.api = undefined;
        this.w3 = APIS.w3;

        let self = this;

        // Loop through each vendor's specific API
        for (let vendor in APIS) {
            // Check if document has the "enabled" property
            if (APIS[vendor].enabled in this.doc) {
                // It seems this browser support the fullscreen API
                this.api = APIS[vendor];
                break;
            }
        }

        if (!(this.w3.enabled in doc) && this.api) {
            // Add listeners for fullscreen events
            this.doc.addEventListener(this.api.events.change, this.handleChange.bind(this), false);
            this.doc.addEventListener(this.api.events.error, this.handleError.bind(this), false);

            // Copy the default value
            this.doc[this.w3.enabled] = this.doc[this.api.enabled];
            this.doc[this.w3.element] = this.doc[this.api.element];

            // Match the reference for exitFullscreen
            this.doc[this.w3.exit] = () => {
                let result = this.doc[this.api.exit]();
                return !result && Promise ? new Promise(this.createResolver(this.w3.exit)).catch(() => {}) : result;
            };

            // Add the request method to the Element's prototype
            Element.prototype[this.w3.request] = function () {
                let result = this[self.api.request].apply(this, arguments);
                return !result && Promise ? new Promise(self.createResolver(self.w3.request)).catch(() => {}) : result;
            };
        }
    }

    dispatch(type, target) {
        let event = this.doc.createEvent('Event');

        event.initEvent(type, true, false);
        target.dispatchEvent(event);
    }

    handleChange(e) {
        // Recopy the enabled and element values
        this.doc[this.w3.enabled] = this.doc[this.api.enabled];
        this.doc[this.w3.element] = this.doc[this.api.element];

        this.dispatch(this.w3.events.change, e.target);
    }

    handleError() {
        // this.dispatch(this.w3.events.error, e.target);
    }

    createResolver(method) {
        // Prepare a resolver to use for the requestFullscreen and exitFullscreen's promises
        // Use a closure since we need to check which method was used

        return (resolve, reject) => {
            // Reject the promise if asked to exitFullscreen and there is no element currently in fullscreen
            if (method === this.w3.exit && !this.doc[this.api.element]) {
                // return reject(new TypeError());
            }

            // When receiving an internal fullscreenchange event, fulfill the promise
            const change = () => {
                resolve();
                this.doc.removeEventListener(this.api.events.change, change, false);
            };
            this.doc.addEventListener(this.api.events.change, change, false);

            // When receiving an internal fullscreenerror event, reject the promise
            const error = () => {
                reject(new TypeError());
                this.doc.removeEventListener(this.api.events.error, error, false);
            };
            this.doc.addEventListener(this.api.events.error, error, false);
        };
    }
}

export default new FullscreenAPIPolyfill(document).api;
