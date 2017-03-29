/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var template = can.view(GGRC.mustache_path +
    '/components/tree/tree-widget-container.mustache');
  var QueryAPI = GGRC.Utils.QueryAPI;
  var viewModel = can.Map.extend({
    define: {
      /**
       * Condition that adds into all request to server-side Query API
       */
      additionalFilter: {
        type: String,
        value: ''
      },
      currentFilter: {
        type: String,
        get: function () {
          var additionalFilter = this.attr('additionalFilter');
          return [additionalFilter].join(' AND ');
        }
      },
      pageInfo: {
        type: '*',
        value: {
          current: 1,
          total: null,
          pageSize: 10,
          count: null,
          pageSizeSelect: [10, 25, 50],
          filter: null,
          sortDirection: null,
          sortBy: null,
          disabled: false
        }
      },
      modelName: {
        type: String,
        get: function () {
          return this.attr('model').shortName;
        }
      }


    },
    pageLoader: null,
    registeredFilters: [],
    /**
     *
     */
    model: null,
    /**
     *
     */
    showedItems: [],
    /**
     *
     */
    parentInstance: null,
    /**
     *
     */
    limitDepthTree: 0,
    /**
     * Legacy options which were built for a previous implementation of TreeView based on CMS.Controllers.TreeView
     */
    options: null,
    loadItems: function () {
      var modelName = this.attr('modelName');
      var pageInfo = this.attr('pageInfo');
      var parentInstance = this.attr('parentInstance');
      var params = QueryAPI.buildParams(
        modelName,
        pageInfo,
        {
          type: parentInstance.type,
          id: parentInstance.id,
          operation: 'relevant'
        }
      );
      this.attr('pageLoader').load({data: params})
        .then(function (data) {
          this.attr('showedItems', data.values);
        }.bind(this))
    }
  });

  /**
   *
   */
  GGRC.Components('treeWidgetContainer', {
    tag: 'tree-widget-container',
    template: template,
    viewModel: viewModel,
    init: function () {
      var viewModel = this.viewModel;
      var model = viewModel.attr('model');
      var parentInstance = viewModel.attr('parentInstance');

      viewModel.attr('pageLoader', new GGRC.ListLoaders.TreePageLoader(model, parentInstance));
      viewModel.loadItems();
    },
    events: {
    }
  });
})(window.can, window.GGRC);
