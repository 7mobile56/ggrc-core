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
    onPreview: function (event) {
      var selected = event.element.closest('.sub-item-content');

      this.select(selected);
    },
    select: function ($element) {
      var instance = this.attr('instance');

      if (instance instanceof CMS.Models.Person && !this.attr('result')) {
        this.attr('resultDfd').then(function () {
          can.trigger($element, 'selectTreeItem', [$element, instance]);
        });
      } else {
        can.trigger($element, 'selectTreeItem', [$element, instance]);
      }
    },
    limitDepthTree: 0,
    instance: null,
    /**
     * Result from mapping
     */
    result: null,
    resultDfd: null,
    extraCss: '@'
  });

  GGRC.Components('subTreeItem', {
    tag: 'sub-tree-item',
    template: template,
    viewModel: viewModel,
    events: {
      inserted: function () {
        var viewModel = this.viewModel;
        var instance = viewModel.attr('instance');
        var resultDfd;

        if (instance instanceof CMS.Models.Person) {
          resultDfd = viewModel.makeResult(instance).then(function (result) {
            viewModel.attr('result', result);
          });

          viewModel.attr('resultDfd', resultDfd);
        }
      }
    }
  });
})(window.can, window.GGRC);
