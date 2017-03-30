/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */
(function (can, GGRC) {
  'use strict';

  GGRC.Components('autoSaveFormField', {
    tag: 'auto-save-form-field',
    template: can.view(
      GGRC.mustache_path +
      '/components/auto-save-form/auto-save-form-field.mustache'
    ),
    viewModel: {
      type: null,
      value: null,
      fieldId: null,
      placeholder: '',
      options: [],
      fieldValueChanged: function (e) {
        this.dispatch({
          type: 'valueChanged',
          fieldId: e.fieldId,
          value: e.value
        });
      }
    }
  });
})(window.can, window.GGRC);
