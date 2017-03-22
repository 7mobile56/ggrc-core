/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */
(function (can, GGRC) {
  'use strict';

  GGRC.Components('richTextValueFormField', {
    tag: 'rich-text-value-form-field',
    template: can.view(
      GGRC.mustache_path +
      '/components/auto-save-form/fields/rich-text-value-form-field.mustache'
    ),
    viewModel: {
      _value: '',
      _oldValue: '',
      focused: false,
      placeholder: '',
      define: {
        value: {
          set: function (newValue, setValue) {
            setValue(newValue);
            this.attr('_value', newValue);
          }
        }
      },
      fieldId: null,
      checkValueChanged: function () {
        var newValue = this.attr('_value');
        var oldValue = this.attr('_oldValue');
        if (newValue !== oldValue) {
          this.valueChanged(newValue);
        }
      },
      valueChanged: function (newValue) {
        this.dispatch({
          type: 'valueChanged',
          fieldId: this.fieldId,
          value: newValue
        });
      },
      onFocus: function () {
        this.attr('focused', true);
        this.attr(
          '_oldValue',
          this.attr('_value')
        );
      },
      onBlur: function () {
        this.attr('focused', false);
        this.checkValueChanged();
      }
    },
    events: {
      '.ql-editor focus': function () {
        this.viewModel.onFocus();
      },
      'rich-text mousedown': function (el, ev) {
        ev.stopPropagation();
      },
      '{window} mousedown': function () {
        if (!this.viewModel.attr('focused')) {
          return;
        }
        this.viewModel.onBlur();
      }
    }
  });
})(window.can, window.GGRC);
