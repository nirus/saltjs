function superThread() {
    let arg = [].slice.call(arguments), //This is for Uglify optimization
        n = arg[0],
        i = arg[1],
        r = arg[2],
        u = arg[3],
        s = arg[4];
    let scope1 = 0;
    let scope2 = 0;
    let scope3 = 0;
    let scope4 = '';
    let scope5 = '';

    //var s = e.data[4];
    do {
        //Scope1                
        if (scope1 < 5) {
            // scope5.push(n.charAt(scope1)); //Password Extract
            scope5 += n.charAt(scope1);
        } else if (scope1 < n.length) {
            // scope4.push(n.charAt(scope1)); //Encrypted String Extraact
            scope4 += n.charAt(scope1)
        }

        scope1++;

        //Scope2
        if (scope2 < 5) {
            // scope5.push(i.charAt(scope2)); //Password Extract
            scope5 += i.charAt(scope2)
        } else if (scope2 < i.length) {
            // scope4.push(i.charAt(scope2)); //Encrypted String Extraact
            scope4 += i.charAt(scope2);
        }

        scope2++;

        //Scope3
        if (scope3 < 5) {
            // scope5.push(r.charAt(scope3)); //Password Extract
            scope5 += r.charAt(scope3)
        } else if (scope3 < r.length) {
            // scope4.push(r.charAt(scope3)); //Encrypted String Extraact
            scope4 += r.charAt(scope3);
        }

        scope3++;

    } while (n.length + i.length + r.length + u.length != scope4.length + scope5.length + u.length)

    //Routine to extract the password and Encrypted string
    scope2 = 0;

    let result = '';
    for (scope1 = 0; scope1 < scope4.length; scope1 += 2) {
        let salt = -1;

        if (scope5.charCodeAt(scope2) % 2) { // When odd number - init = 1 even number init = -1
            salt = 1;
        }

        result += String.fromCharCode(parseInt(scope4.substr(scope1, 2), 36) - salt);
        scope2++;

        if (scope2 >= scope5.length) {
            scope2 = 0;
        }
    }

    return result;
};