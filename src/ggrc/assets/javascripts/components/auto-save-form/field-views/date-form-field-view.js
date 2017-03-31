/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */
(function (can, GGRC) {
  'use strict';

  GGRC.Components('dateFormFieldView', {
    tag: 'date-form-field-view',
    template: can.view(
      GGRC.mustache_path +
      '/components/auto-save-form/field-views/date-form-field-view.mustache'
    ),
    viewModel: {
      value: null
    }
  });
})(window.can, window.GGRC);
