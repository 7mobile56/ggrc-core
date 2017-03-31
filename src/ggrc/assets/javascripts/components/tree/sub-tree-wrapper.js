/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var template = can.view(GGRC.mustache_path +
    '/components/tree/sub-tree-wrapper.mustache');
  var TreeViewUtils = GGRC.Utils.TreeView;
  var CurrentPage = GGRC.Utils.CurrentPage;

  var viewModel = can.Map.extend({
    define: {
      loading: {
        type: Boolean,
        value: false
      },
      notDirectlyExpanded: {
        type: Boolean,
        value: false
      },
      needToSplit: {
        type: Boolean,
        get: function () {
          return CurrentPage.isObjectContextPage();
        }
      },
      notResult: {
        type: Boolean,
        value: false
      },
      drawRelated: {
        type: Boolean,
        value: false
      },
      /**
       *
       */
      showMore: {
        type: Boolean,
        value: false
      },
      isOpen: {
        type: Boolean,
        set: function (newValue, setValue) {
          var isReady = this.attr('dataIsReady');

          if (!isReady && newValue) {
            this.loadItems().then(function () {
              setValue(newValue);
            })
          } else {
            setValue(newValue);
          }
        }
      }
    },
    dataIsReady: false,
    limitDepthTree: 0,
    parentModel: null,
    parentId: null,
    directlyItems: [],
    notDirectlyItems: [],
    expandNotDirectlyRelated: function () {
      var isExpanded = this.attr('notDirectlyExpanded');
      this.attr('notDirectlyExpanded', !isExpanded);
    },
    loadItems: function () {
      var parentType = this.attr('parentModel');
      var parentId = this.attr('parentId');

      this.attr('loading', true);

      return TreeViewUtils.loadItemsForSubTier(parentType, parentId)
        .then(function (result) {
          this.attr('loading', false);
          this.attr('directlyItems', result.directlyItems);
          this.attr('notDirectlyItems', result.notDirectlyItems);
          this.attr('dataIsReady', true);
          this.attr('showMore', result.showMore);

          if (!result.directlyItems.length && !result.notDirectlyItems.length) {
            this.attr('notResult', true);
          }
        }.bind(this));
    }
  });

  GGRC.Components('subTreeWrapper', {
    tag: 'sub-tree-wrapper',
    template: template,
    viewModel: viewModel,
    events: {
    }
  });
})(window.can, window.GGRC);
