function simpleCodeHideAlgorithm(incomingCode) {

    var btoa = this.btoa || function(str) {
        return new Buffer(str).toString('base64');
    },
    
    replace = "(!![]+[])[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]"+"+'\\x70'+"+"(![]+[])[!+[]+!+[]]+(![]+[])[+!+[]]"+"+'\\x63'+"+"(!![]+[])[!+[]+!+[]+!+[]]";
    
    function stringMangler(characters, trickChar) {
        trickChar = trickChar || "\\x";
        if (characters.length == 1) {
            return "'" + trickChar + characters.charCodeAt(0).toString(16) + "'";
        }

        characters = characters.split("");
        characters = characters.reduce(function(previous, current, index, array) {
            if (array[0] == previous) {
                return trickChar + previous.charCodeAt(0).toString(16) + trickChar + current.charCodeAt(0).toString(16);
            }
            else {
                return previous + trickChar + current.charCodeAt(0).toString(16);
            }
        });

        return "'" + characters + "'";
    }

    function encodeApiName(apiName) {
        var maps = {
            "t": "(!![]+[])[+[]]",
            "a": "(![]+[])[+!+[]]"
        }

        if (apiName.toLowerCase() == "btoa") {
            return stringMangler("b") + "+" + maps["t"] + "+" + stringMangler("o") + "+" + maps["a"]; //API = btoa
        }
        else {
            return maps["a"] + "+" + maps["t"] + "+" + stringMangler("ob"); //API = atob
        }
    }

    return "[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]][" + stringMangler("co") + "+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+" + stringMangler("ctor") + "]((!![]+[])[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+([][[]]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+!+[]]+" + stringMangler(" this") + ")([]+![]+!![])[" + encodeApiName("atob") + "]("+stringMangler(btoa(incomingCode))+")";
}

module.exports = simpleCodeHideAlgorithm;
