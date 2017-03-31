/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */
(function (can, GGRC) {
  'use strict';

  GGRC.Components('richTextFormFieldView', {
    tag: 'rich-text-form-field-view',
    template: can.view(
      GGRC.mustache_path +
      '/components/auto-save-form/field-views' +
      '/rich-text-form-field-view.mustache'
    ),
    viewModel: {
      value: null
    }
  });
})(window.can, window.GGRC);
