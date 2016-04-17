//style files
import '../../www/assets/style/main.css'
import '../../www/assets/style/modal.css'

import 'jquery'
import 'lodash';
import 'moment';

import 'angular';
import 'angular-sanitize';
import 'angular-animate';
import 'angular-ui-router';
import './libs/ionic/release/js/ionic';
import './libs/ionic/release/js/ionic-angular';
import './libs/location/location';
import 'angular-local-storage';
import 'ng-cordova/dist/ng-cordova';
import 'angular-auto-validate/dist/jcs-auto-validate';


//----------------app files-----------------------------------------------------
import './core/core';
import './routes/routes';
import './common/common';

import mainModule from './main-module';
import IonicBoot from './bootstrap';

IonicBoot.bootstrap(mainModule);