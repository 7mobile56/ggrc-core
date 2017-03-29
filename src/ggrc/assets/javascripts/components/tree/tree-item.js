/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var template = can.view(GGRC.mustache_path +
    '/components/tree/tree-item.mustache');
  var viewModel = can.Map.extend({
    define: {
      extraClasses: {
        type: String,
        get: function () {
          var classes = [];
          var instance = this.attr('instance');

          if (instance.snapshot) {
            classes.push('snapshot');
          }

          if (instance.workflow_state) {
            classes.push('t-' + instance.workflow_state);
          }

          return classes.join(' ');
        }
      },
      expanded: {
        type: Boolean,
        value: false
      }
    },
    instance: null,
    limitDepthTree: 0,
    onExpand: function () {
      var isExpanded = this.attr('expanded');

      this.attr('expanded', !isExpanded);
    }
  });

  GGRC.Components('treeItem', {
    tag: 'tree-item',
    template: template,
    viewModel: viewModel,
    events: {
    }
  });
})(window.can, window.GGRC);
