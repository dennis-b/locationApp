/**
 * Created by Dennis on 13/01/2016.
 */
import {Inject, Service} from 'annotations/ng-decorator';

@Service({
    serviceName: 'validationDomModifier'
})
@Inject()
class ValidationService {

    constructor() {
        this.hasErrorClass = 'has-error';
        this.fieldErrorClass = 'field-error';
        this.key = 'validationDomModifier';
    }

    makeDefault(el) {
        this.reset(this.findParentLabel(el));
    }

    reset(el) {
        el.removeClass(this.hasErrorClass);
        var nextElement = el.next();
        if (nextElement !== undefined && nextElement.hasClass(this.fieldErrorClass)) {
            nextElement.remove();
        }
    }

    findParentLabel(el) {
        var parent = el;
        for (var i = 0; i <= 3; i += 1) {
            if (parent !== undefined && parent[0] !== undefined && parent[0].tagName === 'LABEL') {
                break;
            } else if (parent !== undefined) {
                parent = el.closest('label.form-item');
            }
        }

        return parent;
    }

    makeValid(el) {
        this.reset(this.findParentLabel(el));
    }

    makeInvalid(el, errorMsg) {
        var parent = this.findParentLabel(el);
        this.reset(parent);
        parent.addClass(this.hasErrorClass);

        if (parent.attr('show-error') == 'false') {
            return;
        }

        var errorTextEl = angular.element('<div class="' + this.fieldErrorClass + '">' + errorMsg + '</div>');
        parent.after(errorTextEl);
    }
}



