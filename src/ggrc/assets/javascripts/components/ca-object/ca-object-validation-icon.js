/*!
 Copyright (C) 2017 Google Inc., authors, and contributors
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (can, GGRC) {
  'use strict';

  var tpl = can.view(GGRC.mustache_path +
    '/components/ca-object/ca-object-validation-icon.mustache');
  var tag = 'ca-object-validation-icon';
  /**
   * State object to present possible icons for validation
   */
  var icons = {
    noValidation: 'fa-check-circle',
    empty: 'fa-asterisk validation-icon-empty',
    valid: 'fa-check validation-icon-valid',
    invalid: 'fa-times validation-icon-invalid'
  };

  /**
   * Assessment specific validation icon component
   */
  can.Component.extend({
    tag: tag,
    template: tpl,
    viewModel: {
      define: {
        validation: {},
        iconCls: {
          value: icons.noValidation,
          get: function () {
            var icon = icons.noValidation;

            if (this.attr('validation.mandatory')) {
              icon = this.attr('validation.empty') ? icons.empty : icons.valid;
            }
            /* This validation is required for DropDowns with required attachments */
            if (!this.attr('validation.valid')) {
              icon = icons.invalid;
            }
            return icon;
          }
        }
      }
    }
  });
})(window.can, window.GGRC);
