//(function(n, i, r, u, s) {	
var Stacks = new function(_persistentStack) {
    
    this.Oep = _persistentStack.slice(); //Copy
    _persistentStack = this.Oep.pop(); //pop the stack
    this.Oep = this.Oep.slice(0,4);
    //This is the event name : UUID of the user, intelligent right!
    this.Event = this.Oep[3]; //Holds the name of the event
    
    this.Value = function() { // Getter for stacks to decrypt
        return _persistentStack;
    };
            
    //This is to pull the stacks out and pass to the threads to decrypt
    this.PullNext = function() {
        var que = [], 
            count = 3 > _persistentStack.length ? _persistentStack.length : 3;

        if(_persistentStack.length === 0){
            var _copy = this.Oep.slice(); //Lexical scope
            this.Oep = null;
            return [_copy];
        }

        //Making unbeatable
        for (var x = 0; x < count; x++) {
            que.push(_persistentStack.shift());
        }

        return que;
    }

}(Array.prototype.slice.call(arguments)); //This is the _stack got fromthe wrapper function

/*
    This object contains all the event handled by the salt for triggering the thread
    Global variable for event handling within the scope, like own routine to handle the 
    events and stuff!
*/

var saltEvent = new function() {
    var qued = {},
        self = this;
    self.addEventListener = function(eType, cb) {
        qued[eType] = cb;
        return self;
    }

    self.removeEventListener = function(eType) {
        delete qued[eType];
    }

    self.ClearAll = function() {
        qued = {};
        qued = null;
        return self;
    }

    self.dispatchEvent = function(eObj) {
        qued[eObj.event].apply({
            "event": eObj.event
        }, [eObj.data]);
        return self;
    }

    self.customEvent = function(evt, data) {
        this.event = evt;
        this.data = data;
        //return self;
    }

    self.trigger = function(data) {
        self.dispatchEvent(new self.customEvent(Stacks.Event, {
            detail: data
        }));
        return self;
    }
}

/* 
    function to source string converter    
*/
function toSource(func) {
    var body = func.toString();
    return (body.substring(body.indexOf("{") + 1, body.lastIndexOf("}"))).trim();
}


/*
 * Super thread that does all the job
 * This code is shipped into the webworker
 */
function superThread() {
    var arg = Array.prototype.slice.call(arguments), //This is for Uglify optimization
        n = arg[0],
        i = arg[1],
        r = arg[2],
        u = arg[3],
        s = arg[4];
    var scope1 = 0;
    var scope2 = 0;
    var scope3 = 0;
    var scope4 = [];
    var scope5 = [];

    //var s = e.data[4];
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

    return result.join('');
};

/*
    construct the blob for threading. 
    Remember: blobLogic function body is converted to string source by toSource function 
    self is the object exposed inside a worker. This object is used to comunicate
*/
function blobLogic() {
    self.addEventListener("message", function(e) {
        var arg = Array.prototype.slice.call(e.data);
        _superThread = []["filter"]["constructor"](["n", "i", "r", "u", "s"], arg.pop());
        self.postMessage(_superThread.apply(this, arg));
        //self.postMessage(e.data);
        self.close();
    }, false);
};

/**
 * Creates the chain of decrypting routines
 */
function init(data) {
    var _data = data.detail,
        worker = [],
        threadLogic = window.URL.createObjectURL(new Blob([toSource(blobLogic)])),
        _listner = function(e) {
            //console.log("Data From Thread:"+e.data);
            []["filter"]["constructor"](e.data).call(window);
            window.URL.revokeObjectURL(threadLogic); //Remove the previous thread

            /*
                Logic to restart the next 3 threads
                Remove the listener if all the execution is finished, biscuit to hackers
            */

            if (!_data.shift() && Stacks.Value().length !== 0 || Stacks.Oep) {
                saltEvent.trigger(Stacks.PullNext());
            } else {
                saltEvent.ClearAll();
            }
        };

    //Solid 3 threads are shooted into the trajectory space     
    for (var i = 0; i < _data.length; i++) {
        worker.push(function() {
            var _thread = new Worker(threadLogic);
            _thread.onmessage = _listner;
            return _thread;
        }());
    }

    //Trigger happens here
    worker.map(function(_threadRx) {
        var nextQue = _data.pop();
        nextQue.push(toSource(superThread));
        _threadRx.postMessage(nextQue);
    });
};

saltEvent.addEventListener(Stacks.Event, init).trigger(Stacks.PullNext());

//})