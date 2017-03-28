/*!
    Copyright (C) 2017 Google Inc.
    Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

(function (can, $) {
  'use strict';

  /*
    Component abstracts <select> dropdown in HTML.

    It receives `name` of the attribute that should be set and `optionsList`
    with titles and values
   */
  GGRC.Components('dropdown', {
    tag: 'dropdown',
    template: can.view(
      GGRC.mustache_path +
      '/components/dropdown/dropdown.mustache'
    ),
    scope: {
      name: '@',
      className: '@',
      onChange: $.noop,
      noValue: '@',
      noValueLabel: '@',
      controlId: '@',
      /*
        Options list should be an `array` of object containing `title` and `value`
        [{
          title: `title`
          value: `value`
        }]
       */
      optionsList: null,
      options: function () {
        var none = [{
          title: this.attr('noValueLabel') || 'None',
          value: ''
        }];
        var list = can.map(this.attr('optionsList') || [], function (option) {
          if (_.isString(option)) {
            return {
              value: option,
              title: option
            };
          }
          return option;
        });
        if (this.attr('noValue')) {
          return none.concat(list);
        }
        return list;
      },
      isDisabled: false
    },
    init: function (element, options) {
      var $el = $(element);
      var attrVal = $el.attr('is-disabled');
      var disable;
      var scope = this.scope;

      // By default CanJS evaluates the component element's attribute values in
      // the current context, but we want to support passing in literal values
      // as well. We thus inspect some of the directly and override what CanJS
      // initializes in scope.
      if (attrVal === '' || attrVal === 'false') {
        disable = false;
      } else if (attrVal === 'true') {
        disable = true;
      } else {
        disable = Boolean(scope.attr('isDisabled'));
      }

      scope.attr('isDisabled', disable);
    }
  });
})(window.can, window.can.$);
