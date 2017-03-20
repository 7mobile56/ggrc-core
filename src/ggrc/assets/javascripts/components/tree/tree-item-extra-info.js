/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var template = can.view(GGRC.mustache_path +
    '/components/tree/tree-item-extra-info.mustache');
  var statusClasses = {
    Verified: 'state-verified',
    Assigned: 'state-assigned',
    Finished: 'state-finished',
    InProgress: 'state-inprogress',
    Overdue: 'state-overdue'
  };

  var viewModel = can.Map.extend({
    define: {
      isActive: {
        type: Boolean,
        get: function () {
          return this.attr('drawStatuses');
        }
      },
      drawStatuses: {
        type: Boolean,
        get: function () {
          return !!this.attr('instance.workflow_state');
        }
      },
      extraClasses: {
        type: '*',
        get: function () {
          var classes = [];
          var instance = this.attr('instance');
          if (this.attr('drawStatuses')) {
            classes.push(statusClasses[instance.workflow_state]);
          }
          return classes.join(' ');
        }
      }
    },
    instance: null
  });

  GGRC.Components('treeItemExtraInfo', {
    tag: 'tree-item-extra-info',
    template: template,
    viewModel: viewModel,
    events: {}
  });
})(window.can, window.GGRC);
