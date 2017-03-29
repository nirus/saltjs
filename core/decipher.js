/*This will return the decryting routine that will be shipped to the JS*/
module.exports  = function(buildfor){
		var /*jsfuck = require("jsfuck").JSFuck,
			uglify = require("uglify-js"),*/
			fs = require("fs"),
			ENUMS = require("./enum.js");
		/*
		 * unpacker.v2.js - new browsers
		 * unpacker.js - Older browsers like ie9
		 * Minified versions are picked up for performance boost(these files are inside the 'Minified' folder) are 
		   generated at server startup
		*/
		//var unpacker = ["unpacker.v2.js", "unpacker.js"];
		var unpacker = ["unpacker.v2.min.js", "unpacker.min.js"];
		var evalBuilder = function(str){return '[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]][([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]('+str+')'},
		    returnStatement = (buildfor == ENUMS.BUILD_TARGET.old) ? ";return retValue" : "",
		    //code = evalBuilder('["n","i","r","u","s"],'+jsfuck.encode((uglify.minify("./core/"+unpacker[buildfor])).code + returnStatement));
		    code = evalBuilder('["n","i","r","u","s"],'+ fs.readFileSync("./minified/"+unpacker[buildfor],"utf8") + returnStatement);
		    //code = fs.readFileSync("./minified/test.js","utf8"); //Testing purpose
		return code;
}