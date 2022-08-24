
function saltEvent() {

    const qued = {}; 
    const self = this;

    if(!new.target){
        return new saltEvent();
    }

    self.addEventListener = function (eType, cb) {
        qued[eType] = cb;
        return self;
    }

    self.removeEventListener = function (eType) {
        delete qued[eType];
    }

    self.unmount = function () {
        qued = {};
        qued = null;
        return self;
    }

    self.dispatchEvent = function (eObj) {
        qued[eObj.event].apply({
            "event": eObj.event
        }, [eObj.data]);
        return self;
    }

    function pureSaltEvent(evt, data) {
        this.event = evt;
        this.data = data;
    }

    self.mount = function (data) {
        self.dispatchEvent(new pureSaltEvent(Stacks.Event, {
            detail: data
        }));
        return self;
    }    
}

export default saltEvent;