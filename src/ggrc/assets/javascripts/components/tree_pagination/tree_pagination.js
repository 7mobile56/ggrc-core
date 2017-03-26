/*!
 Copyright (C) 2017 Google Inc.
 Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
 */

/**
 * A component that renders a tree pagination widget
 * Usage: <tree-pagination paging="paging"></tree-pagination>
 */
(function (GGRC, can) {
  GGRC.Components('treePagination', {
    tag: 'tree-pagination',
    template: can.view(
      GGRC.mustache_path +
      '/components/tree_pagination/tree_pagination.mustache'
    ),
    init: function () {
      /**
       * Entrance object validation
       *
       * paging = {
       *  current: {Number}, - current page number
       *  pageSize: {Number}, - amount elements on the page
       *  total: {Number}, - total amount of elements
       *  count: {Number}, - total amount of pages
       *  pageSizeSelect: {Array} - array of numbers that used for pageSize popover
       *  disabled: {Boolean} - true if frontend doesn't finish request to the server otherwise false
       * }
       */
      if (!this.viewModel.attr('paging')) {
        throw new Error('Paging object didn\'t init');
      }
    },
    viewModel: {
      /**
       * Gets value from input and after validation set it to paging.current
       * @param {Object} object - paging object
       * @param {Object} input - DOM element
       * @param {Object} event - DOM event
       */
      setCurrentPage: function (object, input, event) {
        var _value;
        var _page;
        event.stopPropagation();
        if (!this.paging.attr('disabled') && input.val() !== '') {
          _value = parseInt(input.val(), 10);
          _page = Math.min(Math.max(_value, 1) || 1, this.paging.count);

          this.paging.attr('current', _page);
        }
        input.val('');
        input.blur();
      },
      changePageSize: function (size) {
        if (!this.paging.attr('disabled')) {
          this.paging.attr('pageSize', size);
          this.paging.attr('current', 1);
        }
      },
      setLastPage: function () {
        if (this.paging.current < this.paging.count &&
          !this.paging.attr('disabled')) {
          this.paging.attr('current', this.paging.count);
        }
      },
      setFirstPage: function () {
        if (this.paging.current > 1 && !this.paging.attr('disabled')) {
          this.paging.attr('current', 1);
        }
      },
      setPrevPage: function () {
        if (this.paging.current > 1 && !this.paging.attr('disabled')) {
          this.paging.attr('current', this.paging.current - 1);
        }
      },
      setNextPage: function () {
        if (this.paging.current < this.paging.count &&
          !this.paging.attr('disabled')) {
          this.paging.attr('current', this.paging.current + 1);
        }
      },
      getPaginationInfo: function () {
        var _current = this.attr('paging.current');
        var _size = this.attr('paging.pageSize');
        var _total = this.attr('paging.total');
        var _first;
        var _last;

        _first = (_current - 1) * _size + 1;
        _last = _current * _size < _total ? _current * _size : _total;

        return _last ? _first + '-' + _last + ' of ' + _total :
          'No records';
      },
      getPaginationPlaceholder: function () {
        var _current = this.attr('paging.current');
        var _count = this.attr('paging.count');

        if (_count && _count >= _current) {
          return 'Page ' + _current + ' of ' + _count;
        } else if (!_count) {
          return '';
        }

        return 'Wrong value';
      }
    }
  });
})(window.GGRC, window.can);
