import {Inject, Service} from 'annotations/ng-decorator';
import AppUtils from "../../core/utils/app-utils";

@Service({
    serviceName: 'authService'
})
@Inject('localStorageService', 'Parse')
class AuthService {
    constructor(localStorageService, Parse) {
        this.localStorageService = localStorageService;
        this.Parse = Parse;
    }


    login(userName, password) {
        return this.Parse.User.logIn(userName, password);
    }

    signUp(userModel) {
        let user = new this.Parse.User();
        AuthService.setUserProps(user, userModel, true);
        return user.signUp(null);

    }

    updateUser(userModel, changePass) {
        let user = this.Parse.User.current();
        AuthService.setUserProps(user, userModel, changePass);
        if (changePass) {
            return this.updateUserAndPassword(userModel.password, userModel.email, user.toJSON());
        }
        return user.save();

    }

    static setUserProps(user, userModel, changePass) {
        user.set("username", userModel.email);
        if (changePass) {
            user.set("password", userModel.password);
        }
        user.set("changePass", false);
        user.set("email", userModel.email);
        // user.set("noFeedback", userModel.noFeedback);
        user.set("name", userModel.name);
        user.set("country", JSON.parse(angular.toJson(userModel.country)));
        user.set("age", userModel.age);
        user.set("weight", AuthService.getWeight(userModel));
        user.set("height", AuthService.getHeight(userModel));
        user.set("weightUnits", userModel.weightUnits);
        user.set("heightUnits", userModel.heightUnits);
        user.set("gender", userModel.gender);
    }

    static getWeight(userModel) {
        return AppUtils.isTypeInLb(userModel.weightUnits) ? AppUtils.lbToKg(userModel.weight) : userModel.weight;
    }

    static getHeight(userModel) {
        return AppUtils.isTypeInInch(userModel.heightUnits) ? AppUtils.inchToCm(userModel.height) : userModel.height;
    }


    changePass(userData) {
        var email = this.Parse.User.current().get('email');
        return this.updateUserAndPassword(userData.password, email, null);
    }

    updateUserAndPassword(password, email, user) {
        let _this = this;
        return this.Parse.User.logOut().then(function () {
            return _this.Parse.Cloud.run('updateUserAndPassword', {
                    newPass: password,
                    email: email,
                    user: user
                })
                .then(function (user) {
                    localStorage.clear();
                    return _this.Parse.User.logIn(user.get('username'), password);
                });
        });
    }


    logout() {
        this.localStorageService.clearAll();
        localStorage.clear();
        return this.Parse.User.logOut();
    }

    isLoggedIn() {
        return !_.isEmpty(this.localStorageService.get('user'));
    }

    forgotPassword(email) {
        return this.Parse.Cloud.run('forgotPassword', {email: email});
    }

    sendRegistrationEmail(email, name) {
        return this.Parse.Cloud.run('sendRegistrationEmail', {email: email, name: name});
    }


}