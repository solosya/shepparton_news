var g_SESSION_ID_TAG = "syncwall-sessionid";
var g_AUTHTOKEN = "syncwall-authToken";
var g_HISTORY = "syncwall-history";
var g_REFRESHLIMIT = 10;
var g_REFRESHTIMELIMIT = 4;
var g_PAGEURL;
var g_DEBUG = true;

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(d) {
        if (this == null) {
            throw new TypeError()
        }
        var e = Object(this);
        var b = e.length >>> 0;
        if (b === 0) {
            return -1
        }
        var c = 0;
        if (arguments.length > 1) {
            c = Number(arguments[1]);
            if (c != c) {
                c = 0
            } else {
                if (c != 0 && c != Infinity && c != -Infinity) {
                    c = (c > 0 || -1) * Math.floor(Math.abs(c))
                }
            }
        }
        if (c >= b) {
            return -1
        }
        var a = c >= 0 ? c : Math.max(b - Math.abs(c), 0);
        for (; a < b; a++) {
            if (a in e && e[a] === d) {
                return a
            }
        }
        return -1
    }
}

function checkAuthStatus(token) {
    var options = '&source=web+mobile&username=dummy';

    $.ajax({
        url: 'https://syncaccess-mmg-sn.syncronex.com/mmg/sn/API/svcs/simplelogon?format=json&authtoken=' + token + options,
        contentType: 'application/json',
        type: 'GET',
        success: function(data) {
        },
        error: function(xhr, ajaxOptions, err) {
        },
    });
};

function checkSyncWall() {
    var f = readCookie(g_SESSION_ID_TAG);
    if (!f || f == "null") {
        f = ""
    }
    g_PAGEURL = window.location.toString().replace('?', '').replace('&', '');
    var g = getAuthToken(g_PAGEURL);

    if (g != "") {
        createCookie(g_AUTHTOKEN, g, 36500, "/");
        var h = g_PAGEURL.toString().indexOf("sp-tk");
        g_PAGEURL = g_PAGEURL.toString().substr(0, h);
        console.log('redirecting');
        console.log(_appJsConfig.appHostName + '/admin/syncronex/login-paywall?sp-tk=' + g + '&returnurl=' + g_PAGEURL + '&errorurl=' + g_PAGEURL + '/error&paymeter=syncaccess-mmg-sn.syncronex.com/mmg/sn');
        window.location.replace(_appJsConfig.appHostName + '/admin/syncronex/login-paywall?sp-tk=' + g + '&returnurl=' + g_PAGEURL + '&errorurl=' + g_PAGEURL + '/error&paymeter=syncaccess-mmg-sn.syncronex.com/mmg/sn');
    }
    var d = g_PAGEURL;
    g_PAGEURL = g_PAGEURL.replace(/#.*$/, "");
    var g = readCookie(g_AUTHTOKEN);
    if (!g || g == "null") {
        g = ""
    }
    var a;
    var c = document.getElementsByName("__sync_contentCategory");
    if (c && c[0]) {
        a = c[0].content;
        log("contentId: " + a)
    } else {
        return
    }
    var e = referringDomain(document.referrer);
    var b = readCookie("tncms-authtoken") ? readCookie("tncms-screename") : "";
    if (!recentlyVisited(g_PAGEURL.toString())) {
        callServer(f, g, a, b, e, d, "serverCallback")
    } else {
        createCookie(g_HISTORY, updateHistory(g_PAGEURL.toString()), 36500, "/")
    }
}
function recentlyVisited(c) {
    var a = pageHistory();
    if (a == null) {
        return false
    }
    if (g_REFRESHLIMIT === 0) {
        return false
    }
    var d = a.indexOf(c);
    if (d == -1) {
        return false
    }
    if (g_REFRESHTIMELIMIT === 0) {
        return false
    }
    var b = a[d + 1];
    if (timeDiff(new Date().getTime(), b) > g_REFRESHTIMELIMIT) {
        return false
    }
    return true
}
function pageHistory() {
    var a = readCookie(g_HISTORY);
    if (!a || a == "null") {
        return null
    }
    return a.split(",")
}
function timeDiff(a, c) {
    var b = a - c;
    var d = Math.floor(b / 60000);
    return d
}
function updateHistory(b) {
    var a = pageHistory();
    var c = -1;
    if (a != null) {
        c = a.indexOf(b)
    }
    if (c == -1) {
        if (a == null) {
            a = new Array()
        }
        if ((a.length / 2) >= g_REFRESHLIMIT) {
            replaceOldest(a, b)
        } else {
            a.push(b);
            a.push(new Date().getTime())
        }
    } else {
        a.splice(c + 1, 1, new Date().getTime())
    }
    return a.join(",")
}
function replaceOldest(a, e) {
    var c = new Date("12/31/2199").getTime();
    var d = -1;
    for (var b = 1; b < a.length; b += 2) {
        if (a[b] < c) {
            c = a[b];
            d = b
        }
    }
    if (d > 0) {
        a.splice(d - 1, 2, e, new Date().getTime())
    } else {
        a.push(e);
        a.push(new Date().getTime())
    }
}
function getAuthToken(b) {
    return getParameterByName("sp-tk");
}
function getParameterByName(a) {
    a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var c = "[\\?&]" + a + "=([^&#]*)";
    var b = new RegExp(c);
    var d = b.exec(window.location.search);
    if (d == null) {
        return ""
    } else {
        return decodeURIComponent(d[1].replace(/\+/g, " "))
    }
}
function referringDomain(b) {
    var c = b.split("/");
    var a = "";
    if (c.length > 2) {
        a = "http://" + c[2] + "/foo.htm"
    }
    return a
}
function callServer(o, a, g, i, l, j, d) {
    var p = encodeURI(o);
    var f = encodeURIComponent(g);
    var h = encodeURIComponent(i);
    var m = encodeURIComponent(l);
    var k = encodeURIComponent(j);
    var e = encodeURIComponent(d);
    var b = encodeURIComponent(a);
    var c = "https://syncaccess-mmg-sn.syncronex.com/mmg/sn/api/svcs/meter";
    var n = c + "?sessionId=" + p + "&contentId=" + f + "&externalId=" + h + "&referrer=" + m + "&page=" + k + "&authToken=" + b + "&callback=" + e + "&nocache=" + new Date().getTime();
    log("serverURL: " + n);
    InsertScriptElement(n)
}
function InsertScriptElement(c) {
    var b = document.createElement("script");
    b.setAttribute("type", "text/javascript");
    b.setAttribute("src", c);
    log("script: " + b.outerHTML);
    var a = document.getElementsByTagName("head").item(0);
    if (!a) {
        a = document.getElementsByTagName("body").item(0)
    }
    a.appendChild(b)
}
function serverCallback(c) {
    var a = c.authorized.toLowerCase();
    var f = c.sessionIdentifier;
    var d = c.overlayContent;
    var b = c.authToken;
    var g = c.showWarning;
    var e = c.overlayType;
    log("serverCallback Data:");
    log("    authorized:        " + a);
    log("    sessionId:         " + f);
    log("    authToken:         " + b);
    log("    showWarning:       " + g);
    log("    overlayType:       " + e);
    log("    overlayContent:\n" + d);
    if (a != "true") {
        if (d.substring(0, 9) == "redirect:") {
            createCookie(g_SESSION_ID_TAG, f, 36500, "/");
            displayRedirect(d.substring(9))
        } else {
            displayOverlay(d, g, e);
            if (g == "true") {
                createCookie(g_HISTORY, updateHistory(g_PAGEURL.toString()), 36500, "/")
            }
        }
    } else {
        createCookie(g_HISTORY, updateHistory(g_PAGEURL.toString()), 36500, "/")
    }
    if (f && f != "") {
        createCookie(g_SESSION_ID_TAG, f, 36500, "/")
    }
    if (b && b != "") {
        createCookie(g_AUTHTOKEN, b, 36500, "/")
    }
}
function createCookie(e, g, b, f) {
    var d;
    if (b) {
        var a = new Date();
        a.setTime(a.getTime() + (b * 24 * 60 * 60 * 1000));
        d = "; expires=" + a.toGMTString()
    } else {
        d = ""
    }
    var c = function() {
        if (/Sheppnews.com.au/i.test(window.location.hostname)) {
            return ".sheppnews.com.au"
        }
        if (/Riverineherald.com.au/i.test(window.location.hostname)) {
            return ".Riverineherald.com.au"
        }
        if (/Countrynews.com.au/i.test(window.location.hostname)) {
            return ".Countrynews.com.au"
        }
        if (/Kyfreepress.com.au/i.test(window.location.hostname)) {
            return ".Kyfreepress.com.au"
        }
        if (/Taturaguardian.com.au/i.test(window.location.hostname)) {
            return ".Taturaguardian.com.au"
        }
        if (/Campaspenews.com.au/i.test(window.location.hostname)) {
            return ".Campaspenews.com.au"
        }
        if (/Mcivortimes.com.au/i.test(window.location.hostname)) {
            return ".Mcivortimes.com.au"
        }
        if (/Seymourtelegraph.com.au/i.test(window.location.hostname)) {
            return ".Seymourtelegraph.com.au"
        }
        if (/Benallaensign.com.au/i.test(window.location.hostname)) {
            return ".Benallaensign.com.au"
        }
        if (/Cobramcouier.com.au/i.test(window.location.hostname)) {
            return ".Cobramcouier.com.au"
        }
        if (/Southernriverinanews.com.au/i.test(window.location.hostname)) {
            return ".Southernriverinanews.com.au"
        }
        if (/Denipt.com.au/i.test(window.location.hostname)) {
            return ".Denipt.com.au"
        }
        if (/Corowafreepress.com.au/i.test(window.location.hostname)) {
            return ".Corowafreepress.com.au"
        }
        if (/Yarrawongachronicle.com.au/i.test(window.location.hostname)) {
            return ".Yarrawongachronicle.com.au"
        }
        return window.location.hostname
    };
    document.cookie = e + "=" + g + d + "; path=" + f + ";domain=" + c()
}
function readCookie(e) {
    var f = e + "=";
    var b = document.cookie.split(";");
    for (var d = 0; d < b.length; d++) {
        var a = b[d];
        while (a.charAt(0) == " ") {
            a = a.substring(1, a.length)
        }
        if (a.indexOf(f) == 0) {
            return a.substring(f.length, a.length)
        }
    }
    return null
}
function eraseCookie(a) {
    createCookie(a, "x", -1, "/")
}
function forceCookie() {
    var a = document.getElementById("cookieVal");
    if (a) {
        var b = a.value;
        createCookie(g_SESSION_ID_TAG, b, 1)
    }
}
function loadCustomStyleSheet(b) {
    var a = document.getElementsByTagName("head").item(0);
    var c = document.createElement("link");
    c.type = "text/css";
    c.rel = "stylesheet";
    c.href = b;
    c.setAttribute("id", "_customCss_");
    a.appendChild(c)
}
function displayRedirect(a) {
    top.location.href = a
}
function displayOverlay(f, j, g) {
    if (g_DEBUG) {
        f += '<input type="button" class="sync-overlay-debug" value="Reset Session" onclick="eraseCookie(\'' + g_SESSION_ID_TAG + "'); return false;\" />"
    }
    var b = document.getElementsByTagName("body").item(0);
    loadCustomStyleSheet("https://syncaccess-mmg-sn.syncronex.com/mmg/sn/api/scripts/syncwallstyle");
    var e = document.createElement("div");
    e.setAttribute("id", "syncronexOverlay");
    var d = document.createElement("div");
    d.setAttribute("id", "syncronexOverlayContainer");
    var c = document.createElement("div");
    c.setAttribute("id", "syncronexOverlayContent");
    if (j == "true") {
        e.setAttribute("class", "syncronex-warning-overlay");
        c.setAttribute("class", "syncronex-warning-overlay-content");
        d.setAttribute("class", "syncronex-warning-overlay-container")
    } else {
        e.setAttribute("class", "syncronex-wall-overlay");
        c.setAttribute("class", "syncronex-wall-overlay-content");
        d.setAttribute("class", "syncronex-wall-overlay-container")
    }
    b.appendChild(e);
    c.innerHTML = f;
    d.appendChild(c);
    b.appendChild(d);
    var h = encodeURIComponent(g);
    var a = "https://syncaccess-mmg-sn.syncronex.com/mmg/sn/api/scripts/syncwalloverlayscript";
    var i = "";
    if (a.indexOf("?") > -1) {
        i = a + "&type=" + h
    } else {
        i = a + "?type=" + h
    }
    InsertScriptElement(i)
}
function GetWindowSize() {
    var a = {
        Width: 0,
        Height: 0
    };
    if (typeof (window.innerWidth) == "number") {
        a.Width = window.innerWidth;
        a.Height = window.innerHeight
    } else {
        if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
            a.Width = document.documentElement.clientWidth;
            a.Height = document.documentElement.clientHeight
        } else {
            if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                a.Width = document.body.clientWidth;
                a.Height = document.body.clientHeight
            }
        }
    }
    return a
}
function log(a) {
    if (g_DEBUG) {
        if (window.console && window.console.log) {
            // console.log(a)
        }
    }
}
function dismissOverlay() {
    var b = document.getElementById("syncronexOverlay");
    var c = document.getElementById("syncronexOverlayContent");
    var a = document.getElementById("_customCss_");
    if (typeof c != "undefined") {
        removeElement(c)
    }
    if (typeof b != "undefined") {
        removeElement(b)
    }
    if (typeof a != "undefined") {
        removeElement(a)
    }
}
function removeElement(a) {
    a.parentNode.removeChild(a)
}

function run() {
    if (g_DEBUG) {
        g_REFRESHLIMIT = 1;
        g_REFRESHTIMELIMIT = 1
    }

    if (window.addEventListener) {
        window.addEventListener("load", checkSyncWall, false)
    } else {
        if (window.attachEvent) {
            window.attachEvent("onload", checkSyncWall)
        }
    }
}

if (!/dairy/i.test(window.location.hostname)) {
    run();
}
