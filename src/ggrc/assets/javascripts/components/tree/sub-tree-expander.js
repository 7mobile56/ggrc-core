/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can) {
  'use strict';

  GGRC.Components('subTreeExpander', {
    tag: 'sub-tree-expander',
    template: '<content/>',
    viewModel: {
      define: {
        contextName: {
          type: String,
          get: function () {
            return GGRC.Utils.CurrentPage.getPageType();
          }
        }
      },
      expandNotDirectly: function () {
        this.dispatch('expandNotDirectly');
      },
      expanded: null,
      disabled: false,
      onChangeState: null,
      onExpand: function () {
        this.attr('expanded', !this.attr('expanded'));
        this.onChangeState(this.attr('expanded'));
      }
    }
  });
})(window.can);
