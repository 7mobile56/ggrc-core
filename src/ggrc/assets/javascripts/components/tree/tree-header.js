/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var template = can.view(GGRC.mustache_path +
    '/components/tree/tree-header.mustache');
  var viewModel = can.Map.extend({
    define: {
      selectableSize: {
        type: Number,
        get: function () {
          var sizeMap = [1, 1, 1, 1, 2, 2, 2];
          var attrCount = this.attr('displayAttrs').length;

          return attrCount < sizeMap.length ? sizeMap[attrCount] : 3;
        }
      }
    },
    displayAttrs: [],
    sortingInfo: null,
    onOrderChange: function ($element) {
      var field = $element.data('field');

      this.dispatch({
        type: 'sort',
        field: field
      });
    }
  });

  GGRC.Components('treeHeader', {
    tag: 'tree-header',
    template: template,
    viewModel: viewModel,
    events: {
    },
    helpers: {
      sortIcon: function (attr, sortBy, sortDirection){
        attr = Mustache.resolve(attr);
        sortBy = Mustache.resolve(sortBy);
        sortDirection = Mustache.resolve(sortDirection);

        if (!sortBy) {
          return 'sort';
        } else if (sortBy === attr) {
          return 'sort-' + sortDirection;
        } else {
          return '';
        }
      }
    }
  });
})(window.can, window.GGRC);
