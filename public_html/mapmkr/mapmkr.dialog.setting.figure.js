/*
 * 設定関係の個別のダイアログ
 */

////////////////////////////////////////////////////////////////////////
// 作図設定ダイアログのベースクラス
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalSettingsBase = MKR.Dialog.ModalBase.extend({

	// 保存: mkrDialog:save
	// 既定に設定: mkrDialog:saveDefault
	// 名前を付けて保存: mkrDialog:saveAs
	// キャンセル: mkrDialog:cancel
	includes: L.Mixin.Events,

	options: {
		buttons: ["save", "saveDefault", "saveAs"],
		nameCheckCallback: function (srcName, destName, nameAsDialog) { nameAsDialog.nameOk(destName); }
	},

	figureType: null,

	// 名称・内容
	figureInfoPane: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, clazz, title, dialogBodyWgt, figureType, figureOption, options) {

		var self = this;

		this.figureType = figureType;

		this.options = $.extend(true, {}, this.options, options);
		this.options.buttons = options.buttons;

		var dialogFooterWgt = dialogBodyWgt.find(".mkr_dialog_footer");

		//
		// 画面
		//

		// 名称・内容
		this.figureInfoPane = new MKR.Dialog.Pane.FigureInfo(dialogManager, dialogBodyWgt.find(".mkr_figure_info_pane"), figureType, figureOption.figureInfo);

		// ボタン
		$.each(this.options.buttons, function (index, buttonType) {
			switch (buttonType) {
			case "save":
				dialogFooterWgt.append("<button type='button' class='btn btn-success mkr_save'>" + MKR.Lang.Dialog.ModalSettingsBase.saveButtonCaption + "</button>");
				break;
			case "saveDefault":
				dialogFooterWgt.append("<button type='button' class='btn btn-success mkr_save_default'>" + MKR.Lang.Dialog.ModalSettingsBase.saveDefaultButtonCaption + "</button>");
				break;
			case "saveAs":
				dialogFooterWgt.append("<button type='button' class='btn btn-default mkr_save_as'>" + MKR.Lang.Dialog.ModalSettingsBase.saveAsButtonCaption + "</button>");
				break;
			}
		});
		dialogFooterWgt.append("<button type='button' class='btn btn-default mkr_cancel'>" + MKR.Lang.Dialog.ModalSettingsBase.cancelButtonCaption + "</button>");

		//
		// イベント
		//

		// 保存
		dialogBodyWgt.find(".mkr_save").on("click", function (event) {
			self.fire("mkrDialog:save", { figureType: figureType, figureOption: self.getFigureOption() });
			self.close();
		});

		// 既定に設定
		dialogBodyWgt.find(".mkr_save_default").on("click", function (event) {
			self.fire("mkrDialog:saveDefault", { figureType: figureType, figureOption: self.getFigureOption() });
			self.close();
		});

		// 名前を付けて保存
		dialogBodyWgt.find(".mkr_save_as").on("click", function (event) {

			var nameAsDialogOptions = {
				dialogTitle: MKR.Lang.Dialog.ModalSettingsBase.saveAsDialog.dialogTitle,
				okWidgetCaption: MKR.Lang.Dialog.ModalSettingsBase.saveAsDialog.okWidgetCaption,
				nameCheckCallback: self.options.nameCheckCallback
			};

			var nameAsDialog = new MKR.Dialog.ModalNameAs(dialogManager, nameAsDialogOptions);
			nameAsDialog.on("mkrDialog:nameAs", function (event) {
				self.fire("mkrDialog:saveAs", { figureType: figureType, saveName: event.name, figureOption: self.getFigureOption() });
				self.close();
			});
			nameAsDialog.showModal();
		});

		// キャンセル
		dialogBodyWgt.find(".mkr_cancel").on("click", function (event) {
			self.fire("mkrDialog:cancel");
			self.close();
		});

		MKR.Dialog.ModalBase.prototype.initialize.call(this, dialogManager, clazz, title, dialogBodyWgt, options.dialogOptions);
	},


	//
	// 設定内容を取得する
	//----------------------------------------------------------------------
	//

	getFigureOption: function () {
		// 継承したクラスで実装のこと
	},

	//
	// 表示内容をダイアログサイズに合わせる
	//----------------------------------------------------------------------
	//

	adjustContents: function () {
		var resizableWgt = this.figureInfoPane.getResizableWidget();
		var resizableHeightNew = MKR.DialogUtil.calcResizableHeight(this.dialogWgt, resizableWgt, 45);
		resizableWgt.height(resizableHeightNew);
	}
});


////////////////////////////////////////////////////////////////////////
// マーカー(アイコン)の作図設定ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalMarkerSettings = MKR.Dialog.ModalSettingsBase.extend({

	options: {},

	initialHeight: 460,

	initialWidth: 440,

	_markerIconCurrentWgt: null,

	_markerSizeWgt: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, figureOption, options) {

		var self = this;

		this.options = $.extend(true, {}, {
				dialogOptions: {
					resizable: true,
					minHeight: this.initialHeight,
					minWidth: this.initialWidth,
					maxHeight: Math.min(this.initialHeight + 200, 500),
					maxWidth: Math.min(this.initialWidth + 200, 500)
				}
			}, options);

		var dialogBodyTemplate =
			"<div>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-3 control-label mkr_required'>" + MKR.Lang.Dialog.ModalMarkerSettings.iconLabel + "</label>" +
						"<div class='col-xs-9'>" +

							"<div class='btn-group mkr_marker_icon_pane'>" +
								"<span class='btn mkr_marker_icon_column' title='" + MKR.Lang.Dialog.ModalMarkerSettings.selectedIconTitle + "'><img src='' class='mkr_marker_icon mkr_marker_icon_current' /></span>" +

								"<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false' title='" + MKR.Lang.Dialog.ModalMarkerSettings.selectIconButtonTitle + "'>" +
									"<span class='caret'></span>" +
								"</button>" +
								"<div class='dropdown-menu mkr_scrollable_menu mkr_marker_icon_list'>" +
								"</div>" +
							"</div>" +
							"<button type='button' class='btn btn-default mkr_icon_import' title='" + MKR.Lang.Dialog.ModalMarkerSettings.setIconButtonTitle + "'><i class='fa fa-folder-open-o' aria-hidden='true'></i></button>" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-3 control-label mkr_required'>" + MKR.Lang.Dialog.ModalMarkerSettings.markerSizeLabel + "</label>" +
						"<div class='col-xs-9'>" +
							"<select class='form-control mkr_marker_size' title='" + MKR.Lang.Dialog.ModalMarkerSettings.selectSizeTitle + "'>" +
								"<option value='10'>0.5</option>" +
								"<option value='20'>1.0</option>" +
								"<option value='30'>1.5</option>" +
								"<option value='40'>2.0</option>" +
							"</select>" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='mkr_figure_info_pane'>" +
				"</div>" +

				"<div class='mkr_dialog_footer'>" +
				"</div>" +

			"</div>" +
			"";

		var iconLinkTemplate =
			"<a href='" + MKR.Const.JSVoid + "' class='mkr_marker_icon_selector'><img src='' class='mkr_marker_select_icon' /></a>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		var markerIconListWgt = dialogBodyWgt.find(".mkr_marker_icon_list");
		this._markerSizeWgt = dialogBodyWgt.find(".mkr_marker_size");
		this._markerIconCurrentWgt = dialogBodyWgt.find(".mkr_marker_icon_current");

		//
		// 画面
		//

		// アイコン
		this._markerIconCurrentWgt.attr({"src": figureOption.draw.icon.options.iconUrl});

		// 拡大率
		var markerSize = String(figureOption.draw.icon.options.iconSize[0]);
		this._markerSizeWgt.find("option").each(function (index, element) {
			if (markerSize === $(this).val()) {
				self._markerSizeWgt.val(markerSize);
				return false;
			}
		});

		// マーカーアイコン一覧
		for (var i = 0; i < MKR.Configs.markerIcons.length; ++i) {
			var iconLinkWgt = $(iconLinkTemplate);
			iconLinkWgt.find(".mkr_marker_select_icon").attr("src", MKR.Configs.markerIcons[i]);
			markerIconListWgt.append(iconLinkWgt);
		}

		//
		// イベント
		//

		// マーカーアイコン一覧から選択した時
		markerIconListWgt.on("click", ".mkr_marker_icon_selector", function (event) {
			var src = $(this).find(".mkr_marker_select_icon").attr("src");
			self._markerIconCurrentWgt.attr("src", src);
		});

		// アイコンを設定
		dialogBodyWgt.find(".mkr_icon_import").on("click", function (event) {
			var importIconImageDialog = new MKR.Dialog.ModalImportIconImage(dialogManager, self._markerIconCurrentWgt.attr("src"));
			importIconImageDialog.on("mkrDialog:ok", function (event) {
				self._markerIconCurrentWgt.attr("src", event.url);
			});
			importIconImageDialog.showModal();
		});


		MKR.Dialog.ModalSettingsBase.prototype.initialize.call(this, dialogManager, "mkr_marker_settings_dialog", MKR.Lang.Dialog.ModalMarkerSettings.dialogTitle, dialogBodyWgt, MKR.FigureType.Marker, figureOption, this.options);
	},

	//
	// 設定内容を取得する
	//----------------------------------------------------------------------
	//

	getFigureOption: function () {

		var dialogWgt = this.dialogWgt;

		var figureOptionNew = MKR.SettingUtil.getNewFigureOption(this.figureType);

		var size = MKR.Number.parseInt(this._markerSizeWgt.val());
		var anchor = Math.floor(size / 2);

		figureOptionNew.draw.icon = new L.Icon({
			iconUrl: this._markerIconCurrentWgt.attr("src"),
			iconSize: [size, size],
			iconAnchor: [anchor, anchor]
		});

		figureOptionNew.figureInfo = this.figureInfoPane.getFigureInfo();

		return figureOptionNew;
	}
});


////////////////////////////////////////////////////////////////////////
// アイコンの設定ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalImportIconImage = MKR.Dialog.ModalBase.extend({

	// OK: mkrDialog:ok
	// キャンセル: mkrDialog:cancel
	includes: L.Mixin.Events,

	minWidth: 500,
	maxWidth: 500,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, origUrl) {

		var self = this;

		origUrl = origUrl || "";

		var dialogBodyTemplate =
			"<div>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>URL</label>" +
						"<div class='col-xs-8'>" +
							"<textarea class='form-control mkr_url' placeholder='例:http://www.koutou-software.net/images/kswsLogo.png'></textarea>" +
						"</div>" +
						"<div class='col-xs-offset-4 col-xs-8'>" +
							"<div class='mkr_url_description'>" +
								MKR.Lang.Dialog.ModalImportIconImage.iconSizeDescription +
							"</div>" +
						"</div>" +
					"</div>" +

					"<div class='form-group mkr_img_file_pane'>" +
						"<label class='col-xs-4 control-label'>" + MKR.Lang.Dialog.ModalImportIconImage.loadImageFileLabel + "</label>" +
						"<div class='col-xs-8'>" +
							"<input type='file' class='mkr_img_file_name' />" +
						"</div>" +
						"<div class='col-xs-offset-4 col-xs-8'>" +
							"<div class='mkr_img_file_name_description'>" +
								MKR.Const.DataImageWarning +
							"</div>" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='mkr_dialog_footer'>" +
					"<button type='button' class='btn btn-success mkr_ok'>OK</button>" +
					"<button type='button' class='btn btn-default mkr_cancel'>" + MKR.Lang.Dialog.ModalImportIconImage.cancelButtonCaption + "</button>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		var urlWgt = dialogBodyWgt.find(".mkr_url");
		var imgFilenameWgt = dialogBodyWgt.find(".mkr_img_file_name");

		imgFilenameWgt.fileinput({
			language: MKR.Lang.lang,

			browseClass: "btn btn-default",
			browseLabel: "",

			removeLabel: "",
			removeIcon: "<i class='glyphicon glyphicon-remove'></i>",
			removeTitle: MKR.Lang.Dialog.ModalImportIconImage.fileinput.removeTitle,

			showPreview: false,
			showUpload: false,
			showRemove: true
		});

		var urlPopover = new MKR.Widget.InputPopover(urlWgt.parents(".form-group"), urlWgt);

		// fileinput により生成されたエレメントを popover の対象とする
		var imgFilenamePopover = new MKR.Widget.InputPopover(imgFilenameWgt.parents(".form-group"), dialogBodyWgt.find(".mkr_img_file_pane .file-input .file-caption"));

		//
		// 画面
		//

		urlWgt.val(origUrl);

		//
		// イベント
		//

		imgFilenameWgt.on("change", function (event) {

			var imgFilename = $.trim(imgFilenameWgt.val());
			if (imgFilename === "") {
				return;
			}

			var files = imgFilenameWgt.prop("files");
			if (!files || files.length <= 0) {
				imgFilenamePopover.showError(MKR.Lang.Dialog.ModalImportIconImage.loadFileErrorMessage);
				return;
			}

			var fileReader = new FileReader();
			fileReader.onload = function (event) {
				var dataUrl = event.target.result;

				if (dataUrl.indexOf("data:image") === 0) {
					urlWgt.val(dataUrl);
					imgFilenamePopover.hide();
				} else {
					imgFilenamePopover.showError(MKR.Lang.Dialog.ModalImportIconImage.fileFormatErrorMessage);
				}
			};
			fileReader.onerror = function(event) {
				imgFilenamePopover.showError(MKR.Lang.Dialog.ModalImportIconImage.readFileErrorMessage);
			};
			fileReader.readAsDataURL(files[0]);
		});

		// OK
		dialogBodyWgt.find(".mkr_ok").on("click", function (event) {

			var url = MKR.WidgetUtil.trimVal(urlWgt);

			if (url === "") {
				urlPopover.showError(MKR.Lang.Dialog.ModalImportIconImage.urlIsEmptyMessage);
				return;
			}
			if (url.indexOf("data:image") === 0 || url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
				// OK
			} else {
				urlPopover.showError(MKR.Lang.Dialog.ModalImportIconImage.urlIsEmptyMessage);
				return;
			}
			urlPopover.hide();

			self.fire("mkrDialog:ok", { url: url });
			self.close();
		});

		// キャンセル
		dialogBodyWgt.find(".mkr_cancel").on("click", function (event) {
			self.fire("mkrDialog:cancel");
			self.close();
		});

		MKR.Dialog.ModalBase.prototype.initialize.call(this, dialogManager, "mkr_import_icon_image_dialog", MKR.Lang.Dialog.ModalImportIconImage.dialogTitle, dialogBodyWgt, {
			resizable: false,
			minWidth: this.minWidth,
			maxWidth: this.maxWidth
		});
	},

	//
	// 表示時に呼び出される
	//----------------------------------------------------------------------
	//

	onShown: function () {
		this.dialogWgt.find(".mkr_url").focus();
	}
});



////////////////////////////////////////////////////////////////////////
// 線の作図設定ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalPolylineSettings = MKR.Dialog.ModalSettingsBase.extend({

	options: {},

	initialHeight: 500,

	initialWidth: MKR.Lang.Dialog.ModalPolylineSettings.initialWidth,

	_polylineWeightWgt: null,
	_polylineColorPicker: null,
	_polylineOpacitySlider: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, figureOption, options) {

		var self = this;

		this.options = $.extend(true, {}, {
				dialogOptions: {
					resizable: true,
					minHeight: this.initialHeight,
					minWidth: this.initialWidth,
					maxHeight: Math.min(this.initialHeight + 200, 550),
					maxWidth: Math.min(this.initialWidth + 200, MKR.Lang.Dialog.ModalPolylineSettings.maxWidth)
				}
			}, options);

		var dialogBodyTemplate =
			"<div>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>" + MKR.Lang.Dialog.ModalPolylineSettings.lineWidthLabel + "</label>" +
						"<div class='col-xs-8'>" +
							"<select class='form-control mkr_polyline_weight' title='" + MKR.Lang.Dialog.ModalPolylineSettings.selectLineWidthTitle + "'>" +
								"<option value='1'>1px</option>" +
								"<option value='3'>3px</option>" +
								"<option value='5'>5px</option>" +
								"<option value='10'>10px</option>" +
								"<option value='15'>15px</option>" +
								"<option value='25'>25px</option>" +
							"</select>" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>" + MKR.Lang.Dialog.ModalPolylineSettings.lineColorLabel + "</label>" +
						"<div class='col-xs-8'>" +
							"<div class='input-group colorpicker-component mkr_polyline_color_pane'>" +
								"<input type='text' class='form-control mkr_polyline_color' placeholder='" + MKR.Lang.Dialog.ModalPolylineSettings.lineColorExample + "' title='" + MKR.Lang.Dialog.ModalPolylineSettings.inputLineColorTitle + "'  />" +
								"<span class='input-group-addon' title='" + MKR.Lang.Dialog.ModalPolylineSettings.selectLineColorTitle + "'><i></i></span>" +
							"</div>" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>" + MKR.Lang.Dialog.ModalPolylineSettings.lineOpacityLabel + "</label>" +
						"<div class='col-xs-2'>" +
							"<div class='form-control-static'>" +
								"<span class='mkr_polyline_opacity_value'></span><span>%</span>" +
							"</div>" +
						"</div>" +
						"<div class='col-xs-6'>" +
							"<div class='form-control-static mkr_polyline_opacity_pane' title='" + MKR.Lang.Dialog.ModalPolylineSettings.selectLineOpacityTitle + "'>" +
								"<div class='mkr_polyline_opacity'></div>" +
							"</div>" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='mkr_figure_info_pane'>" +
				"</div>" +

				"<div class='mkr_dialog_footer'>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		var polylineColorPaneWgt = dialogBodyWgt.find(".mkr_polyline_color_pane");

		this._polylineWeightWgt = dialogBodyWgt.find(".mkr_polyline_weight");
		var polylineColorWgt = dialogBodyWgt.find(".mkr_polyline_color");

		//
		// 画面
		//

		// 線幅
		var polylineWeight = String(figureOption.draw.shapeOptions.weight);
		this._polylineWeightWgt.find("option").each(function (index, element) {
			if (polylineWeight === $(this).val()) {
				self._polylineWeightWgt.val(polylineWeight);
				return false;
			}
		});

		// 線色
		this._polylineColorPicker = new MKR.Widget.ColorPicker(polylineColorPaneWgt, polylineColorWgt, MKR.Color.getColor(MKR.Color.getRgba(figureOption.draw.shapeOptions.color)));

		// 線の透過率
		this._polylineOpacitySlider = new MKR.Widget.OpacitySlider(dialogBodyWgt.find(".mkr_polyline_opacity"), dialogBodyWgt.find(".mkr_polyline_opacity_value"), figureOption.draw.shapeOptions.opacity);

		MKR.Dialog.ModalSettingsBase.prototype.initialize.call(this, dialogManager, "mkr_polyline_settings_dialog", MKR.Lang.Dialog.ModalPolylineSettings.dialogTitle, dialogBodyWgt, MKR.FigureType.Polyline, figureOption, this.options);
	},

	//
	// 設定内容を取得する
	//----------------------------------------------------------------------
	//

	getFigureOption: function () {

		var dialogWgt = this.dialogWgt;

		var figureOptionNew = MKR.SettingUtil.getNewFigureOption(this.figureType);

		figureOptionNew.draw.shapeOptions.weight = MKR.Number.parseInt(this._polylineWeightWgt.val());
		figureOptionNew.draw.shapeOptions.color = this._polylineColorPicker.getColor();
		figureOptionNew.draw.shapeOptions.opacity = this._polylineOpacitySlider.getOpacity();

		figureOptionNew.figureInfo = this.figureInfoPane.getFigureInfo();

		return figureOptionNew;
	}
});

////////////////////////////////////////////////////////////////////////
// ポリゴンの作図設定ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalPolygonSettings = MKR.Dialog.ModalSettingsBase.extend({

	options: {},

	initialHeight: 600,

	initialWidth: MKR.Lang.Dialog.ModalPolygonSettings.initialWidth,

	_polylineWeightWgt: null,
	_polylineColorPicker: null,
	_polylineOpacitySlider: null,

	_polyfillColorPicker: null,
	_polyfillOpacitySlider: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, figureOption, options) {

		var self = this;

		this.options = $.extend(true, {}, {
				dialogOptions: {
					resizable: true,
					minHeight: this.initialHeight,
					minWidth: this.initialWidth,
					maxHeight: Math.min(this.initialHeight + 200, 650),
					maxWidth: Math.min(this.initialWidth + 200, MKR.Lang.Dialog.ModalPolygonSettings.maxWidth)
				}
			}, options);

		var dialogBodyTemplate =
			"<div>" +

				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>" + MKR.Lang.Dialog.ModalPolygonSettings.lineWidthLabel + "</label>" +
						"<div class='col-xs-8'>" +
							"<select class='form-control mkr_polyline_weight' title='" + MKR.Lang.Dialog.ModalPolygonSettings.selectLineWidthTitle + "'>" +
								"<option value='1'>1px</option>" +
								"<option value='3'>3px</option>" +
								"<option value='5'>5px</option>" +
								"<option value='10'>10px</option>" +
								"<option value='15'>15px</option>" +
								"<option value='25'>25px</option>" +
							"</select>" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>" + MKR.Lang.Dialog.ModalPolygonSettings.lineColorLabel + "</label>" +
						"<div class='col-xs-8'>" +
							"<div class='input-group colorpicker-component mkr_polyline_color_pane'>" +
								"<input type='text' class='form-control mkr_polyline_color' placeholder='" + MKR.Lang.Dialog.ModalPolygonSettings.lineColorExample + "' title='" + MKR.Lang.Dialog.ModalPolygonSettings.inputLineColorTitle + "' />" +
								"<span class='input-group-addon' title='" + MKR.Lang.Dialog.ModalPolygonSettings.selectLineColorTitle + "'><i></i></span>" +
							"</div>" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>" + MKR.Lang.Dialog.ModalPolygonSettings.lineOpacityLabel + "</label>" +
						"<div class='col-xs-2'>" +
							"<div class='form-control-static'>" +
								"<span class='mkr_polyline_opacity_value'></span><span>%</span>" +
							"</div>" +
						"</div>" +
						"<div class='col-xs-6'>" +
							"<div class='form-control-static mkr_polyline_opacity_pane' title='" + MKR.Lang.Dialog.ModalPolygonSettings.selectLineOpacityTitle + "'>" +
								"<div class='mkr_polyline_opacity'></div>" +
							"</div>" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>" + MKR.Lang.Dialog.ModalPolygonSettings.fillColorLabel + "</label>" +
						"<div class='col-xs-8'>" +
							"<div class='input-group colorpicker-component mkr_polyfill_color_pane'>" +
								"<input type='text' class='form-control mkr_polyfill_color' placeholder='" + MKR.Lang.Dialog.ModalPolygonSettings.fillColorExample + "' title='" + MKR.Lang.Dialog.ModalPolygonSettings.inputFillColorTitle + "' />" +
								"<span class='input-group-addon' title='" + MKR.Lang.Dialog.ModalPolygonSettings.selectFillColorTitle + "'><i></i></span>" +
							"</div>" +
						"</div>" +
					"</div>" +

					"<div class='form-group'>" +
						"<label class='col-xs-4 control-label mkr_required'>" + MKR.Lang.Dialog.ModalPolygonSettings.fillOpacityLabel + "</label>" +
						"<div class='col-xs-2'>" +
							"<div class='form-control-static'>" +
								"<span class='mkr_polyfill_opacity_value'></span><span>%</span>" +
							"</div>" +
						"</div>" +
						"<div class='col-xs-6'>" +
							"<div class='form-control-static mkr_polyline_opacity_pane' title='" + MKR.Lang.Dialog.ModalPolygonSettings.selectFillOpacityTitle + "'>" +
								"<div class='mkr_polyfill_opacity'></div>" +
							"</div>" +
						"</div>" +
					"</div>" +

				"</div>" +

				"<div class='mkr_figure_info_pane'>" +
				"</div>" +

				"<div class='mkr_dialog_footer'>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		var polylineColorPaneWgt = dialogBodyWgt.find(".mkr_polyline_color_pane");
		var polyfillColorPaneWgt = dialogBodyWgt.find(".mkr_polyfill_color_pane");

		this._polylineWeightWgt = dialogBodyWgt.find(".mkr_polyline_weight");
		var polylineColorWgt = dialogBodyWgt.find(".mkr_polyline_color");

		var polyfillColorWgt = dialogBodyWgt.find(".mkr_polyfill_color");

		//
		// 画面
		//

		// 線幅
		var polylineWeight = String(figureOption.draw.shapeOptions.weight);
		this._polylineWeightWgt.find("option").each(function (index, element) {
			if (polylineWeight === $(this).val()) {
				self._polylineWeightWgt.val(polylineWeight);
				return false;
			}
		});


		// 線色
		this._polylineColorPicker = new MKR.Widget.ColorPicker(polylineColorPaneWgt, polylineColorWgt, MKR.Color.getColor(MKR.Color.getRgba(figureOption.draw.shapeOptions.color)));

		// 線の透過率
		this._polylineOpacitySlider = new MKR.Widget.OpacitySlider(dialogBodyWgt.find(".mkr_polyline_opacity"), dialogBodyWgt.find(".mkr_polyline_opacity_value"), figureOption.draw.shapeOptions.opacity);

		// 塗潰し色
		this._polyfillColorPicker = new MKR.Widget.ColorPicker(polyfillColorPaneWgt, polyfillColorWgt, MKR.Color.getColor(MKR.Color.getRgba(figureOption.draw.shapeOptions.fillColor)));

		// 塗潰し透過率
		this._polyfillOpacitySlider = new MKR.Widget.OpacitySlider(dialogBodyWgt.find(".mkr_polyfill_opacity"), dialogBodyWgt.find(".mkr_polyfill_opacity_value"), figureOption.draw.shapeOptions.fillOpacity);

		this.callBaseInitialize(dialogManager, dialogBodyWgt, figureOption);
	},

	//
	// ベースの初期化処理を呼ぶ
	//----------------------------------------------------------------------
	//

	callBaseInitialize: function (dialogManager, dialogBodyWgt, figureOption) {
		MKR.Dialog.ModalSettingsBase.prototype.initialize.call(this, dialogManager, "mkr_polygon_settings_dialog", MKR.Lang.Dialog.ModalPolygonSettings.dialogTitle, dialogBodyWgt, MKR.FigureType.Polygon, figureOption, this.options);
	},

	//
	// 設定内容を取得する
	//----------------------------------------------------------------------
	//

	getFigureOption: function () {

		var dialogWgt = this.dialogWgt;

		var figureOptionNew = MKR.SettingUtil.getNewFigureOption(this.figureType);

		figureOptionNew.draw.shapeOptions.weight = MKR.Number.parseInt(this._polylineWeightWgt.val());
		figureOptionNew.draw.shapeOptions.color = this._polylineColorPicker.getColor();
		figureOptionNew.draw.shapeOptions.opacity = this._polylineOpacitySlider.getOpacity();

		figureOptionNew.draw.shapeOptions.fillColor = this._polyfillColorPicker.getColor();
		figureOptionNew.draw.shapeOptions.fillOpacity = this._polyfillOpacitySlider.getOpacity();

		figureOptionNew.figureInfo = this.figureInfoPane.getFigureInfo();

		return figureOptionNew;
	}
});

////////////////////////////////////////////////////////////////////////
// 円の作図設定ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalCircleSettings = MKR.Dialog.ModalPolygonSettings.extend({

	//
	// ベースの初期化処理を呼ぶ
	//----------------------------------------------------------------------
	//

	callBaseInitialize: function (dialogManager, dialogBodyWgt, figureOption) {
		MKR.Dialog.ModalSettingsBase.prototype.initialize.call(this, dialogManager, "mkr_circle_settings_dialog", MKR.Lang.Dialog.ModalCircleSettings.dialogTitle, dialogBodyWgt, MKR.FigureType.Circle, figureOption, this.options);
	}

});

////////////////////////////////////////////////////////////////////////
// マーカー(円)の作図設定ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalCircleMarkerSettings = MKR.Dialog.ModalPolygonSettings.extend({

	//
	// ベースの初期化処理を呼ぶ
	//----------------------------------------------------------------------
	//

	callBaseInitialize: function (dialogManager, dialogBodyWgt, figureOption) {
		MKR.Dialog.ModalSettingsBase.prototype.initialize.call(this, dialogManager, "mkr_circle_marker_settings_dialog", MKR.Lang.Dialog.ModalCircleMarkerSettings.dialogTitle, dialogBodyWgt, MKR.FigureType.CircleMarker, figureOption, this.options);
	}

});

////////////////////////////////////////////////////////////////////////
// マーカー(テキスト)の作図設定ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalDivIconMarkerSettings = MKR.Dialog.ModalSettingsBase.extend({

	options: {},

	initialHeight: 480,

	initialWidth: 440,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, figureOption, options) {

		var self = this;

		this.options = $.extend(true, {}, {
				dialogOptions: {
					resizable: true,
					minHeight: this.initialHeight,
					minWidth: this.initialWidth,
					maxHeight: Math.min(this.initialHeight + 200, 500),
					maxWidth: Math.min(this.initialWidth + 200, 500)
				}
			}, options);

		var dialogBodyTemplate =
			"<div>" +

				"<div class='form-group'>" +
					"<label class='control-label mkr_required'>" + MKR.Lang.Dialog.ModalDivIconMarkerSettings.htmlLabel + "</label>" +
					"<textarea class='form-control mkr_html' placeholder='" + MKR.Lang.Dialog.ModalDivIconMarkerSettings.htmlExample + "' title='" + MKR.Lang.Dialog.ModalDivIconMarkerSettings.htmlTitle + "'></textarea>" +
				"</div>" +

				"<div class='mkr_figure_info_pane'>" +
				"</div>" +

				"<div class='mkr_dialog_footer'>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);

		//
		// 画面
		//

		// HTML
		dialogBodyWgt.find(".mkr_html").val(figureOption.draw.icon.getHtml());

		MKR.Dialog.ModalSettingsBase.prototype.initialize.call(this, dialogManager, "mkr_div_icon_marker_settings_dialog", MKR.Lang.Dialog.ModalDivIconMarkerSettings.dialogTitle, dialogBodyWgt, MKR.FigureType.DivIconMarker, figureOption, this.options);
	},

	//
	// 設定内容を取得する
	//----------------------------------------------------------------------
	//

	getFigureOption: function () {

		var dialogWgt = this.dialogWgt;

		var figureOptionNew = MKR.SettingUtil.getNewFigureOption(this.figureType);

		figureOptionNew.draw.icon = new MKR.DivIcon({
			htmlValue: $.trim(dialogWgt.find(".mkr_html").val())
		});

		figureOptionNew.figureInfo = this.figureInfoPane.getFigureInfo();

		return figureOptionNew;
	}
});

////////////////////////////////////////////////////////////////////////
// 名称・内容ペイン
////////////////////////////////////////////////////////////////////////

MKR.Dialog.Pane.FigureInfo = L.Class.extend({

	_figureType: null,

	_figureInfoWgt: null,

	_figureTypeToText: MKR.Lang.Dialog.Pane.FigureInfo.figureTypeToText,

	_figureTypeToTable: MKR.Lang.Dialog.Pane.FigureInfo.figureTypeToTable,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, parentWgt, figureType, figureInfo) {

		var self = this;

		this._figureType = figureType;

		var figureInfoTemplate =
			"<div class='well well-sm'>" +
				"<div class='form-horizontal'>" +

					"<div class='form-group'>" +
						"<label class='col-xs-2 control-label'>" + MKR.Lang.Dialog.Pane.FigureInfo.nameLabel + "</label>" +
						"<div class='col-xs-10'>" +
							"<input type='text' class='form-control mkr_figure_info_name' placeholder='" + MKR.Lang.Dialog.Pane.FigureInfo.nameExample + "' title='" + MKR.Lang.Dialog.Pane.FigureInfo.inputNameTitle + "' />" +
						"</div>" +
					"</div>" +

					"<div class='mkr_switch_figure_info_type_pane'>" +
						"<a href='" + MKR.Const.JSVoid + "' class='pull-left mkr_switch_figure_info_type' title='" + MKR.Lang.Dialog.Pane.FigureInfo.toggleInputMethodTitle + "'></a>" +
						"<a href='" + MKR.Const.JSVoid + "' class='pull-right mkr_open_info_text_editor' title='" + MKR.Lang.Dialog.Pane.FigureInfo.openHtmlEditorTitle + "'>" + MKR.Lang.Dialog.Pane.FigureInfo.openHtmlEditorCaption + "</a>" +
					"</div>" +

					"<div class='mkr_figure_info_data'>" +

						"<div class='mkr_figure_info_table_pane'>" +
							"<p class='text-warning mkr_figure_info_table_warn'><i class='fa fa-info-circle' aria-hidden='true'></i>" + MKR.Lang.Dialog.Pane.FigureInfo.tablePaneWarn1Label + "</p>" +
							"<p class='text-warning mkr_figure_info_table_warn'><i class='fa fa-info-circle' aria-hidden='true'></i>" + MKR.Lang.Dialog.Pane.FigureInfo.tablePaneWarn2Label + "</p>" +
							"<table class='mkr_figure_info_table'>" +
								"<tr class='form-group'>" +
									"<td class='mkr_figure_info_key_column'>" +
										"<label class='control-label'>" + MKR.Lang.Dialog.Pane.FigureInfo.itemNameLabel + "</label>" +
									"</td>" +
									"<td>" +
										"<label class='control-label'>" + MKR.Lang.Dialog.Pane.FigureInfo.valueLabel + "</label>" +
									"</td>" +
									"<td>" +
									"</td>" +
									"<td>" +
									"</td>" +
								"</tr>" +
							"</table>" +
						"</div>" +

						"<textarea class='form-control mkr_figure_info_text' placeholder='" + MKR.Lang.Dialog.Pane.FigureInfo.textExample + "' title='" + MKR.Lang.Dialog.Pane.FigureInfo.textTitle + "'></textarea>" +

					"</div>" +

				"</div>" +
			"</div>" +
			"";

		var rowTemplate =
			"<tr class='form-group mkr_figure_info_key_value'>" +
				"<td class='mkr_figure_info_key_column'>" +
					"<input type='text' class='form-control mkr_figure_info_key' placeholder='" + MKR.Lang.Dialog.Pane.FigureInfo.itemNameExample + "' title='" + MKR.Lang.Dialog.Pane.FigureInfo.itemNameTitle + "' />" +
				"</td>" +
				"<td>" +
					"<input type='text' class='form-control mkr_figure_info_value' placeholder='" + MKR.Lang.Dialog.Pane.FigureInfo.valueExample + "' title='" + MKR.Lang.Dialog.Pane.FigureInfo.valueTitle + "' />" +
				"</td>" +
				"<td>" +
					"<button type='button' class='btn btn-default mkr_figure_info_del_row' title='" + MKR.Lang.Dialog.Pane.FigureInfo.deleteRowTitle + "'><i class='fa fa-trash-o' aria-hidden='true'></i></button>" +
				"</td>" +
				"<td>" +
					"<button type='button' class='btn btn-default mkr_figure_info_add_row' title='" + MKR.Lang.Dialog.Pane.FigureInfo.addRowTitle + "'><img src='images/icon_enter.png' /></button>" +
				"</td>" +
			"</tr>" +
			"";

		var figureInfoWgt = $(figureInfoTemplate);
		var figureInfoDataWgt = figureInfoWgt.find(".mkr_figure_info_data");
		var figureTypeSwWgt = figureInfoWgt.find(".mkr_switch_figure_info_type");
		var infoTablePaneWgt = figureInfoWgt.find(".mkr_figure_info_table_pane");
		var infoTableWgt = figureInfoWgt.find(".mkr_figure_info_table");
		var infoTextWgt = figureInfoWgt.find(".mkr_figure_info_text");
		var openInfoTextEditorWgt = figureInfoWgt.find(".mkr_open_info_text_editor");

		//
		// 画面
		//

		infoTablePaneWgt.hide();
		infoTextWgt.hide();
		openInfoTextEditorWgt.hide();

		if (figureInfo.keyValues.length === 0) {
			infoTableWgt.append(rowTemplate);
		}

		// 名称
		figureInfoWgt.find(".mkr_figure_info_name").val(figureInfo.name);

		// 内容
		if (figureInfo.type() === MKR.Option.FigureInfoType.KeyValue) {

			figureTypeSwWgt.text(this._figureTypeToText);

			for (var i = 0; i < figureInfo.keyValues.length; ++i) {
				var row = $(rowTemplate);

				var keyValue = figureInfo.keyValues[i];

				row.find(".mkr_figure_info_key").val(keyValue.key);
				row.find(".mkr_figure_info_value").val(keyValue.value);

				infoTableWgt.append(row);
			}

			figureInfoDataWgt.css({"overflow-y": "scroll"});
			infoTablePaneWgt.show();	// テーブルの外側のエレメント

		} else {

			figureTypeSwWgt.text(this._figureTypeToTable);

			infoTextWgt.val(figureInfo.text);

			figureInfoDataWgt.css({"overflow-y": "visible"});
			infoTextWgt.show();
			openInfoTextEditorWgt.show();
		}

		//
		// イベント
		//

		// 自由文入力とテーブル入力の切替え
		figureInfoWgt.find(".mkr_switch_figure_info_type").on("click", function (event) {

			if (infoTablePaneWgt.css("display") === "none") {

				figureTypeSwWgt.text(self._figureTypeToText);

				figureInfoDataWgt.css({"overflow-y": "scroll"});
				infoTextWgt.hide();
				openInfoTextEditorWgt.hide();
				infoTablePaneWgt.show();

			} else {

				figureTypeSwWgt.text(self._figureTypeToTable);

				var figureInfo = self.getFigureInfo();

				var rows = [];

				for (var i = 0; i < figureInfo.keyValues.length; ++i) {
					var key = figureInfo.keyValues[i].key;
					var value = figureInfo.keyValues[i].value;

					if (key !== "" && value !== "") {
						// テーブル入力にキー・値の両方があるときのみ設定する
						rows.push(
							$("<tr></tr>")
								.append($("<td></td>").text(key))
								.append($("<td></td>").text(value))
						);
					}
				}

				if (0 < rows.length) {
					var table = $("<table></table>");
					$.each(rows, function (index, row) {
						table.append(row);
					});

					var html = $.trim($("<div></div>").append(table).html());
					html = html.replace(/<tr>/g, "\n<tr>");
					html = html.replace(/<\/table>/g, "\n</table>");

					infoTextWgt.val(html);
				}

				figureInfoDataWgt.css({"overflow-y": "visible"});
				infoTablePaneWgt.hide();
				infoTextWgt.show();
				openInfoTextEditorWgt.show();
			}
		});

		// 自由文入力エディタを開く
		figureInfoWgt.find(".mkr_open_info_text_editor").on("click", function (event) {
			var infoTextEditorDialog = new MKR.Dialog.ModalInfoTextEditor(dialogManager, infoTextWgt.val());
			infoTextEditorDialog.on("mkrDialog:save", function (event) {
				infoTextWgt.val(event.infoText);
			});
			infoTextEditorDialog.showModal();
		});

		// テーブル項目削除
		figureInfoWgt.find(".mkr_figure_info_table").on("click", ".mkr_figure_info_del_row", function (event) {

			$(this).parents(".mkr_figure_info_key_value").remove();

			if (infoTableWgt.find(".mkr_figure_info_key_value").length <= 0) {
				infoTableWgt.append(rowTemplate);
			}
		});

		// テーブル項目追加
		figureInfoWgt.find(".mkr_figure_info_table").on("click", ".mkr_figure_info_add_row", function (event) {
			var rowWgt = $(rowTemplate);
			$(this).parents(".mkr_figure_info_key_value").after(rowWgt);
			rowWgt.find(".mkr_figure_info_key").focus();
		});

		parentWgt.append(figureInfoWgt);

		this._figureInfoWgt = figureInfoWgt;
	},

	//
	// 名称・内容を取得する
	//----------------------------------------------------------------------
	//

	getFigureInfo: function () {

		var typeHelper = new MKR.TypeHelper(this._figureType);

		var geoJSONKeys = {};
		typeHelper.geojson.setGeoJSONKeys(geoJSONKeys);

		var figureInfo = new MKR.Option.FigureInfo();

		var infoTablePaneWgt = this._figureInfoWgt.find(".mkr_figure_info_table_pane");
		var infoTableWgt = this._figureInfoWgt.find(".mkr_figure_info_table");
		var infoTextWgt = this._figureInfoWgt.find(".mkr_figure_info_text");

		figureInfo.name = $.trim(this._figureInfoWgt.find(".mkr_figure_info_name").val());

		if (infoTablePaneWgt.css("display") === "none") {

			figureInfo.text = $.trim(infoTextWgt.val());

		} else {

			infoTableWgt.find(".mkr_figure_info_key_value").each(function (index, rowElem) {
				var rowWgt = $(rowElem);

				var key = $.trim(rowWgt.find(".mkr_figure_info_key").val());

				if (key !== "") {
					// キーがある項目のみ保存する

					// GeoJSON で使用するキー値の場合はダブルクォートで囲んで保存する
					if (key === "name" || key === "description" || geoJSONKeys[key]) {
						key = "\"" + key + "\"";
					}

					figureInfo.addKeyValues(key, $.trim(rowWgt.find(".mkr_figure_info_value").val()));
				}
			});
		}

		return figureInfo;
	},

	//
	// リサイズする箇所のウィジェットを得る
	//----------------------------------------------------------------------
	//

	getResizableWidget: function() {
		return this._figureInfoWgt.find(".mkr_figure_info_data");
	}
});

////////////////////////////////////////////////////////////////////////
// 自由文入力ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalInfoTextEditor = MKR.Dialog.ModalBase.extend({

	// 設定: mkrDialog:save
	includes: L.Mixin.Events,

	options: {
		minWidth: 600,
		maxWidth: 600
	},

	_infoTextWgt: null,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, infoText) {

		var self = this;

		var dialogBodyTemplate =
			"<div>" +

				"<textarea class='mkr_info_text'></textarea>" +

				"<p class='mkr_description'>" + MKR.Lang.Dialog.ModalInfoTextEditor.editorWarnMessage + "</p>" +

				"<div class='mkr_dialog_footer'>" +
					"<button type='button' class='btn btn-success mkr_save'>" + MKR.Lang.Dialog.ModalInfoTextEditor.saveButtonCaption + "</button>" +
					"<button type='button' class='btn btn-default mkr_cancel'>" + MKR.Lang.Dialog.ModalInfoTextEditor.cancelButtonCaption + "</button>" +
				"</div>" +

			"</div>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		this._infoTextWgt = dialogBodyWgt.find(".mkr_info_text");
		var saveWgt = dialogBodyWgt.find(".mkr_save");

		//
		// 画面
		//

		this._infoTextWgt.val(infoText);

		this._infoTextWgt.trumbowyg({
			lang: MKR.Lang.lang,
			semantic: false,
			resetCss: true,

			btns: [
				["viewHTML"],
				["undo", "redo"],
				["formatting"],
				"btnGrp-design",	//// "btnGrp-semantic",
				["superscript", "subscript"],
				["link"],
				["insertImage"],
				"btnGrp-justify",
				"btnGrp-lists",
				["horizontalRule"],
				["removeformat"],
				["insertTemplte"],
				["fullscreen"]
			],

			btnsDef: {
				insertTemplte: {
					dropdown: [
						"insertTemplteUnorderedList",
						"insertTemplteOrderedList",
						"insertTemplteTitlePlusDesctiption",
						"insertTemplteTitlePlusDesctiptionPlusImage",
						"insertTemplteTitlePlusImage",
						"insertTemplteTitlePlusImagePlusDesctiption",
						"insertTemplteTitlePlusImageAndDesctiption"
					],
					hasIcon: false,
					text: "<i class='fa fa-file-code-o'></i>",
					title: MKR.Lang.Dialog.ModalInfoTextEditor.insertTemplateTitle,
				},
				insertTemplteUnorderedList: {
					fn: "insertTemplate",
					hasIcon: false,
					text: "<i class='fa fa-list-ul' style='margin-right: 14px;'></i>" + MKR.Lang.Dialog.ModalInfoTextEditor.insertUnorderedListCaption,
					param: {
						html: MKR.Lang.Dialog.ModalInfoTextEditor.unorderedListHtml
					}
				},
				insertTemplteOrderedList: {
					fn: "insertTemplate",
					hasIcon: false,
					text: "<i class='fa fa-list-ol' style='margin-right: 14px;'></i>" + MKR.Lang.Dialog.ModalInfoTextEditor.insertOrderedListCaption,
					param: {
						html: MKR.Lang.Dialog.ModalInfoTextEditor.orderedListHtml
					}
				},
				insertTemplteTitlePlusDesctiption: {
					fn: "insertTemplate",
					hasIcon: false,
					text: "<i class='fa fa-file-text-o' style='margin-right: 14px;'></i>" + MKR.Lang.Dialog.ModalInfoTextEditor.insertTitlePlusDesctiptionCaption,
					param: {
						html: MKR.Lang.Dialog.ModalInfoTextEditor.insertTitlePlusDesctiptionHtml
					}
				},
				insertTemplteTitlePlusDesctiptionPlusImage: {
					fn: "insertTemplate",
					hasIcon: false,
					text: "<i class='fa fa-file-image-o' style='margin-right: 14px;'></i>" + MKR.Lang.Dialog.ModalInfoTextEditor.insertTitlePlusDesctiptionPlusImageCaption,
					param: {
						html: MKR.Lang.Dialog.ModalInfoTextEditor.insertTitlePlusDesctiptionPlusImageHtml
					}
				},
				insertTemplteTitlePlusImage: {
					fn: "insertTemplate",
					hasIcon: false,
					text: "<i class='fa fa-file-image-o' style='margin-right: 14px;'></i>" + MKR.Lang.Dialog.ModalInfoTextEditor.insertTitlePlusImageCaption,
					param: {
						html: MKR.Lang.Dialog.ModalInfoTextEditor.insertTitlePlusImageHtml
					}
				},
				insertTemplteTitlePlusImagePlusDesctiption: {
					fn: "insertTemplate",
					hasIcon: false,
					text: "<i class='fa fa-file-image-o' style='margin-right: 14px;'></i>" + MKR.Lang.Dialog.ModalInfoTextEditor.insertTitlePlusImagePlusDesctiptionCaption,
					param: {
						html: MKR.Lang.Dialog.ModalInfoTextEditor.insertTitlePlusImagePlusDesctiptionHtml
					}
				},
				insertTemplteTitlePlusImageAndDesctiption: {
					fn: "insertTemplate",
					hasIcon: false,
					text: "<i class='fa fa-file-image-o' style='margin-right: 14px;'></i>" + MKR.Lang.Dialog.ModalInfoTextEditor.insertTitlePlusImageAndDesctiptionCaption,
					param: {
						html: MKR.Lang.Dialog.ModalInfoTextEditor.insertTitlePlusImageAndDesctiptionHtml
					}
				}
			},
			dialogManager: dialogManager,
			viewHTMLCallback: function (htmlVisiblity) {
				saveWgt.prop("disabled", htmlVisiblity);
			}
    	});

		//
		// イベント
		//

		// 設定
		saveWgt.on("click", function (event) {
			self.fire("mkrDialog:save", { infoText: self._infoTextWgt.trumbowyg("html") });
			self.close();
		});

		// キャンセル
		dialogBodyWgt.find(".mkr_cancel").on("click", function (event) {
			self.close();
		});


		MKR.Dialog.ModalBase.prototype.initialize.call(this, dialogManager, "mkr_info_text_editor_dialog", MKR.Lang.Dialog.ModalInfoTextEditor.dialogTitle, dialogBodyWgt, {
			resizable: false,
			minWidth: this.options.minWidth,
			maxWidth: this.options.maxWidth
		});
	}
});
