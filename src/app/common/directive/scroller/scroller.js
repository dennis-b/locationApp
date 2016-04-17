import {Directive} from 'annotations/directive-decorator';
import {Inject} from 'annotations/ng-decorator';

@Directive({
    selector: 'lagScroller'
})
//
class Scroller {
    constructor(f7Service) {
        this.require = '?ngModel';
        this.f7Service = f7Service;
        this.template = '<div><input class="hide" type="hidden"/></div>';
        this.scope = {
            wheels: "=wheels",
            height: "=height",
            onScrollSelect: "&onScrollSelect",
            model: "=ngModel"
        };
    }

    link(scope, element, attrs, ngModel) {
        if (!ngModel) return; // do nothing if no ng-model
        var picker = this.f7Service.getF7().picker({
            input: element.find('input'),
            container: element,
            toolbar: false,
            rotateEffect: true,
            value: scope.model,
            cols: scope.wheels,
            onChange: function (p, values, displayValues) {
                if (p.initialized) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(values);
                        scope.onScrollSelect({val: values});
                        //ngModel.$setViewValue(val);
                    });
                }
            }

        });

        // Specify how UI should be updated
        ngModel.$render = render;

        function render() {
            if (ngModel.$modelValue) {
                picker.setValue(scope.model, 0);
                element.find('input').val(ngModel.$viewValue);
            }
        }


    }
}

export default Scroller