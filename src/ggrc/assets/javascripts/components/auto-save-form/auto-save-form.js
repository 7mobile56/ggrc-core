/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */
(function (can, GGRC, $) {
  'use strict';

  var AUTO_SAVE_DELAY = 5000;
  // remove - debug
  var BACKEND_SAVE_DELAY = 3000;
  // end: remove - debug

  GGRC.Components('autoSaveForm', {
    tag: 'auto-save-form',
    template: can.view(
      GGRC.mustache_path +
      '/components/auto-save-form/auto-save-form.mustache'
    ),
    viewModel: {
      saving: false,
      fieldsToSave: new can.Map(),
      fieldsToSaveAvailable: false,
      autoSaveScheduled: false,
      autoSaveAfterSave: false,
      autoSaveTimeoutHandler: null,
      fields: [],
      define: {
        instance: {
          set: function (instance, setValue) {
            setValue(instance);
            this.prepareFormFields(instance);
          }
        }
      },
      fieldValueChanged: function (e) {
        this.fieldsToSave.attr(e.fieldId, e.value);
        this.attr('fieldsToSaveAvailable', true);

        this.triggerAutoSave();
      },
      save: function () {
        var self = this;
        var toSave = this.attr('fieldsToSave').attr();

        this.attr('fieldsToSave', new can.Map());
        this.attr('fieldsToSaveAvailable', false);

        clearTimeout(this.attr('autoSaveTimeoutHandler'));
        this.attr('autoSaveScheduled', false);

        this.attr('saving', true);

        this.__backendSave(toSave)
          .done(function () {
            if (self.attr('autoSaveAfterSave')) {
              self.attr('autoSaveAfterSave', false);
              setTimeout(self.save.bind(self));
            }

            // remove - debug
            self.attr('saved', true);
            setTimeout(function() {
              self.attr('saved', false);
            }, 2000);
            // end: remove - debug
          })
          .always(function () {
            self.attr('saving', false);
          });
      },
      triggerAutoSave: function () {
        if (this.attr('autoSaveScheduled')) {
          return;
        }
        if (this.attr('saving')) {
          this.attr('autoSaveAfterSave', true);
          return;
        }

        this.attr(
          'autoSaveTimeoutHandler',
          setTimeout(this.save.bind(this), AUTO_SAVE_DELAY)
        );
        this.attr('autoSaveScheduled', true);
      },
      saveDisabled: function () {
        return !this.attr('fieldsToSaveAvailable') || this.attr('saving');
      },
      prepareFormFields: function (instance) {
        var fields =
          instance.custom_attribute_values
            .map(function (attr) {
              return {
                type: attr.attributeType,
                id: attr.def.id,
                value: attr.attribute_value,
                title: attr.def.title,
                placeholder: attr.def.placeholder
              };
            });
        this.attr('fields', fields);
      },
      // remove - debug
      __backendSave: function (toSave) {
        var self = this;
        Object.keys(toSave).forEach(function (fieldId) {
          var caValue =
            can.makeArray(self.attr('instance').custom_attribute_values)
              .find(function (item) {
                return item.def.id === Number(fieldId);
              });
          caValue.attr('attribute_value', toSave[fieldId]);
        });

        return this.attr('instance').save();
      }
      // end: remove - debug
    }
  });
})(window.can, window.GGRC, window.jQuery);