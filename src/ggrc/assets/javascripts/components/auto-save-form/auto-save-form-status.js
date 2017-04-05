/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */
(function (can) {
  'use strict';

  GGRC.Components('autoSaveFormStatus', {
    tag: 'auto-save-form-status',
    template: can.view(
      GGRC.mustache_path +
      '/components/auto-save-form/auto-save-form-status.mustache'
    ),
    viewModel: {
      formSaving: false,
      formAllSaved: false
    }
  });
})(window.can);
