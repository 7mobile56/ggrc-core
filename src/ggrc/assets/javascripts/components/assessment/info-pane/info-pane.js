/*!
 Copyright (C) 2017 Google Inc., authors, and contributors
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';
  var tpl = can.view(GGRC.mustache_path +
    '/components/assessment/info-pane/info-pane.mustache');

  /**
   * Assessment Specific Info Pane View Component
   */
  GGRC.Components('assessmentInfoPane', {
    tag: 'assessment-info-pane',
    template: tpl,
    viewModel: {
      define: {
        mappedSnapshots: {
          Value: can.List
        },
        controls: {
          get: function () {
            return this.attr('mappedSnapshots')
              .filter(function (item) {
                return item.child_type === 'Control';
              });
          }
        },
        relatedInformation: {
          get: function () {
            return this.attr('mappedSnapshots')
              .filter(function (item) {
                return item.child_type !== 'Control';
              });
          }
        },
        comments: {
          Value: can.List
        },
        instance: {}
      },
      getSnapshotQuery: function () {
        var relevantFilters = [{
          type: this.attr('instance.type'),
          id: this.attr('instance.id'),
          operation: 'relevant'
        }];
        return GGRC.Utils.QueryAPI
          .buildParam('Snapshot', {}, relevantFilters, [], []);
      },
      getCommentsQuery: function () {
        var relevantFilters = [{
          type: this.attr('instance.type'),
          id: this.attr('instance.id'),
          operation: 'relevant'
        }];
        return GGRC.Utils.QueryAPI
          .buildParam('Comment', {}, relevantFilters, [], []);
      },
      requestQuery: function (query) {
        var dfd = can.Deferred();
        this.attr('isLoading', true);
        GGRC.Utils.QueryAPI
          .batchRequests(query)
          .done(function (response) {
            var type = Object.keys(response)[0];
            var values = response[type].values;
            dfd.resolve(values);
          })
          .fail(function () {
            dfd.resolve([]);
          })
          .always(function () {
            this.attr('isLoading', false);
          }.bind(this));
        return dfd;
      },
      loadSnapshots: function () {
        var query = this.getSnapshotQuery();
        return this.requestQuery(query);
      },
      loadComments: function () {
        var query = this.getCommentsQuery();
        return this.requestQuery(query);
      },
      prepareFormFields: function () {
        this.attr('formFields',
          GGRC.Utils.CustomAttributes.convertValuesToFormFields(
            this.attr('instance.custom_attribute_values')
          )
        );
      },
      saveForm: function (formFields) {
        var caValues = can.makeArray(
          this.attr('instance.custom_attribute_values')
        );
        Object.keys(formFields).forEach(function (fieldId) {
          var caValue =
            caValues
              .find(function (item) {
                return item.def.id === Number(fieldId);
              });
          caValue.attr('attribute_value',
            GGRC.Utils.CustomAttributes.convertToCaValue(
              caValue.attr('attributeType'),
              formFields[fieldId]
            )
          );
        });

        return this.attr('instance').save();
      }
    },
    init: function () {
      this.viewModel.attr('mappedSnapshots')
        .replace(this.viewModel.loadSnapshots());
      this.viewModel.attr('comments')
        .replace(this.viewModel.loadComments());
      this.viewModel.prepareFormFields();
    },
    events: {
      '{viewModel.instance} related_destinations': function () {
        console.info('Was related_destinations called!!!!', arguments);
      }
    }
  });
})(window.can, window.GGRC);
