/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */
(function (can, GGRC, $) {
  'use strict';

  var AUTO_SAVE_DELAY = 5000;

  GGRC.Components('autoSaveForm', {
    tag: 'auto-save-form',
    template: can.view(
      GGRC.mustache_path +
      '/components/auto-save-form/auto-save-form.mustache'
    ),
    viewModel: {
      saving: false,
      allSaved: false,
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

            self.attr('allSaved', true);
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

        this.attr('allSaved', false);

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
        var self = this;
        var fields =
          instance.custom_attribute_values
            .map(function (attr) {
              var options = attr.def.multi_choice_options;
              return {
                type: attr.attributeType,
                id: attr.def.id,
                value: self.__getFieldValue(attr.attributeType, attr.attribute_value),
                title: attr.def.title,
                placeholder: attr.def.placeholder,
                options: options && _.isString(options) ? options.split(',') : []
              };
            });
        this.attr('fields', fields);
      },
      // todo
      __getFieldValue: function (type, value, valueObj) {
        if (type === 'checkbox') {
          return value === '1';
        }

        if (type === 'input') {
          if (!value) {
            return null;
          }
          return value.trim();
        }

        if (type === 'person') {
          if (valueObj) {
            return valueObj;
          }
          return null;
        }

        if (type === 'dropdown') {
          if (_.isNull(value) || _.isUndefined(value)) {
            return '';
          }
        }
        return value;
      },
      __fromFieldValue: function (type, value) {
        if (type === 'checkbox') {
          return value ? 1 : 0;
        }

        if (type === 'person') {
          if (value && value instanceof can.Map) {
            value = value.serialize();
            return 'Person:' + value.id;
          }
          return 'Person:None';
        }
        return value || null;
      },
      __backendSave: function (toSave) {
        var self = this;
        Object.keys(toSave).forEach(function (fieldId) {
          var caValue =
            can.makeArray(self.attr('instance').custom_attribute_values)
              .find(function (item) {
                return item.def.id === Number(fieldId);
              });
          caValue.attr('attribute_value',
            self.__fromFieldValue(caValue.attr('attributeType'), toSave[fieldId])
          );
        });

        return this.attr('instance').save();
      }
      // end: todo
    }
  });
})(window.can, window.GGRC, window.jQuery);
