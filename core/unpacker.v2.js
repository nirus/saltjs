//(function(n, i, r, u, s) {	
    var Stacks = (arguments[4] instanceof Array) && (new function(_stack){
        var _persistentStack = [].slice.call(_stack);
        
        this.Value = function(){
            return _persistentStack;
        };
        
        //This is the event name : UUID of the user, intelligent right!
        this.Event = (function(){
           return  _persistentStack[0][_persistentStack[0].length - 1];
        })();
        
        this.PullNext = function(count){
            
            if(count === 0 || count === undefined){
                return _persistentStack.shift();
            }
            
            if(count > _persistentStack.length){
                count = _persistentStack.length;
            }
            
            //Making unbeatable
            
            var que = [];
            for(var x=0;x<count; x++){
                que.push(_persistentStack.shift());
            }
                                
            return que;
        }
        
    }(arguments[4])), init, saltEvent; //This is the _stack and init function
    
    //Filler for function to source
    
    function toSource(func){
        var body = func.toString();
        return (body.substring(body.indexOf("{")+1,body.lastIndexOf("}"))).trim();
    }
    
    /*
        * utility to mimic event listeners implemented by Browsers
                   
        * 'saltEvent' object contains all the event handled by the salt for triggering the thread
          Global variable for event handling within the scope
   
    */
     saltEvent =  new function(){
        var qued = {};
        this.addEventListener = function(eType, cb){
            qued[eType] = cb;
        }
        
        this.removeEventListener = function(eType){
            delete qued[eType];
        }
        
        this.ClearAll = function(){
            qued = {};
        }
        
        this.dispatchEvent = function(eObj){
            qued[eObj.event].apply({"event": eObj.event},[eObj.data]);
        }
        
        this.customEvent = function(evt, data){
            this.event = evt;
            this.data = data;
        }
    };       
          
    
    /*
        * Super thread that does all the job    
    */
    function superThread (){
        var arg = Array.prototype.slice.call(arguments), //This is for Uglify optimization
            n = arg[0], i = arg[1], r = arg[2], u = arg[3], s = arg[4];
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
    
    function blobLogic (){
        self.addEventListener("message",function(e){
            var arg = Array.prototype.slice.call(e.data);
                _superThread = []["filter"]["constructor"](["n","i","r","u","s"], arg.pop());
            self.postMessage(_superThread.apply(this, arg));
            //self.postMessage(e.data);
            self.close();
        },false);
    };
    
    function syntheticEvent(data){
        /*var cEvt = new CustomEvent(Stacks.Event, {detail:Stacks.PullNext(3)});
        window.dispatchEvent(cEvt);*/
        var cEvt = new saltEvent.customEvent(Stacks.Event, data || {detail:Stacks.PullNext(3)});
        saltEvent.dispatchEvent(cEvt);
    };
    
      /*
        * OEP starts here
        * Slice picks up the OEP code and executes first ignoring 's' variable referred as Stack
    */
    
    (init = function init(data){
        var _data = data.detail, worker = [],
            threadLogic = window.URL.createObjectURL(new Blob([toSource(blobLogic)])),
            _listner =  function(e){
                //console.log("Data From Thread:"+e.data);
                []["filter"]["constructor"]( e.data ).call(window);
                window.URL.revokeObjectURL(threadLogic);
                
                /*
                    Logic to restart the next 3 threads
                    Remove the listener if all the execution is finished, biscuit to hackers
                */
                _data.shift() === undefined && Stacks.Value().length !== 0 && syntheticEvent() 
                || Stacks.Value().length === 0 && saltEvent.removeEventListener(Stacks.Event);
            };
            
        //Solid 3 threads are shooted into the trajectory space     
        for(var i = 0; i < _data.length; i++){
            worker.push(function(){
                var _thread = new Worker(threadLogic);
                _thread.onmessage = _listner;
                return _thread;
            }());
        }
        
        //Trigger happens here
        worker.map(function(_threadRx){
            var nextQue = _data.pop();
                nextQue.push(toSource(superThread));
            _threadRx.postMessage(nextQue);
        });
    })({detail:Stacks.PullNext(3)});
        
    saltEvent.addEventListener(Stacks.Event ,init);
            
//})