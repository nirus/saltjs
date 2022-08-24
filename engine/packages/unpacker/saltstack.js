function SaltStack(saltyStack) {
    this.EntryPoint = saltyStack.slice(); //Copy
    saltyStack = this.EntryPoint.pop(); //pop the stack
    this.EntryPoint = this.EntryPoint.slice(0, 4);
    //This is the event name : UUID of the user, intelligent right!
    this.Event = this.EntryPoint[3]; //Holds the name of the event

    this.Length = function () { // Getter for stacks to decrypt
        return saltyStack.length;
    };

    //This is to pull the stacks out and pass to the threads to decrypt
    this.PullNext = function () {
        const que = [];
        const count = 3 > saltyStack.length ? saltyStack.length : 3;

        if (saltyStack.length === 0) {
            const copied = this.EntryPoint.slice();
            this.EntryPoint = null;
            return [copied];
        }

        //Making unbeatable
        for (let x = 0; x < count; x++) {
            que.push(saltyStack.shift());
        }

        return que;
    }

}; //This is the _stack got from the wrapper function

export default SaltStack;
