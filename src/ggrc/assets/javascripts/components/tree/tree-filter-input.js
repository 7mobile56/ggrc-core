/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var template = can.view(GGRC.mustache_path +
    '/components/tree/tree-filter-input.mustache');
  var viewModel = can.Map.extend({
    define: {
      filter: {
        type: String,
        set: function (value) {
          this.attr('options.filter', value);
        }
      },
      operation: {
        type: String,
        value: 'AND'
      },
      depth: {
        type: Boolean,
        value: false
      }
    },
    options: {},
    filters: null,
    init: function () {
      var options = this.attr('options');
      var filter = this.attr('filter');
      var operation = this.attr('operation');
      var depth = this.attr('depth');

      options.attr('filter', filter);
      options.attr('operation', operation);
      options.attr('depth', depth);

      if (this.filters) {
        this.attr('filters').push(options);
      }
    },
    submit: function () {
      this.dispatch('filter');
    },
    reset: function ($element) {
      $element.closest('tree-filter-input').find('.tree-filter__input').val('');
      this.submit();
    }
  });

  GGRC.Components('treeFilterInput', {
    tag: 'tree-filter-input',
    template: template,
    viewModel: viewModel,
    events: {
    }
  });
})(window.can, window.GGRC);
