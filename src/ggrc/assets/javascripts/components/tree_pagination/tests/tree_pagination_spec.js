/*!
  Copyright (C) 2017 Google Inc.
  Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

describe('GGRC.Components.treePagination', function () {
  'use strict';
  var viewModel;

  beforeAll(function () {
    var Component = GGRC.Components.get('treePagination');
    viewModel = new can.Map(Component.prototype.viewModel);
  });

  beforeEach(function () {
    viewModel.attr('paging', {
      current: 1,
      pageSize: 10,
      count: 3,
      disabled: false
    }, true);
  });

  describe('paginationInfo() method in helpers', function () {
    it('returns info about visible items on page', function () {
      var result;
      viewModel.attr('paging.current', 15);
      viewModel.attr('paging.pageSize', 10);
      viewModel.attr('paging.total', 3000);
      result = viewModel.getPaginationInfo();
      expect(result).toEqual('141-150 of 3000');
    });

    it('returns "No records" if we don\'t have elements', function () {
      var result;
      viewModel.paging.attr('current', 0);
      viewModel.paging.attr('total', 0);
      result = viewModel.getPaginationInfo();
      expect(result).toEqual('No records');
    });
  });
  describe('paginationPlaceholder() method in helpers', function () {
    it('returns placeholder into page input', function () {
      var result;
      viewModel.attr('paging.current', 3);
      viewModel.attr('paging.pageSize', 10);
      viewModel.attr('paging.total', 30);
      viewModel.attr('paging.count', 10);
      result = viewModel.getPaginationPlaceholder();
      expect(result).toEqual('Page 3 of 10');
    });
    it('returns empty string if we don\'t have amount of pages', function () {
      var result;
      viewModel.paging.attr('count', null);
      result = viewModel.getPaginationPlaceholder();
      expect(result).toEqual('');
    });
    it('returns "Wrong value" if current page bigger than amount of pages',
      function () {
        var result;
        viewModel.paging.attr('current', 10);
        viewModel.paging.attr('pageSize', 2);
        viewModel.paging.attr('total', 0);
        result = viewModel.getPaginationPlaceholder();
        expect(result).toEqual('Wrong value');
      });
  });
  describe('setNextPage() method ', function () {
    it('changes current and increase it by 1', function () {
      viewModel.setNextPage();
      expect(viewModel.paging.current).toEqual(2);
    });
    it('doesn\'t change current value if current equal amount of pages',
      function () {
        viewModel.paging.attr('current', 3);
        viewModel.setNextPage();
        expect(viewModel.paging.current).toEqual(3);
      });
    it('doesn\'t change current value if inProgress equal true',
      function () {
        viewModel.paging.attr('disabled', true);
        viewModel.paging.attr('current', 3);
        viewModel.setNextPage();
        expect(viewModel.paging.current).toEqual(3);
      });
  });
  describe('setPrevPage() method ', function () {
    it('changes current and decrease it by 1', function () {
      viewModel.paging.attr('current', 2);
      viewModel.setPrevPage();
      expect(viewModel.paging.current).toEqual(1);
    });
    it('doesn\'t change current value if current equal 1',
      function () {
        viewModel.paging.attr('current', 1);
        viewModel.setPrevPage();
        expect(viewModel.paging.current).toEqual(1);
      });
    it('doesn\'t change current value if inProgress equal true',
      function () {
        viewModel.paging.attr('disabled', true);
        viewModel.paging.attr('current', 2);
        viewModel.setPrevPage();
        expect(viewModel.paging.current).toEqual(2);
      });
  });
  describe('setFirstPage() method ', function () {
    it('changes current if current more than 1', function () {
      viewModel.paging.attr('current', 3);
      viewModel.setFirstPage();
      expect(viewModel.paging.current).toEqual(1);
    });
    it('doesn\'t change current value if inProgress equal true',
      function () {
        viewModel.paging.attr('disabled', true);
        viewModel.paging.attr('current', 3);
        viewModel.setFirstPage();
        expect(viewModel.paging.current).toEqual(3);
      });
  });
  describe('setLastPage() method ', function () {
    it('changes current if current less than amount of pages', function () {
      viewModel.paging.attr('current', 2);
      viewModel.setLastPage();
      expect(viewModel.paging.current).toEqual(3);
    });
    it('doesn\'t change current value if inProgress equal true',
      function () {
        viewModel.paging.attr('disabled', true);
        viewModel.paging.attr('current', 2);
        viewModel.setLastPage();
        expect(viewModel.paging.current).toEqual(2);
      });
  });
  describe('changePageSize() method ', function () {
    it('changes current to first page and page size', function () {
      viewModel.paging.attr('current', 2);
      expect(viewModel.paging.pageSize).toEqual(10);
      viewModel.changePageSize(25);
      expect(viewModel.paging.pageSize).toEqual(25);
      expect(viewModel.paging.current).toEqual(1);
    });
    it('doesn\'t change current value if inProgress equal true',
      function () {
        viewModel.paging.attr('disabled', true);
        viewModel.paging.attr('current', 2);
        expect(viewModel.paging.pageSize).toEqual(10);
        viewModel.changePageSize(25);
        expect(viewModel.paging.pageSize).toEqual(10);
        expect(viewModel.paging.current).toEqual(2);
      });
  });
  describe('setCurrentPage() method ', function () {
    var input;
    var event;
    beforeEach(function () {
      input = {
        value: null,
        val: function () {
          return this.value;
        },
        blur: jasmine.createSpy()
      };
      event = {
        stopPropagation: jasmine.createSpy()
      };
    });
    it('changes current if value more than 1 and less than amount of pages',
      function () {
        input.value = 2;
        viewModel.setCurrentPage({}, input, event);
        expect(viewModel.paging.current).toEqual(2);
      });
    it('changes current to 1 if value less than 1', function () {
      input.value = -1;
      viewModel.setCurrentPage({}, input, event);
      expect(viewModel.paging.current).toEqual(1);
    });
    it('changes current to last if value more than amount of pages',
      function () {
        input.value = 5;
        viewModel.setCurrentPage({}, input, event);
        expect(viewModel.paging.current).toEqual(3);
      });
    it('changes current to 1 if value is NaN', function () {
      input.value = 'test word';
      viewModel.setCurrentPage({}, input, event);
      expect(viewModel.paging.current).toEqual(1);
    });
    it('doesn\'t change current value if inProgress equal true',
      function () {
        viewModel.paging.attr('disabled', true);
        viewModel.paging.attr('current', 2);
        input.value = 5;
        viewModel.setCurrentPage({}, input, event);
        expect(viewModel.paging.current).toEqual(2);
      });
  });
});
