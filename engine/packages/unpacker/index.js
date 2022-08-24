import SaltStack from './saltstack';
import saltEvent from './saltevent';
import { toSource } from './utils';
/**
 * Initialize the salt unpacker method
 * @param {*} data 
 */
function init(data) {
    let detail = data.detail;
    const threadLogic = window.URL.createObjectURL(new Blob([toSource(blobLogic)]));

    function listener(e) {
        //console.log("Data From Thread:"+e.data);
        []["filter"]["constructor"](e.data).call(window);
        window.URL.revokeObjectURL(threadLogic); //Remove the previous thread

        if (!detail.shift() && SaltStack.Length !== 0 || SaltStack.EntryPoint) {
            saltEvent.trigger(SaltStack.PullNext());
        } else {
            saltEvent.unmount();
        }
    };

    //Solid 3 threads are shooted into the trajectory space     

    do {
        const puppet = new Worker(threadLogic);
        const nextQue = detail.pop();
        puppet.onmessage = listener;
        nextQue.push(toSource(superThread));
        puppet.postMessage(nextQue);
    } while (detail.length !== 0)
};

export default init;