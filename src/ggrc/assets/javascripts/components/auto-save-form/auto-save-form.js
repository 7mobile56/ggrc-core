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
      editMode: false,
      saving: false,
      allSaved: false,
      fieldsToSave: new can.Map(),
      fieldsToSaveAvailable: false,
      autoSaveScheduled: false,
      autoSaveAfterSave: false,
      autoSaveTimeoutHandler: null,
      fields: [],
      saveCallback: null,
      triggerSaveCbs: null,
      init: function () {
        this._save = this.save.bind(this);
        this.attr('triggerSaveCbs').add(this._save);
      },
      unsubscribe: function () {
        this.attr('triggerSaveCbs').remove(this._save);
      },
      fieldValueChanged: function (e) {
        this.fieldsToSave.attr(e.fieldId, e.value);
        this.attr('fieldsToSaveAvailable', true);

        this.triggerAutoSave();
      },
      save: function () {
        var self = this;
        var toSave = {};

        this.attr('fieldsToSave').each(function (v, k) {
          toSave[k] = v;
        });

        this.attr('fieldsToSave', new can.Map());
        this.attr('fieldsToSaveAvailable', false);

        clearTimeout(this.attr('autoSaveTimeoutHandler'));
        this.attr('autoSaveScheduled', false);

        this.attr('saving', true);

        this.saveCallback(toSave)
          .done(function () {
            if (self.attr('autoSaveAfterSave')) {
              self.attr('autoSaveAfterSave', false);
              setTimeout(self.save.bind(self));
            }

            self.attr('allSaved', true);
          })
          // todo: error handling
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
      }
    },
    events: {
      removed: function () {
        this.viewModel.unsubscribe();
      }
    }
  });
})(window.can, window.GGRC, window.jQuery);
