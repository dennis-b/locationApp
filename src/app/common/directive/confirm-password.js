import {Directive} from 'annotations/directive-decorator';
import {Inject} from 'annotations/ng-decorator';

@Directive({
    selector: 'confirmPassword'
})
//
class ConfirmPasswordRule {
    constructor(defaultErrorMessageResolver) {
        this.require = 'ngModel';
        this.scope = {
            confirmPassword: "=confirmPassword"
        };

        defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
            errorMessages['confirmPassword'] = 'Passwords do not match';
        });
    }

    link(scope, element, attributes, ngModel) {
        ngModel.$validators.confirmPassword = function (modelValue) {
            return modelValue === scope.confirmPassword;
        };

        scope.$watch('confirmPassword', function () {
            ngModel.$validate();
        });
    }
}

export default ConfirmPasswordRule