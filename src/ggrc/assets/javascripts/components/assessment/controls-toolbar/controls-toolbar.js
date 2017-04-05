/*!
 Copyright (C) 2017 Google Inc., authors, and contributors
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';
  var tpl = can.view(GGRC.mustache_path +
    '/components/assessment/controls-toolbar/controls-toolbar.mustache');

  can.Component.extend({
    tag: 'assessment-controls-toolbar',
    template: tpl,
    viewModel: {
      instance: null,
      formState: null,
      state: {
        open: false
      },
      modalTitle: 'Related Assessments',
      showRelatedResponses: function () {
        this.attr('state.open', true);
      },
      onFormSave: function () {
        this.dispatch('onFormSave');
      }
    }
  });
})(window.can, window.GGRC, window.CMS);
