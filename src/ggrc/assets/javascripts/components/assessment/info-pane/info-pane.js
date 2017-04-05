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
        isSaving: {
          type: 'boolean',
          value: false
        },
        isLoading: {
          type: 'boolean',
          value: false
        },
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
        documents: {
          Value: can.List
        },
        instance: {}
      },
      getQuery: function (type) {
        var relevantFilters = [{
          type: this.attr('instance.type'),
          id: this.attr('instance.id'),
          operation: 'relevant'
        }];
        return GGRC.Utils.QueryAPI
          .buildParam(type, {}, relevantFilters, [], []);
      },
      getCommentQuery: function () {
        return this.getQuery('Comment');
      },
      getSnapshotQuery: function () {
        return this.getQuery('Snapshot');
      },
      getDocumentQuery: function () {
        return this.getQuery('Document');
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
        var query = this.getCommentQuery();
        return this.requestQuery(query);
      },
      loadDocuments: function () {
        var query = this.getDocumentQuery();
        return this.requestQuery(query);
      },
      updateRelatedItems: function () {
        this.attr('mappedSnapshots')
          .replace(this.loadSnapshots());
        this.attr('comments')
          .replace(this.loadComments());
        this.attr('documents')
          .replace(this.loadDocuments());
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
      this.viewModel.updateRelatedItems();
    },
    events: {
      '{viewModel.instance} related_destinations': function () {
        this.viewModel.updateRelatedItems();
      }
    }
  });
})(window.can, window.GGRC);
