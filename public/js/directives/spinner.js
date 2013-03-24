bikerider.directive('spinner', ['$rootScope', function(rootScope) {

  return function(scope, el, attrs) {      
    scope.$on('Spinner.msg', function(e, msg) {
      el.find('p').text(msg)
    })
  }
}])