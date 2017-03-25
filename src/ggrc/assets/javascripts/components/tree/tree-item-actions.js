/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var template = can.view(GGRC.mustache_path +
    '/components/tree/tree-item-actions.mustache');

  var viewModel = can.Map.extend({
    define: {
    },
    maximizeObject: function (scope, el, ev) {
      var tree = el.closest('.cms_controllers_tree_view_node');
      var node = tree.control();
      ev.preventDefault();
      ev.stopPropagation();
      if (node) {
        node.select(true);
      }
    },
    openObject: function (scope, el, ev) {
      ev.stopPropagation();
    },
    instance: null,
    childOptions: null,
    addItem: null,
    allowMapping: null,
    init: function () {
      console.log('test');
    }
  });

  GGRC.Components('treeItemActions', {
    tag: 'tree-item-actions',
    template: template,
    viewModel: viewModel,
    events: {}
  });
})(window.can, window.GGRC);
