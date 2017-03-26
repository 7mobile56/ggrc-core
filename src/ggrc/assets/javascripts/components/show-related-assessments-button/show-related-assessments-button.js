/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var template = can.view(GGRC.mustache_path +
    '/components/show-related-assessments-button' +
    '/show-related-assessments-button.mustache');

  can.Component.extend({
    tag: 'show-related-assessments-button',
    template: template,
    viewModel: {
      define: {
        cssClasses: {
          type: String,
          get: function () {
            return !this.attr('resetStyles') ?
              'btn btn-draft btn-extra-gray ' + this.attr('extraBtnCSS') : '';
          }
        },
        resetStyles: {
          type: Boolean,
          value: false
        },
        showTitle: {
          type: Boolean,
          value: true
        },
        showIcon: {
          type: Boolean,
          value: false
        },
        title: {
          type: String,
          get: function () {
            return this.attr('text') || 'Assessments';
          }
        }
      },
      instance: null,
      state: {
        open: false
      },
      extraBtnCSS: '@',
      text: '@',
      modalTitle: 'Related Assessments',
      showRelatedAssessments: function () {
        this.attr('state.open', true);
      },
      // Temporary put this logic on the level of Component itself
      isAllowedToShow: function () {
        var type = this.attr('instance.type');
        return type === 'Control' || type === 'Objective';
      }
    }
  });
})(window.can, window.GGRC);
