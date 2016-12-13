/*
 * 作図ダイアログ
 */

////////////////////////////////////////////////////////////////////////
// 作図ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.Construction = MKR.Dialog.Base.extend({

	initialHeight: 98,

	initialWidth: 690,

	_maxHeight: 620,

	_maxWidth: 790,

	_layerShowHeight: 136,	// ダイアログ高さがこの高さを超えると、レイヤ操作部を表示する

	_showLayerDialogMinHeight: 300,	// レイヤ操作部表示時に設定するダイアログの高さの最小値
	_showLayerDialogHeight: 300,	// レイヤ操作部表示時に設定するダイアログの高さ

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, layerManager, drawFigure, settings, options) {

		var self = this;

		var dialogBodyTemplate =

			"<div>" +

				"<div class='mkr_figure_operation'>" +

					"<div class='mkr_figure_create'>" +
					"</div>" +

					"<div class='mkr_figure_edit'>" +
						"<div class='btn-group btn-group-sm' role='group'>" +
							"<button type='button' class='btn btn-default mkr_begin_edit_figure' title='" + MKR.Lang.Dialog.Construction.beginEditFigureTitle + "' data-edit-type='" + MKR.EditType.Edit + "'><i class='fa fa-edit' aria-hidden='true'></i></button>" +
							"<button type='button' class='btn btn-default mkr_begin_setting_figure' title='" + MKR.Lang.Dialog.Construction.beginSettingFigureTitle + "' data-edit-type='" + MKR.EditType.Setting + "'><i class='fa fa-cog' aria-hidden='true'></i></button>" +
							"<button type='button' class='btn btn-default mkr_begin_delete_figure' title='" + MKR.Lang.Dialog.Construction.beginDeleteFigureTitle + "' data-edit-type='" + MKR.EditType.Delete + "'><i class='fa fa-trash-o' aria-hidden='true'></i></button>" +
						"</div>" +
					"</div>" +

					"<div class='mkr_layer_visible_operation'>" +
						"<div class='btn-group btn-group-sm' role='group'>" +
							"<button type='button' class='btn btn-default mkr_show_layer_operation' title='" + MKR.Lang.Dialog.Construction.showLayerOperationTitle + "' data-edit-type='" + MKR.EditType.Edit + "'><i class='fa fa-chevron-down' aria-hidden='true'></i></button>" +
							"<button type='button' class='btn btn-default mkr_hide_layer_operation' title='" + MKR.Lang.Dialog.Construction.hideLayerOperationTitle + "' data-edit-type='" + MKR.EditType.Edit + "'><i class='fa fa-chevron-up' aria-hidden='true'></i></button>" +
						"</div>" +
					"</div>" +

					"<div class='mkr_file_operation'>" +
						"<div class='btn-group btn-group-sm' role='group'>" +
							"<button type='button' class='btn btn-default mkr_load_layer' title='" + MKR.Lang.Dialog.Construction.loadLayerFromFileTitle + "'><i class='fa fa-folder-open-o' aria-hidden='true'></i></button>" +
							"<button type='button' class='btn btn-default dropdown-toggle mkr_selector' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' title='" + MKR.Lang.Dialog.Construction.selectOperationTitle + "'>" +
								"<span class='caret'></span>" +
							"</button>" +
							"<ul class='dropdown-menu mkr_scrollable_menu'>" +
								"<li><a href='" + MKR.Const.JSVoid + "' class='mkr_load_layer'><i class='fa fa-folder-open-o' aria-hidden='true'></i>" + MKR.Lang.Dialog.Construction.loadLayerFromFileTitle + "</a></li>" +
								"<li role='separator' class='divider'></li>" +
								"<li><a href='" + MKR.Const.JSVoid + "' class='mkr_clear_layers'><i class='fa fa-times-circle' aria-hidden='true'></i>" + MKR.Lang.Dialog.Construction.clearAllLayersTitle + "</a></li>" +
							"</ul>" +
						"</div>" +

						"<div class='btn-group btn-group-sm' role='group'>" +
							"<button type='button' class='btn btn-default mkr_save_layer_browser' title='" + MKR.Lang.Dialog.Construction.saveToBrowserTitle + "'><i class='fa fa-download' aria-hidden='true'></i></button>" +

							"<button type='button' class='btn btn-default dropdown-toggle mkr_selector' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' title='" + MKR.Lang.Dialog.Construction.selectOperationTitle + "'>" +
								"<span class='caret'></span>" +
							"</button>" +

							"<ul class='dropdown-menu mkr_scrollable_menu'>" +
								"<li><a href='" + MKR.Const.JSVoid + "' class='mkr_save_layer_browser'><i class='fa fa-download' aria-hidden='true'></i>" + MKR.Lang.Dialog.Construction.saveToBrowserTitle + "</a></li>" +
								"<li role='separator' class='divider'></li>" +
								"<li><a href='" + MKR.Const.JSVoid + "' class='mkr_save_layer'><i class='fa fa-save' aria-hidden='true'></i>" + MKR.Lang.Dialog.Construction.saveToFileTitle + "</a></li>" +
							"</ul>" +

						"</div>" +

					"</div>" +

					"<div class='mkr_extend_operation'>" +
					"</div>" +

				"</div>" +

				"<div class='mkr_figure_motion'>" +

					"<div class='mkr_construct_pane'>" +
						"<div class='btn-group btn-group-sm' role='group'>" +
							"<button type='button' class='btn btn-success mkr_end_figure' title='" + MKR.Lang.Dialog.Construction.finishDrawTitle + "'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i></button>" +
							"<button type='button' class='btn btn-warning mkr_delete_last_point' title='" + MKR.Lang.Dialog.Construction.deleteLastPointTitle + "'><i class='fa fa-eraser' aria-hidden='true'></i></button>" +
							"<button type='button' class='btn btn-danger mkr_cancel_figure' title='" + MKR.Lang.Dialog.Construction.cancelDrawTitle + "'><i class='fa fa-times' aria-hidden='true'></i></button>" +
						"</div>" +
					"</div>" +

					"<div class='mkr_edit_pane'>" +
						"<div class='btn-group btn-group-sm' role='group'>" +
							"<button type='button' class='btn btn-success mkr_save_edit' title='" + MKR.Lang.Dialog.Construction.saveEditTitle + "'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i></button>" +
							"<button type='button' class='btn btn-danger mkr_cancel_edit' title='" + MKR.Lang.Dialog.Construction.cancelEditTitle + "'><i class='fa fa-times' aria-hidden='true'></i></button>" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='mkr_layer_operation_container'>" +

					"<hr class='mkr_layers_separator' />" +

					"<div class='mkr_layer_operation'>" +
						"<div class='btn-group btn-group-sm' role='group'>" +
							"<button type='button' class='btn btn-default mkr_new_layer' title='" + MKR.Lang.Dialog.Construction.addNewLayerTitle + "'><i class='fa fa-file-o' aria-hidden='true'></i></button>" +
						"</div>" +
					"</div>" +

					"<div class='mkr_layers'>" +
						"<ul class='list-group mkr_layer_list'>" +
						"</ul>" +
					"</div>" +

				"</div>" +

			"</div>" +

			"";

		var menuItemTemplate =
			"<li><a href='" + MKR.Const.JSVoid + "' class='mkr_begin_figure mkr_figure_option' data-figure-option-name=''></a></li>" +
			"";

		var figureGroupTemplate =
			"<div class='btn-group btn-group-sm mkr_figure_group' data-figure-type=''>" +
				"<button type='button' class='btn btn-default mkr_begin_figure' title=''><img src='' /></button>" +
				"<button type='button' class='btn btn-default dropdown-toggle mkr_selector' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' title='" + MKR.Lang.Dialog.Construction.selectOperationTitle + "'>" +
					"<span class='caret'></span>" +
				"</button>" +
				"<ul class='dropdown-menu mkr_scrollable_menu'>" +
					"<li><a href='" + MKR.Const.JSVoid + "' class='mkr_begin_figure mkr_figure_default'></a></li>" +
					"<li role='separator' class='divider mkr_divider'></li>" +
					"<li><a href='" + MKR.Const.JSVoid + "' class='mkr_setting_figure'><i class='fa fa-cog' aria-hidden='true'></i>" + MKR.Lang.Dialog.Construction.figureSettingCaption + "</a></li>" +
					"<li class='mkr_setting_figure_list_container'><a href='" + MKR.Const.JSVoid + "' class='mkr_setting_figure_list'><i class='fa fa-list' aria-hidden='true'></i>" + MKR.Lang.Dialog.Construction.maintenanceFigureSettingCaption + "</a></li>" +
					"<li role='separator' class='divider'></li>" +
					"<li><a href='" + MKR.Const.JSVoid + "' class='mkr_draw_repeat' data-draw-repeat=''><i class='' aria-hidden='true'></i>" + MKR.Lang.Dialog.Construction.repeatDrawingCaption + "</a></li>" +
				"</ul>" +
			"</div>" +
			"";

		var figureGroupTemplateParams = [
			{
				figureType: MKR.FigureType.Marker,
				title: MKR.Lang.Dialog.Construction.addMarkerTitle,
				icon: "images/icon_marker.png"
			},
			{
				figureType: MKR.FigureType.CircleMarker,
				title: MKR.Lang.Dialog.Construction.addCircleMarkerTitle,
				icon: "images/icon_circle_marker.png"
			},
			{
				figureType: MKR.FigureType.Polyline,
				title: MKR.Lang.Dialog.Construction.addPolylineTitle,
				icon: "images/icon_polyline.png"
			},
			{
				figureType: MKR.FigureType.Polygon,
				title: MKR.Lang.Dialog.Construction.addPolygonTitle,
				icon: "images/icon_polygon.png"
			},
			{
				figureType: MKR.FigureType.Circle,
				title: MKR.Lang.Dialog.Construction.addCircleTitle,
				icon: "images/icon_circle.png"
			},
			{
				figureType: MKR.FigureType.DivIconMarker,
				title: MKR.Lang.Dialog.Construction.addDivIconMarkerTitle,
				icon: "images/icon_div_icon_marker.png"
			}
		];

		var layerItemTemplate =
			"<li class='list-group-item mkr_layer_item'>" +
				"<div class='caption mkr_layer_display_name_pane'>" +
					"<div class='mkr_toggle_layer_visible_pane'>" +
						"<button type='button' class='btn btn-sm btn-default mkr_toggle_layer_visible' title=''><i class='fa fa-eye' aria-hidden='true'></i></button>" +
					"</div><span class='mkr_layer_display_name' title=''></span>" +
				"</div>" +
				"<div class='mkr_layer_name_pane'><span class='mkr_layer_name' title=''></span></div>" +

				"<div class='mkr_layer_edit'>" +
					"<div class='btn-group btn-group-sm' role='group'>" +
						"<button type='button' class='btn btn-default mkr_select_layer' title='" + MKR.Lang.Dialog.Construction.selectLayerTitle + "'><i class='fa fa-mouse-pointer' aria-hidden='true'></i></button>" +
						"<button type='button' class='btn btn-default mkr_layer_to_foreground' title='" + MKR.Lang.Dialog.Construction.moveLayerForwardTitle + "'><i class='fa fa-arrow-up' aria-hidden='true'></i></button>" +
						"<button type='button' class='btn btn-default mkr_layer_to_background' title='" + MKR.Lang.Dialog.Construction.moveLayerBackwardTitle + "'><i class='fa fa-arrow-down' aria-hidden='true'></i></button>" +
						"<button type='button' class='btn btn-default mkr_rename_layer' title='" + MKR.Lang.Dialog.Construction.renameLayerTitle + "'><i class='fa fa-edit' aria-hidden='true'></i></button>" +
						"<button type='button' class='btn btn-default mkr_remove_layer' title='" + MKR.Lang.Dialog.Construction.deleteLayerTitle + "'><i class='fa fa-trash-o' aria-hidden='true'></i></button>" +
					"</div>" +
				"</div>" +

				"<div class='mkr_layer_count_pane'>" +
					"<span class='badge mkr_layer_count'>0</span>" +
				"</div>" +

			"</li>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		var figureOperationWgt = dialogBodyWgt.find(".mkr_figure_operation");
		var figureCreateWgt = dialogBodyWgt.find(".mkr_figure_create");

		var fileOperationWgt = dialogBodyWgt.find(".mkr_file_operation");
		var layerVisibleOperationWgt = dialogBodyWgt.find(".mkr_layer_visible_operation");

		var constructPaneWgt = dialogBodyWgt.find(".mkr_construct_pane");
		var editPaneWgt = dialogBodyWgt.find(".mkr_edit_pane");

		var layerOperationWgt = dialogBodyWgt.find(".mkr_layer_operation");
		var layerListWgt = dialogBodyWgt.find(".mkr_layer_list");

		// 作図ボタンを作成する
		function createFigureGroupWgt(figureType, title, icon) {

			var figureGroupWgt = $(figureGroupTemplate);
			figureGroupWgt.attr("data-figure-type", figureType);

			var beginFigureButtonWgt = figureGroupWgt.find("button.mkr_begin_figure");
			beginFigureButtonWgt.attr("title", title);
			beginFigureButtonWgt.find("img").attr("src", icon);

			var typeHelper = new MKR.TypeHelper(figureType);

			var iconWgt = typeHelper.widget.createIconWidget("mkr_figure_option_icon", settings.getFigureOption(figureType));

			var figureDefaultWgt = figureGroupWgt.find(".mkr_figure_default");
			figureDefaultWgt
				.append(iconWgt)
				.append(MKR.Lang.Dialog.Construction.figureDefaultTitle);

			return figureGroupWgt;
		}

		// 拡張機能をアタッチする
		function attachExtends() {
			if (MKR.Extends) {
				var extendOperation = new MKR.Extends({
					dialogManager: dialogManager,
					layerManager: layerManager,
					drawFigure: drawFigure,
					parentWgt: dialogBodyWgt.find(".mkr_extend_operation")
				});

				self.initialWidth += extendOperation.uiWidth();
				self._maxWidth += extendOperation.uiWidth();
			}
		}

		// リストの既定のアイコンを設定する
		function setFigureDefaultWgtIcon(figureType) {

			var figureDefaultWgt = dialogBodyWgt.find(".mkr_figure_create .mkr_figure_group[data-figure-type='" + figureType + "'] .mkr_figure_default");
			var typeHelper = new MKR.TypeHelper(figureType);

			typeHelper.widget.setIconWidget(figureDefaultWgt.find(".mkr_figure_option_icon"), settings.getFigureOption(figureType));
		}

		// リストの作図設定の管理の有効・無効を設定する
		function enableSettingFigureListWgt(figureType) {

			var countNamedFigureOptionList = settings.countNamedFigureOptionList(figureType);
			var settingFigureList = dialogBodyWgt.find(".mkr_figure_create .mkr_figure_group[data-figure-type='" + figureType + "'] .mkr_setting_figure_list");

			// NOTE: 有効・無効の設定は「見た目」だけのため、クリックイベントは発生する。イベントハンドラ側で有効・無効を判定し、処理をガードすること
			if (countNamedFigureOptionList === 0) {
				settingFigureList.parents(".mkr_setting_figure_list_container").addClass("disabled");
			} else {
				settingFigureList.parents(".mkr_setting_figure_list_container").removeClass("disabled");
			}
		}

		// リストの作図の繰り返しを設定する
		function setDrawRepeatWgt(figureType, drawRepeat) {
			var drawRepeatWgt = dialogBodyWgt.find(".mkr_figure_create .mkr_figure_group[data-figure-type='" + figureType + "'] .mkr_draw_repeat");

			drawRepeatWgt.attr("data-draw-repeat", String(drawRepeat));

			drawRepeatWgt.find("i")
				.removeClass("fa fa-square-o fa-check-square-o")
				.addClass((drawRepeat) ? "fa fa-check-square-o" : "fa fa-square-o");
		}

		// 編集の有効・無効を設定する
		function setEnableEditFigureWgt() {
			var widgetDisabled = (drawFigure.getFigureCount() === 0);

			$.each([".mkr_begin_edit_figure", ".mkr_begin_setting_figure", ".mkr_begin_delete_figure"], function (index, clazz) {
				figureOperationWgt.find(clazz).prop("disabled", widgetDisabled);
			});
		}

		// リストの作図一覧の項目を作成
		function createFigureOptionWgt(figureType, name, figureOption) {

			var menuItemWgt = $(menuItemTemplate);
			var beginFigureWgt = menuItemWgt.find(".mkr_begin_figure");

			var typeHelper = new MKR.TypeHelper(figureType);

			var iconWgt = typeHelper.widget.createIconWidget("mkr_figure_option_icon", figureOption);
			beginFigureWgt.append(iconWgt);

			var nameInnerWgt = $("<span class='mkr_figure_option_name'></span>");
			nameInnerWgt
				.attr("title", name)
				.text(name);
			beginFigureWgt.append(nameInnerWgt);

			beginFigureWgt.attr("data-figure-option-name", name);

			return menuItemWgt;
		}

		// リストの作図一覧を再作成する
		function recreateFigureOptionListWgt(figureType) {

			var menuList = dialogBodyWgt.find(".mkr_figure_create .mkr_figure_group[data-figure-type='" + figureType + "'] .mkr_scrollable_menu .mkr_figure_option");
			menuList.remove();

			var menuDivider = dialogBodyWgt.find(".mkr_figure_create .mkr_figure_group[data-figure-type='" + figureType + "'] .mkr_scrollable_menu .mkr_divider");
			var namedFigureOptionList = settings.getNamedFigureOptionList(figureType);
			for (var i = 0; i < namedFigureOptionList.length; ++i) {
				menuDivider.before(createFigureOptionWgt(figureType, namedFigureOptionList[i].name, namedFigureOptionList[i].figureOption));
			}
		}

		// 作図のためのボタンを表示する
		function showConstructPaneWgt(figureType) {

			// ボタンの表示・非表示の設定
			// NOTE: @figureTypeSwitch
			switch (figureType) {
			case MKR.FigureType.Marker:
			case MKR.FigureType.Circle:
			case MKR.FigureType.CircleMarker:
			case MKR.FigureType.DivIconMarker:
				$.each([".mkr_end_figure", ".mkr_delete_last_point"], function (index, clazz) {
					constructPaneWgt.find(clazz).hide();
				});
				constructPaneWgt.find(".mkr_cancel_figure").show();
				break;
			case MKR.FigureType.Polyline:
			case MKR.FigureType.Polygon:
				$.each([".mkr_end_figure", ".mkr_delete_last_point", ".mkr_cancel_figure"], function (index, clazz) {
					constructPaneWgt.find(clazz).show();
				});
				break;
			}

			// ボタンの位置の設定
			var aWidgetWidth = figureOperationWgt.find(".mkr_figure_create").outerWidth() / 6;
			var marginLeft = 0;

			// NOTE: @figureTypeSwitch
			switch (figureType) {
			case MKR.FigureType.Marker:
				marginLeft = (aWidgetWidth * 0) + 1;
				break;
			case MKR.FigureType.CircleMarker:
				marginLeft = (aWidgetWidth * 1) + 1;
				break;
			case MKR.FigureType.Polyline:
				marginLeft = (aWidgetWidth * 2);
				break;
			case MKR.FigureType.Polygon:
				marginLeft = (aWidgetWidth * 3);
				break;
			case MKR.FigureType.Circle:
				marginLeft = (aWidgetWidth * 4) + 1;
				break;
			case MKR.FigureType.DivIconMarker:
				marginLeft = (aWidgetWidth * 5) + 1;
				break;
			}

			constructPaneWgt.css({"margin-left": String(marginLeft) + "px"});

			constructPaneWgt.show();
		}

		// 編集のためのボタンを表示する
		function showEditPaneWgt(editType) {

			var figureCreateWidth = figureOperationWgt.find(".mkr_figure_create").outerWidth();
			var aWidgetWidth = figureOperationWgt.find(".mkr_figure_edit").outerWidth() / 3;
			var marginLeft = figureCreateWidth + 8;

			// NOTE: @editTypeSwitch
			switch (editType) {
			case MKR.EditType.Edit:
				marginLeft += (aWidgetWidth * 0);
				break;
			case MKR.EditType.Setting:
				marginLeft += (aWidgetWidth * 1) + 1;
				break;
			case MKR.EditType.Delete:
				marginLeft += (aWidgetWidth * 2) + 1;
				break;
			}

			editPaneWgt.css({"margin-left": String(marginLeft) + "px"});

			editPaneWgt.show();
		}

		// 作図設定名チェック用のコールバック
		function figureSettingNameCheckCallback(srcName, destName, nameAsDialog, namedFigureOptionList) {
			if (0 <= MKR.SettingUtil.indexOfNamedFigureOptionByName(namedFigureOptionList, destName)) {
				var yesNoDialog = new MKR.Dialog.ModalYesNo(dialogManager, MKR.Lang.Dialog.Construction.sameNameExistsCaption);
				yesNoDialog.on("mkrDialog:yes", function (event) {
					nameAsDialog.nameOk(destName);
				});
				yesNoDialog.showModal();
			} else {
				nameAsDialog.nameOk(destName);
			}
		}

		// レイヤ操作部の表示・非表示を設定する
		function setLayerOperationVisible(show) {
			self.dialogWgt.css({height: (show) ? self._showLayerDialogHeight : self.initialHeight });
			self.adjustContents();
		}

		// レイヤの表示・非表示の情報を設定する
		function setLayerVisibleInfo(layerItemWgt, show) {
			layerItemWgt.find(".mkr_toggle_layer_visible_pane i")
				.removeClass("fa fa-eye fa-eye-slash")
				.addClass((show) ? "fa fa-eye" : "fa fa-eye-slash")
				.attr("title", (show) ? MKR.Lang.Dialog.Construction.hideLayerCaption : MKR.Lang.Dialog.Construction.showLayerCaption);
		}

		// レイヤの表示名とファイル名を設定する
		function setLayerName(layerItemWgt, name, displayName) {

			layerItemWgt.find(".mkr_layer_name")
				.attr("title", name)
				.text(name);

			layerItemWgt.find(".mkr_layer_display_name")
				.attr("title", displayName)
				.text(displayName);
		}

		// 図形の個数を設定する
		function setFigureCount(layerItemWgt, figureCount) {
			layerItemWgt.find(".mkr_layer_count").text(String(figureCount));
		}

		// 選択されているレイヤ内の図形の個数を設定する
		function setCurrentFigureCount() {
			var index = layerManager.getCurrentLayerInfoIndex();
			var figureCount = drawFigure.getFigureCount();
			var layerItemWgt = layerListWgt.find(".mkr_layer_item").eq(index);

			setFigureCount(layerItemWgt, figureCount);

			return layerItemWgt;
		}

		// レイヤ項目を作成する
		function createLayerItemWgt(layerInfo) {
			var layerItemWgt = $(layerItemTemplate);

			setLayerVisibleInfo(layerItemWgt, layerInfo.visible);
			setLayerName(layerItemWgt, layerInfo.name, layerInfo.displayName);
			setFigureCount(layerItemWgt, layerInfo.layer.getLayers().length);

			return layerItemWgt;
		}

		// レイヤ項目のインデックスを得る
		function getLayerItemIndex(elem) {
			var layerItemWgt = $(elem).parents(".mkr_layer_item");
			var layerItemsWgt = layerListWgt.find(".mkr_layer_item");
			return layerItemsWgt.index(layerItemWgt);
		}

		// レイヤの重なり順変更ボタンの有効・無効を設定する
		function setEnableLayerOrderWgt() {
			layerListWgt.find(".mkr_layer_to_foreground, .mkr_layer_to_background").prop("disabled", false);
			layerListWgt.find(".mkr_layer_item:first-child .mkr_layer_to_foreground, .mkr_layer_item:last-child .mkr_layer_to_background").prop("disabled", true);
		}

		// レイヤ名変更チェック用のコールバック
		function layerNameCheckCallback(index, nameNew, displayNameNew, layerNameAsDialog) {

			if (!layerManager.checkSameName(index, nameNew)) {
				var alertDialog = new MKR.Dialog.ModalAlert(dialogManager, MKR.Lang.Dialog.Construction.sameFilenameExistsMessage);
				alertDialog.showModal();
			} else {
				layerNameAsDialog.nameOk(nameNew, displayNameNew);
			}
		}

		//
		// 画面
		//

		attachExtends();

		$.each(figureGroupTemplateParams, function (index, templateParam) {
			var figureGroupWgt = createFigureGroupWgt(templateParam.figureType, templateParam.title, templateParam.icon);

			figureCreateWgt.append(figureGroupWgt);
		});


		$.each([MKR.FigureType.Marker, MKR.FigureType.Polyline, MKR.FigureType.Polygon, MKR.FigureType.Circle, MKR.FigureType.CircleMarker, MKR.FigureType.DivIconMarker], function (index, figureType) {
			setFigureDefaultWgtIcon(figureType);
			recreateFigureOptionListWgt(figureType);
			enableSettingFigureListWgt(figureType);
			setDrawRepeatWgt(figureType, false);
		});

		setEnableEditFigureWgt();

		//
		// イベント
		//

		// 作図開始
		figureOperationWgt.find(".mkr_figure_group").on("click", ".mkr_begin_figure", function (event) {

			var beginFigureWgt = $(this);

			var figureGroupWgt = beginFigureWgt.parents(".mkr_figure_group");
			var drawRepeatWgt = figureGroupWgt.find(".mkr_draw_repeat");
			var drawRepeat = (drawRepeatWgt.attr("data-draw-repeat") === "true");

			var figureType = figureGroupWgt.attr("data-figure-type");
			var optionName = (beginFigureWgt.hasClass("mkr_figure_option")) ? beginFigureWgt.attr("data-figure-option-name") : null;

			var namedFigureOption = settings.findNamedFigureOptionByName(figureType, optionName);

			drawFigure.beginFigure(figureType, (namedFigureOption !== null) ? namedFigureOption.figureOption : settings.getFigureOption(figureType), drawRepeat);
		});

		// 編集
		figureOperationWgt.find(".mkr_begin_edit_figure, .mkr_begin_setting_figure, .mkr_begin_delete_figure").on("click", function (event) {

			var editType = $(this).attr("data-edit-type");

			drawFigure.beginEdit(editType);
		});

		// 作図設定の管理
		figureOperationWgt.find(".mkr_figure_group").on("click", ".mkr_setting_figure_list", function (event) {

			var settingFigureListWgt = $(this);

			if (settingFigureListWgt.parents(".mkr_setting_figure_list_container").hasClass("disabled")) {
				// 作図設定の管理の「見た目」が無効の場合は処理しない
				return;
			}

			drawFigure.cancelAll();

			var figureType = settingFigureListWgt.parents(".mkr_figure_group").attr("data-figure-type");
			var namedFigureOptionList = settings.getNamedFigureOptionList(figureType);

			var figureSettingsMaintenanceDialog = new MKR.Dialog.ModalFigureSettingsMaintenance(dialogManager, figureType, namedFigureOptionList);

			figureSettingsMaintenanceDialog.on("mkrDialog:save", function (event) {

				settings.setNamedFigureOptionList(event.figureType, event.namedFigureOptionList);

				// 一覧の再作成
				recreateFigureOptionListWgt(event.figureType);

				enableSettingFigureListWgt(event.figureType);
			});

			figureSettingsMaintenanceDialog.showModal();
		});

		// 作図設定
		figureOperationWgt.find(".mkr_figure_group").on("click", ".mkr_setting_figure", function (event) {

			var settingFigureWgt = $(this);

			drawFigure.cancelAll();

			var figureType = settingFigureWgt.parents(".mkr_figure_group").attr("data-figure-type");

			var typeHelper = new MKR.TypeHelper(figureType);

			var figureOption = settings.getFigureOption(figureType);
			var figureSettingsDialog = typeHelper.widget.createFigureSettingsSaveAsOrDefaultDialog(dialogManager, figureOption, function (srcName, destName, nameAsDialog) {
					figureSettingNameCheckCallback(srcName, destName, nameAsDialog, settings.getNamedFigureOptionList(figureType));
				});
			if (figureSettingsDialog === null) {
				MKR.Debug.notImplemented();
				return;
			}

			// 既定に設定
			figureSettingsDialog.on("mkrDialog:saveDefault", function (event) {
				settings.setFigureOption(event.figureType, event.figureOption);

				setFigureDefaultWgtIcon(event.figureType);
			});

			// 名前を付けて保存
			figureSettingsDialog.on("mkrDialog:saveAs", function (event) {

				// 設定値の追加
				var add = settings.addOrUpdateNamedFigureOption(event.figureType, event.saveName, event.figureOption);

				// 一覧へ追加
				if (add) {
					var menuDivider = dialogBodyWgt.find(".mkr_figure_create .mkr_figure_group[data-figure-type='" + event.figureType + "'] .mkr_scrollable_menu .mkr_divider");
					menuDivider.before(createFigureOptionWgt(event.figureType, event.saveName, event.figureOption));
				} else {
					// 更新した場合は一覧を再作成する: 対象を探して表示を変えるのが面倒なので全部作成し直す
					recreateFigureOptionListWgt(event.figureType);
				}

				enableSettingFigureListWgt(event.figureType);
			});

			figureSettingsDialog.showModal();
		});

		// 作図の繰り返し
		figureOperationWgt.find(".mkr_figure_group").on("click", ".mkr_draw_repeat", function (event) {
			var drawRepeatWgt = $(this);

			drawFigure.cancelAll();

			var drawRepeat = (drawRepeatWgt.attr("data-draw-repeat") === "true");
			var figureType = drawRepeatWgt.parents(".mkr_figure_group").attr("data-figure-type");

			setDrawRepeatWgt(figureType, !drawRepeat);
		});

		//// レイヤ操作部表示・非表示

		// レイヤ操作部表示
		layerVisibleOperationWgt.find(".mkr_show_layer_operation").on("click", function (event) {
			$(this).blur();
			setLayerOperationVisible(true);
		});

		// レイヤ操作部非表示
		layerVisibleOperationWgt.find(".mkr_hide_layer_operation").on("click", function (event) {
			$(this).blur();
			setLayerOperationVisible(false);
		});

		//// ファイル操作

		// ファイルから読み込み
		fileOperationWgt.find(".mkr_load_layer").on("click", function (event) {

			drawFigure.cancelAll();

			var loadLayerDialog = new MKR.Dialog.ModalLoadLayer(dialogManager);
			loadLayerDialog.on("mkrDialog:loadAs", function (event) {
				layerManager.loadLayersFromFile(event.file, event.removeExistsLayer);
			});
			loadLayerDialog.showModal();
		});

		// すべての図形を削除
		fileOperationWgt.find(".mkr_clear_layers").on("click", function (event) {

			drawFigure.cancelAll();

			var yesNoDialog = new MKR.Dialog.ModalYesNo(dialogManager, MKR.Lang.Dialog.Construction.deleteAllLayersMessage);
			yesNoDialog.on("mkrDialog:yes", function (event) {
				layerManager.removeLayers();
			});
			yesNoDialog.showModal();
		});

		// ファイルへ保存
		fileOperationWgt.find(".mkr_save_layer").on("click", function (event) {
			$(this).blur();

			drawFigure.cancelAll();

			if (layerManager.getVisibleFiguresCount() <= 0) {
				var alertDialog = new MKR.Dialog.ModalAlert(dialogManager, MKR.Lang.Dialog.Construction.noLayersMessage);
				alertDialog.showModal();
			} else {

				var saveLayerDialog = new MKR.Dialog.ModalSaveLayer(dialogManager);
				saveLayerDialog.on("mkrDialog:saveAs", function (event) {
					var filename = event.filename + ".zip";
					layerManager.downloadLayers(filename, event.publishInfo, event.includePublishFiles, false);
				});

				saveLayerDialog.showModal();
			}
		});

		// ブラウザへ保存
		fileOperationWgt.find(".mkr_save_layer_browser").on("click", function (event) {
			$(this).blur();

			drawFigure.cancelAll();

			layerManager.saveLayersToBrowser(function () {
				var alertDialog = new MKR.Dialog.ModalAlert(self.getDialogManager(),
					MKR.Lang.Dialog.Construction.failedSaveToBrowserMessage, {
						minWidth: 350,
						maxWidth: 400
					});
				alertDialog.showModal();
			});
		});

		//// 作図のためのボタン

		// 作図確定
		constructPaneWgt.find(".mkr_end_figure").on("click", function (event) {
			drawFigure.endFigure();
		});

		// 最終点を削除する
		constructPaneWgt.find(".mkr_delete_last_point").on("click", function (event) {
			drawFigure.deleteLastPoint();
		});

		// 作図キャンセル
		constructPaneWgt.find(".mkr_cancel_figure").on("click", function (event) {
			drawFigure.cancelFigure();
		});

		// 編集確定
		editPaneWgt.find(".mkr_save_edit").on("click", function (event) {
			drawFigure.saveEdit();
		});

		// 編集キャンセル
		editPaneWgt.find(".mkr_cancel_edit").on("click", function (event) {
			drawFigure.cancelEdit();
		});

		//// 作図からのイベント

		// 作図開始
		drawFigure.on("mkrFigure:figureStart", function (event) {
			showConstructPaneWgt(event.figureType);
		});

		// 作図確定、キャンセル、停止
		drawFigure.on("mkrFigure:figureCreated mkrFigure:figureCanceled mkrFigure:figureStop", function (event) {
			constructPaneWgt.hide();
		});

		// 編集開始
		drawFigure.on("mkrFigure:editStart", function (event) {
			showEditPaneWgt(MKR.EditType.Edit);
		});

		// 設定開始
		drawFigure.on("mkrFigure:settingStart", function (event) {
			showEditPaneWgt(MKR.EditType.Setting);
		});

		// 削除開始
		drawFigure.on("mkrFigure:deleteStart", function (event) {
			showEditPaneWgt(MKR.EditType.Delete);
		});

		// カレントレイヤに変更あり
		drawFigure.on("mkrFigure:layerModified", function (event) {
			setEnableEditFigureWgt();

			setCurrentFigureCount();
		});

		// 編集確定、編集停止、設定確定、設定停止、削除確定、削除停止
		drawFigure.on("mkrFigure:edited mkrFigure:editStop mkrFigure:setting mkrFigure:settingStop mkrFigure:deleted mkrFigure:deleteStop", function (event) {
			editPaneWgt.hide();
		});

		//// レイヤ

		// 新しいレイヤを作成
		layerOperationWgt.find(".mkr_new_layer").on("click", function (event) {
			$(this).blur();
			layerManager.addNewLayer();
		});

		// レイヤを選択
		layerListWgt.on("click", ".mkr_select_layer", function (event) {
			$(this).blur();

			var index = getLayerItemIndex(this);

			layerManager.setCurrentLayer(index);
		});

		// レイヤの表示・非表示を切り替え
		layerListWgt.on("click", ".mkr_toggle_layer_visible", function (event) {
			$(this).blur();

			var index = getLayerItemIndex(this);
			if (layerManager.isLayerVisible(index)) {
				var rc = layerManager.hideLayer(index);
				if (!rc) {
					var alertDialog = new MKR.Dialog.ModalAlert(dialogManager, MKR.Lang.Dialog.Construction.layersCannotBeHiddenMessage);
					alertDialog.showModal();
				}
			} else {
				layerManager.showLayer(index);
			}
		});

		// レイヤを前面に移動
		layerListWgt.on("click", ".mkr_layer_to_foreground", function (event) {
			$(this).blur();

			var index = getLayerItemIndex(this);
			layerManager.layerToForeground(index);
		});

		// レイヤを背面に移動
		layerListWgt.on("click", ".mkr_layer_to_background", function (event) {
			$(this).blur();

			var index = getLayerItemIndex(this);
			layerManager.layerToBackground(index);
		});

		// レイヤの名前を変更
		layerListWgt.on("click", ".mkr_rename_layer", function (event) {
			$(this).blur();

			var index = getLayerItemIndex(this);
			var layerInfo = layerManager.getLayerInfo(index);
			if (layerInfo !== null) {
				var layerNameAsDialogOptions = {
					index: index,
					srcName: layerInfo.name,
					srcDisplayName: layerInfo.displayName,
					nameCheckCallback: layerNameCheckCallback
				};

				var layerNameAsDialog = new MKR.Dialog.ModalLayerNameAs(dialogManager, layerNameAsDialogOptions);
				layerNameAsDialog.on("mkrDialog:layerNameAs", function (event) {
					layerManager.renameLayer(index, event.name, event.displayName);
				});

				layerNameAsDialog.showModal();
			}
		});

		// レイヤを削除
		layerListWgt.on("click", ".mkr_remove_layer", function (event) {
			$(this).blur();

			var index = getLayerItemIndex(this);
			var layerInfo = layerManager.getLayerInfo(index);
			if (layerInfo !== null) {
				var yesNoDialog = new MKR.Dialog.ModalYesNo(dialogManager, MKR.Lang.Dialog.Construction.layerDeleteConfirmationMessageFunction(layerInfo.displayName));
				yesNoDialog.on("mkrDialog:yes", function (event) {
					layerManager.removeLayer(index);
				});
				yesNoDialog.showModal();
			}
		});

		//// レイヤ管理からのイベント

		// ファイルから読み込みでエラー
		layerManager.on("mkrLayer:loadError", function (event) {
			var alertDialog = new MKR.Dialog.ModalAlert(dialogManager, MKR.Lang.Dialog.Construction.failedToReadFileMessage, {
				minWidth: 350,
				maxWidth: 400
			});
			alertDialog.showModal();
		});

		layerManager.on("mkrLayer:someError", function (event) {
			var alertDialog = new MKR.Dialog.ModalAlert(dialogManager, MKR.Lang.Dialog.Construction.someDataCouldNotLoadedMessage, {
				minWidth: 380,
				maxWidth: 400
			});
			alertDialog.showModal();
		});

		// ファイルのダウンロードでエラー
		layerManager.on("mkrLayer:downloadError", function (event) {
			var alertDialog = new MKR.Dialog.ModalAlert(dialogManager, MKR.Lang.Dialog.Construction.failedToSaveFileMessage, {
				minWidth: 350,
				maxWidth: 400
			});
			alertDialog.showModal();
		});

		// 新しいレイヤが追加された
		layerManager.on("mkrLayer:add", function (event) {
			var layerInfo = layerManager.getLayerInfo(event.index);
			if (layerInfo !== null) {
				var layerItemWgt = createLayerItemWgt(layerInfo)
				layerListWgt.append(layerItemWgt);
				layerListWgt.scrollTop(layerItemWgt.outerHeight(true) * event.index);
				setEnableLayerOrderWgt();

				// NOTE: スタートアップ時のレイヤ追加でレイヤ操作部が表示されるのを防ぐために、後付けで追加した。
				//       今のところ、新規レイヤを追加する際は、レイヤ操作部上のボタンを使わなければならず、
				//       その場合、既にレイヤ操作部は表示されており、改めてのレイヤ操作部の表示は不要なため、
				//       これで足りている。
				if (event.operation === "load") {
					setLayerOperationVisible(true);
				}
			}
		});

		// 選択レイヤの変更
		layerManager.on("mkrLayer:changed", function (event) {
			layerListWgt.find(".mkr_layer_item").removeClass("active");
			layerListWgt.find(".mkr_toggle_layer_visible").prop("disabled", false);

			var layerItemWgt = setCurrentFigureCount();

			layerItemWgt.addClass("active");
			layerItemWgt.find(".mkr_toggle_layer_visible").prop("disabled", true);

			setEnableEditFigureWgt();
		});

		// レイヤの表示・非表示
		layerManager.on("mkrLayer:layerVisible", function (event) {
			var layerItemWgt = layerListWgt.find(".mkr_layer_item").eq(event.index);
			setLayerVisibleInfo(layerItemWgt, event.visible);
		});

		// レイヤを前面に移動
		layerManager.on("mkrLayer:layerToForeground", function (event) {
			var layerItemWgt = layerListWgt.find(".mkr_layer_item").eq(event.index);
			var layerItemForeWgt = layerListWgt.find(".mkr_layer_item").eq(event.index - 1);

			if (layerItemWgt[0] && layerItemForeWgt[0]) {
				layerItemWgt.after(layerItemForeWgt);
			}

			setEnableLayerOrderWgt();
		});

		// レイヤを背面に移動
		layerManager.on("mkrLayer:layerToBackground", function (event) {
			var layerItemWgt = layerListWgt.find(".mkr_layer_item").eq(event.index);
			var layerItemBackWgt = layerListWgt.find(".mkr_layer_item").eq(event.index + 1);

			if (layerItemWgt[0] && layerItemBackWgt[0]) {
				layerItemWgt.before(layerItemBackWgt);
			}
			setEnableLayerOrderWgt();
		});

		// レイヤの名前を変更
		layerManager.on("mkrLayer:rename", function (event) {
			var layerItemWgt = layerListWgt.find(".mkr_layer_item").eq(event.index);
			var layerInfo = layerManager.getLayerInfo(event.index);

			setLayerName(layerItemWgt, layerInfo.name, layerInfo.displayName);
		});

		// レイヤの削除
		layerManager.on("mkrLayer:removed", function (event) {
			var layerItemWgt = layerListWgt.find(".mkr_layer_item").eq(event.indexOld);
			layerItemWgt.remove();
			setEnableLayerOrderWgt();
		});


		MKR.Dialog.Base.prototype.initialize.call(this, dialogManager, "mkr_construction_dialog", MKR.Lang.Dialog.Construction.dialogTitle, dialogBodyWgt, {
			top: options.top,
			left: options.left,
			minHeight: this.initialHeight,
			minWidth: this.initialWidth,
			maxHeight: this._maxHeight,
			maxWidth: this._maxWidth
		});
	},

	//
	// 表示内容をダイアログサイズに合わせる
	//----------------------------------------------------------------------
	//

	adjustContents: function () {

		var dialogWgt = this.dialogWgt;
		var layerOperationContainerWgt = dialogWgt.find(".mkr_layer_operation_container");

		var dialogHeight = dialogWgt.outerHeight(true);

		if (this._layerShowHeight < dialogHeight) {
			// かなり無理矢理: ダイアログに overflow: hidden する方法も考えたが、作図用のメニュー表示が隠れてしまうので断念
			layerOperationContainerWgt.show();

			var resizableWgt = dialogWgt.find(".mkr_layer_list");
			var resizableHeightNew = MKR.DialogUtil.calcResizableHeight(dialogWgt, resizableWgt, 15);
			resizableWgt.height(resizableHeightNew);

			// 高さが一定以上なら憶えておく
			if (this._showLayerDialogMinHeight < dialogHeight) {
				this._showLayerDialogHeight = dialogHeight;
			}

		} else {
			layerOperationContainerWgt.hide();
		}
	}
});

////////////////////////////////////////////////////////////////////////
// レイヤ名変更ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalLayerNameAs = MKR.Dialog.ModalBase.extend({

	// 名前確定: mkrDialog:layerNameAs
	// キャンセル: mkrDialog:cancel
	includes: L.Mixin.Events,

	options: {
		index: 0,
		srcName: "",
		srcDisplayName: "",
		nameCheckCallback: function (index, nameNew, displayNameNew, layerNameAsDialog) { layerNameAsDialog.nameOk(nameNew, displayNameNew); }
	},

	initialWidth: MKR.Lang.Dialog.ModalLayerNameAs.initialWidth,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, options) {

		var self = this;

		this.options = $.extend(true, {}, this.options, options);

		var dialogBodyTemplate =
			"<div>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-3 control-label mkr_required'>" + MKR.Lang.Dialog.ModalLayerNameAs.displayNameLabel + "</label>" +
						"<div class='col-xs-9'>" +
							"<input type='text' class='form-control mkr_display_name_as' placeholder='' />" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>" + MKR.Lang.Dialog.ModalLayerNameAs.filenameLabel + "</label>" +
						"<div class='col-xs-8'>" +
							"<input type='text' class='form-control mkr_name_as' placeholder='' />" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='mkr_dialog_footer'>" +
					"<button type='button' class='btn btn-success mkr_rename'>" + MKR.Lang.Dialog.ModalLayerNameAs.renameButtonCaption + "</button>" +
					"<button type='button' class='btn btn-default mkr_cancel'>" + MKR.Lang.Dialog.ModalLayerNameAs.cancelButtonCaption + "</button>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		var displayNameAsWgt = dialogBodyWgt.find(".mkr_display_name_as");
		var nameAsWgt = dialogBodyWgt.find(".mkr_name_as");

		var displayNameAsPopover = new MKR.Widget.InputPopover(displayNameAsWgt.parents(".form-group"), displayNameAsWgt);
		var nameAsPopover = new MKR.Widget.InputPopover(nameAsWgt.parents(".form-group"), nameAsWgt);

		//
		// 画面
		//

		displayNameAsWgt.val(this.options.srcDisplayName);
		nameAsWgt.val(this.options.srcName);

		//
		// イベント
		//

		// 変更
		dialogBodyWgt.find(".mkr_rename").on("click", function (event) {

			var displayNameAs = MKR.WidgetUtil.trimVal(displayNameAsWgt);
			if (displayNameAs === "") {
				displayNameAsPopover.showError(MKR.Lang.Dialog.ModalLayerNameAs.displayNameIsEmptyMessage);
				return;
			}
			displayNameAsPopover.hide();

			var nameAs = MKR.WidgetUtil.trimVal(nameAsWgt);
			if (nameAs === "") {
				nameAsPopover.showError(MKR.Lang.Dialog.ModalLayerNameAs.filenameIsEmptyMessage);
				return;
			}
			if (!nameAs.match(/^[a-zA-Z0-9_]+$/)) {
				nameAsPopover.showError(MKR.Lang.Dialog.ModalLayerNameAs.invalidFilenameMessage);
				return;
			}
			nameAsPopover.hide();

			self.options.nameCheckCallback(self.options.index, nameAs, displayNameAs, self);
		});

		// キャンセル
		dialogBodyWgt.find(".mkr_cancel").on("click", function (event) {
			self.fire("mkrDialog:cancel");
			self.close();
		});

		MKR.Dialog.ModalBase.prototype.initialize.call(this, dialogManager, "mkr_layer_name_as_dialog", MKR.Lang.Dialog.ModalLayerNameAs.dialogTitle, dialogBodyWgt, {
			resizable: false,
			minWidth: this.initialWidth,
			maxWidth: Math.min(this.initialWidth + 200, 600)
		});
	},

	//
	// 表示時に呼び出される
	//----------------------------------------------------------------------
	//

	onShown: function () {
		this.dialogWgt.find(".mkr_display_name_as").focus();
	},

	//
	// 名前が OK の時、nameCheckCallback から確定した名前を引数にして呼び出すこと
	//----------------------------------------------------------------------
	//

	nameOk: function (name, displayName) {
		this.fire("mkrDialog:layerNameAs", { name: name, displayName: displayName });
		this.close();
	}
});

////////////////////////////////////////////////////////////////////////
// レイヤ保存ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalSaveLayer = MKR.Dialog.ModalBase.extend({

	// 保存: mkrDialog:saveAs
	includes: L.Mixin.Events,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager) {

		var self = this;

		var dialogBodyTemplate =
			"<div>" +

				"<p class='mkr_description'>" + MKR.Lang.Dialog.ModalSaveLayer.saveDescription + "</p>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>" + MKR.Lang.Dialog.ModalSaveLayer.filenameLabel + "</label>" +
						"<div class='col-xs-8'>" +
							"<input type='text' class='form-control mkr_save_file_name' placeholder='' />" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='checkbox'>" +
					"<label title='" + MKR.Lang.Dialog.ModalSaveLayer.includePublishFilesTitle + "'>" +
						"<input type='checkbox' class='mkr_include_publish_files' /><span class='mkr_include_publish_files_caption'>" + MKR.Lang.Dialog.ModalSaveLayer.includePublishFilesLabel + "</span>" +
					"</label>" +
				"</div>" +

				"<div class='mkr_dialog_footer'>" +
					"<button type='button' class='btn btn-success mkr_save'>" + MKR.Lang.Dialog.ModalSaveLayer.saveButtonCaption + "</button>" +
					"<button type='button' class='btn btn-default mkr_cancel'>" + MKR.Lang.Dialog.ModalSaveLayer.cancelButtonCaption + "</button>" +
				"</div>" +

			"</div>" +
			"";

		var momt = moment();

		var dialogBodyWgt = $(dialogBodyTemplate);
		var saveFilenameWgt = dialogBodyWgt.find(".mkr_save_file_name");
		var includePublishFilesWgt = dialogBodyWgt.find(".mkr_include_publish_files");

		var saveFilenamePopover = new MKR.Widget.InputPopover(saveFilenameWgt.parents(".form-group"), saveFilenameWgt);

		//
		// 画面
		//
		saveFilenameWgt.val(momt.format("YYYYMMDDHHmmssSSS"));

		//
		// イベント
		//

		// 保存
		dialogBodyWgt.find(".mkr_save").on("click", function (event) {

			var saveFilename = MKR.WidgetUtil.trimVal(saveFilenameWgt);
			if (saveFilename === "") {
				saveFilenamePopover.showError(MKR.Lang.Dialog.ModalSaveLayer.filenameIsEmptyMessage);
				return;
			}
			if (!saveFilename.match(/^[a-zA-Z0-9_]+$/)) {
				saveFilenamePopover.showError(MKR.Lang.Dialog.ModalSaveLayer.invalidFilenameMessage);
				return;
			}

			saveFilenamePopover.hide();

			var includePublishFiles = includePublishFilesWgt.prop("checked");
			if (includePublishFiles) {

				var publishInfoDialog = new MKR.Dialog.ModalPublishInfo(dialogManager);
				publishInfoDialog.on("mkrDialog:save", function (event) {
					self.fire("mkrDialog:saveAs", { filename: saveFilename, publishInfo: event.publishInfo, includePublishFiles: true });
					self.close();
				});
				publishInfoDialog.showModal();

			} else {
				self.fire("mkrDialog:saveAs", { filename: saveFilename, publishInfo: null, includePublishFiles: false });
				self.close();
			}
		});

		// キャンセル
		dialogBodyWgt.find(".mkr_cancel").on("click", function (event) {
			self.close();
		});

		MKR.Dialog.ModalBase.prototype.initialize.call(this, dialogManager, "mkr_save_layer_dialog", MKR.Lang.Dialog.ModalSaveLayer.dialogTitle, dialogBodyWgt, {
			resizable: false
		});
	},

	//
	// 表示時に呼び出される
	//----------------------------------------------------------------------
	//

	onShown: function () {
		this.dialogWgt.find(".mkr_save_file_name").focus();
	}
});

////////////////////////////////////////////////////////////////////////
// 公開に必要な情報の設定ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalPublishInfo = MKR.Dialog.ModalBase.extend({

	// 保存: mkrDialog:save
	includes: L.Mixin.Events,

	dialogOptions: {
		saveButtonCaption: MKR.Lang.Dialog.ModalPublishInfo.saveButtonCaption
	},

	mapOptions: {
		mapName: "",
		mapTileNames: []
	},

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, dialogOptions, mapOptions) {

		var self = this;

		this.dialogOptions = $.extend(true, {}, this.dialogOptions, dialogOptions);
		this.mapOptions = $.extend(true, {}, this.mapOptions, mapOptions);

		var dialogBodyTemplate =
			"<div>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>" + MKR.Lang.Dialog.ModalPublishInfo.mapNameLabel + "</label>" +
						"<div class='col-xs-8'>" +
							"<input type='text' class='form-control mkr_map_name' placeholder='' />" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>" + MKR.Lang.Dialog.ModalPublishInfo.initialMapLabel + "</label>" +
						"<div class='col-xs-8'>" +
							"<select class='form-control mkr_initial_map_tile' title='" + MKR.Lang.Dialog.ModalPublishInfo.selectInitialMapTitle + "'>" +
							"</select>" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='form-horizontal mkr_map_tiles_pane'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>" + MKR.Lang.Dialog.ModalPublishInfo.displayMapsLabel + "</label>" +
						"<div class='col-xs-8 mkr_map_tiles'>" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='mkr_dialog_footer'>" +
					"<button type='button' class='btn btn-success mkr_save'></button>" +
					"<button type='button' class='btn btn-default mkr_cancel'>" + MKR.Lang.Dialog.ModalPublishInfo.cancelButtonCaption + "</button>" +
				"</div>" +

			"</div>" +
			"";

		var mapTileTemplate =
			"<div class='checkbox'>" +
				"<label title='" + MKR.Lang.Dialog.ModalPublishInfo.selectDisplayMapsTitle + "'>" +
					"<input type='checkbox' class='mkr_map_tile' data-map-name='' /><span class='mkr_map_tile_caption'></span>" +
				"</label>" +
			"</div>" +
			"";

		var initialMapTileOptionTemplate =
			"<option value='' class='mkr_initial_map_tile_option'></option>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		var mapNameWgt = dialogBodyWgt.find(".mkr_map_name");
		var initialMapTileWgt = dialogBodyWgt.find(".mkr_initial_map_tile");
		var mapTilesWgt = dialogBodyWgt.find(".mkr_map_tiles");
		var saveWgt = dialogBodyWgt.find(".mkr_save");

		var mapNamePopover = new MKR.Widget.InputPopover(mapNameWgt.parents(".form-group"), mapNameWgt);

		//
		// 画面
		//

		// 保存ボタン
		saveWgt.text(this.dialogOptions.saveButtonCaption);

		// マップ名
		mapNameWgt.val(this.mapOptions.mapName);

		var initialMapTileName = null;
		if (0 < this.mapOptions.mapTileNames.length) {

			var mapTileName = this.mapOptions.mapTileNames[0];

			if (0 <= MKR.ConfigUtil.indexOfMapTileByName(MKR.Configs.mapTiles, mapTileName)) {
				initialMapTileName = mapTileName;
			}
		}

		// 表示地図、初期表示地図
		for (var i = 0; i < MKR.Configs.mapTiles.length; ++i) {
			var mapTile = MKR.Configs.mapTiles[i];

			// 初期表示地図
			var initialMapTileOptionWgt = $(initialMapTileOptionTemplate);

			initialMapTileOptionWgt
				.text(mapTile.displayName)
				.attr("value", mapTile.name);

			initialMapTileWgt.append(initialMapTileOptionWgt);

			// 表示地図
			var mapTileWgt = $(mapTileTemplate);

			var mapTileCheckWgt = mapTileWgt.find(".mkr_map_tile");

			mapTileCheckWgt.attr("data-map-name", mapTile.name);

			if ((initialMapTileName === null && i === 0)
			 || (initialMapTileName !== null && initialMapTileName === mapTile.name)) {
				mapTileCheckWgt
					.prop("disabled", true)
					.prop("checked", true);
			}

			if (0 <= $.inArray(mapTile.name, this.mapOptions.mapTileNames)) {
				mapTileCheckWgt.prop("checked", true);
			}

			mapTileWgt.find(".mkr_map_tile_caption")
				.text(mapTile.displayName);

			mapTilesWgt.append(mapTileWgt);
		}

		// 初期表示地図
		if (initialMapTileName !== null) {
			initialMapTileWgt.val(initialMapTileName);
		}

		//
		// イベント
		//

		// 初期表示地図
		initialMapTileWgt.on("change", function (event) {
			var initialMapName = initialMapTileWgt.val();

			mapTilesWgt.find(".mkr_map_tile").prop("disabled", false);

			var mapTileCheckWgt = mapTilesWgt.find(".mkr_map_tile[data-map-name='" + initialMapName + "'] ");

			mapTileCheckWgt
				.prop("disabled", true)
				.prop("checked", true);
		});

		// 保存
		saveWgt.on("click", function (event) {

			var mapName = MKR.WidgetUtil.trimVal(mapNameWgt);
			if (mapName === "") {
				mapNamePopover.showError(MKR.Lang.Dialog.ModalPublishInfo.mapNameIsEmptyMessage);
				return;
			}
			mapNamePopover.hide();

			var mapTileNames = [];

			mapTileNames.push(initialMapTileWgt.val());

			mapTilesWgt.find(".mkr_map_tile").each(function (index, elem) {
				var mapTileWgt = $(elem);

				if (mapTileWgt.prop("checked")) {
					var mapTileName = mapTileWgt.attr("data-map-name");

					if ($.inArray(mapTileName, mapTileNames) < 0) {
						mapTileNames.push(mapTileName);
					}
				}
			});

			self.fire("mkrDialog:save", { publishInfo: { mapName: mapName, mapTileNames: mapTileNames } });
			self.close();
		});

		// キャンセル
		dialogBodyWgt.find(".mkr_cancel").on("click", function (event) {
			self.close();
		});

		MKR.Dialog.ModalBase.prototype.initialize.call(
			this,
			dialogManager,
			"mkr_publish_info",
			MKR.Lang.Dialog.ModalPublishInfo.dialogTitle,
			dialogBodyWgt, {
				resizable: false
			});
	},

	//
	// 表示時に呼び出される
	//----------------------------------------------------------------------
	//

	onShown: function () {
		this.dialogWgt.find(".mkr_map_name").focus();
	}
});

////////////////////////////////////////////////////////////////////////
// レイヤ読み込みダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalLoadLayer = MKR.Dialog.ModalBase.extend({

	// 保存: mkrDialog:loadAs
	includes: L.Mixin.Events,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager) {

		var self = this;

		var dialogBodyTemplate =
			"<div>" +

				"<p class='mkr_description'>" + MKR.Lang.Dialog.ModalLoadLayer.loadDescription + "</p>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group mkr_load_file_pane'>" +
						"<label class='col-xs-3 control-label mkr_required'>" + MKR.Lang.Dialog.ModalLoadLayer.filenameLabel + "</label>" +
						"<div class='col-xs-9'>" +
							"<input type='file' class='mkr_load_file_name' />" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='checkbox'>" +
					"<label title='" + MKR.Lang.Dialog.ModalLoadLayer.removeExistsLayersTitle + "'>" +
						"<input type='checkbox' class='mkr_remove_exists_layer' /><span class='mkr_remove_exists_layer_caption'>" + MKR.Lang.Dialog.ModalLoadLayer.removeExistsLayersLabel + "</span>" +
					"</label>" +
				"</div>" +

				"<div class='mkr_dialog_footer'>" +
					"<button type='button' class='btn btn-success mkr_load'>" + MKR.Lang.Dialog.ModalLoadLayer.loadButtonCaption + "</button>" +
					"<button type='button' class='btn btn-default mkr_cancel'>" + MKR.Lang.Dialog.ModalLoadLayer.cancelButtonCaption + "</button>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		var loadFilenameWgt = dialogBodyWgt.find(".mkr_load_file_name");
		var removeExistsLayerWgt = dialogBodyWgt.find(".mkr_remove_exists_layer");

		// 先に fileinput を適用する
		loadFilenameWgt.fileinput({
			language: MKR.Lang.lang,

			allowedFileExtensions: ["zip", "geojson"],
			msgNoFilesSelected: MKR.Lang.Dialog.ModalLoadLayer.fileinput.msgNoFilesSelected,

			browseClass: "btn btn-default",
			browseLabel: "",

			removeLabel: "",
			removeIcon: "<i class='glyphicon glyphicon-remove'></i>",
			removeTitle: MKR.Lang.Dialog.ModalLoadLayer.fileinput.removeTitle,

			showPreview: false,
			showUpload: false,
			showRemove: true
		});

		// fileinput により生成されたエレメントを popover の対象とする
		var loadFilenamePopover = new MKR.Widget.InputPopover(loadFilenameWgt.parents(".form-group"), dialogBodyWgt.find(".mkr_load_file_pane .file-input .file-caption"));

		//
		// イベント
		//

		// 読込
		dialogBodyWgt.find(".mkr_load").on("click", function (event) {

			// NOTE: <input type="file"> に対しては val() で値を設定できないので注意
			var loadFilename = $.trim(loadFilenameWgt.val());
			if (loadFilename === "") {
				loadFilenamePopover.showError(MKR.Lang.Dialog.ModalLoadLayer.filenameIsEmptyMessage);
				return;
			}

			var files = loadFilenameWgt.prop("files");
			if (!files || files.length <= 0) {
				loadFilenamePopover.showError(MKR.Lang.Dialog.ModalLoadLayer.loadFileErrorMessage);
				return;
			}

			loadFilenamePopover.hide();

			if (removeExistsLayerWgt.prop("checked")) {

				var yesNoDialog = new MKR.Dialog.ModalYesNo(dialogManager, MKR.Lang.Dialog.ModalLoadLayer.allLayersDeleteMessage);
				yesNoDialog.on("mkrDialog:yes", function (event) {
					self.fire("mkrDialog:loadAs", { file: files[0], removeExistsLayer: true });
					self.close();
				});
				yesNoDialog.showModal();

			} else {
				self.fire("mkrDialog:loadAs", { file: files[0], removeExistsLayer: false });
				self.close();
			}
		});

		// キャンセル
		dialogBodyWgt.find(".mkr_cancel").on("click", function (event) {
			self.close();
		});

		MKR.Dialog.ModalBase.prototype.initialize.call(this, dialogManager, "mkr_load_layer_dialog", MKR.Lang.Dialog.ModalLoadLayer.dialogTitle, dialogBodyWgt, {
			resizable: false,
			minWidth: 500,
			maxWidth: 600
		});
	},

	//
	// 表示時に呼び出される
	//----------------------------------------------------------------------
	//

	onShown: function () {
		this.dialogWgt.find(".mkr_load_file_name").focus();
	}
});
