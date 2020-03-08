class Authenticate {
    private static _singleton: Authenticate;

    private static TOKEN_CACHE_KEY = 'supervisor-scraper-job-queue:renewal-job-form:token';
    private static PORT_CACHE_KEY = 'supervisor-scraper-job-queue:renewal-job-form:port';

    private _token: string;
    private _port: string;
    
    private constructor() {
        this._token = this.loadValue(Authenticate.TOKEN_CACHE_KEY);
        this._port = this.loadValue(Authenticate.PORT_CACHE_KEY);
    }

    private loadValue(cacheKey: string) {
        const valueStoredLocally = localStorage.getItem(cacheKey);
        if (valueStoredLocally !== null) {
            return valueStoredLocally;
        } else {
            localStorage.setItem(Authenticate.TOKEN_CACHE_KEY, '');
            return '';
        }
    }

    static get singleton() {
        if (!Authenticate._singleton) {
            Authenticate._singleton = new Authenticate();
        }
        return Authenticate._singleton;
    }

    private setValue(valueString: string, cacheKey: string) {
        localStorage.setItem(cacheKey, valueString);
        return valueString;
    }

    private getValue(thisValue: string, cacheKey: string) {
        if (thisValue && thisValue !== '') {
            return thisValue;
        }

        const locallyStoredValue = localStorage.getItem(cacheKey);
        if (locallyStoredValue !== null) {
            return locallyStoredValue;
        }

        localStorage.setItem(cacheKey, '');
        return '';
    }

    set token(tokenString: string) {
        this._token = this.setValue(tokenString, Authenticate.TOKEN_CACHE_KEY);
    }

    get token() {
        this._token = this.getValue(this._token, Authenticate.TOKEN_CACHE_KEY);
        return this._token;
    }

    set port(portString: string) {
        this._port = this.setValue(portString, Authenticate.PORT_CACHE_KEY);
    }

    get port() {
        this._port = this.getValue(this._port, Authenticate.PORT_CACHE_KEY);
        return this._port;
    }
}

export const Authenticator = Authenticate.singleton;
