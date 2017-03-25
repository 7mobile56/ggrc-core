/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var template = can.view(GGRC.mustache_path +
    '/components/tree/tree-item-map.mustache');

  var viewModel = can.Map.extend({
    define: {
      title: {
        type: String,
        value: 'Map to this Object'
      },
      model: {
        type: '*',
        get: function () {
          return this.attr('instance.model');
        }
      },
      objectParams: {
        type: String,
        get: function () {
          var instance = this.attr('instance');
          var params = {
            section: {
              id: instance.id,
              title: instance.title,
              description: instance.description
            }
          };

          return JSON.stringify(params);
        }
      }
    },
    instance: null,
    cssClasses: null
  });

  GGRC.Components('treeItemMap', {
    tag: 'tree-item-map',
    template: template,
    viewModel: viewModel,
    events: {}
  });
})(window.can, window.GGRC);
