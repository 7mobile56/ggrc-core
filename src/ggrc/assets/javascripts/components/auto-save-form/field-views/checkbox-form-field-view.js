/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */
(function (can, GGRC) {
  'use strict';

  GGRC.Components('checkboxFormFieldView', {
    tag: 'checkbox-form-field-view',
    template: can.view(
      GGRC.mustache_path +
      '/components/auto-save-form/field-views/checkbox-form-field-view.mustache'
    ),
    viewModel: {
      value: null
    }
  });
})(window.can, window.GGRC);
