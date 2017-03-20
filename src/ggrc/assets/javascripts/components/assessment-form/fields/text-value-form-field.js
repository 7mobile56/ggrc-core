/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */
(function (can, GGRC) {
  'use strict';

  GGRC.Components('textValueFormField', {
    tag: 'text-value-form-field',
    template: can.view(
      GGRC.mustache_path +
      '/components/assessment-form/fields/text-value-form-field.mustache'
    ),
    viewModel: {
      define: {
        _value: {
          set: function (newValue, setValue, onError, oldValue) {
            setValue(newValue);
            if (oldValue === undefined ||
                newValue === oldValue) {
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
      name: '',
      valueChanged: function (newValue) {
        this.dispatch({
          type: 'valueChanged',
          name: this.name,
          value: newValue
        });
      }
    }
  });
})(window.can, window.GGRC);
