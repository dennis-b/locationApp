import {Inject,Service} from 'annotations/ng-decorator';

@Service({
    serviceName: 'f7Service'
})
@Inject()
class F7Service {
    constructor() {
        this.f7 = new Framework7();
    }

    getF7() {
        return this.f7;
    }
}



