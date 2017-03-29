//(function(n, i, r, u, s) {	
var n = arguments[0],
    i = arguments[1],
    r = arguments[2],
    u = arguments[3],
    s = arguments[4],
    scope1 = 0,
    scope2 = 0,
    scope3 = 0,
    scope4 = [],
    scope5 = [];
while (true) {
    //Scope1                
    if (scope1 < 5) {
        scope5.push(n.charAt(scope1)); //Password Extract
    }
    else if (scope1 < n.length) {
        scope4.push(n.charAt(scope1)); //Encrypted String Extraact
    }
    scope1++;

    //Scope2
    if (scope2 < 5) {
        scope5.push(i.charAt(scope2)); //Password Extract
    }
    else if (scope2 < i.length) {
        scope4.push(i.charAt(scope2)); //Encrypted String Extraact
    }
    scope2++;

    //Scope3
    if (scope3 < 5) {
        scope5.push(r.charAt(scope3)); //Password Extract
    }
    else if (scope3 < r.length) {
        scope4.push(r.charAt(scope3)); //Encrypted String Extraact
    }
    scope3++;

    //Final loop breaker
    if (n.length + i.length + r.length + u.length == scope4.length + scope5.length + u.length) {
        break;
    }
}

//Routine to extract the password and Encrypted string
var word1 = scope4.join(''); //Encrypted string
var word2 = scope5.join(''); //Password
scope2 = 0;
var result = [];
for (scope1 = 0; scope1 < scope4.length; scope1 += 2) {
    var salt = -1;
    if (word2.charCodeAt(scope2) % 2) { // When odd number - init = 1 even number init = -1
        salt = 1;
    }
    result.push(String.fromCharCode(parseInt(word1.substr(scope1, 2), 36) - salt));
    scope2++;
    if (scope2 >= scope5.length) {
        scope2 = 0;
    }
}

var retValue = []["filter"]["constructor"](result.join(''));
//     return result.join('');
// })


/*The above lines are commented as uglify compressor will not recognise the scope
  Code written by Nirus
*/