describe('GGRC.Components.richTextValueFormField', function () {
  'use strict';
  var viewModel;

  beforeEach(function () {
    viewModel = GGRC.Components
      .getViewModel('richTextValueFormField');
    spyOn(viewModel, 'dispatch');
    viewModel.attr('fieldId', 'id');
  });

  it('does not fire valueChanged event on first value assignation', function () {
    viewModel.attr('value', '');
    expect(viewModel.dispatch).not.toHaveBeenCalled();
  });

  it('sets the value of the input', function () {
    viewModel.attr('value', 'test');
    expect(viewModel.attr('_value')).toEqual('test');
  });

  it('does not fire valueChanged event if value wasn\'t changed', function () {
    viewModel.attr('value', '');
    viewModel.attr('_value', 'newValue');
    viewModel.onFocus();
    viewModel.attr('_value', 'newValue');
    viewModel.onBlur();
    expect(viewModel.dispatch).not.toHaveBeenCalled();
  });

  it('fires valueChanged event on input value change', function () {
    viewModel.attr('value', '');
    viewModel.onFocus();
    viewModel.attr('_value', 'newValue');
    viewModel.onBlur();
    expect(viewModel.dispatch).toHaveBeenCalledWith({
      type: 'valueChanged',
      fieldId: 'id',
      value: 'newValue'
    });
    viewModel.onFocus();
    viewModel.attr('_value', 'newValue2');
    viewModel.onBlur();
    expect(viewModel.dispatch).toHaveBeenCalledWith({
      type: 'valueChanged',
      fieldId: 'id',
      value: 'newValue2'
    });
  });
});
