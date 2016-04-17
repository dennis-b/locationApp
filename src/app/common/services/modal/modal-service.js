/**
 * Created by Dennis on 24/02/2016.
 */
import {Inject, Service} from 'annotations/ng-decorator';
import template from './base-modal.html';

@Service({
    serviceName: 'modalService'
})
@Inject('$ionicModal', '$rootScope', '$q')
class ModalService {
    constructor($ionicModal, $rootScope, $q) {
        this.$ionicModal = $ionicModal;
        this.$rootScope = $rootScope;
        this.$q = $q;
    }

    show(params) {
        params = params || {};
        let q = this.$q.defer();
        var scope = this.$rootScope.$new(true);
        scope.data = {
            bind: params.bind,
            title: params.title,
            text: params.text,
            okText: params.okText || 'OK',
            cancelButton: params.showCancel || true,
            cancelText: params.cancelText || 'CANCEL',
            showCancel: true,
            okCallback: function () {
                if (params.okCallback) {
                    params.okCallback();
                }
                q.resolve({ok: true, bind: scope.data.bind});
                scope.modal.hide();
                scope.modal.remove();

            },
            cancelCallback: function () {
                if (params.cancelCallback) {
                    params.cancelCallback();
                }
                q.resolve({ok: false, bind: scope.data.bind});
                scope.modal.hide();
                scope.modal.remove();
            }
        };


        var modal = this.$ionicModal.fromTemplate(template, {
            scope: scope,
            animation: 'fade-in-scale'
        });

        scope.modal = modal;
        modal.show();
        return q.promise;

    }
}



