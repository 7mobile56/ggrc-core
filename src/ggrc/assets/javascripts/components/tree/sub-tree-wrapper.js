/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var template = can.view(GGRC.mustache_path +
    '/components/tree/sub-tree-wrapper.mustache');
  var QueryAPI = GGRC.Utils.QueryAPI;
  var Snapshots = GGRC.Utils.Snapshots;
  var CurrentPage = GGRC.Utils.CurrentPage;
  var SUB_TREE_FIELDS = [
    'child_id',
    'child_type',
    'context',
    'email',
    'id',
    'is_latest_revision',
    'name',
    'revision',
    'revisions',
    'selfLink',
    'slug',
    'status',
    'title',
    'type',
    'viewLink',
    'workflow_state'
  ];

  var viewModel = can.Map.extend({
    define: {
      loading: {
        type: Boolean,
        value: false
      },
      notDirectlyExpanded: {
        type: Boolean,
        value: false
      }
    },
    parentModel: 'Control',
    parentId: 20,
    directlyItems: [],
    notDirectlyItems: [],
    expandNotDirectlyRelated: function () {
      var isExpanded = this.attr('notDirectlyExpanded');
      this.attr('notDirectlyExpanded', !isExpanded);
    },
    loadItems: function () {
      var parentType = this.attr('parentModel');
      var parentId = this.attr('parentId');
      var originalOrder = GGRC.Utils.TreeView.getModelsForSubTier(parentType);
      var relevant = {
        type: parentType,
        id: parentId,
        operation: 'relevant'
      };
      var reqParams = originalOrder.map(function (model) {
        return QueryAPI.buildParam(model, {}, relevant, SUB_TREE_FIELDS, null);
      });
      this.attr('loading', true);
      QueryAPI.makeRequest({data: reqParams})
        .then(function (response) {
          var related = CurrentPage.related;
          var needToSplit = CurrentPage.isObjectContextPage();
          var directlyRelated = [];
          var notRelated = [];

          originalOrder.forEach(function (modelName, idx) {
            var values = can.makeArray(response[idx][modelName].values);

            values.forEach(function (source) {
              var relates = related.attr(source.type);
              if (!needToSplit || relates && relates[source.id]) {
                directlyRelated.push({
                  instance: CMS.Models[modelName].model(source)
                });
              } else {
                notRelated.push({
                  instance: CMS.Models[modelName].model(source)
                });
              }
            });
          });
          this.attr('loading', false);
          this.attr('directlyItems', directlyRelated);
          this.attr('notDirectlyItems', notRelated);
        }.bind(this));
    }
  });

  GGRC.Components('subTreeWrapper', {
    tag: 'sub-tree-wrapper',
    template: template,
    viewModel: viewModel,
    init: function () {
      this.viewModel.loadItems();
    },
    events: {
    }
  });
})(window.can, window.GGRC);
