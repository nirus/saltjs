(function(universal) {

	/*Constants*/
	const FILE_EXTN = ".salt.js",
		FILE_MAIN_PATH = "./",
		FILE_READ_FORMAT = 'utf8',
		ENUMS = require("./core/enum.js");

	"use strict";

	//Promisify global ES6 filler
	require('es6-promise').polyfill();

	//Color for console priinting
	require("colors");


	/*
		import dependencies		
	*/

	var /*uglify = require("uglify-js"),*/
		fs = require("fs"),
		decipherBoby = require("./core/decipher.js");

	/*
		Description:
		This is Encryption routine
	
		Syntax:
		Encrypt(string, key, UUID);
	*/

	function Encrypt(word1, key, UUID) {
		var result = [],
			scope2 = 0,
			letters = null;
		key.length != 15 &&
			(function() {
				var pad = "";
				for (var i = 0; i < 15 - key.length; i++) {
					pad = pad.concat("0");
				}
				key = key + pad;
			})();

		for (var scope1 = 0; scope1 < word1.length; scope1++) {
			var salt = -1;
			if (key.charCodeAt(scope2) % 2) {
				salt = 1;
			}
			letters = (parseInt(word1.charCodeAt(scope1).toString(36), 36) + salt).toString(36);
			result.push(letters.length == 1 ? "0" + letters : letters); //Handling space
			scope2++;
			if (scope2 >= key.length) {
				scope2 = 0;
			}
		}

		//console.log('Encryted:'+JSON.stringify((new CipherBuilder(key))	(result.join(""))));
		return (new CipherBuilder(key, UUID))(result.join(""));

	};

	/*
		Description:
		This function helps the library to build the ciphered javascript files
	
		Syntax:
		1: new CipherBuilder (key)
		2: Encrypted string
	*/

	function CipherBuilder(key, UUID) {
		var build = {
				n: [],
				i: [],
				r: [],
				u: null,
				s: ![]
			},
			distributor = function(str) {
				var scope1 = 0;

				while (true) {

					str.charAt(scope1) !== undefined && build.n.push(str.charAt(scope1)) && scope1++; //distributor	        

					str.charAt(scope1) !== undefined && build.i.push(str.charAt(scope1)) && scope1++; //distributor

					str.charAt(scope1) !== undefined && build.r.push(str.charAt(scope1)) && scope1++; //distributor

					if (scope1 >= str.length)
						break;

				}
			};

		distributor(key);
		//build.u = (key.length >>> 0).toString(2);
		return function(eString) {
			distributor(eString);
			build.n = build.n.join("");
			build.i = build.i.join("");
			build.r = build.r.join("");
			//build.s = "Nirus";
			//build.s = UUID.toString();
			return build;
		};
	};


	/*
		Description:
		The Function constructor formats the encrypted objects for write
	
		Syntax:
		FormatThis( ENCRYPTED OBJECT )
	*/

	function FormatThis(encObj, buildfor, OEPformat, protect) {
		var code, debugProtection = "";

		protect = protect || ENUMS.ATTACH.NO; //Defaulting the parameter

		if (protect) {
			/*debugProtection = uglify.minify("./core/protection.js").code;
			debugProtection = debugProtection.substring(0, debugProtection.length - 1) + " && ";*/
			/*this is to remove the trailing semicolon generated by uglify*/
			debugProtection = fs.readFileSync("./minified/protection.min.js", "utf8") + " && ";
		}

		if (!OEPformat) {

			code = "('" + encObj.n + "','" + encObj.i + "','" + encObj.r + "','" + encObj.u + "','" + encObj.s + "')";
			if (buildfor == ENUMS.BUILD_TARGET.old) {
				code = code + "[([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(![]+[])[+!+[]]+(![]+[])[!+[]+!+[]]+(![]+[])[!+[]+!+[]]](this)";
			}

			return debugProtection.concat(decipherBoby(buildfor).concat(code));

		} else {

			("SINGLE" in OEPformat) && (code = debugProtection.concat(decipherBoby(buildfor).concat("('" + encObj.n + "','" + encObj.i + "','" + encObj.r + "','" + encObj.u + "','N!ru$')")));

			("INIT" in OEPformat) && (code = debugProtection.concat(decipherBoby(buildfor).concat("('" + encObj.n + "','" + encObj.i + "','" + encObj.r + "','" + encObj.u + "',[")));

			("STACKIT" in OEPformat) && (code = "['" + encObj.n + "','" + encObj.i + "','" + encObj.r + "','" + encObj.u + "','" + encObj.s + "'],");

			("END" in OEPformat) && (code = "['" + encObj.n + "','" + encObj.i + "','" + encObj.r + "','" + encObj.u + "','" + encObj.s + "']])");

			return code;
		}

		//throw new Error("Invalid OEP Format option");
	};

	/*
		Description:
		The Function Reads a file asynchronously and prepares the encrypted version
	
		Syntax:
		ReadAndEncrypt( FILE_NAME, KEY_TO_ENCRYPT )
	*/

	function ReadAndEncrypt(file, key, UUID, buildfor, OEPformat, protect) {
		var defer = new Promise(function(resolve, reject) {
			fs.readFile(file, FILE_READ_FORMAT, function(err, data) {
				if (err) {
					reject(err.message);
				}
				else {
					console.log('Success file read:' + file);
					resolve(FormatThis(Encrypt(data, key, UUID), buildfor, OEPformat, protect)); //parameters Same as write
				}
			});
		});

		defer.catch(function() {
			console.log("Unable to read the file:" + file);
		});

		return defer;
	};

	/*
		Description:
		The Function to write to a file
	
		Syntax:
		Write( FILE_NAME )
	*/

	function Write(file) {
		console.log('Writing File name:' + file);
		return fs.existsSync(file) === true ? fs.appendFile : fs.writeFileSync; //deliberatelty targetting the async operation while append
	};

	/*
		Description:
		The Function to map read to write function
	
		Syntax:
		var f = MappingIO( KEY_TO_ENCRYPT);
		f(FILE_NAME);
	*/

	function MappingIO(salty) {
		return function(file) {
			var _key = salty.key,
				_buildFor = salty.buildfor,
				_protect = salty.protection;
			//var writeFileName = (salty.output === ENUMS.FILE.SEPARATE) ? (file.substring(0, file.length - 3)).concat(FILE_EXTN) : salty.fname.concat(FILE_EXTN);
			var writeFileName = (salty.output === ENUMS.FILE.SEPARATE) ? (file.substring(0, file.length - 3)).concat(FILE_EXTN) : salty.fname;
			return ReadAndEncrypt(file, _key, salty.UUID, _buildFor, salty.OEPformat, _protect)
				.then(function(data) {
					(Write(writeFileName))(writeFileName, data, function(err){
						if(err){
							console.log("Error while writing to the file: ".red, err);
						}
					});
				});
		};
	}

	/*
		OEP writer
	*/

	function Encloser(opt, obj, protect) {
		console.log("Encloser:" + opt.file);
		var stream = Encrypt(fs.readFileSync(opt.file, "utf8"), opt.key, opt.UUID),
			writeFileName = opt.fname /*.concat(FILE_EXTN)*/ ;

		Write(writeFileName)(writeFileName, FormatThis(stream, opt.buildfor, obj, protect), function(err){
			if(err){
				console.log("Error occured in 'Encloser' function while writing: ".red, err);
			}
		});
	};


	/*
		This function contains the stack of error check conditions
	*/
	function CheckErrorConditions(salty) {
		if (salty.key.length > 15) {
			throw new Error("Key length exceeds 15 characters".red);
			//return;
		}

		if (salty.output == ENUMS.FILE.MERGE && !salty.fname) {
			throw new Error("Provide merge file name with key 'fname'".red);
			//return;
		}

		if (salty.output == ENUMS.FILE.MERGE && salty.buildfor == ENUMS.BUILD_TARGET.old) {
			throw new Error("This option is not supported: You cannot merge the files building for old browsers, they should be seperate. Please check 'output' & 'buildfor' options".red);
			//return;
		}

		/*if (!salty.folder) {
			throw new Error("Provide source folder of your JS files".red);
			return;
		}*/
	};

	/*
		Description:
		Global interface API
	
		Syntax:
		salt( KEY_TO_ENCRYPT, FILE/FILES_ARRAY)
	*/

	universal.salt = function(salty, files, resolve, reject) {

		try {

			files = !(files instanceof Array) ? [files] : files;

			/*
				Check error conditions
				This function throws error message to the below Catch block
			*/
			CheckErrorConditions(salty);

			//Entrypoint variables
			var mapped, EOF = null;

			/*
				*This is a special code that checks if you are trying to build for one file using mordern
				browser cofig and modify to build as old browser code because its one and the same. Sorry buddy!
			*/
			/*if(files.length === 1){
				salty.output = ENUMS.FILE.SEPARATE;
				salty.buildfor = ENUMS.BUILD_TARGET.old;
			}*/

			if (salty.output === ENUMS.FILE.MERGE) { //This is the place where all the logic for thread distribution happens
				//Default value for stacking the code
				if (files.length === 1) {
					salty.OEPformat = { "SINGLE": true };
				} else {
					salty.OEPformat = { "STACKIT": true};
				}

				/*
				 * This is to make sure the output file is a *.salt.js extension with a full path
				 */

				salty.fname = salty.folder + "/" + ((salty.fname.substr(salty.fname.length - 3, salty.fname.length).toLowerCase() === ".js") ? salty.fname.substring(0, salty.fname.length - 3) + FILE_EXTN : salty.fname + FILE_EXTN);

				//This is a Enclosure method which writes the entrypoint code
				/*
					This is a sync operation so dont worry!
				*/
				Encloser({
					file: files.shift(),
					fname: salty.fname,
					buildfor: salty.buildfor,
					key: salty.key,
					UUID: salty.UUID
				}, salty.OEPformat.SINGLE && salty.OEPformat || { "INIT": true}, salty.protection);

				//Call the resolve method after processing only one file
				/*
					This is a special case boss. Here only one file is processed in mordern config
				*/
				if (salty.OEPformat.SINGLE) {
					resolve && resolve(salty.fname);
					return; //Just cut the crap and return here please
				}

				/*If this passes all the above conditions
				  then the files to be procesed are more than 1*/
				if (files.length == 1) {
					Encloser({
						file: files.pop(),
						fname: salty.fname,
						buildfor: salty.buildfor,
						key: salty.key,
						UUID: salty.UUID
					}, { "END": true });
                    
					resolve && resolve(salty.fname);
					console.log('Finished the job!'.green);
				} else {
					EOF = files.pop();
				}
			}

			if (files.length !== 0) {
				mapped = files.map(MappingIO(salty));
				Promise.all(mapped).then(function() {					
					EOF && Encloser({
								file: EOF,
								fname: salty.fname,
								buildfor: salty.buildfor,
								key: salty.key,
								UUID: salty.UUID
							}, { "END": true });
					
					//Incase of seperate file compression
					if (salty.output === ENUMS.FILE.SEPARATE) {
						salty.fname = [];
						files.forEach(function(element, index, array) {
							salty.fname.push((function() {
								var fname = element.substr(element.length - 3, element.length).toLowerCase() === ".js" ? element.substring(0, element.length - 3) + FILE_EXTN : element + FILE_EXTN;
								return salty.folder + "/" + fname;
							})());
						});
					}

					resolve && resolve(salty.fname);

					console.log('Finished the job!'.green);
				});
			}

		} catch (e) {
			reject && reject(e.message);
			console.log("Error Occured:".red + e.message + "\r");
		}
	};

	//This is a wrapper method that returns encrypted text
	universal.toTxt = function(file, key, UUID) {
		return ReadAndEncrypt(file, key, UUID, ENUMS.BUILD_TARGET.old);
	};


	//Promise version of the Salt API
	universal.AsPromise = function(salty, files) {
		return new Promise(function(resolve, reject) {
			return universal.salt.apply(universal, [salty, files, resolve, reject]); // Safe wrapping
		});
	};

})(module.exports);