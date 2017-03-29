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
          }).reduce(function (filter, options) {
            var operation = options.operation || 'AND';

            if (filter.length) {
              filter += ' ' + operation + ' ' + options.filter;
            } else {
              filter = options.filter;
            }

            return filter;
          }, additionalFilter);
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
          return GGRC.Utils.State.hasFilter(this.attr('modelName'))
        }
      }

    },
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
    parentInstance: null,
    /**
     *
     */
    limitDepthTree: 0,
    /**
     * Legacy options which were built for a previous implementation of TreeView based on CMS.Controllers.TreeView
     */
    options: null,
    loading: false,
    /**
     *
     */
    displayPrefs: {},
    selectAttrList: {},
    displayAttrList: {},
    filters: [],
    loadItems: function () {
      var modelName = this.attr('modelName');
      var pageInfo = this.attr('pageInfo');
      var sortingInfo = this.attr('sortingInfo');
      var parentInstance = this.attr('parentInstance');
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
        {
          type: parentInstance.type,
          id: parentInstance.id,
          operation: 'relevant'
        }
      );

      pageInfo.attr('disabled', true);
      this.attr('loading', true);

      this.attr('pageLoader').load({data: params})
        .then(function (data) {
          var total = data.total;
          this.attr('showedItems', data.values);
          this.attr('pageInfo.total', total);
          this.attr('pageInfo.count',
            Math.ceil(total / this.attr('pageInfo.pageSize')));
          this.attr('pageInfo.disabled', false);
          this.attr('loading', false);

        }.bind(this))
    },
    display: function () {
      console.log('display for ' + this.attr('modelName'));
      return this.loadItems();
    },
    initDisplayOptions: function () {
      var i;
      var savedAttrList;
      var selectAttrList = [];
      var displayAttrList = [];
      var model = this.attr('model');
      var modelName = model.model_singular;
      var modelDefinition = model().class.root_object;
      var mandatoryAttrNames;
      var displayAttrNames;
      var attr;

      // get standard attrs for each model
      can.each(model.tree_view_options.attr_list ||
        can.Model.Cacheable.attr_list, function (item) {
        if (!item.attr_sort_field) {
          item.attr_sort_field = item.attr_name;
        }
        selectAttrList.push(item);
      });

      selectAttrList.sort(function (a, b) {
        if (a.order && !b.order) {
          return -1;
        } else if (!a.order && b.order) {
          return 1;
        }
        return a.order - b.order;
      });
      // Get mandatory_attr_names
      mandatoryAttrNames = model.tree_view_options.mandatory_attr_names ?
        model.tree_view_options.mandatory_attr_names :
        can.Model.Cacheable.tree_view_options.mandatory_attr_names;

      // get custom attrs
      can.each(GGRC.custom_attr_defs, function (def, i) {
        var obj;
        if (def.definition_type === modelDefinition &&
          def.attribute_type !== 'Rich Text') {
          obj = {};
          obj.attr_title = obj.attr_name = def.title;
          obj.display_status = false;
          obj.attr_type = 'custom';
          obj.attr_sort_field = obj.attr_name;
          selectAttrList.push(obj);
        }
      });


      // Get the display attr_list from local storage
      savedAttrList = this.displayPrefs.getTreeViewHeaders(modelName);

      // this.loadTreeStates(modelName);

      if (!savedAttrList.length) {
        // Initialize the display status, Get display_attr_names for model
        displayAttrNames = model.tree_view_options.display_attr_names ?
          model.tree_view_options.display_attr_names :
          can.Model.Cacheable.tree_view_options.display_attr_names;

        if (GGRC.Utils.CurrentPage.isMyAssessments()) {
          displayAttrNames.push('updated_at');
        }

        for (i = 0; i < selectAttrList.length; i++) {
          attr = selectAttrList[i];

          attr.display_status = displayAttrNames.indexOf(attr.attr_name) !== -1;
          attr.mandatory = mandatoryAttrNames.indexOf(attr.attr_name) !== -1;
        }
      } else {
        // Mandatory attr should be always displayed in tree view
        can.each(mandatoryAttrNames, function (attrName) {
          savedAttrList.push(attrName);
        });

        for (i = 0; i < selectAttrList.length; i++) {
          attr = selectAttrList[i];
          attr.display_status = savedAttrList.indexOf(attr.attr_name) !== -1;
          attr.mandatory = mandatoryAttrNames.indexOf(attr.attr_name) !== -1;
        }
      }

      // Create display list
      can.each(selectAttrList, function (item) {
        if (!item.mandatory && item.display_status) {
          displayAttrList.push(item);
        }
      });

      // console.log(selectAttrList);
      // console.log(displayAttrList);

      this.attr('selectAttrList', selectAttrList);
      this.attr('displayAttrList', displayAttrList);
      // this.setup_column_width();
      // this.init_child_tree_display(model);
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

      CMS.Models.DisplayPrefs.getSingleton().then(function (displayPrefs) {
        viewModel.attr('displayPrefs', displayPrefs);

        viewModel.initDisplayOptions();
      }.bind(this));

      viewModel.attr('pageLoader',
        new GGRC.ListLoaders.TreePageLoader(model, parentInstance));
    },
    events: {
      '{viewModel.pageInfo} current': function () {
        this.viewModel.loadItems();
      },
      '{viewModel.pageInfo} pageSize': function () {
        this.viewModel.loadItems();
      }
    }
  });
})(window.can, window.GGRC);
