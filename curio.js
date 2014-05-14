var Curio = (function (apiKey, trackingCode) {
    var getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    };
    var setCookie = function(key, value, expire) {
        document.cookie = key + "=" + value + "; expires=" + expire;
    };
    var delCookie = function(key) {
        document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };
    var createVisitorCode = function() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        });
        return uuid;
    };
    console.log(createVisitorCode());
    var createCookieExpireDate = function() {
        var date = new Date();
        date.setFullYear(date.getFullYear()+2);
        return date;
    };
    var curio = {
        "ready": false,
        "authToken": "",
        "visitorCode": "",
        "apiKey": apiKey,
        "trackingCode": trackingCode,
        "sessionCode": "",
        "hitCode": "",
        "serverUrl": document.location.protocol + "//ttech.8digits.com/api/"
    };
    if(getCookie("curioVisitorCode").length > 0) {
        setCookie('curioVisitorCode', getCookie('curioVisitorCode'), createCookieExpireDate());
        curio.visitorCode = getCookie("curioVisitorCode");
    } else {
        setCookie('curioVisitorCode', createVisitorCode(), createCookieExpireDate());
    }
    if(getCookie("curioSessionCode").length > 0) {
        curio.sessionCode = getCookie("curioSessionCode");
    }
    curio.endpoints = {
        "auth": {
            "requestType": "POST",
            "address": curio.serverUrl + "auth"
        },
        "visit": {
            "create": {
                "requestType": "POST",
                "address": curio.serverUrl + "visit/create"
            },
            "end": {
                "requestType": "POST",
                "address": curio.serverUrl + "visit/end"
            }
        },
        "event": {
            "create": {
                "requestType": "POST",
                "address": curio.serverUrl + "event/create"
            }
        },
        "hit": {
            "create": {
                "requestType": "POST",
                "address": curio.serverUrl + "hit/create"
            },
            "end": {
                "requestType": "POST",
                "address": curio.serverUrl + "hit/end"
            }
        }
    };
    var createCORSRequest = function(method, url) {
        var xhr = new XMLHttpRequest();
        if("withCredentials" in xhr) {
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            xhr = null;
        }
        return xhr;
    };
    var authenticate = function() {
        var xhr = createCORSRequest(curio.endpoints.auth.requestType, curio.endpoints.auth.address + '?apiKey=' + this.apiKey);
        if (xhr != null) {
            xhr.onload = function() {
                try {
                    var response = JSON.parse(xhr.responseText);
                } catch (ex) {
                    return false;
                }
                if(response.data === undefined || typeof response.data != "object") {
                    return false;
                }
                if(response.data.authToken === undefined || typeof response.data.authToken != "string") {
                    return false;
                }
                curio.authToken = response.data.authToken;
                curio.ready = true;
                return true;
            };
            xhr.send();
        }
    }();

    curio.newVisit = function(requestObject, callback) {
        if(!curio.ready) {
            callback(false);
            return false;
        }
        if(callback === undefined || typeof callback != "function") {
            return false;
        }
        if(requestObject === undefined || typeof requestObject != "object") {
            callback(false);
            return false;
        }
        var url = curio.endpoints.visit.create.address;
        url = url + '?authToken=' + curio.authToken + '&trackingCode=' + curio.trackingCode;
        url = url + '&visitorCode=' + curio.visitorCode;
        if(requestObject.pageTitle != undefined && typeof requestObject.pageTitle == "string" && requestObject.pageTitle.length > 0) {
            url = url + '&pageTitle=' + requestObject.pageTitle;
        }
        if(requestObject.path != undefined && typeof requestObject.path == "string" && requestObject.path.length > 0) {
            url = url + '&path=' + requestObject.path;
        }
        if(requestObject.hitCode != undefined && typeof requestObject.hitCode == "string" && requestObject.hitCode.length > 0) {
            url = url + '&hitCode=' + requestObject.hitCode;
        }
        if(requestObject.sessionCode != undefined && typeof requestObject.sessionCode == "string" && requestObject.sessionCode.length > 0) {
            url = url + '&sessionCode=' + requestObject.sessionCode;
        }
        if(requestObject.userAgent != undefined && typeof requestObject.userAgent == "string" && requestObject.userAgent.length > 0) {
            url = url + '&userAgent=' + requestObject.userAgent;
        }
        var xhr = createCORSRequest(curio.endpoints.visit.create.requestType, url);
        if(xhr == null) {
            callback(false);
            return false;
        }
        xhr.onload = function() {
            try {
                var response = JSON.parse(xhr.responseText);
                curio.sessionCode = response.data.sessionCode;
                curio.hitCode = response.data.hitCode;
                setCookie('curioSessionCode', curio.sessionCode, createCookieExpireDate());
            } catch (ex) {
                callback(xhr.responseText);
                return false;
            }
            callback(response);
            return true;
        };
        xhr.send();
    };

    curio.endVisit = function(requestObject, callback) {
        if(!curio.ready) {
            callback(false);
            return false;
        }
        if(callback === undefined || typeof callback != "function") {
            return false;
        }
        if(requestObject === undefined || typeof requestObject != "object") {
            callback(false);
            return false;
        }
        if(requestObject.sessionCode === undefined || typeof requestObject.sessionCode != "string" || requestObject.sessionCode.length < 1) {
            callback(false);
            return false;
        }
        var url = curio.endpoints.visit.end.address;
        url = url + '?authToken=' + curio.authToken + '&trackingCode=' + curio.trackingCode;
        url = url + '&visitorCode=' + curio.visitorCode;
        url = url + '&sessionCode=' + curio.sessionCode;
        var xhr = createCORSRequest(curio.endpoints.visit.end.requestType, url);
        if(xhr == null) {
            callback(false);
            return false;
        }
        xhr.onload = function() {
            curio.hitCode = '';
            curio.sessionCode = '';
            delCookie('curioSessionCode');
            try {
                var response = JSON.parse(xhr.responseText);
            } catch (ex) {
                callback(xhr.responseText);
                return false;
            }
            callback(response);
            return true;
        };
        xhr.send();
    };

    curio.newEvent = function(requestObject, callback) {
        if (!curio.ready) {
            callback(false);
            return false;
        }
        if(callback === undefined || typeof callback != "function") {
            return false;
        }
        if(requestObject === undefined || typeof requestObject != "object") {
            callback(false);
            return false;
        }
        var url = curio.endpoints.event.create.address;
        url = url + '?authToken=' + curio.authToken + '&trackingCode=' + curio.trackingCode;
        url = url + '&visitorCode=' + curio.visitorCode;
        if(requestObject.sessionCode != undefined && typeof requestObject.sessionCode == "string" && requestObject.sessionCode.length > 0) {
            url = url + '&sessionCode=' + requestObject.sessionCode;
        }
        if(requestObject.hitCode != undefined && typeof requestObject.hitCode == "string" && requestObject.hitCode.length > 0) {
            url = url + '&hitCode=' + requestObject.hitCode;
        }
        if(requestObject.key != undefined && typeof requestObject.key == "string" && requestObject.key.length > 0) {
            url = url + '&key=' + requestObject.key;
        }
        if(requestObject.value != undefined && typeof requestObject.value == "string" && requestObject.value.length > 0) {
            url = url + '&value=' + requestObject.value;
        }
        var xhr = createCORSRequest(curio.endpoints.event.create.requestType, url);
        if(xhr == null) {
            callback(false);
            return false;
        }
        xhr.onload = function() {
            try {
                var response = JSON.parse(xhr.responseText);
            } catch (ex) {
                callback(xhr.responseText);
                return false;
            }
            callback(response);
            return true;
        };
        xhr.send();
    };

    curio.newHit = function(requestObject, callback) {
        if (!curio.ready) {
            callback(false);
            return false;
        }
        if(callback === undefined || typeof callback != "function") {
            return false;
        }
        if(callback === undefined || typeof requestObject != "object") {
            callback(false);
            return false;
        }
        if(requestObject.sessionCode === undefined || typeof requestObject.sessionCode != "string" || requestObject.sessionCode.length < 1) {
            callback(false);
            return false;
        }
        if(requestObject.pageTitle === undefined || typeof requestObject.pageTitle != "string" || requestObject.pageTitle.length < 1) {
            callback(false);
            return false;
        }
        if(requestObject.path === undefined || typeof requestObject.path != "string" || requestObject.path.length < 1) {
            callback(false);
            return false;
        }
        var url = curio.endpoints.hit.create.address;
        url = url + '?authToken=' + curio.authToken + '&trackingCode=' + curio.trackingCode;
        url = url + '&visitorCode=' + curio.visitorCode;
        url = url + '&sessionCode=' + requestObject.sessionCode;
        url = url + '&pageTitle=' + requestObject.pageTitle;
        url = url + '&path=' + requestObject.path;
        if(requestObject.hitCode != undefined && typeof requestObject.hitCode == "string" && requestObject.hitCode.length > 0) {
            url = url + '&hitCode=' + requestObject.hitCode;
        }
        var xhr = createCORSRequest(curio.endpoints.hit.create.requestType, url);
        if(xhr == null) {
            callback(false);
            return false;
        }
        xhr.onload = function() {
            try {
                var response = JSON.parse(xhr.responseText);
                curio.hitCode = response.data.hitCode;
            } catch (ex) {
                callback(xhr.responseText);
                return false;
            }
            callback(response);
            return true;
        };
        xhr.send();
    };

    curio.endHit = function(requestObject, callback) {
        if (!curio.ready) {
            callback(false);
            return false;
        }
        if(callback === undefined || typeof callback != "function") {
            return false;
        }
        if(requestObject === undefined || typeof requestObject != "object") {
            callback(false);
            return false;
        }
        if(requestObject.sessionCode === undefined || typeof requestObject.sessionCode != "string" || requestObject.sessionCode.length < 1) {
            callback(false);
            return false;
        }
        if(requestObject.hitCode === undefined || typeof requestObject.hitCode != "string" || requestObject.hitCode.length < 1) {
            callback(false);
            return false;
        }
        var url = curio.endpoints.hit.end.address;
        url = url + '?authToken=' + curio.authToken + '&trackingCode=' + curio.trackingCode;
        url = url + '&visitorCode=' + curio.visitorCode;
        url = url + '&sessionCode=' + curio.sessionCode;
        url = url + '&hitCode=' + curio.hitCode;
        var xhr = createCORSRequest(curio.endpoints.hit.end.requestType, url);
        if(xhr == null) {
            callback(false);
            return false;
        }
        xhr.onload = function() {
            curio.hitCode = '';
            try {
                var response = JSON.parse(xhr.responseText);
            } catch (ex) {
                callback(xhr.responseText);
                return false;
            }
            callback(response);
            return true;
        };
        xhr.send();
    };

    return curio;

})(apiKey, trackingCode);