/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */
(function (can) {
  'use strict';

  GGRC.Components('autoSaveFormActions', {
    tag: 'auto-save-form-actions',
    template: can.view(
      GGRC.mustache_path +
      '/components/auto-save-form/auto-save-form-actions.mustache'
    ),
    viewModel: {
      formEditMode: false,
      formSaving: false,
      formFieldsToSaveAvailable: false,
      saveDisabled: function () {
        return !this.attr('formFieldsToSaveAvailable') ||
               this.attr('formSaving');
      },
      viewDisabled: function () {
        return this.attr('formFieldsToSaveAvailable') ||
               this.attr('formSaving');
      },
      view: function () {
        this.attr('formEditMode', false);
      },
      edit: function () {
        this.attr('formEditMode', true);
      },
      save: function () {
        this.dispatch('onSave');
      }
    }
  });
})(window.can);
