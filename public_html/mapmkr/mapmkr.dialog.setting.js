/*
 * 設定関係のダイアログ
 */

////////////////////////////////////////////////////////////////////////
// 作図設定の管理ダイアログ
////////////////////////////////////////////////////////////////////////

MKR.Dialog.ModalFigureSettingsMaintenance = MKR.Dialog.ModalBase.extend({

	// 保存: mkrDialog:save
	includes: L.Mixin.Events,

	initialHeight: 380,

	initialWidth: 400,

	//
	// 初期化処理
	//----------------------------------------------------------------------
	//

	initialize: function (dialogManager, figureType, _namedFigureOptionList) {

		var self = this;

		var namedFigureOptionListWork = MKR.Array.copy(_namedFigureOptionList);

		var dialogBodyTemplate =
			"<div>" +

				"<ul class='list-group mkr_figure_option_list'>" +
				"</ul>" +

				"<div class='mkr_dialog_footer'>" +
					"<button type='button' class='btn btn-success mkr_save'>" + MKR.Lang.Dialog.ModalFigureSettingsMaintenance.saveButtonCaption + "</button>" +
					"<button type='button' class='btn btn-default mkr_cancel'>" + MKR.Lang.Dialog.ModalFigureSettingsMaintenance.cancelButtonCaption + "</button>" +
				"</div>" +

			"</div>" +
			"";

		var itemTemplate =
			"<li class='list-group-item mkr_name_group'>" +
				"<div class='caption mkr_name' data-figure-option-name=''></div>" +
				"<div class='btn-group' role='group'>" +
					"<button type='button' class='btn btn-default mkr_rename' title='" + MKR.Lang.Dialog.ModalFigureSettingsMaintenance.renameButtonTitle + "'><i class='fa fa-edit' aria-hidden='true'></i></button>" +
					"<button type='button' class='btn btn-default mkr_setting_figure' title='" + MKR.Lang.Dialog.ModalFigureSettingsMaintenance.settingFigureButtonTitle + "'><i class='fa fa-cog' aria-hidden='true'></i></button>" +
					"<button type='button' class='btn btn-default mkr_copy' title='" + MKR.Lang.Dialog.ModalFigureSettingsMaintenance.copyButtonTitle + "'><i class='fa fa-copy' aria-hidden='true'></i></button>" +
					"<button type='button' class='btn btn-default mkr_delete' title='" + MKR.Lang.Dialog.ModalFigureSettingsMaintenance.deleteButtonTitle + "'><i class='fa fa-trash-o' aria-hidden='true'></i></button>" +
				"</div>" +
			"</li>" +
			"";

		var dialogBodyWgt = $(dialogBodyTemplate);
		var figureOptionListWgt = dialogBodyWgt.find(".mkr_figure_option_list");

		// 一覧の項目を作成する
		function createFigureOptionWgt(namedFigureOption) {

			var itemWgt = $(itemTemplate);

			var nameWgt = itemWgt.find(".mkr_name");
			nameWgt.attr("data-figure-option-name", namedFigureOption.name);

			var typeHelper = new MKR.TypeHelper(figureType);

			var iconWgt = typeHelper.widget.createIconWidget("mkr_figure_option_icon", namedFigureOption.figureOption);
			nameWgt.append(iconWgt);

			var nameInnerWgt = $("<span class='mkr_figure_option_name' title=''></span>");
			nameInnerWgt
				.attr("title", namedFigureOption.name)
				.text(namedFigureOption.name);
			nameWgt.append(nameInnerWgt);

			return itemWgt;
		}

		//
		// 画面
		//

		// 一覧
		for (var i = 0; i < namedFigureOptionListWork.length; ++i) {
			figureOptionListWgt.append(createFigureOptionWgt(namedFigureOptionListWork[i]));
		}

		//
		// イベント
		//

		// 名前を変更
		dialogBodyWgt.find(".mkr_figure_option_list").on("click", ".mkr_rename", function (event) {

			var nameWgt = $(this).parents(".mkr_name_group").find(".mkr_name");
			var optionName = nameWgt.attr("data-figure-option-name");

			var nameAsDialogOptions = {
				dialogTitle: MKR.Lang.Dialog.ModalFigureSettingsMaintenance.renameAsDialog.dialogTitle,
				srcName: optionName,
				okWidgetCaption: MKR.Lang.Dialog.ModalFigureSettingsMaintenance.renameAsDialog.okWidgetCaption,
				nameCheckCallback: function (srcName, destName, nameAsDialog) {

					if (optionName === destName) {
						// 名前を変更していない
						nameAsDialog.nameOk(destName);
					} else {

						if (0 <= MKR.SettingUtil.indexOfNamedFigureOptionByName(namedFigureOptionListWork, destName)) {
							var alertDialog = new MKR.Dialog.ModalAlert(dialogManager, MKR.Lang.Dialog.ModalFigureSettingsMaintenance.renameAsDialog.sameNameExistsMessage);
							alertDialog.showModal();
						} else {
							nameAsDialog.nameOk(destName);
						}
					}
				}
			};

			var nameAsDialog = new MKR.Dialog.ModalNameAs(dialogManager, nameAsDialogOptions);
			nameAsDialog.on("mkrDialog:nameAs", function (event) {

				var index = MKR.SettingUtil.indexOfNamedFigureOptionByName(namedFigureOptionListWork, optionName);
				if (index < 0) {
					MKR.Debug.notImplemented();
					return;
				}

				namedFigureOptionListWork[index] = new MKR.NamedFigureOption(event.name, namedFigureOptionListWork[index].figureOption)

				nameWgt.attr("data-figure-option-name", event.name);
				nameWgt.find(".mkr_figure_option_name")
					.attr("title", event.name)
					.text(event.name);
			});
			nameAsDialog.showModal();
		});

		// 作図設定
		dialogBodyWgt.find(".mkr_figure_option_list").on("click", ".mkr_setting_figure", function (event) {

			var nameWgt = $(this).parents(".mkr_name_group").find(".mkr_name");
			var optionName = nameWgt.attr("data-figure-option-name");

			var namedFigureOption = MKR.SettingUtil.findNamedFigureOptionByName(namedFigureOptionListWork, optionName);
			if (namedFigureOption === null) {
				MKR.Debug.notImplemented();
				return;
			}

			var typeHelper = new MKR.TypeHelper(figureType);

			var figureSettingsDialog = typeHelper.widget.createFigureSettingsSaveDialog(dialogManager, namedFigureOption.figureOption);
			if (figureSettingsDialog === null) {
				MKR.Debug.notImplemented();
				return;
			}

			// 保存
			figureSettingsDialog.on("mkrDialog:save", function (event) {

				var index = MKR.SettingUtil.indexOfNamedFigureOptionByName(namedFigureOptionListWork, optionName);
				if (index < 0) {
					MKR.Debug.notImplemented();
					return;
				}

				namedFigureOptionListWork[index] = new MKR.NamedFigureOption(optionName, event.figureOption);

				var typeHelper = new MKR.TypeHelper(figureType);
				typeHelper.widget.setIconWidget(nameWgt.find(".mkr_figure_option_icon"), event.figureOption);
			});

			figureSettingsDialog.showModal();
		});

		// コピー
		dialogBodyWgt.find(".mkr_figure_option_list").on("click", ".mkr_copy", function (event) {

			var nameWgt = $(this).parents(".mkr_name_group").find(".mkr_name");
			var optionName = nameWgt.attr("data-figure-option-name");

			var nameAsDialogOptions = {
				dialogTitle: MKR.Lang.Dialog.ModalFigureSettingsMaintenance.copyAsDialog.dialogTitle,
				srcName: optionName,
				okWidgetCaption: MKR.Lang.Dialog.ModalFigureSettingsMaintenance.copyAsDialog.okWidgetCaption,
				nameCheckCallback: function (srcName, destName, nameAsDialog) {

					if (0 <= MKR.SettingUtil.indexOfNamedFigureOptionByName(namedFigureOptionListWork, destName)) {
						var alertDialog = new MKR.Dialog.ModalAlert(dialogManager, MKR.Lang.Dialog.ModalFigureSettingsMaintenance.copyAsDialog.sameNameExistsMessage);
						alertDialog.showModal();
					} else {
						nameAsDialog.nameOk(destName);
					}
				}
			};

			var nameAsDialog = new MKR.Dialog.ModalNameAs(dialogManager, nameAsDialogOptions);
			nameAsDialog.on("mkrDialog:nameAs", function (event) {

				var index = MKR.SettingUtil.indexOfNamedFigureOptionByName(namedFigureOptionListWork, optionName);
				if (index < 0) {
					MKR.Debug.notImplemented();
					return;
				}


				var namedFigureOptionNew = new MKR.NamedFigureOption(event.name, namedFigureOptionListWork[index].figureOption);

				namedFigureOptionListWork.push(namedFigureOptionNew);

				figureOptionListWgt.append(createFigureOptionWgt(namedFigureOptionNew));
			});
			nameAsDialog.showModal();
		});

		// 削除
		dialogBodyWgt.find(".mkr_figure_option_list").on("click", ".mkr_delete", function (event) {

			var nameWgt = $(this).parents(".mkr_name_group").find(".mkr_name");
			var optionName = nameWgt.attr("data-figure-option-name");

			var index = MKR.SettingUtil.indexOfNamedFigureOptionByName(namedFigureOptionListWork, optionName);
			if (index < 0) {
				MKR.Debug.notImplemented();
				return;
			}

			namedFigureOptionListWork.splice(index, 1);

			$(this).parents(".mkr_name_group").remove();
		});

		// 保存
		dialogBodyWgt.find(".mkr_save").on("click", function (event) {
			self.fire("mkrDialog:save", { figureType: figureType, namedFigureOptionList: namedFigureOptionListWork })
			self.close();
		});

		// キャンセル
		dialogBodyWgt.find(".mkr_cancel").on("click", function (event) {
			self.close();
		});


		MKR.Dialog.ModalBase.prototype.initialize.call(this, dialogManager, "mkr_figure_settings_maintenance_dialog", MKR.Lang.Dialog.ModalFigureSettingsMaintenance.dialogTitle, dialogBodyWgt, {
			resizable: true,
			minHeight: this.initialHeight,
			minWidth: this.initialWidth,
			maxHeight: Math.min(this.initialHeight + 200, 500),
			maxWidth: Math.min(this.initialWidth + 200, 500)
		});
	},


	//
	// 表示内容をダイアログサイズに合わせる
	//----------------------------------------------------------------------
	//

	adjustContents: function () {
		var resizableWgt = this.dialogWgt.find(".mkr_figure_option_list");
		var resizableHeightNew = MKR.DialogUtil.calcResizableHeight(this.dialogWgt, resizableWgt, 35);
		resizableWgt.height(resizableHeightNew);
	}
});

