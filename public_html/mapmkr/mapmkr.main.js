/*
 * スタートアップ
 */

////////////////////////////////////////////////////////////////////////
// メイン
////////////////////////////////////////////////////////////////////////

MKR.Main = {

	//
	// スタートアップ
	//----------------------------------------------------------------------
	//

	start: function () {
		MKR.WidgetUtil.stopBodyContextMenu();

		var mapManager = new MKR.MapManager("map");
		var map = mapManager.getMap();

		var settingsStorage = new MKR.LocalStorage("settings");
		var settings = new MKR.Settings(settingsStorage);
		settings.load();

		var dialogManager = new MKR.DialogManager();

		var popupWindow = new MKR.Widget.PopupWindow(map);
		var contextMenu = new MKR.Widget.ContextMenu(map, dialogManager);

		var layerManager = new MKR.LayerManager(mapManager, contextMenu);

		var drawFigure = new MKR.DrawFigure(map, layerManager, dialogManager, popupWindow, contextMenu);

		var constructionDialog = new MKR.Dialog.Construction(
												dialogManager,
												layerManager,
												drawFigure,
												settings,
												{
													top: 5,
													left: 5
												}
											);

		constructionDialog.show();

		layerManager.addNewLayer();
	}
};

$(function() {
	MKR.Main.start();
});

