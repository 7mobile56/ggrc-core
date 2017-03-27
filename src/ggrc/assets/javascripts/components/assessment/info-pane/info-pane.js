/*!
 Copyright (C) 2017 Google Inc., authors, and contributors
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';
  var tpl = can.view(GGRC.mustache_path +
    '/components/assessment/info-pane/info-pane.mustache');

  /**
   * Assessment Specific Info Pane View Component
   */
  GGRC.Components('assessmentInfoPane', {
    tag: 'assessment-info-pane',
    template: tpl,
    viewModel: {
      define: {
        isLocked: {
          type: 'htmlbool',
          value: false
        }
      },
      instance: {}
    }
  });
})(window.can, window.GGRC);
