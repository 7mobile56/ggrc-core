/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var template = can.view(GGRC.mustache_path +
    '/components/tree/tree-widget-container.mustache');
  var QueryAPI = GGRC.Utils.QueryAPI;
  var TreeViewUtils = GGRC.Utils.TreeView;

  var viewModel = can.Map.extend({
    define: {
      /**
       * Condition that adds into all request to server-side Query API
       */
      additionalFilter: {
        type: String,
        value: ''
      },
      /**
       *
       */
      currentFilter: {
        type: String,
        get: function () {
          var filters = can.makeArray(this.attr('filters'));
          var additionalFilter = this.attr('additionalFilter');

          return filters.filter(function (options) {
            return options.filter;
          }).reduce(this._concatFilters, additionalFilter);
        }
      },
      modelName: {
        type: String,
        get: function () {
          return this.attr('model').shortName;
        }
      },
      statusFilterVisible: {
        type: Boolean,
        get: function () {
          return GGRC.Utils.State.hasFilter(this.attr('modelName'));
        }
      },
      cssClasses: {
        type: String,
        get: function () {
          var classes = [];

          if (this.attr('loading')) {
            classes.push('loading');
          }

          return classes.join(' ');
        }
      },
      parent_instance: {
        type: '*',
        get: function () {
          return this.attr('options').parent_instance;
        }
      },
      allow_mapping: {
        type: Boolean,
        get: function () {
          var allowMapping = true;
          var options = this.attr('options');

          if ('allow_mapping' in options) {
            allowMapping = options.allow_mapping;
          }

          return allowMapping;
        }
      },
      allow_creating: {
        type: Boolean,
        get: function () {
          var allowCreating = true;
          var options = this.attr('options');

          if ('allow_creating' in options) {
            allowCreating = options.allow_creating;
          }

          return allowCreating;
        }
      },
      addItem: {
        type: String,
        get: function () {
          return this.attr('options').add_item_view ||
            this.attr('model').tree_view_options.add_item_view;
        }
      },
      hideImportExport: {
        type: Boolean,
        get: function () {
          var Snapshots = GGRC.Utils.Snapshots;
          var parentInstance = this.attr('parent_instance');
          var model = this.attr('model');

          return Snapshots.isSnapshotScope(parentInstance) &&
            Snapshots.isSnapshotModel(model.model_singular);
        }
      }
    },
    /**
     *
     */
    allow_mapping_or_creating: null,
    /**
     *
     */
    pageLoader: null,
    /**
     * Information about current page of tree
     * @param current {Number} - Number of page
     * @param total {Number} - Number of items on the Server-side which satisfy current filter
     * @param pageSize {Number} - Number of items per page
     * @param count {Number} - Number of pages
     * @param pageSizeSelect {Array} -
     * @param disabled {Boolean} -
     */
    pageInfo: {
      current: 1,
      total: null,
      pageSize: 10,
      count: null,
      pageSizeSelect: [10, 25, 50],
      disabled: false
    },
    sortingInfo: {
      sortDirection: null,
      sortBy: null
    },
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
    limitDepthTree: 0,
    /**
     * Legacy options which were built for a previous implementation of TreeView based on CMS.Controllers.TreeView
     */
    options: null,
    $el: null,
    loading: false,
    /**
     *
     */
    displayPrefs: {},
    columns: {
      selected: [],
      available: []
    },
    filters: [],
    loaded: null,
    loadItems: function () {
      var modelName = this.attr('modelName');
      var pageInfo = this.attr('pageInfo');
      var sortingInfo = this.attr('sortingInfo');
      var parent = this.attr('parent_instance');
      var filter = this.attr('currentFilter');
      var params;
      var page = {
        current: pageInfo.current,
        pageSize: pageInfo.pageSize,
        sortBy: sortingInfo.sortBy,
        sortDirection: sortingInfo.sortDirection,
        filter: filter
      };

      params = QueryAPI.buildParams(
        modelName,
        page,
        TreeViewUtils.makeRelevantExpression(modelName, parent.type, parent.id)
      );

      pageInfo.attr('disabled', true);
      this.attr('loading', true);

      return this.attr('pageLoader').load({data: params})
        .then(function (data) {
          var total = data.total;
          this.attr('showedItems', data.values);
          this.attr('pageInfo.total', total);
          this.attr('pageInfo.count',
            Math.ceil(total / this.attr('pageInfo.pageSize')));
          this.attr('pageInfo.disabled', false);
          this.attr('loading', false);
        }.bind(this));
    },
    display: function () {
      if (!this.attr('loaded')) {
        this.attr('loaded', this.loadItems());
      }

      return this.attr('loaded');
    },
    setColumnsConfiguration: function () {
      var columns = TreeViewUtils.getColumnsForModel(
        this.attr('model').model_singular,
        this.attr('displayPrefs')
      );

      this.attr('columns.available', columns.available);
      this.attr('columns.selected', columns.selected);
      this.attr('columns.mandatory', columns.mandatory);
    },
    onUpdateColumns: function (event) {
      var selectedColumns = event.columns;
      var columns = TreeViewUtils.setColumnsForModel(
        this.attr('model').model_singular,
        selectedColumns,
        this.attr('displayPrefs')
      );

      this.attr('columns.selected', columns.selected);
    },
    onSort: function (event) {
      var field = event.field;
      var sortingInfo = this.attr('sortingInfo');
      var order;

      if (field !== sortingInfo.sortBy) {
        sortingInfo.attr('sortBy', field);
        sortingInfo.attr('sortDirection', 'desc');
      } else {
        order = sortingInfo.sortDirection === 'asc' ? 'desc' : 'asc';
        sortingInfo.attr('sortDirection', order);
      }

      this.attr('pageInfo.current', 1);
      this.loadItems();
    },
    onFilter: function () {
      this.attr('pageInfo.current', 1);
      this.loadItems();
    },
    getDepthFilter: function () {
      var filters = can.makeArray(this.attr('filters'));

      return filters.filter(function (options) {
        return options.filter && options.depth;
      }).reduce(this._concatFilters, '');
    },
    initCount: function () {
      var $el = this.attr('$el');
      var counts = TreeViewUtils.getCounts();
      var countsName = this.attr('model').shortName;

      if ($el) {
        can.trigger($el, 'updateCount', [counts.attr(countsName)]);
      }

      counts.on(countsName, function (ev, newVal, oldVal) {
        can.trigger($el, 'updateCount', [newVal]);
      });
    },
    /**
     * Concatenation active filters.
     *
     * @param {String} filter - Parsed filter string
     * @param {Object} options - Filter parameters
     * @return {string} - Result of concatenation filters.
     * @private
     */
    _concatFilters: function (filter, options) {
      var operation = options.operation || 'AND';

      if (filter.length) {
        filter += ' ' + operation + ' ' + options.filter;
      } else {
        filter = options.filter;
      }

      return filter;
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
      var options = viewModel.attr('options');
      var parentInstance = viewModel.attr('parent_instance');
      var allowMapping = viewModel.attr('allow_mapping');
      var allowCreating = viewModel.attr('allow_creating');

      function setAllowMapping() {
        var isAccepted = parentInstance.attr('status') === 'Accepted';
        var admin = Permission.is_allowed('__GGRC_ADMIN__');

        viewModel.attr('allow_mapping_or_creating',
          (admin || !isAccepted) && (allowMapping || allowCreating));
      }

      CMS.Models.DisplayPrefs.getSingleton().then(function (displayPrefs) {
        viewModel.attr('displayPrefs', displayPrefs);

        if (parentInstance && 'status' in parentInstance) {
          setAllowMapping();
          parentInstance.bind('change', setAllowMapping);
        } else {
          viewModel.attr('allow_mapping_or_creating',
            allowMapping || allowCreating);
        }

        viewModel.setColumnsConfiguration();
      });

      viewModel.attr('pageLoader',
        new GGRC.ListLoaders.TreePageLoader(model, parentInstance));
    },
    events: {
      '{viewModel.pageInfo} current': function () {
        this.viewModel.loadItems();
      },
      '{viewModel.pageInfo} pageSize': function () {
        this.viewModel.loadItems();
      },
      ' childTreeTypes': function () {
      },
      ' selectTreeItem': function (el, ev, selectedItem, instance) {
        el.find('.item-active').removeClass('item-active');
        selectedItem.addClass('item-active');
      },
      inserted: function () {
        this.viewModel.attr('$el', this.element);

        this.viewModel.initCount();
      }
    }
  });
})(window.can, window.GGRC);
