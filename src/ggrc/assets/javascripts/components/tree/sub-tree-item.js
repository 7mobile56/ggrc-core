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
      },
      cssClasses: {
        type: String,
        get: function () {
          var classes = [];
          var instance = this.attr('instance');

          if (instance.snapshot) {
            classes.push('snapshot');
          }

          if (this.attr('extraCss')) {
            classes = classes.concat(this.attr('extraCss').split(' '));
          }

          return classes.join(' ');
        }
      },
      title: {
        type: String,
        get: function () {
          var instance = this.attr('instance');
          return instance.title || instance.description_inline ||
            instance.name || instance.email || '';
        }
      }
    },
    onExpand: function () {
      var isExpanded = this.attr('expanded');

      this.attr('expanded', !isExpanded);
    },
    select: function ($element) {
      var instance = this.attr('instance');
      can.trigger($element, 'selectTreeItem', [$element, instance]);
    },
    limitDepthTree: 0,
    instance: null,
    extraCss: '@'
  });

  GGRC.Components('subTreeItem', {
    tag: 'sub-tree-item',
    template: template,
    viewModel: viewModel,
    events: {
    }
  });
})(window.can, window.GGRC);
