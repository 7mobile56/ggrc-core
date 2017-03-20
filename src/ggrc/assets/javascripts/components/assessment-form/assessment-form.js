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

  GGRC.Components('assessmentForm', {
    tag: 'assessment-form',
    template: can.view(
      GGRC.mustache_path +
      '/components/assessment-form/assessment-form.mustache'
    ),
    viewModel: {
      saving: false,
      fieldsToSave: new can.Map(),
      fieldsToSaveAvailable: false,
      autoSaveScheduled: false,
      autoSaveAfterSave: false,
      autoSaveTimeoutHandler: null,
      fieldValueChanged: function (e) {
        this.fieldsToSave.attr(e.name, e.value);
        this.attr('fieldsToSaveAvailable', true);

        this.triggerAutoSave();

        // remove - debug
        console.info('+ Queue:');
        var toSave = this.attr('fieldsToSave').attr();
        console.table(Object.keys(toSave).reduce((acc, k) => Object.assign({}, acc, {[k]: { value: toSave[k]}}), {}))
        // end: remove - debug
      },
      save: function () {
        var self = this;
        var toSave = this.attr('fieldsToSave').attr();

        // remove - debug
        console.info('> Saving:');
        console.table(Object.keys(toSave).reduce((acc, k) => Object.assign({}, acc, {[k]: { value: toSave[k]}}), {}))
        // end: remove - debug

        this.attr('fieldsToSave', new can.Map());
        this.attr('fieldsToSaveAvailable', false);

        clearTimeout(this.attr('autoSaveTimeoutHandler'));
        this.attr('autoSaveScheduled', false);

        this.attr('saving', true);

        this.__backendSave()
          .done(function () {
            self.attr('saving', false);

            if (self.attr('autoSaveAfterSave')) {
              self.attr('autoSaveAfterSave', false);
              setTimeout(self.save.bind(self));
            }

            // remove - debug
            self.attr('saved', true);
            setTimeout(function() {
              self.attr('saved', false);
            }, 2000);
            console.info('! Saved:');
            console.table(Object.keys(toSave).reduce((acc, k) => Object.assign({}, acc, {[k]: { value: toSave[k]}}), {}))
            // end: remove - debug
          })
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
      // remove - debug
      __backendSave: function () {
        var dfd = $.Deferred();
        setTimeout(function () {
          dfd.resolve();
        }, BACKEND_SAVE_DELAY);
        return dfd;
      }
      // end: remove - debug
    }
  });
})(window.can, window.GGRC, window.jQuery);
