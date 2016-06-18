/*!
    Copyright (C) 2016 Google Inc., authors, and contributors <see AUTHORS file>
    Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

(function (can, $) {
  'use strict';

  GGRC.Components('inlineText', {
    tag: 'inline-text',
    template: can.view(
      GGRC.mustache_path +
      '/components/inline_edit/text.mustache'
    ),
    scope: {
    },
    events: {

    }
  });
})(window.can, window.can.$);
