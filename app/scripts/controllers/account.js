'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Provides rudimentary account management functions.
 */
angular.module('devFlowApp')
  .controller('AccountCtrl', function ($scope, user, simpleLogin, fbutil, $timeout, $rootScope, $http) {
    $scope.user = user;
    $rootScope.user = user;
    var uid = $rootScope.user.uid;
    $scope.logout = simpleLogin.logout;
    $scope.messages = [];
    loadProfile(user);

    $http.get('https://devflow.firebaseio.com/users.json')
    .success(function(data) {
        for (var key in data) {
            var obj = data[key];
            if (key.toLowerCase() === uid.toLowerCase()) {
                $scope.user = obj;
            }
        }
    });

    $scope.changePassword = function(oldPass, newPass, confirm) {
      $scope.err = null;
      if( !oldPass || !newPass ) {
        error('Please enter all fields');
      }
      else if( newPass !== confirm ) {
        error('Passwords do not match');
      }
      else {
        simpleLogin.changePassword(user.email, oldPass, newPass)
          .then(function() {
            success('Password changed');
          }, error);
      }
    };

    $scope.changeEmail = function(pass, newEmail) {
      $scope.err = null;
      simpleLogin.changeEmail(pass, newEmail)
        .then(function(user) {
          loadProfile(user);
          success('Email changed');
        })
        .catch(error);
    };

    function error(err) {
      alert(err, 'danger');
    }

    function success(msg) {
      alert(msg, 'success');
    }

    function alert(msg, type) {
      var obj = {text: msg, type: type};
      $scope.messages.unshift(obj);
      $timeout(function() {
        $scope.messages.splice($scope.messages.indexOf(obj), 1);
      }, 10000);
    }

    function loadProfile(user) {
      if( $scope.profile ) {
        $scope.profile.$destroy();
      }
      fbutil.syncObject('users/'+user.uid).$bindTo($scope, 'profile');
    }
  });