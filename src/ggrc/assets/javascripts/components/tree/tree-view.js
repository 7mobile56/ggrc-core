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
    parentInstance: null,
    model: null,
    selectedColumns: [],
    mandatory: [],
    loading: false,
    limitDepthTree: 0,
    depthFilter: '',
    _loader: null,
    makeResult: function (instance) {
      return this.attr('_loader').getResultFromMapping(instance);
    }
  });

  GGRC.Components('treeView', {
    tag: 'tree-view',
    template: template,
    viewModel: viewModel,
    events: {
      inserted: function () {
        var model = this.viewModel.attr('model');
        var parentInstance = this.viewModel.attr('parentInstance');

        this.viewModel.attr('_loader',
          new GGRC.ListLoaders.TreeBaseLoader(model, parentInstance));
      }
    }
  });
})(window.can, window.GGRC);
