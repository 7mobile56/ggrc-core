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

          if (this.attr('expanded')) {
            classes.push('open-item');
          }

          return classes.join(' ');
        }
      },
      expanded: {
        type: Boolean,
        value: false
      },
      selectableSize: {
        type: Number,
        get: function () {
          var sizeMap = [1, 1, 1, 1, 2, 2, 2];
          var attrCount = this.attr('displayAttrs').length;

          return attrCount < sizeMap.length ? sizeMap[attrCount] : 3;
        }
      }
    },
    displayAttrs: [],
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
