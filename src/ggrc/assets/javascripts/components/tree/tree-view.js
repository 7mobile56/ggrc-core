/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var template = can.view(GGRC.mustache_path +
    '/components/tree/tree-view.mustache');
  var viewModel = can.Map.extend({
    define: {
    },
    items: null,
    displayAttrs: [],
    loading: false,
    limitDepthTree: 0,
    depthFilter: ''
  });

  GGRC.Components('treeView', {
    tag: 'tree-view',
    template: template,
    viewModel: viewModel,
    events: {
    }
  });
})(window.can, window.GGRC);
