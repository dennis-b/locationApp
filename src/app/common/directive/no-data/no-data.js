// import {Component} from 'angular2/core'
import {NG2Directive, View} from 'annotations/directive-decorator';

// @NG2Directive({selector: 'no-data'})
@View({
    selector: 'no-data',
    template: require('./no-data.html')
})
export class NoDataComp {


    onAddCategories(){
        
    }
}

