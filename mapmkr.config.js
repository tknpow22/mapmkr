/*
 * アプリケーション設定
 */

////////////////////////////////////////////////////////////////////////
// アプリケーション設定
////////////////////////////////////////////////////////////////////////

MKR.Configs = {

	//
	// マップに表示するタイル(地図画像)
	//----------------------------------------------------------------------
	// 定義の先頭のものを初期表示タイルとする
	//

	mapTiles: [
		{
			name: "std",
			displayName: MKR.Lang.Configs.mapTiles.displayName_std,
			urlTemplate: "//cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
			errorTileUrl: MKR.Lang.Configs.mapTiles.errorTileUrl_std
		},
		{
			name: "pale",
			displayName: MKR.Lang.Configs.mapTiles.displayName_pale,
			urlTemplate: "//cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
			errorTileUrl: MKR.Lang.Configs.mapTiles.errorTileUrl_pale
		},
		{
			name: "blank",
			displayName: MKR.Lang.Configs.mapTiles.displayName_blank,
			urlTemplate: "//cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png",
			errorTileUrl: MKR.Lang.Configs.mapTiles.errorTileUrl_blank
		},
		{
			name: "ort",
			displayName: MKR.Lang.Configs.mapTiles.displayName_ort,
			urlTemplate: "//cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg",
			errorTileUrl: MKR.Lang.Configs.mapTiles.errorTileUrl_ort
		},
		{
			name: "airphoto",
			displayName: MKR.Lang.Configs.mapTiles.displayName_airphoto,
			urlTemplate: "//cyberjapandata.gsi.go.jp/xyz/airphoto/{z}/{x}/{y}.png",
			errorTileUrl: MKR.Lang.Configs.mapTiles.errorTileUrl_airphoto
		}
	],

	//
	// デフォルトのマーカーアイコン
	//----------------------------------------------------------------------
	//

	markerIconDefault: "//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/076.png",

	//
	// デフォルトのマーカーアイコンのサイズ
	//----------------------------------------------------------------------
	//

	markerIconSizeDefault: [20, 20],

	//
	// デフォルトのマーカーアイコンのアンカー位置
	//----------------------------------------------------------------------
	//

	markerIconAnchorDefault: [10, 10],

	//
	// マーカーアイコン
	//----------------------------------------------------------------------
	//

	markerIcons: [
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/001.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/002.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/003.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/004.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/005.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/006.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/007.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/008.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/009.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/010.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/011.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/012.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/013.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/014.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/015.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/016.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/017.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/018.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/019.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/020.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/021.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/022.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/023.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/024.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/025.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/026.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/027.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/028.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/029.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/030.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/031.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/032.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/033.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/034.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/035.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/036.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/037.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/038.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/039.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/040.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/041.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/042.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/043.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/044.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/045.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/046.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/047.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/048.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/049.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/050.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/051.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/052.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/053.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/054.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/055.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/056.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/057.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/058.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/059.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/060.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/061.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/062.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/063.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/064.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/065.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/066.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/067.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/068.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/069.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/070.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/071.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/072.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/073.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/074.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/075.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/076.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/077.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/078.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/079.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/080.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/081.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/082.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/083.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/084.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/085.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/086.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/087.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/088.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/089.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/090.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/091.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/092.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/093.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/094.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/095.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/096.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/097.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/098.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/099.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/100.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/101.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/102.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/103.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/104.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/105.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/106.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/107.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/108.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/109.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/110.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/111.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/112.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/113.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/114.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/115.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/116.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/117.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/118.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/119.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/120.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/121.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/122.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/123.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/124.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/125.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/126.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/127.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/128.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/129.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/130.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/131.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/132.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/133.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/134.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/135.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/136.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/137.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/138.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/139.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/140.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/141.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/142.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/143.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/144.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/145.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/146.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/147.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/148.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/149.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/150.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/151.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/152.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/153.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/154.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/155.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/156.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/157.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/158.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/159.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/160.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/161.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/162.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/163.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/164.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/165.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/166.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/167.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/168.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/169.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/170.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/171.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/180.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/181.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/182.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/183.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/184.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/185.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/186.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/187.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/188.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/200.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/201.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/202.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/203.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/204.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/205.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/206.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/207.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/208.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/209.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/210.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/211.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/212.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/213.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/214.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/215.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/216.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/217.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/300.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/364.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/301.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/302.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/303.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/304.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/305.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/306.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/307.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/365.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/308.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/309.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/310.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/311.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/312.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/313.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/363.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/314.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/315.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/316.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/317.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/318.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/319.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/320.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/321.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/322.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/323.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/324.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/325.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/326.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/327.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/328.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/329.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/330.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/331.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/332.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/333.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/334.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/335.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/336.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/337.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/338.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/339.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/340.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/341.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/342.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/343.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/344.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/345.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/346.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/347.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/348.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/349.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/350.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/351.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/352.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/353.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/354.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/355.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/356.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/357.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/358.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/359.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/360.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/361.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/362.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/436.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/437.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/438.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/445.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/446.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/447.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/449.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/457.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/458.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/459.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/460.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/461.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/462.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/463.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/464.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/465.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/466.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/476.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/700.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/701.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/702.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/703.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/704.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/705.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/706.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/707.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/708.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/709.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/710.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/dot.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/1101.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/1102.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/1103.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/1104.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/1105.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/1106.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/1107.png",
		"//cyberjapandata.gsi.go.jp/portal/sys/v4/symbols/1108.png"
	]

};

////////////////////////////////////////////////////////////////////////
// ユーティリティ
////////////////////////////////////////////////////////////////////////

MKR.ConfigUtil = {

	findMapTileByName: function (mapTiles, name) {
		index = this.indexOfMapTileByName(mapTiles, name);
		if (0 <= index) {
			return mapTiles[index];
		}
		return null;
	},

	indexOfMapTileByName: function (mapTiles, name) {
		function compare(index, name_, mapTile_) {
			return name_ === mapTile_.name;
		}

		return MKR.Array.inArray(name, mapTiles, compare);
	},

	findMapTileByDisplayName: function (mapTiles, displayName) {
		index = this.indexOfMapTileByDisplayName(mapTiles, displayName);
		if (0 <= index) {
			return mapTiles[index];
		}
		return null;
	},

	indexOfMapTileByDisplayName: function (mapTiles, displayName) {
		function compare(index, displayName_, mapTile_) {
			return displayName_ === mapTile_.displayName;
		}

		return MKR.Array.inArray(displayName, mapTiles, compare);
	}
};

