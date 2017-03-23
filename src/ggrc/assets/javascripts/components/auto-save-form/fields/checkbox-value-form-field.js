/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */
(function (can, GGRC) {
  'use strict';

  GGRC.Components('checkboxValueFormField', {
    tag: 'checkbox-value-form-field',
    template: can.view(
      GGRC.mustache_path +
      '/components/auto-save-form/fields/checkbox-value-form-field.mustache'
    ),
    viewModel: {
      define: {
        _value: {
          set: function (newValue, setValue, onError, oldValue) {
            setValue(newValue);
            if (oldValue === undefined) {
              return;
            }
            this.valueChanged(newValue);
          }
        },
        value: {
          set: function (newValue, setValue) {
            setValue(newValue);
            this.attr('_value', newValue);
          }
        }
      },
      fieldId: null,
      valueChanged: function (newValue) {
        this.dispatch({
          type: 'valueChanged',
          fieldId: this.fieldId,
          value: newValue
        });
      }
    }
  });
})(window.can, window.GGRC);
