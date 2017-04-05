/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

(function (GGRC, can) {
  'use strict';

  /**
   * Util methods for custom attibutes.
   */
  GGRC.Utils.CustomAttributes = (function () {
    /**
     * Converts custom attribute value for UI controls.
     * @param {String} type - Custom attribute type
     * @param {Object} value - Custom attribute value
     * @param {Object} valueObj - Custom attribute object
     * @return {Object} Converted value
     */
    function convertFromCaValue(type, value, valueObj) {
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
        if (value === null || value === undefined) {
          return '';
        }
      }
      return value;
    }

    /**
     * Converts value from UI controls back to CA value.
     * @param {String} type - Custom attribute type
     * @param {Object} value - Control value
     * @return {Object} Converted value
     */
    function convertToCaValue(type, value) {
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
    }

    /**
     * Converts CA values array to form fields.
     * @param {Array} customAttributeValues - Custom attributes values
     * @return {Array} From fields array
     */
    function convertValuesToFormFields(customAttributeValues) {
      return customAttributeValues
        .map(function (attr) {
          var options = attr.def.multi_choice_options;
          return {
            type: attr.attributeType,
            id: attr.def.id,
            value: convertFromCaValue(
              attr.attributeType,
              attr.attribute_value,
              attr.attribute_object
            ),
            title: attr.def.title,
            placeholder: attr.def.placeholder,
            options: options &&
            typeof options === 'string' ?
              options.split(',') : [],
            helptext: attr.def.helptext,
            validation: attr.validation
          };
        });
    }

    return {
      convertFromCaValue: convertFromCaValue,
      convertToCaValue: convertToCaValue,
      convertValuesToFormFields: convertValuesToFormFields
    };
  })();
})(window.GGRC, window.can);
