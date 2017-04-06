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
          var attrCount = this.attr('selectedColumns').length;
          var result = 3;

          if (attrCount < 4) {
            result = 1;
          } else if (attrCount < 7) {
            result = 2;
          }

          return result;
        }
      },
      selectableColumns: {
        type: '*',
        get: function () {
          var fixedColumns = this.attr('mandatory') || [];

          return this.attr('selectedColumns').filter(function (attr) {
            return fixedColumns.indexOf(attr.attr_sort_field) < 0;
          });
        }
      }
    },
    selectedColumns: [],
    mandatory: [],
    instance: null,
    limitDepthTree: 0,
    onExpand: function () {
      var isExpanded = this.attr('expanded');

      this.attr('expanded', !isExpanded);
    },
    select: function ($element) {
      var instance = this.attr('instance').instance;
      can.trigger($element, 'selectTreeItem', [$element, instance]);
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
