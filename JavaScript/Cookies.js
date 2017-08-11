


function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";"
}

function getCookie(cname) {
    var name = cname + "="
    var decodedCookie = decodeURIComponent(document.cookie)
    var ca = decodedCookie.split(';')
    for ( var i = 0; i < ca.length; i++ ) {
        var c = ca[i]

        while ( c.charAt(0) == ' ' ) {
            c = c.substring(1)
        }
        
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

function listCookies() {
    var theCookies = document.cookie.split(';')
    var aString = ''
    for (var i = 1; i<= theCookies.length; i++) {
        aString += i + ' ' + theCookies[i-1] + "\n"
    } 

    return aString
}













