var ENUMS = require("./core/enum.js");
var Salt = require('./salt.js');
Salt.salt({
    key:"niranjan",
    buildfor:ENUMS.BUILD_TARGET.modern,
    output:ENUMS.FILE.MERGE,
    folder:"files",
    fname:"out",
    protection: ENUMS.ATTACH.NO
},["files/file1.js","files/file2.js","files/file3.js", "files/file4.js"]);