/*!
 Copyright (C) 2017 Google Inc., authors, and contributors
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var tpl = can.view(GGRC.mustache_path +
    '/components/assessment/mapped-objects/' +
    'mapped-comments.mustache');
  var tag = 'assessment-mapped-comments';
  /**
   * Assessment specific mapped controls view component
   */
  can.Component.extend({
    tag: tag,
    template: tpl,
    viewModel: {
      define: {
        noItemsText: {
          type: 'string',
          value: ''
        }
      },
      mappedItems: []
    }
  });
})(window.can, window.GGRC);
