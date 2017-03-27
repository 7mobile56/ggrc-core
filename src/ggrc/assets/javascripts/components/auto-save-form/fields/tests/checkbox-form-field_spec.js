describe('GGRC.Components.checkboxFormField', function () {
  'use strict';
  var viewModel;

  beforeEach(function () {
    viewModel = GGRC.Components
      .getViewModel('checkboxFormField');
    spyOn(viewModel, 'dispatch');
    viewModel.attr('fieldId', 'id');
  });

  it('does not fire valueChanged event on first value assignation', function () {
    viewModel.attr('value', true);
    expect(viewModel.dispatch).not.toHaveBeenCalled();
  });

  it('sets the value of the input', function () {
    viewModel.attr('value', true);
    expect(viewModel.attr('_value')).toEqual(true);
  });

  it('fires valueChanged event on input value change', function () {
    viewModel.attr('value', false);
    viewModel.attr('_value', true);
    expect(viewModel.dispatch).toHaveBeenCalledWith({
      type: 'valueChanged',
      fieldId: 'id',
      value: true
    });
    viewModel.attr('_value', false);
    expect(viewModel.dispatch).toHaveBeenCalledWith({
      type: 'valueChanged',
      fieldId: 'id',
      value: false
    });
  });
});
