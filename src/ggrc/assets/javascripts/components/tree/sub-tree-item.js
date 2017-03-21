/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var template = can.view(GGRC.mustache_path +
    '/components/tree/sub-tree-item.mustache');
  var viewModel = can.Map.extend({
    define: {
      expanded: {
        type: Boolean,
        value: false
      }
    },
    onExpand: function () {
      var isExpanded = this.attr('expanded');

      this.attr('expanded', !isExpanded);
    },
    limitDepthTree: 0,
    instance: null
  });

  GGRC.Components('subTreeItem', {
    tag: 'sub-tree-item',
    template: template,
    viewModel: viewModel,
    events: {
    }
  });
})(window.can, window.GGRC);
