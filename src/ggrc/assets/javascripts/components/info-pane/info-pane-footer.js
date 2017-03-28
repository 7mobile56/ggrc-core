/*!
 Copyright (C) 2017 Google Inc., authors, and contributors
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';
  var tpl = can.view(GGRC.mustache_path +
    '/components/info-pane/info-pane-footer.mustache');

  /**
   * Specific Info Pane Footer Component
   */
  GGRC.Components('infoPaneFooter', {
    tag: 'info-pane-footer',
    template: tpl,
    viewModel: {
      createdAt: '',
      modifiedAt: '',
      modifiedBy: {}
    }
  });
})(window.can, window.GGRC);
