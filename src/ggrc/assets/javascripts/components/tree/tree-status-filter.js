/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var StateUtils = GGRC.Utils.State;

  var viewModel = can.Map.extend({
    define: {
      operation: {
        type: String,
        value: 'AND'
      },
      depth: {
        type: Boolean,
        value: false
      },
      useLocalStorage: {
        type: Boolean,
        value: true
      },
      selectedStates: {
        type: '*',
        set: function (selected) {
          this.attr('filterStates').forEach(function (item) {
            if (selected.indexOf(item.value) > -1) {
              item.attr('checked', true);
            }
          });

          this.attr('options.filter',
            StateUtils.statusFilter(selected, '', this.attr('modelName')));
        }
      }
    },
    options: {},
    filters: null,
    filterStates: [],
    modelName: null,
    displayPrefs: null,
    init: function () {
      var options = this.attr('options');
      var filter = this.attr('filter');
      var operation = this.attr('operation');
      var depth = this.attr('depth');
      var filterStates = StateUtils.getStatesForModel(this.attr('modelName'))
        .map(function (state) {
          return {
            value: state
          };
        });

      options.attr('filter', filter);
      options.attr('operation', operation);
      options.attr('depth', depth);

      if (this.filters) {
        this.attr('filters').push(options);
      }

      this.attr('filterStates', filterStates);

      if (this.attr('useLocalStorage')) {
        CMS.Models.DisplayPrefs.getSingleton().then(function (displayPrefs) {
          this.attr('displayPrefs', displayPrefs);

          this.loadTreeStates(this.attr('modelName'));
        }.bind(this));
      }
    },
    loadTreeStates: function (modelName) {
      // Get the status list from local storage
      var savedStateList = this.attr('displayPrefs')
        .getTreeViewStates(modelName);

      if (savedStateList.length === 0) {
        savedStateList = StateUtils.getDefaultStatesForModel(modelName);
      }

      this.attr('selectedStates', savedStateList);
    },
    saveTreeStates: function (selectedStates) {
      var stateToSave;

      // in this case we save previous states
      if (!selectedStates) {
        return;
      }

      stateToSave = selectedStates.map(function (state) {
        return state.value;
      });

      this.attr('selectedStates', stateToSave);

      if (this.attr('useLocalStorage')) {
        this.attr('displayPrefs').setTreeViewStates(this.attr('modelName'),
          stateToSave);
      }
    }
  });

  GGRC.Components('treeStatusFilter', {
    tag: 'tree-status-filter',
    template: '<content/>',
    viewModel: viewModel,
    events: {
      'multiselect-dropdown multiselect:closed': function (el, ev, selected) {
        ev.stopPropagation();
        this.viewModel.saveTreeStates(selected);
        this.viewModel.dispatch('filter');
      }
    }
  });
})(window.can, window.GGRC);
