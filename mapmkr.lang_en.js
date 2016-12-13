/*
 * Language Settings(en)
 */

MKR.Lang = {

	lang: "en",

	Configs: {
		mapTiles: {
			displayName_std: "Standard",
			displayName_pale: "Pale",
			displayName_blank: "Blank",
			displayName_ort: "Ortho",
			displayName_airphoto: "Airphoto",

			errorTileUrl_std: "images/no-data.png",
			errorTileUrl_pale: "images/no-data.png",
			errorTileUrl_blank: "images/no-data.png",
			errorTileUrl_ort: "images/no-data.png",
			errorTileUrl_airphoto: "images/no-data.png",
		}
	},

	Const: {
		DataImageWarning:
			"When importing from a file, the image is embedded in the graphic data as a character string, so it takes time to process and the screen may not respond at unexpected timing." +
			"If you wait as it is, which will come back, depending on the image size you may wait quite a while before returning. I am sorry, please be aware." +
			""
	},

	Debug: {
		notImplemented: "Not implemented."
	},

	Widget: {
		ContextMenu: {
			figureSetting: "Figure setting"
		}
	},

	DivIcon: {
		notSet: "[Not set]"
	},

	LayerManager: {
		layerNamePrefix: "NewLayer"
	},

	Dialog: {
		ModalNameAs: {
			dialogTitle: "Enter name",
			okWidgetCaption: "OK",
			nameAsLabel: "Name",
			cancelButtonCaption: "Cancel",
			nameIsEmptyMessage: "Please enter name"
		},

		ModalYesNo: {
			dialogTitle: "Confirmation",
			yesButtonCaption: "Yes",
			cancelButtonCaption: "No"
		},

		ModalAlert: {
			dialogTitle: "Confirmation"
		},

		ModalFigureSettingsMaintenance: {
			dialogTitle: "Maintenance figure settings",
			saveButtonCaption: "Save",
			cancelButtonCaption: "Cancel",
			renameButtonTitle: "Rename",
			settingFigureButtonTitle: "Figure setting",
			copyButtonTitle: "Copy",
			deleteButtonTitle: "Delete",

			renameAsDialog: {
				dialogTitle: "Rename",
				okWidgetCaption: "Change",
				sameNameExistsMessage: "Same name exists. Please set a different name."
			},

			copyAsDialog: {
				dialogTitle: "Copy",
				okWidgetCaption: "Save",
				sameNameExistsMessage: "Same name exists. Please set a different name."
			}
		},

		ModalSettingsBase: {
			saveButtonCaption: "Save",
			saveDefaultButtonCaption: "Set as default",
			saveAsButtonCaption: "Save as",
			cancelButtonCaption: "Cancel",

			saveAsDialog: {
				dialogTitle: "Save as",
				okWidgetCaption: "Save"
			}
		},

		ModalMarkerSettings: {
			dialogTitle: "Marker (icon) setting",

			iconLabel: "Icon",
			selectedIconTitle: "Selected Icon",
			selectIconButtonTitle: "Select Icon",
			setIconButtonTitle: "Set Icon",

			markerSizeLabel: "Size ratio",
			selectSizeTitle: "Select size ratio"
		},

		ModalImportIconImage: {
			dialogTitle: "Set Icon",

			iconSizeDescription: "Please specify an image of size 20 * 20.",

			loadImageFileLabel: "Import file",

			cancelButtonCaption: "Cancel",

			fileinput: {
				removeTitle: "Cancel file selection"
			},

			loadFileErrorMessage: "Unable to retrieve file",
			fileFormatErrorMessage: "File format is wrong",
			readFileErrorMessage: "Failed to load",

			urlIsEmptyMessage: "Please enter URL"
		},

		ModalPolylineSettings: {
			initialWidth: 490,
			maxWidth: 590,

			dialogTitle: "Polyline setting",

			lineWidthLabel: "Line Width",
			selectLineWidthTitle: "Select Line Width",

			lineColorLabel: "Line Color",
			lineColorExample: "e.g.) red",
			inputLineColorTitle: "Enter line color",
			selectLineColorTitle: "Select line color",

			lineOpacityLabel: "Line Transparency",
			selectLineOpacityTitle: "Select line transparency"
		},

		ModalPolygonSettings: {
			initialWidth: 490,
			maxWidth: 590,

			dialogTitle: "Polygon setting",

			lineWidthLabel: "Line Width",
			selectLineWidthTitle: "Select Line Width",

			lineColorLabel: "Line Color",
			lineColorExample: "e.g.) red",
			inputLineColorTitle: "Enter line color",
			selectLineColorTitle: "Select line color",

			lineOpacityLabel: "Line Transparency",
			selectLineOpacityTitle: "Select line transparency",

			fillColorLabel: "Fill Color",
			fillColorExample: "e.g.) blue",
			inputFillColorTitle: "Enter fill color",
			selectFillColorTitle: "Select fill color",

			fillOpacityLabel: "Fill Transparency",
			selectFillOpacityTitle: "Select fill Transparency"
		},

		ModalCircleSettings: {
			dialogTitle: "Circle setting"
		},

		ModalCircleMarkerSettings: {
			dialogTitle: "Marker (circle) setting"
		},

		ModalDivIconMarkerSettings: {
			dialogTitle: "Text setting",

			htmlLabel: "Please enter the HTML",
			htmlExample: "e.g.) Zoo&nbsp;\ne.g.) &lt;span style=&quot;background-color:#00ffff; color:red; font-size:20px;&quot;&gt;Library&lt;/span&gt;",
			htmlTitle: "HTML"
		},

		Pane: {
			FigureInfo: {
				figureTypeToText: "Switch to html",
				figureTypeToTable: "Switch to table",

				nameLabel: "Name",
				nameExample: "e.g.) Library",
				inputNameTitle: "Popup info title",

				toggleInputMethodTitle: "Toggle input method",
				openHtmlEditorTitle: "Open html editor",
				openHtmlEditorCaption: "Open editor",

				tablePaneWarn1Label: "Columns with only values entered are not saved.",
				tablePaneWarn2Label: "If you enter a key value of GeoJSON format such as \"name\" or \"description\" in the item name, it is enclosed in double quotes (\") and saved.",

				itemNameLabel: "Item Name",
				valueLabel: "Value",

				textExample: "e.g.) Museum&nbsp;\ne.g.) &lt;span style=&quot;background-color:#00ffff; color:red; font-size:20px;&quot;&gt;Park&lt;/span&gt;",
				textTitle: "Popup Description",

				itemNameExample: "e.g.) business hours",
				itemNameTitle: "Popup item name",
				valueExample: "e.g.) 10 AM - 6 PM",
				valueTitle: "Popup item value",

				deleteRowTitle: "Delete this row",

				addRowTitle: "Add new row"
			}
		},

		ModalInfoTextEditor: {
			dialogTitle: "Html Editor",

			editorWarnMessage: "The appearance may not match between editing and popup display.",

			saveButtonCaption: "Set",
			cancelButtonCaption: "Cancel",

			insertTemplateTitle: "Insert template",

			insertUnorderedListCaption: "Unordered list",
			unorderedListHtml: "<div style='width: 300px; word-break: break-all;'><ul><li>list1</li><li>list2</li><li>list3</li></ul></div>",

			insertOrderedListCaption: "Ordered list",
			orderedListHtml: "<div style='width: 300px; word-break: break-all;'><ol><li>list1</li><li>list2</li><li>list3</li></ol></div>",

			insertTitlePlusDesctiptionCaption: "Title+Description",
			insertTitlePlusDesctiptionHtml: "<div style='width: 300px; word-break: break-all;'><h3 style='font-weight: bold; font-size: 14px; margin: 0.5em 0;'>Title</h3><p style='font-size: 12px; margin: 0;'>Description</p></div>",

			insertTitlePlusDesctiptionPlusImageCaption: "Title+Desc+Image",
			insertTitlePlusDesctiptionPlusImageHtml: "<div style='width: 300px; word-break: break-all;'><h3 style='font-weight: bold; font-size: 14px; margin: 0.5em 0;'>Title</h3><p style='font-size: 12px; margin: 0.2em 0;'>Description</p><div><img src='images/template_no_image-en.png?v=" + MKR.version + "' style='width: 100%; height: auto;'/></div></div>",

			insertTitlePlusImageCaption: "Title+Image",
			insertTitlePlusImageHtml: "<div style='width: 300px; word-break: break-all;'><h3 style='font-weight: bold; font-size: 14px; margin: 0.5em 0;'>Title</h3><div><img src='images/template_no_image-en.png?v=" + MKR.version + "' style='width: 100%; height: auto;'/></div></div>",

			insertTitlePlusImagePlusDesctiptionCaption: "Title+Image+Desc",
			insertTitlePlusImagePlusDesctiptionHtml: "<div style='width: 300px; word-break: break-all;'><h3 style='font-weight: bold; font-size: 14px; margin: 0.5em 0;'>Title</h3><div><img src='images/template_no_image-en.png?v=" + MKR.version + "' style='width: 100%; height: auto;'/></div><p style='font-size: 12px; margin: 0.2em 0;'>Description</p></div>",

			insertTitlePlusImageAndDesctiptionCaption: "Title+Image&amp;Desc",
			insertTitlePlusImageAndDesctiptionHtml: "<div style='width: 300px; word-break: break-all;'><h3 style='font-weight: bold; font-size: 14px; margin: 0.5em 0;'>Title</h3><div><img src='images/template_no_image-en.png?v=" + MKR.version + "' style='width: 50%; height: auto; float: left; margin-right: 0.5em;'/><div style='font-size: 12px; margin: 0;'>Description</div></div><div style='clear: both;'></div></div>"
		},

		Construction: {
			dialogTitle: "Drawing map",

			beginEditFigureTitle: "Edit current layers item",
			beginSettingFigureTitle: "Setting current layers item",
			beginDeleteFigureTitle: "Delete current layers item",

			showLayerOperationTitle: "Show layer operation section",
			hideLayerOperationTitle: "Hide layer operation section",

			selectOperationTitle: "Select Operation",

			loadLayerFromFileTitle: "Load from file",
			clearAllLayersTitle: "Clear all",

			saveToBrowserTitle: "Save to browser",
			saveToFileTitle: "Save to file",

			finishDrawTitle: "Finish",
			deleteLastPointTitle: "Delete last point",
			cancelDrawTitle: "Cancel",

			saveEditTitle: "Save",
			cancelEditTitle: "Cancel",

			addNewLayerTitle: "Add new layer",

			figureSettingCaption: "Figure setting",
			maintenanceFigureSettingCaption: "Maintenance figure settings",
			repeatDrawingCaption: "Repeat drawing",

			addMarkerTitle: "Add marker (icon) to current layer",
			addCircleMarkerTitle: "Add marker (circle) to current layer",
			addPolylineTitle: "Add polyline to current layer",
			addPolygonTitle: "Add polygon to current layer",
			addCircleTitle: "Add circle to current layer",
			addDivIconMarkerTitle: "Add text to current layer",

			selectLayerTitle: "Select this layer",
			moveLayerForwardTitle: "Move layer forward",
			moveLayerBackwardTitle: "Move layer backward",
			renameLayerTitle: "Rename layer",
			deleteLayerTitle: "Delete layer",

			figureDefaultTitle: "Default",

			sameNameExistsCaption: "Same name exists. overwrite it?",

			showLayerCaption: "Show layer",
			hideLayerCaption: "Hide layer",

			sameFilenameExistsMessage: "Same filename exists. Please set a different name.",

			deleteAllLayersMessage: "Delete all layers. do it?",

			noLayersMessage: "There are no layers.<div class='mkr_sub_message'>Save only the shown layers.</div>",

			failedSaveToBrowserMessage: "Failed save to browser.",

			layersCannotBeHiddenMessage: "Layers can not be hidden.",

			layerDeleteConfirmationMessageFunction: function (name) {
				return "Are you sure you want to delete " + name + "?"
			},

			failedToReadFileMessage: "Failed to read the file.",

			someDataCouldNotLoadedMessage: "Some data could not be loaded.",

			failedToSaveFileMessage: "Failed to save the file."
		},

		ModalLayerNameAs: {
			initialWidth: 500,

			dialogTitle: "Rename layer",

			displayNameLabel: "Display name",
			filenameLabel: "File name",

			renameButtonCaption: "Change",
			cancelButtonCaption: "Cancel",

			displayNameIsEmptyMessage: "Please enter display name",
			filenameIsEmptyMessage: "Please enter file name",
			invalidFilenameMessage: "You can enter only alphanumeric characters and underscore (_) in the file name"
		},

		ModalSaveLayer: {
			dialogTitle: "Save",

			saveDescription: "Save only the shown layers.",

			filenameLabel: "ZIP File name",

			includePublishFilesTitle: "Check if you want to include the files necessary for publishing to the ZIP file on your Web server",
			includePublishFilesLabel: "Include files required for publishing",

			saveButtonCaption: "Save",
			cancelButtonCaption: "Cancel",

			filenameIsEmptyMessage: "Please enter zip file name",
			invalidFilenameMessage: "You can enter only alphanumeric characters and underscore (_) in the zip file name"
		},

		ModalPublishInfo: {
			dialogTitle: "Setting information for publish",

			mapNameLabel: "Map name",

			initialMapLabel: "Initial map",
			selectInitialMapTitle: "Select initial map",

			displayMapsLabel: "Maps",
			selectDisplayMapsTitle: "Select maps",

			saveButtonCaption: "Save",
			cancelButtonCaption: "Cancel",

			mapNameIsEmptyMessage: "Please enter map name"
		},

		ModalLoadLayer: {
			dialogTitle: "Load",

			loadDescription: "Please specify a previously saved ZIP file or geojson file.",

			filenameLabel: "File name",

			removeExistsLayersTitle: "Check if delete all existing layers and newly loading",
			removeExistsLayersLabel: "Delete all existing layers and load them",

			loadButtonCaption: "Load",
			cancelButtonCaption: "Cancel",

			fileinput: {
				msgNoFilesSelected: "Please specify zip or geojson file",
				removeTitle: "Cancel file selection"
			},

			filenameIsEmptyMessage: "Please select file",
			loadFileErrorMessage: "Unable to load file",

			allLayersDeleteMessage: "All existing layers will be deleted. load it?"
		}
	},

	Trumbowyg: {
		Dialog: {
			ModalInsertImage: {
				dialogTitle: "Insert image",

				urlExample: "e.g.) http://www.koutou-software.net/images/kswsLogo.png",

				loadFromFileLabel: "Load from file",

				altLabel: "alt",
				altExample: "e.g.) logo image",
				altTitle: "Specify image description (alt attribute)",

				widthLabel: "width",
				widthExample: "e.g.) 200px",
				widthTitle: "Specify image width (width style)",

				cancelButtonCaption: "Cancel",

				fileinput: {
					removeTitle: "Cancel file selection"
				},

				loadFileErrorMessage: "Unable to load file",
				invalidFileTypeMessage: "Invalid file type",
				readFileErrorMessage: "Unable to read file",

				urlIsEmptyMessage: "Please enter URL"
			},

			ModalCreateLink: {
				dialogTitle: "Insert link",

				urlExample: "e.g.) http://www.koutou-software.net/main/index.php",

				linkTextLabel: "Text",
				linkTextExample: "e.g.) Group homepage",

				linkTitleLabel: "title",
				linkTitleExample: "e.g.) Link to homepage",
				linkTitleTitle: "Specify link description (title attribute)",

				linkTargetLabel: "target",
				linkTargetExample: "e.g.) _blank",
				linkTargetTitle: "Specify window of displaying links",
				selectLinkTargetCaption: "Select",

				cancelButtonCaption: "Cancel",

				urlIsEmptyMessage: "Please enter URL",

				textIsEmptyMessage: "Please enter text"
			}
		}
	},

	Task: {
		UseLH: {
			latDefalut: 35.362222,
			lngDefalut: 138.731389
		},

		MapManager: {
			tileCopyright: "The Geospatial Information Authority of Japan"
		}
	}
};

////////////////////////////////////////////////////////////////////////
// Message of Leaflet.draw
////////////////////////////////////////////////////////////////////////

//L.drawLocal = {
//};

MKR.drawLocal = {
	draw: {
		handlers: {
			diviconmarker: {
				tooltip: {
					start: "Click map to place text."
				}
			},
		}
	},
	edit: {
		handlers: {
			setting: {
				tooltip: {
					text: "Click on a feature to figure setting."
				}
			}
		}
	}
};

