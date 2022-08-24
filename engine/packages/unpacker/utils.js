export function toSource(func) {
    const body = func.toString();
    return (body.substring(body.indexOf("{") + 1, body.lastIndexOf("}"))).trim();
}

export function blobLogic() {
    self.addEventListener("message", function (e) {
        const arg = [].slice.call(e.data);
        const context = []["filter"]["constructor"](["n", "i", "r", "u", "s"], arg.pop()).apply(this, arg);
        self.postMessage(context);
        //self.postMessage(e.data);
        self.close();
    }, false);
};