/*!
    Copyright (C) 2017 Google Inc.
    Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

can.Control('CMS.Controllers.InfoPin', {
  defaults: {
    view: GGRC.mustache_path + '/base_objects/info.mustache'
  }
}, {
  init: function (el, options) {
    this.element.height(0);
  },
  findView: function (instance) {
    var view = instance.class.table_plural + '/info';

    if (instance instanceof CMS.Models.Person) {
      view = GGRC.mustache_path +
        '/ggrc_basic_permissions/people_roles/info.mustache';
    } else if (view in GGRC.Templates) {
      view = GGRC.mustache_path + '/' + view + '.mustache';
    } else {
      view = this.options.view;
    }
    return view;
  },
  findOptions: function (el) {
    var options;
    var treeNode = el.closest('.cms_controllers_tree_view_node');

    if (treeNode.length) {
      options = treeNode.control().options;
    } else {
      options = el.closest('.tree-item-element').viewModel();
    }
    return options;
  },
  loadChildTrees: function () {
    var childTreeDfds = [];
    var that = this;
    var $el;
    var childTreeControl;

    this.element.find('.' + CMS.Controllers.TreeView._fullName)
      .each(function (_, el) {
        $el = $(el);

        //  Ensure this targets only direct child trees, not sub-tree trees
        if ($el.closest('.' + that.constructor._fullName).is(that.element)) {
          childTreeControl = $el.control();
          if (childTreeControl) {
            childTreeDfds.push(childTreeControl.display());
          }
        }
      });
  },
  getPinHeight: function (maximizedState) {
    if (maximizedState) {
      return Math.floor($(window).height() * 3 / 4);
    }
    return Math.floor($(window).height() / 3);
  },
  hideInstance: function () {
    this.element.stop(true);
    this.element.height(0).html('');
    $(window).trigger('resize');
  },
  unsetInstance: function () {
    this.element.stop(true);
    this.element.animate({
      height: 0
    }, {
      duration: 800,
      start: function () {
        $(window).trigger('resize', 0);
      },
      complete: function () {
        this.element.height(0).html('');
        $('.cms_controllers_tree_view_node').removeClass('active');
      }.bind(this)
    });
  },
  setInstance: function (opts, el, maximizedState) {
    var self = this;
    var instance = opts.attr('instance');
    var parentInstance = opts.attr('parent_instance');
    var options = this.findOptions(el);
    var view = this.findView(instance);
    var panelHeight = this.getPinHeight(maximizedState);
    var confirmEdit = instance.class.confirmEditModal ?
      instance.class.confirmEditModal : {};
    var currentPanelHeight;
    instance.attr('view', view);

    if (!_.isEmpty(confirmEdit)) {
      confirmEdit.confirm = this.confirmEdit;
    }

    this.element.html(can.view(view, {
      instance: instance,
      parentInstance: parentInstance,
      model: instance.class,
      confirmEdit: confirmEdit,
      is_info_pin: true,
      options: options,
      result: options.result,
      page_instance: GGRC.page_instance(),
      maximized: maximizedState,
      onChangeMaximizedState: function () {
        return self.changeMaximizedState.bind(self);
      },
      onClose: function () {
        return self.close.bind(self);
      }
    }));

    if (instance.info_pane_preload) {
      instance.info_pane_preload();
    }

    // Load trees inside info pin
    this.loadChildTrees();

    // Make sure pin is visible
    currentPanelHeight = this.element.height();
    if (!currentPanelHeight || currentPanelHeight !== panelHeight) {
      this.element.animate({
        height: panelHeight
      }, {
        duration: 800,
        easing: 'easeOutExpo',
        complete: function () {
          this.ensureElementVisible(el);
        }.bind(this)
      });
    } else {
      this.ensureElementVisible(el);
    }
    this.element.trigger('scroll');
  },
  ensureElementVisible: function (el) {
    var $objectArea;
    var $header;
    var $filter;
    var elTop;
    var elBottom;
    var headerTop;
    var headerBottom;
    var infoTop;

    $(window).trigger('resize');
    $objectArea = $('.object-area');
    $header = $('.tree-header:visible');
    $filter = $('.tree-filter:visible');

    if (_.isEmpty(el) || _.isEmpty($header)) {
      return;
    }

    elTop = el.offset().top;
    elBottom = elTop + el.height();

    headerTop = $header.offset().top;
    headerBottom = headerTop + $header.height();
    infoTop = this.element.offset().top;

    if (elTop < headerBottom || elBottom > infoTop) {
      el[0].scrollIntoView(false);
      if (elTop < headerBottom) {
        el[0].scrollIntoView(true);
        $objectArea.scrollTop(
          $objectArea.scrollTop() - $header.height() - $filter.height());
      } else {
        el[0].scrollIntoView(false);
      }
    }
  },
  confirmEdit: function (instance, modalDetails) {
    var confirmDfd = $.Deferred();
    var renderer = can.view.mustache(modalDetails.description);
    GGRC.Controllers.Modals.confirm({
      modal_description: renderer(instance).textContent,
      modal_confirm: modalDetails.button,
      modal_title: modalDetails.title,
      button_view: GGRC.mustache_path + '/quick_form/confirm_buttons.mustache'
    }, confirmDfd.resolve);
    return confirmDfd;
  },
  changeMaximizedState: function (maximizedState) {
    var $win = $(window);
    var options = {
      duration: 800,
      easing: 'easeOutExpo'
    };
    var $activeTree = $('.cms_controllers_tree_view_node.active');
    var size = this.getPinHeight(maximizedState);
    if (size <= this.element.height()) {
      options.start = function () {
        $win.trigger('resize', size);
      };
    } else {
      options.complete = function () {
        $win.trigger('resize');
      };
    }

    this.element.animate({height: size}, options);

    if (maximizedState) {
      $activeTree
        .addClass('maximized-info-pane');
    } else {
      $activeTree
        .removeClass('maximized-info-pane');
    }
  },
  close: function () {
    var visibleWidget = $('.widget-area .widget:visible');
    var element = visibleWidget.find('.cms_controllers_tree_view');

    if (element.length) {
      element.control().deselect();
    } else {
      visibleWidget.find('.item-active')
        .removeClass('item-active');
    }

    this.unsetInstance();
  },
  ' scroll': function (el, ev) {
    var header = this.element.find('.pane-header');
    var isFixed = el.scrollTop() > 0;
    var offset = isFixed ? header.height() : 0;
    var HEADER_PADDING = -15;

    this.element.find('.tier-content').css('paddingTop', offset);
    header.css('marginTop', function () {
      // Header in info pane is padded by 15px, and we need to make sure
      // text doesn't bleed below.
      return HEADER_PADDING - offset;
    });
    header.toggleClass('pane-header__fixed', isFixed);
  }
});
