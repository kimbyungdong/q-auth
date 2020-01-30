	$(function() {

		// イメージを先に読み込んで置く
		$('<img src="../images/dir-top.png"/>');
		$('<img src="../images/dir-bottom.png"/>');
		$('<img src="../images/dir-left.png"/>');
		$('<img src="../images/dir-right.png"/>');
		$('<img src="../images/magnet.png"/>');
		$('<img src="../images/garbage.png"/>');
		$('<img src="../images/posFix.png"/>');
		$('<img src="../images/posReplace.png"/>');
		$('<img src="../images/link.png"/>');

	    w2utils.locale('../libs/locale/ja-jp.json');

		// -11 -> title
		$('#allLayout').height($(window).height() - $('#menubar').height() -3);
		
		var setIni = {
			layout: {
				name: 'layout',
				padding: 2,
				panels: [
				{ type: 'left', size: '20%', resizable: true, minSize: 50, hidden:true, title: '検索＆シェープ',content:'<div id="searchArea" class="ui-widget-content"></div>'},
				{ type: 'main', resizable: true, minSize: 200,title: '平面図',overflow: 'hidden',content:'<div id="workArea" hidden><svg id="drawArea"></svg></div>'},
				{ type: 'right', resizable: true, minSize: 50,title: '属性',size: '20%',hidden:true,content:'<div id="attrArea" class="ui-widget-content"></div>'},
				]
			},
		}

		$('#allLayout').w2layout(setIni.layout);

		// w2ui.toolbar.on('*', function (event) { 
		//     console.log('EVENT: '+ event.type + ' TARGET: '+ event.target, event);
		// });

		 $(window).on("beforeunload", function() {
			//var data = {};//jsonデータ作成
			$.ajax({
				type : 'post',
				url : "../php/sessionEnd.php",
				data : null,
				dataType : 'json',
				async:   false,
				success : function(data) {

				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {

				}
			});
			return "本当に移動しても良いですか？";
		});

		//　ポップアップ
		$(document).on('click', '.iframe-device', function (e) {

			new $pop( this.href, 
				{ 
					type: 'iframe', 
					title: '<img class="dcVisorTitleImg" src="../images/ICO_dcVisor_LOGO_64.ico">' + this.innerText, 
					width: 1150, 
					height: 760,
					modal:true,
				} ); 

			return false;

		});	

		$(document).on('click', '.iframe-nomal', function (e) {

			new $pop(this.href, 
				{ 
					type: 'iframe', 
					title: '<img class="dcVisorTitleImg" src="../images/ICO_dcVisor_LOGO_64.ico">' + this.innerText, 
					width: 900, 
					height: 520,
					modal:true,
				} ); 

			return false;

		});	

		// ポップアップ閉じるときの処理
		popupClose = function(){
			var argument = $.extend({
			                dialog : true,
			                value: "",
			                formID:"",
			            },arguments[0]);

			if(argument.dialog){
				if (!confirm("ポップアップを閉じますか？")) {
					return;
				}
			}
			 // ポップアップ閉じる
			 if($(".closeBtn").length > 0){
			 	$(".closeBtn").click();
			 }

			 // 図面開くで図面を洗濯した場合
			 if(argument.value != "" && argument.formID=='frmOpenDwg'){
			 	// value -> floor location
			 	loadSVG(argument.value);
			 }
		}

		$('#svgNavi').appendTo('#layout_layout_panel_main');
		$('#attrArea').height($('#layout_layout_panel_main .w2ui-panel-content').height() - 11);
		$('#searchArea').height($('#layout_layout_panel_main .w2ui-panel-content').height() - 4);

		// 検索エリア（Left）作成
		$(function(){
			$('#layout_layout_panel_left .w2ui-panel-title').text('検索＆シェープ' ).css("color","black");	
			$('#searchArea').empty();

			var content　= '';
			content = content + '<div id="leftAreaTab" style="padding:5px">';
			content = content + '	<div id="tab_search">';
			content = content + '	    <div id="tabs" style="width: 100%; height: 29px;"></div>';
			content = content + '	    <div id="tab_SRH" class="tab">';
			content = content + '	    </div>';
			content = content + '	    <div id="tab_RST" class="tab">';
			content = content + '	    </div>';
			content = content + '	    <div id="tab_SHP" class="tab" style="padding:5px;">';
			content = content + '	    </div>';
			content = content + '	</div>';
			content = content + '</div>';

			$('#searchArea').append(content);

			var config = {
			    tabs: {
			        name: 'tabs',
			        active: 'tab_SRH',
			        tabs: [
			            { id: 'tab_SRH', caption: '検索' },
			            { id: 'tab_RST', caption: '検索結果' },
			            { id: 'tab_SHP', caption: '図面シェープ'},
			        ],
			        onClick: function (event) {
			            $('#tab_search .tab').hide();
			            $('#tab_search #' + event.target).show();

						if(event.target == "tab_SHP"){
							dspShapeList();
						}
			        }
			    }
			}

			$('#tabs').w2tabs(config.tabs);
	    	$('#tab_SRH').show();
	    	$('.tab').height($('#layout_layout_panel_main .w2ui-panel-content').height() - 53);



	    	$('[data-toggle="tooltip"]').tooltip();


		});

		function dspShapeList(){

			$('#tab_SHP').empty();

			var result = $.ajax({
				type: "POST",
				url: "../php/ajaxGetShapeList.php",
				data: null,
				async: false,
				cache: false,
			}).responseText;
			
			result = '<div id="shapeAccdrdion">' + result + '</div>';

	    	$('#tab_SHP').append(result);

	    	$("#shapeAccdrdion").accordion({
				heightStyle: "fill",
				collapsible: false,
				active:0,
				create: function( event, ui ) {
					ui.header.css({background:"#31B404"});
			    },
			    beforeActivate: function( event, ui ) {
					ui.newHeader.css({background:"#31B404"});
					ui.oldHeader.css({background:"#f6f6f6"});
			    }
			});

			$("#shapeAccdrdion .ui-accordion-content").height($('#tab_SHP').height() - 12 - (($("#shapeAccdrdion .ui-accordion-header").outerHeight() + 7 ) * $("#shapeAccdrdion .ui-accordion-header").length) );
			
			$('[data-toggle="tooltip"]').tooltip();

			$('#shapeAccdrdion .ui-accordion-content').contextMenu('cmShapeList',
	          	{
		           	bindings: {
						'cmSLAdd': function(evt) {
							
						},
						'cmSLCategoryEdit': function(evt) {

						},
						'cmSLDel': function(evt) {
							
						},
						'cmSLClose': function(evt) {
							
						},
		           	},
		           	menuStyle: {width: '150px'},
		           	itemStyle: {},
		           	itemHoverStyle: {},
		           	onContextMenu: function(e) {
		           		return true;
		           	},
		           	onShowMenu: function(e, menu) {
		           		if($(e.target).hasClass("ui-accordion-content")){
		           			$('#cmSLCategoryEdit, #cmSLDel',menu).remove();
		           		}
		           		else{
		           			$('#cmSLAdd',menu).remove();
		           		}
		           		return menu;
					},
					onHideMenu: function(menu) {
		           		return menu;
					}
	        	}
	        );

		};

		$(document).on('click', '.shape', function (event) {
			var src = "";
			if(event.target.childElementCount > 0){
				src = event.target.firstChild.getAttribute("src");
			}
			else{
				src = event.target.getAttribute("src");
			}

			var result = $.ajax({
				type: "POST",
				url: "../php/ajaxGetSvgShape.php",
				data: {SRC:src},
				async: false,
				cache: false,
			}).responseText;

			// 読み込んだSVGテキストをXML形に変換
			var xmldom = new DOMParser();
			var dom = xmldom.parseFromString( result, "application/xml" );
			if (!dom){
				alert("サポートされない形式のファイルです。");
				return;
			} 

			// ヘッドと＜SVG>タグは必要ないのでinnerHTMLを取ります。
			var svgShape = dom.documentElement.innerHTML;
			// Snapオブジェクトに変換（Fragment）
			var sn = Snap.parse(svgShape);

			var sShape = sn.select(".DCVisorDev");
			if (!sShape){
				alert("DCVisorで使用出来ないシェープファイルです。");
				return;
			} 

			// サブネールで表示する為追加したStyleを削除する（Classが効かないので）
			if(sn.select(".OutLineBody")) sn.select(".OutLineBody").attr({style:""});
			if(sn.select(".OutLineHead")) sn.select(".OutLineHead").attr({style:""});
			// Classを設定する
			var shapeID = getUuid();
			sShape.attr({id:shapeID,style:""}).addClass("unLink").addClass("unFix");

			//  キャンパスに挿入
			paper.select("#FloorUnFixLayer").append(sn);
			// Drag可能にする
			var shape = paper.select('#' + shapeID)

			shape.altDrag();
			
			setShapeContextMenu();

		});
//------------------------------------------------------------------------------
//  SVG 関連
//------------------------------------------------------------------------------

		var devAttrPos = 0;
		var floorAttrPos = 0;
		var paper;
		var siteID;
		var zoomPan;					// zoomPan オブジェクト
		var dragFlg = false;			
		var SnapPoint;	 				// スナップ用のX.Y座標
		var beforeZoom;
		var beforePan;
		var rightLayoutDsp = "";		// 右の表示内容保存
		var snapOn = false;
		var autoGapOn = false;
		var autoGapCm = 10;

		function loadSVG(floorLoc){
			$("#workArea").show();

			floorLoc = floorLoc ? floorLoc :'';

			function getFloorSvg(){
				var result = $.ajax({
					type: "POST",
					url: "../php/dbUtil.php?fName=GetFloorSvg&LOCATION=" + floorLoc,
					data: null,
					async: false,
					cache: false,
				}).responseText;
				return JSON.parse(result);
			};


			var flData = getFloorSvg();

			$("#workArea").empty();

			if (flData && flData.DOC_FILE){

			}
			else{
				return;
			}

			var svgFile = $(flData.DOC_FILE);

			$("#workArea").append(svgFile);

			svgFile.ready(function(){

				if ($('#CanvasLayer').parents("g").length > 0 ){
					$('#CanvasLayer').unwrap();
				}

		 		zoomPan = svgPanZoom('#drawArea',{minZoom: 0.1});
		 		$("#fitH").click();
//				zoomPan.disablePan();

			});

			paper = Snap('#drawArea');

	 		siteID = flData.ID;

			$('#selLocID').text(flData.ID);

	 		$('#layout_layout_panel_main .w2ui-panel-title').text('【平面図】' + flData.SITE );	


			paper.selectAll(".unFix").forEach(
				function(elem){
					var elemid = elem.attr("id");
					if (elemid){	// ラバーボックス選択防止
						paper.select("#" + elemid).altDrag();
					}
				}
			);

			setDrag();


			console.log("pan:" + zoomPan.getPan() + ">>> zoom:" + zoomPan.getZoom());
			
			$("#svgNavi").draggable();

			$("#svgNavi").show();
	 	}

		//-----  Drag Plugin  -----//
		var ObjDrag = false;
		Snap.plugin(function( Snap, Element, Paper, global ) {

			Element.prototype.altDrag = function() {
				this.drag( dragMove, dragStart, dragEnd );
				return this;
			}

			var dragStart = function ( x,y,event ) {

				if(event.button !=0) {
					ObjDrag = false;
					return;
				}

				// 選択したシェープの元座標を保存（シングル）
				// this.data('ot', this.transform().local );
				// ObjDrag = true;
				// 選択したシェープの元座標を保存(複数)
	    		setTimeout(function(){
	    			// setTimeout ー＞ 最初選択したDeviceがタイミングにより選択が認識されない場合があり、TimeOutで実行を50ms遅らせる
					paper.selectAll(".selectDev").forEach(
						function(elem){
							var devId = elem.attr("devid");
							var shape  = paper.select("#" + devId);
							// 移動可能にしたのみ
							if(shape.hasClass("unFix")){
								shape.data('ot', shape.transform().local );
							}
							ObjDrag = true;
						}
					);
				}, 50);

//				console.log("dragStart:" + x + ":" + y);
			}


			var dragMove = function(dx, dy, x, y,event) {

				if(!ObjDrag || event.button !=0) return;

				event.stopPropagation();
//				console.log("dragMove:" + x + ":" + y);
				var tdx, tdy;
				var snapInvMatrix = this.transform().diffMatrix.invert();

				snapInvMatrix.e = 0;
				snapInvMatrix.f = 0;

				tdx = snapInvMatrix.x( dx,dy ); 
				tdy = snapInvMatrix.y( dx,dy );

				// 選択したシェープをDrapする（シングル）
				//this.transform( "t" + [ tdx, tdy ] + this.data('ot')  );

				// 選択したシェープをDrapする（複数）
				paper.selectAll(".selectDev").forEach(
					function(elem){
						
						var devId = elem.attr("devid");
						var shape  = paper.select("#" + devId);
						// 移動可能にしたのみ
						if(shape.hasClass("unFix")){
							shape.transform( "t" + [ tdx, tdy ] + shape.data('ot')  );
						}
						ObjDrag = true;
					}
				);

				// スナップは選択したシェープを基準にする
				var localPosX = this.transform().localMatrix.e;
				var localPosY = this.transform().localMatrix.f;
				var snapX = localPosX;
				var snapY = localPosY;

				//snapTO
				if ($("#snapObj") && $("#snapObj").prop("checked")){


					var doorDir = this.attr("doordir");
					var offX;
					var offY;

					switch (doorDir) {
						case 'T':
						case 'B':
							offX = parseFloat(this.attr("width"));
							offY = parseFloat(this.attr("depth"));
							break;
						case 'L':
						case 'R':
							offX = parseFloat(this.attr("depth"));
							offY = parseFloat(this.attr("width"));
							break;
					}

					var valueX = SnapPoint.X;
					var valueY = SnapPoint.Y;

					var tol = 15;

					// Leftスナップ
					var ax1 = Snap.snapTo(valueX, localPosX, tol);
					var ay1 = Snap.snapTo(valueY, localPosY, tol);

					// Rightスナップ
					var ax2 = Snap.snapTo(valueX, localPosX + offX, tol);
					var ay2 = Snap.snapTo(valueY, localPosY + offY, tol);

					var snapped = false;


					// 順番：左スナップ優先
					if (localPosX + offX != ax2){
						snapX = ax2 - offX;
						snapped = true;
					}

					if (localPosY + offY != ay2){
						snapY = ay2 - offY;
						snapped = true;
					}

					if (localPosX != ax1){
						snapX = ax1;
						snapped = true;
					}

					if (localPosY != ay1){
						snapY = ay1;
						snapped = true;
					}

					if (snapped){
						this.transform( "t" + [snapX, snapY] );
					}
				}
				//snapTO

				$("#posH").val(snapX);
				$("#posV").val(snapY);

			}

			var dragEnd = function() {
				ObjDrag = false;
//				console.log("dragEnd:");
//				zoomPan.enablePan();

			}

		});

		function getUuid(options){
			var uuid = (function(){
				var S4 = function() {
					return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
				}   
				return ("s" + S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
			})();
			return uuid;
		}


		function MakeRack(options){
            var defaults = $.extend({
            	x:200,
            	y:200,
            	id:getUuid(),
                devMgid : null,
                devType: "Rack",
                width: 63,
                depth: 90,
                rackName:"未定",
                unitRate:0,
                weitRate:0,
                powerRate:0,
                doorDir:"T",
                class:"DCVisorDev",
                transform:null,

            },options);


			var group = {
				devmgid: defaults.devMgid,
				id: defaults.id,
				devtype: defaults.devType,
				class:defaults.class,
				width:defaults.width,
				depth:defaults.depth,
				doordir:defaults.doorDir,
			};

            var rackg = paper.g(group);

            var horizon;
            var vertical;

			switch (defaults.doorDir) {
				case 'T':
				case 'B':
					horizon = defaults.width;
					vertical = defaults.depth;
					break;
				case 'L':
				case 'R':
					horizon = defaults.depth;
					vertical = defaults.width;
					break;
			}


            var OutLineBody = {
				x:0,
				y:0,
				rx:1,
				ry:1,
				width:horizon,
				height:vertical,
				class:"OutLineBody",
			};
            rackg.add(paper.rect(OutLineBody));

             var OutLineHead = {
				x:0.5,
				y:0.5,
				rx:0.5,
				ry:0.5,
				width:horizon -1,
				height:10.5,
				class:"OutLineHead",
			};
            rackg.add(paper.rect(OutLineHead));

            rackg.add(paper.line(0,11,horizon,11).addClass("headSeperate"));

			var RackName = {
					x:4,
					y:8.5,
					text:defaults.rackName,
					value:defaults.rackName,
					class:"RackName"
			};
            rackg.add(paper.text(RackName));

			var WeitRate = {
					x:4,
					y:RackName.y + 15 ,
					text:"重さ：" + defaults.weitRate + "%",
					value:defaults.weitRate,
					class:"WeitRate"
			};
			rackg.add(paper.text(WeitRate));

			var UnitRate = {
					x:4,
					y:WeitRate.y + 10 ,
					text:"ユニット：" + defaults.unitRate + "%",
					value:defaults.unitRate,
					class:"UnitRate"
			};
			rackg.add(paper.text(UnitRate));

			var PowerRate = {
					x:4,
					y:UnitRate.y + 10 ,
					text:"電力量：" + defaults.powerRate + "%",
					value:defaults.powerRate,
					class:"PowerRate"
			};
			rackg.add(paper.text(PowerRate));


			switch (defaults.doorDir) {
				case 'T':
					rackg.add(paper.line(0,1.5,horizon,1.5).addClass("doorLine"));
					break;
				case 'B':
					rackg.add(paper.line(0,vertical - 1.5,horizon,vertical - 1.5).addClass("doorLine"));
					break;
				case 'L':
					rackg.add(paper.line(1.5,0,1.5,vertical).addClass("doorLine"));
					break;
				case 'R':
					rackg.add(paper.line(horizon - 1.5,0,horizon - 1.5,vertical).addClass("doorLine"));
					break;
			}

			rackg.attr("transform","translate(" + defaults.x + "," + defaults.y + ")");			

			return rackg;
		}

		w2ui.layout.on('resize', function(event) {
			event.onComplete = function () {
				var naviLeft = $("#svgNavi").position().left + $("#svgNavi").width();

				if (naviLeft > $('#layout_layout_panel_main').width() -15 ){
					$("#svgNavi").css("left",$('#layout_layout_panel_main').width() - $("#svgNavi").width() - 35);
				}

				// zoomPan Ojcectがある場合（初期表示時、図面読み込みより、resizeイベントの発生が早いので）
				if(zoomPan){
			 		zoomPan = svgPanZoom('#drawArea');
			 		$("#fitH").click();
//			 		zoomPan.disablePan();
			 	}
			}

		});

		w2ui.layout.on('hide', function(event) {
			if (event.target =='right'){
				rightLayoutDsp = "";
			}
			// if (event.target =='right'){
			// 	$('#attrArea').empty();
			// 	$('#layout_layout_panel_right .w2ui-panel-title').text('属性' ).css("color","black");
			// 	$('#attrArea').append('<div style="text-align:center;">デバイスを図面から選択して下さい。</div>');
			// 	devAttrPos = 0;
			// 	floorAttrPos = 0;
			// }
		});

		w2ui.layout.on('show', function(event) {
			event.onComplete = function () {

				if (event.target =='right' && paper){

				 	if(paper.select(".selectDev") && paper.selectAll(".selectDev").length == 1){
						var devId = paper.select(".selectDev").attr("devid");
						var devMgid  = paper.select("#" + devId).attr('devmgid');
						var devType = paper.select(".selectDev").attr("devtype");

				 		if(paper.select(".selectDev").hasClass("unFix")){
				 			if (rightLayoutDsp != "unFixInfo"){
								rightLayoutDsp = "unFixInfo";
					 			unFixInfo(siteID,devMgid,devType,devId);
					 		}
					 		$("#posH").val(paper.select("#" + devId).transform().localMatrix.e);
							$("#posV").val(paper.select("#" + devId).transform().localMatrix.f);
							$('#snapObj').prop("checked",snapOn) 
				 		}
				 		else if(paper.select(".selectDev").hasClass("unLink")){
							rightLayoutDsp = "unLinkInfo";
				 			unLinkInfo(siteID,devMgid,devType);
				 		}
				 		else{
							rightLayoutDsp = "devInfo";
					 		devInfo(devId,devMgid,devType);
				 		}
				 	}
				 	else{
						rightLayoutDsp = "floorInfo";
				 		floorInfo(siteID);
				 		$('#chkGap').prop("checked",autoGapOn);
				 		$('#alignGap').val(autoGapCm);

				 	}
				}
			}
		});


		// 属性エリア更新（移動可能デバイス）
		function unFixInfo(siteid,devmgid,devtype,devid){
			$('#layout_layout_panel_right .w2ui-panel-title').text('【未配置】' ).css("color","blue");	
			$('#attrArea').empty();

			var content = "";
			content = content + '<div id="attribute">';
			content = content + '<h3>移動</h3>';
			content = content + '<div id="attrBase" style="padding:10px;">';
			content = content + '<div style="margin-bottom:20px"><input type="checkbox" id="snapObj"> 図面シェープにスナップ</input></div>';
			content = content + '<div style="margin-bottom:20px" hidden><input type="checkbox" id="snapTile"> 床タイルにスナップ</input></div>';
			content = content + '<fieldset>';
			content = content + '    <legend style="white-space:nowrap;width: 70px;">座標指定</legend>';
			content = content + '<div style="margin-bottom:5px;margin-left:10px;"><label style="margin-right:10px;">X</label><input type="text" style="text-align:right;" size=10 id="posH"> Cm</div>';
			content = content + '<div style="margin-bottom:5px;margin-left:10px;"><label style="margin-right:10px;">Y</label><input type="text" style="text-align:right;" size=10 id="posV"> Cm</div>';
			content = content + '</fieldset>';

//			content = content + '<div style="margin-bottom:10px"><button type="button" id="magnet" style="padding:5px;" title="スナップ"><img src="../images/magnet.png"/></button></div>';
			content = content + '<br>';
//			content = content + '<div>';
			content = content + '<fieldset>';
			content = content + '    <legend style="white-space:nowrap;width: 70px;">扉と方向</legend>';			
			content = content + '<button type="button" class="direction" id="dir-top" data-toggle="tooltip" data-placement="bottom" style="margin-bottom:5px;margin-right:7px;padding:5px;" title="扉上"><img src="../images/dir-top.png"/></button>';
			content = content + '<button type="button" class="direction" id="dir-right" data-toggle="tooltip" data-placement="bottom" style="margin-bottom:5px;margin-right:7px;padding:5px;" title="扉右"><img src="../images/dir-right.png"/></button>';
			content = content + '<button type="button" class="direction" id="dir-bottom" data-toggle="tooltip" data-placement="bottom" style="margin-bottom:5px;margin-right:7px;padding:5px;" title="扉下"><img src="../images/dir-bottom.png"/></button>';
			content = content + '<button type="button" class="direction" id="dir-left" data-toggle="tooltip" data-placement="bottom" style="margin-bottom:5px;margin-right:7px;padding:5px;" title="扉左"><img src="../images/dir-left.png"/></button>';
			content = content + '</fieldset>';

//			content = content + '</div>';
//			content = content + '<hr>';
			content = content + '<div align="right" style="margin-top:20px" id="unFixInfoBtn">';
			content = content + '<button type="button" id="posReplace" style="padding:5px;margin:7px;" data-toggle="tooltip" data-placement="bottom" title="座標図面反映" ><img src="../images/posReplace.png"/></button>';
			content = content + '<button type="button" id="fixPosition" style="padding:5px;margin:7px;" data-toggle="tooltip" data-placement="bottom" title="位置固定"><img src="../images/posFix.png"/></button>';
			content = content + '</div>';
			content = content + '</div>';
			content = content + '</div>';

			$('#attrArea').append(content);
			$("#attribute").accordion({
				heightStyle: "fill",
				collapsible: false,
				active:0,
				// 以前選択位置保存
				activate: function( event, ui ) { 
					floorAttrPos = $("#attribute").accordion("option","active");
				}
			});
			$("#attribute .ui-accordion-content").height($('#attrArea').height() - (($("#attribute .ui-accordion-header").outerHeight() + 7 )* $("#attribute .ui-accordion-header").length) );
			$("#attribute").accordion("refresh");
			$('[data-toggle="tooltip"]').tooltip();
		}

		// 属性エリア更新（未リンクデバイス）
		function unLinkInfo(siteid,devmgid,devtype){
			$('#layout_layout_panel_right .w2ui-panel-title').text('【未リンク】' ).css("color","red");		
			$('#attrArea').empty();

			var content;
			content = '<div id="attribute">';
			content = content + '<h3>割り当て</h3>';
			content = content + '<div id="attrBase" style="padding:10px;">';
			content = content + '<div><font color="blue">リンクされてないデバイス</font></div>';
			content = content + '<div id="gridUnLinkList"></div>';			
			content = content + '<div align="right" style="margin-top:10px">';
			content = content + '<button type="button" id="linkElement" style="margin-right:10px;padding:5px;" data-toggle="tooltip" data-placement="bottom" title="リンク"><img src="../images/link.png"/></button>';
			content = content + '<button type="button" id="delElement" style="padding:5px;" data-toggle="tooltip" data-placement="bottom" title="削除"><img src="../images/garbage.png"/></button>';
			content = content + '</div>';
			content = content + '</div>';
			content = content + '</div>';


			$('#attrArea').append(content);
			$("#attribute").accordion({
				heightStyle: "fill",
				collapsible: false,
				active:0,
				// 以前選択位置保存
				activate: function( event, ui ) { 
					floorAttrPos = $("#attribute").accordion("option","active");
				}
			});
			$("#attribute .ui-accordion-content").height($('#attrArea').height() - (($("#attribute .ui-accordion-header").outerHeight() + 7 )* $("#attribute .ui-accordion-header").length) );
			$("#attribute").accordion("refresh");
			// //$(document).tooltip();
			$('#linkElement').attr('disabled',true);

			var grid = { 
		        name: 'gridUnLink', 
		        style   :'width:100%;height:560px;top:0px;',
				show: {
					toolbar : true,
					toolbarColumns : false,
				},
		        fixedBody: true,
		        multiSelect: false,
		        columns: [                
					{ field: 'INIT_DATE' , caption: '導入日',size:'75px',sortable:true},
					{ field: 'OBJ_NO' , caption: '什器番号',size:'70px' },
					{ field: 'MAN_NO' , caption: '資産番号',size:'70px' },
					{ field: 'MAN_NAME' , caption: '管理名',size:'120px' },
					{ field: 'MAKER' , caption: 'メーカー',size:'70px' },
					{ field: 'MODEL' , caption: 'モデル名',size:'70px' }
		        ],
		        records:unLinkList(),
		       	onReload: function(event) {
		        	this.records = unLinkList();
					this.refresh();

		        },
		        onClick: function(event) {
		        	var grid = this;
		        	event.onComplete = function () {
						var sel = grid.getSelection();
						if (sel.length == 1) {
							$('#linkElement').attr('disabled',false);

						} else {
							$('#linkElement').attr('disabled',true);
						}
					}

		    	}
		    }

			function unLinkList() {		 
				var result = $.ajax({
					type: "POST",
					url: "../php/dbUtil.php?fName=unLinkList&LOCATION=" + siteid + "&DEV_GRP_ID=" + devtype,
					data: null,
					async: false,
					cache: false,
				}).responseText;
				return JSON.parse(result);
			};

			$().w2destroy('gridUnLink');
			$('#gridUnLinkList').w2grid(grid);
  			$('[data-toggle="tooltip"]').tooltip();
		}

		// 属性エリア更新（フロア）
		function floorInfo(site){
			$('#attrArea').empty();	
			$('#layout_layout_panel_right .w2ui-panel-title').text('【フロア情報】').css("color","black");

			var result = $.ajax({
				type: "POST",
				url: "../php/dbUtil.php?fName=floorData&LOCATION=" + site,
				data: null,
				async: false,
				cache: false,
			}).responseText;

			var floorData = JSON.parse(result);

			var floorFieldDefine = 	[
							{ text: 'サイト', field: 'SITE_NAME', },
							{ text: 'ビル', field: 'BUILD_NAME', },
							{ text: 'フロア', field: 'FLOOR_NAME', },
							{ text: '横(m)', field: 'HORIZON', },
							{ text: '縦(m)', field: 'VERTICAL', },
							{ text: '面積(m²)', field: 'SQUARE_METER', },
							{ text: '初期表示', field: 'INIT_FLG', },
				];

			var content;
			if (floorData){
					content = '<div id="attribute">';
					content = content + '<h3>基本情報</h3>';
					content = content + '<div id="attrBase" style="padding:10px;">';
					content = content + '<table class="attr">';
					floorFieldDefine.forEach(
						function(flddata){
							var data;
							if (flddata.field == 'INIT_FLG'){
								data = floorData.BASE[flddata.field] != '1' ? '<font color="red">表示しない</font>': '<font color="green">表示</font>';
								content = content + '<tr><th>' + flddata.text + '</th><td>' + data + '</td></tr>';
							}
							else{
								data = floorData.BASE[flddata.field] == null ? '': floorData.BASE[flddata.field];
								content = content + '<tr><th>' + flddata.text + '</th><td>' + data + '</td></tr>';
							}
						}
					);
					content = content + '</table>';
					content = content + '<br><h5><font color="blue">＊ サマリー</font></h5>';
					content = content + '<table class="attr">';
					floorData.SUMMARY.forEach(
						function(sumdata){
							data = sumdata['DEV_GRP_NAME'] == null ? '0': sumdata['CNT'];
							content = content + '<tr><th>' + sumdata['DEV_GRP_NAME'] + '</th><td>' + data + '</td></tr>';
						}

					);
					content = content + '</table>';
					content = content + '</div>';

					// レイヤー
					content = content + '<h3>レイヤ表示状況</h3>';
					content = content + '<div id="attrLayer" style="padding:10px;">';
					content = content + '<table class="attr">';
					content = content + '<thead>';
					content = content + '<tr><th>レイヤー名</th><th>表示</th></tr>';
					content = content + '</thead>';

					paper.selectAll(".layer").forEach(
						function(elem){
							var LayerId = elem.attr("id");
							var LayerName = elem.attr("layername");
							var checked = elem.hasClass("dispHidden") ? '': 'checked';
							if (LayerId == 'CanvasLayer') return;	//キャッンパスレイアは表示しない
							content = content + '<tr><th>' + LayerName + '</th><td><input class="layerDisplay" type="checkbox" name="' + LayerId + '" ' + checked + ' value="1"></td></tr>';
						}
					);

					content = content + '</table>';
					content = content + '<div style="padding:7px"><button type="button" id="layerUpdate" style="padding:3px;">レイヤ表示状況保存</button></div>';
					content = content + '</div>';

					content = content + '<h3>図面シェープ管理</h3>';
					content = content + '<div id="attrAttach" style="padding:10px;">';

					content = content + '<fieldset style="margin-bottom:15px;">';
//					content = content + '    <legend>整列</legend>';
//					content = content + '<div style="margin-top:15px;margin-bottom:15px;">';
					content = content + '	<button type="button" id="reLocationAll" style="padding:5px;margin-right:7px;" data-toggle="tooltip" data-placement="bottom" title="選択シェープ再配置"><img src="../images/reLocation.png"/></button>';

//					content = content + '<div >';
					content = content + '	<button type="button" id="createShape" style="padding:5px;margin-right:7px;" data-toggle="tooltip" data-placement="bottom" title = "未リンクのシェープ生成"><img src="../images/createShape.png"/></button>';	
					content = content + '	<button type="button" id="allPosFix" style="padding:5px;" data-toggle="tooltip" data-placement="bottom" title="配置一括更新"><img src="../images/posFixAll.png"/></button>';
//					content = content + '</div>';

//					content = content + '</div>';
					content = content + '</fieldset>';

					content = content + '<fieldset>';
//					content = content + '    <legend>整列</legend>';
//					content = content + '<div style="margin-bottom:15px;">';
					content = content + '	<div style="margin-bottom:10px;"><input type="checkbox" id="chkGap" data-toggle="tooltip" data-placement="bottom" title="トップ整列">&nbsp;&nbsp; <input type="text" id="alignGap" size="2" value="10" style="text-align:right"> cm 間隔で自動配置</div>';
					content = content + '	<button type="button" id="alignmentTop" style="padding:5px;margin-right:7px;" data-toggle="tooltip" data-placement="bottom" title="トップ整列"><img src="../images/alignment-top.png"/></button>';
					content = content + '	<button type="button" id="alignmentLeft" style="padding:5px;margin-right:7px;" data-toggle="tooltip" data-placement="bottom" title="左整列"><img src="../images/alignment-left.png"/></button>';
					content = content + '	<button type="button" id="alignmentVcenter" style="padding:5px;margin-right:7px;" data-toggle="tooltip" data-placement="bottom" title="縦中央整列"><img src="../images/alignment-vcenter.png"/></button>';
					content = content + '	<button type="button" id="alignmentHcenter" style="padding:5px;margin-right:7px;" data-toggle="tooltip" data-placement="bottom" title="横中央整列"><img src="../images/alignment-hcenter.png"/></button>';
//					content = content + '</div>';
					content = content + '</fieldset>';
					content = content + '</div>';

					content = content + '</div>';
			}

			$('#attrArea').append(content);
			$("#attribute").accordion({
				heightStyle: "fill",
				collapsible: true,
				active:floorAttrPos,
				// 以前選択位置保存
				activate: function( event, ui ) { 
					floorAttrPos = $("#attribute").accordion("option","active");
				}
			});
			$("#attribute .ui-accordion-content").height($('#attrArea').height() - (($("#attribute .ui-accordion-header").outerHeight() + 7 )* $("#attribute .ui-accordion-header").length) );
			$("#attribute").accordion("refresh");
			$('[data-toggle="tooltip"]').tooltip();
		}

		// 属性エリア更新(機器)
		function devInfo(devid,devMgid,devType){
			
			function DevData() {		 
		        var result = $.ajax({
		            type: "POST",
		            url: "../php/dbUtil.php?fName=DevData&LOCATION=" + siteID + "&DEV_GRP_ID=" + devType + "&DEV_MG_ID=" + devMgid,
		            data: null,
		            async: false,
		            cache: false,
		        }).responseText;
		        return JSON.parse(result);
		        //return result;
			};

			var Dev;
			if (devMgid){
				Dev = DevData();
			}

			if (Dev.length > 0){
				$('#layout_layout_panel_right .w2ui-panel-title').text('【' + devType + '】' + Dev[0].MAN_NAME).css("color","black");

				var accordionTitle = {Base:"基本情報",Mng:"管理情報",Inv:"インベントリ情報",Mnt:"マウント情報",Con:"接続情報"};

				var dispFieldDefine = {
					RAK:{
						Base:[
							{ text: 'メーカー', field: 'MAKER', },
							{ text: 'モデル名', field: 'MODEL', },
							{ text: 'シリアル番号', field: 'SERIAL', },
							{ text: '幅(mm)', field: 'WIDTH', },
							{ text: '高さ(mm)', field: 'HEIGHT', },
							{ text: '奥行き(mm)', field: 'DEPTH', },
							{ text: '最大重量(Kg)', field: 'WEIT', },
							{ text: '設計重量(Kg)', field: 'DESIGN_WEIT', },
							{ text: '最大収容重量(Kg)', field: 'CONTAIN_WEIT', },
							{ text: '設計収容重量(Kg)', field: 'DESIGN_CONTAIN_WEIT', },
							{ text: '収容ユニット', field: 'CONTAIN_UNIT', },

							{ text: '電源使用有無', field: 'PWR_USE_FLG', },
							{ text: '入力定格（V）', field: 'INPUT_VOLT', },
							{ text: 'フェーズ(Hz)', field: 'PHASE', },
							{ text: '最大消費電力(Kva)', field: 'CONSUMP_KVA', },
							{ text: '設計電力(Kva)', field: 'DESIGN_KVA', },
							{ text: '接続可能電源数', field: 'CONNECT_PWR_CNT', },
							{ text: '英熱量(BTU)', field: 'UNIT_HEAT', },
							{ text: '熱量(Cal)', field: 'AMOUNT_HEAT', },
							{ text: '電源コンセント型', field: 'CONNECT_CONCENT', },

							{ text: '供給電源有無', field: 'PWR_SUPPLY_FLG', },
							{ text: '最大供給電力(Kva)', field: 'OUTPUT_KVA', },
							{ text: '設計供給電力(Kva)', field: 'DESIGN_OUTPUT_KVA', },
							{ text: '供給電源数', field: 'OUTPUT_PWR_CNT', },
							{ text: '電源コンセント型(供給)', field: 'OUTPUT_CONCENT', },

							// { text: '占有ユニット', field: 'OCCUPY_UNIT', },
							// { text: '占有ユニット幅', field: 'OCCUPY_UNIT_W', },
							// { text: '占有スロット', field: 'OCCUPY_SLOT', },
							// { text: 'スロット数', field: 'CONTAIN_SLOT', },
							],
						Mng:[
							{ text: '什器番号', field: 'OBJ_NO', },
							{ text: '資産番号', field: 'MAN_NO', },
							{ text: '管理名', field: 'MAN_NAME', },
							{ text: 'システム名', field: 'SYS_NAME', },
							{ text: '稼働情報', field: 'STATUS_NAME', },
							{ text: '導入日', field: 'INIT_DATE', },
							{ text: '備考', field: 'MEMO', },
							],
						Inv:[
							{ text: '所有区分', field: 'INVFLG_NAME', },
							{ text: '機器管理担当部署', field: 'CHRG_PART', },
							{ text: '機器管理責任者', field: 'CHRG_NAME', },
							{ text: '機器管理責任者連絡先', field: 'CHRG_TEL', },
							{ text: '保守契約会社名', field: 'MANT_COMP_NAME', },
							{ text: '保守契約会社連絡先', field: 'MANT_COMP_TEL', },
							{ text: '保守契約会社担当者', field: 'MANT_CHRG_NAME', },
							{ text: '保守契約開始日', field: 'MANT_START_YMD', },
							{ text: '保守契約期間(ヶ月)', field: 'MANT_TERM', },
							{ text: '保守契約終了日', field: 'MANT_END_YMD', },
							{ text: 'リース契約会社名', field: 'LEASE_COMP_NAME', },
							{ text: 'リース契約会社連絡先', field: 'LEASE_COMP_TEL', },
							{ text: 'リース契約会社担当者', field: 'LEASE_CHRG_NAME', },
							{ text: 'リース契約開始日', field: 'LEASE_START_YMD', },
							{ text: 'リース契約期間(ヶ月)', field: 'LEASE_TERM', },
							{ text: 'リース契約終了日', field: 'LEASE_END_YMD', },
							{ text: '追加情報', field: 'ADDON_INFO', },
							{ text: '備考', field: 'INV_MEMO', },
						],
						Mnt:[],
						Con:[],

					}
				}

				var devFieldDef = dispFieldDefine[devType];

				if(devFieldDef){
					$('#attrArea').empty();	
					var content = '<div id="attribute">';
					Object.keys(devFieldDef).forEach(
						function(key){
							content = content + '<h3>' + accordionTitle[key] + '</h3>';
							content = content + '<div id="attr' + key + '" style="padding:10px;">';
							if (key != 'Mnt'){
								content = content + '<table class="attr">';
								devFieldDef[key].forEach(
									function(flddata){
										// 電源使用区分の処理
										var pwrUse = 'INPUT_VOLT,PHASE,CONSUMP_KVA,DESIGN_KVA,CONNECT_PWR_CNT,UNIT_HEAT,AMOUNT_HEAT,CONNECT_CONCENT';
										if (pwrUse.indexOf(flddata.field) >= 0){
											if(Dev[0]['PWR_USE_FLG'] != '1'){
												return;
											}
										}
										// 供給電源有無の処理
										var pwrSupUse = 'OUTPUT_KVA,DESIGN_OUTPUT_KVA,OUTPUT_PWR_CNT,OUTPUT_CONCENT';
										if (pwrSupUse.indexOf(flddata.field) >= 0){
											if(Dev[0]['PWR_SUPPLY_FLG'] != '1'){
												return;
											}
										}

										// インベントリリース有無処理
										var leaseUse = 'LEASE_COMP_NAME,LEASE_COMP_TEL,LEASE_CHRG_NAME,LEASE_START_YMD,LEASE_TERM,LEASE_END_YMD';
										if (leaseUse.indexOf(flddata.field) >= 0){
											if(Dev[0]['OWEN_FLG'] != '2'){
												return;
											}
										}

										if (flddata.field == 'ADDON_INFO'){
											// jsonデータで保存されている拡張フィールドデータ処理
											var addon = JSON.parse(Dev[0][flddata.field]);
											if (addon){
												Object.keys(addon).forEach(
													function(addkey){
														content = content + '<tr><th>' + addkey.replace('AF_','') + '</th><td>' + addon[addkey] + '</td></tr>';
													}
												);
											}
										}
										else{
											var data;
											if (flddata.field == 'PWR_SUPPLY_FLG' || flddata.field == 'PWR_USE_FLG'){
												data = Dev[0][flddata.field] != '1' ? '<font color="red">使用しない</font>': '<font color="green">使用する</font>';
												content = content + '<tr><th><font color="blue">' + flddata.text + '</font></th><td>' + data + '</td></tr>';
											}
											else{
												data = Dev[0][flddata.field] == null ? '': Dev[0][flddata.field];
												content = content + '<tr><th>' + flddata.text + '</th><td>' + data + '</td></tr>';
											}
										}
									}
								);
								content = content + '</table>';

								if (key == 'Mng'){
									content = content + '<div style="margin-top:15px;" align="right">';
									content = content + '<button type="button" id="reLocation" style="padding:5px;margin:5px;" data-toggle="tooltip" data-placement="bottom" title="再配置"><img src="../images/reLocation.png"/></button>';
									if(!paper.select("#" + devid).hasClass("unLink"))
										content = content + '<button type="button" id="unLink" style="padding:5px;margin:5px;" data-toggle="tooltip" data-placement="bottom" title="リンク解除" ><img src="../images/broken-link.png"/></button>';
									content = content + '</div>';
								}
								
							}
							else{
								content = content + '<div align="center" id="MntFlip"> <font size=1 color="blue">* クリックで前面/背面反転</font>';

								// 前面マウント情報
								var Rack_F = $.ajax({
								    type: "POST",
								    url: "../php/dbUtil.php?fName=MountData&DEV_MG_ID=" + devMgid + "&SET_UNIT_DIR=F",
								    data: null,
								    async: false,
								    cache: false,
								}).responseText;

								if (Rack_F == null || Rack_F == ''){
									Rack_F =  null;
								}
								else{
									Rack_F = JSON.parse(Rack_F)
								}

								//Rack JSONデータ
								var data_F = {
									RackData: Rack_F.RackData,
									MaxUnit:Rack_F.MaxUnit,
									RackName: Rack_F.RackName,
									UnitWidth:250,
                					UnitHeight:18,
									Direction:"F",
								};

								content = content + '<div class="front">';
								$('#RackTableF').rackmount(data_F);
								content = content + $('#RackTableF').html()
								content = content + '</div>';
								

								var Rack_R = $.ajax({
								    type: "POST",
								    url: "../php/dbUtil.php?fName=MountData&DEV_MG_ID=" + devMgid + "&SET_UNIT_DIR=R",
								    data: null,
								    async: false,
								    cache: false,
								}).responseText;

								if (Rack_R == null || Rack_R == ''){
									Rack_R =  null;
								}
								else{
									Rack_R= JSON.parse(Rack_R)
								}

								var data_R = {
									RackData: Rack_R.RackData,
									MaxUnit:Rack_R.MaxUnit,
									RackName: Rack_R.RackName,
									UnitWidth:250,
                					UnitHeight:18,
									Direction:"R",
								};


								content = content + '<div class="back" >';
								$('#RackTableR').rackmount(data_R);
								content = content + $('#RackTableR').html();
								content = content + '</div>';
								content = content + '</div>';
								

							}
							content = content + '</div>';

						}
					);

					$('#attrArea').append(content);

					$("#attribute").accordion({
						heightStyle: "fill",
						collapsible: true,
						active:devAttrPos,
						// 以前選択位置保存
						activate: function( event, ui ) { 
							devAttrPos = $("#attribute").accordion("option","active");
						}
					});


					$('#RackTableF').empty();
					$('#RackTableR').empty();
					// 前面/背面反転
					$("#MntFlip").flip({
					  axis: 'y',
					  trigger: 'click',
					});


					$("#attribute .ui-accordion-content").height($('#attrArea').height() - (($("#attribute .ui-accordion-header").outerHeight() + 7 )* $("#attribute .ui-accordion-header").length) );
					$("#attribute").accordion("refresh");
				}
				else{
					$('#attrArea').append('<div style="text-align:center;">システムエラーです。</div>');
				}

				$('[data-toggle="tooltip"]').tooltip();
			}
			else{

				paper.select("#" + devid).addClass("unLink");
				paper.select(".selectDev").addClass("unLink");
				unLinkInfo(siteID,devMgid,devType);	
			}
		}


		// スナップポイント作成
		function createSnapPoint(siteid){
			// var result = $.ajax({
			// 	type: "POST",
			// 	url: "../php/dbUtil.php?fName=SnapPoint&LOCATION=" + siteid,
			// 	data: null,
			// 	async: false,
			// 	cache: false,
			// }).responseText;
			// return JSON.parse(result);

			var snpPointX = [];
			var snpPointY = [];
			var result = {};

			paper.selectAll(".DCVisorDev").forEach(
				function(elem){
					var elemId = elem.attr("id");

					if (elemId){	// ラバーボックス選択防止
						var elemWidth = parseFloat(elem.attr("width"));
						var elemDepth = parseFloat(elem.attr("depth"));
						var elemDoordir = elem.attr("doordir");						
						var x = parseFloat(elem.transform().localMatrix.e);
						var y = parseFloat(elem.transform().localMatrix.f);
						
						snpPointX.push(x);
						snpPointY.push(y);

						switch (elemDoordir) {
							case 'T':
							case 'B':
								snpPointX.push(x + elemWidth);
								snpPointY.push(y + elemDepth);
								break;
							case 'L':
							case 'R':
								snpPointX.push(x + elemDepth);
								snpPointY.push(y + elemWidth);
								break;
						}
					}
				}
			);

			
			// 重複座標削除
			var snpPointX = snpPointX.filter(function (v, i, s) {
				return s.indexOf(v) === i;
			});
			
			var snpPointY = snpPointY.filter(function (v, i, s) {
				return s.indexOf(v) === i;
			});

			result['X'] = snpPointX;
			result['Y'] = snpPointY;

			return result;

		}

		loadSVG();


		// -----------------------------------------------------------------------------------------------------
		// イベント
		// -----------------------------------------------------------------------------------------------------
		$(document).on('click', '#layoutLeft', function (e) {
			e.preventDefault();
			w2ui['layout'].toggle('left', window.instant);
		});

		$(document).on('click', '#layoutRight', function (e) {
			e.preventDefault();
			w2ui['layout'].toggle('right', window.instant);
		});


		// 図面コントロール
		$(document).on('click', '#svgNavi button', function (e) {
			e.preventDefault();

			var rate;
			var kubun;
			var bPan;

			if ($(e.target).prop('tagName') == 'IMG'){
				kubun = $(e.target).parent().attr('id');
			}
			else{
				kubun = $(e.target).attr('id');
			}

			bPan = zoomPan.getPan();

			switch (kubun) {
				case 'zoomIn':
					zoomPan.zoomIn();
					break;
				case 'zoomOut':
					zoomPan.zoomOut();
					break;
				case 'fitH':
					rate = ($('#layout_layout_panel_main').width() - 20) / $("#drawArea").attr("width");
					zoomPan.zoom(rate);
					zoomPan.pan({x: 10, y: 10});
					break;
				case 'fitV':
					rate = ($('#layout_layout_panel_main').height() - 40) / $("#drawArea").attr("height");
					zoomPan.zoom(rate);
					zoomPan.pan({x: 10, y: 10});
					break;
				case 'reDraw':
					beforePan = zoomPan.getPan();
					beforeZoom = zoomPan.getZoom();

					loadSVG(siteID);

					zoomPan.zoom(beforeZoom);
					zoomPan.pan(beforePan);

					// フロア情報
					if (!w2ui.layout.get('right').hidden){
						rightLayoutDsp = "floorInfo";
						floorInfo(siteID);
					}

					setShapeContextMenu();
					break;
				case 'panUp':
					zoomPan.pan({x: bPan.x, y: bPan.y - 50});
					break;
				case 'panDown':
					zoomPan.pan({x: bPan.x, y: bPan.y + 50});
					break;
				case 'panLeft':
					zoomPan.pan({x: bPan.x - 50, y: bPan.y});
					break;
				case 'panRight':
					zoomPan.pan({x: bPan.x + 50, y: bPan.y});
					break;
			}
			e.stopPropagation();


		});

		// デバイス配置方向
		$(document).on('click', '.direction', function (e) {
			e.preventDefault();

			if ($(e.target).prop('tagName') == 'IMG'){
				kubun = $(e.target).parent().attr('id');
			}
			else{
				kubun = $(e.target).attr('id');
			}
			
			var devId = paper.select(".selectDev").attr("devid");

			var moveDev = paper.select("#" + devId);
			var devMgid =  moveDev.attr("devmgid");
			var devType = moveDev.attr("devtype");
			var width = moveDev.attr("width");
			var depth = moveDev.attr("depth");
			var RackName = paper.select("#" + devId + " text.RackName").attr("value");
			var UnitRate = paper.select("#" + devId + " text.UnitRate").attr("value");
			var WeitRate = paper.select("#" + devId + " text.WeitRate").attr("value");
			var PowerRate = paper.select("#" + devId + " text.PowerRate").attr("value");

			var rack = {
				x:moveDev.attr("transform").localMatrix.e,
				y:moveDev.attr("transform").localMatrix.f,
				id:devId,
				devMgid : devMgid,
				devType: devType,
				class:moveDev.attr("class"),
				width: width,
				depth: depth,
				rackName:RackName,
				unitRate:UnitRate,
                weitRate:WeitRate,
                powerRate:PowerRate,
				doorDir:"L",
			};
			

			switch (kubun) {
				case 'dir-top':
					rack.doorDir = "T";
					break;
				case 'dir-right':
					rack.doorDir = "R";
					break;
				case 'dir-bottom':
					rack.doorDir = "B";
					break;
				case 'dir-left':
					rack.doorDir = "L";
					break;
			}

			// 元のシェープ削除
			moveDev.remove();
			// 元のラバボックス削除
			paper.selectAll(".selectDev").forEach(
				function(elem){
					elem.remove();
				}
			);

			paper.select("#FloorUnFixLayer").add(MakeRack(rack));

			rubberBox(devId,"unFix");

			paper.selectAll(".unFix").forEach(
				function(elem){
					var elemid = elem.attr("id");
					if (elemid){	// ラバーボックス選択防止
						paper.select("#" + elemid).altDrag();
					}
				}
			);

			e.stopPropagation();
		});


		// デバイス配置整列
		$(document).on('click', '#alignmentTop,#alignmentLeft,#alignmentVcenter,#alignmentHcenter', function (e) {
			e.preventDefault();

			if (paper.selectAll(".selectDev").length < 1){
				return false;
			}



			if ($(e.target).prop('tagName') == 'IMG'){
				kubun = $(e.target).parent().attr('id');
			}
			else{
				kubun = $(e.target).attr('id');
			}


			// ソートする為、配列にする。
			var arrObj = [];

			paper.selectAll(".selectDev").forEach(
				function(elem){

					var devId = elem.attr("devid");
					var moveDev = paper.select("#" + devId);

					var attr = {
						elem:elem,
						devId: devId,
						moveDev:moveDev,
						devMgid: moveDev.attr("devmgid"),
						devType: moveDev.attr("devtype"),
						width: moveDev.attr("width"),
						depth: moveDev.attr("depth"),
						doordir: moveDev.attr("doordir"),
						x: moveDev.attr("transform").localMatrix.e,
						y: moveDev.attr("transform").localMatrix.f,
					};

					arrObj.push(attr);
				}
			);

			switch (kubun) {
				// yでソート
				case 'alignmentTop':
				case 'alignmentVcenter':
					arrObj.sort(function(a,b){
						if(a.y<b.y) return -1;
						if(a.y > b.Y) return 1;
						return 0;
					});
					break;
				// xでソート
				case 'alignmentLeft':
				case 'alignmentHcenter':
					arrObj.sort(function(a,b){
						if(a.x<b.x) return -1;
						if(a.x > b.x) return 1;
						return 0;
					});
					break;
			}

			var baseLineX = arrObj[0].x;
			var baseLineY = arrObj[0].y;
			var baseCenterLineX = arrObj[0].doordir == 'T' || arrObj[0].doordir == 'B' ? arrObj[0].x + (arrObj[0].width / 2) : arrObj[0].x + (arrObj[0].depth / 2);
			var baseCenterLineY = arrObj[0].doordir == 'T' || arrObj[0].doordir == 'B' ? arrObj[0].y + (arrObj[0].depth / 2) : arrObj[0].y + (arrObj[0].width / 2);
			var alignGap = parseFloat($("#alignGap").val());


			var alignOffx = 0;
			var alignOffy = 0;
			$.each(arrObj,function(index,val){
				// 移動可能レイアのシェープのみ移動する。
				if ($("#" + val.devId).parent().attr("id") == "FloorUnFixLayer"){

					var centerOffx = 0;
					var centerOffy = 0;

					alignOffx = val.x;
					alignOffy = val.y;
					// 同間隔自動配置をチェックした場合
					if($("#chkGap").prop('checked')){
						if(index > 0){
							alignOffx = arrObj[index -1].moveDev.attr("transform").localMatrix.e;
							alignOffx = arrObj[index -1].doordir == 'T' || arrObj[index -1].doordir == 'B' ?  alignOffx + parseFloat(arrObj[index -1].width) + alignGap : alignOffx + parseFloat(arrObj[index -1].depth) + alignGap;

							alignOffy = arrObj[index -1].moveDev.attr("transform").localMatrix.f;
							alignOffy = arrObj[index -1].doordir == 'T' || arrObj[index -1].doordir == 'B' ? alignOffy + parseFloat(arrObj[index -1].depth) + alignGap : alignOffy + parseFloat(arrObj[index -1].width) + alignGap;
						}
					}

					switch (kubun) {
						case 'alignmentTop':
							val.moveDev.attr("transform","translate(" + alignOffx + "," + baseLineY + ")");
							break;
						case 'alignmentLeft':
							val.moveDev.attr("transform","translate(" + baseLineX + "," + alignOffy + ")");
							break;
						case 'alignmentVcenter':
							centerOffy = val.doordir == 'T' || val.doordir == 'B' ? baseCenterLineY - (val.depth / 2) : baseCenterLineY - (val.width / 2);
							val.moveDev.attr("transform","translate(" + alignOffx + "," + centerOffy + ")");
							break;
						case 'alignmentHcenter':
							centerOffx = val.doordir == 'T' || val.doordir == 'B' ? baseCenterLineX - (val.width / 2) : baseCenterLineX - (val.depth / 2);
							val.moveDev.attr("transform","translate(" + centerOffx + "," + alignOffy + ")");
							break;
					}

					val.elem.remove();

					rubberBox(val.devId,"multi");
				}
			});

			if (snapOn){
				SnapPoint = createSnapPoint(siteID);
			}

			e.stopPropagation();
		});

	 	// DC Visor用機器クリック
		$(document).on('mousedown', 'g.DCVisorDev, g.layer', function (e) {
			e.preventDefault();

			// 左ボタンのみ有効
			if (e.button !=0) {
				return false; 
			}
			
			// クリックしたシェープのトップ<g>を探してidを取得する（attribute devmgidがあるタグがシェープのトップGroup）
			var devId = $(e.target).parents("g[devmgid]").attr('id');
			// クリックしたのがシェープではない場合（レイアの場合）
			if(!devId){
				devId = $(e.target).parents("g.layer").attr('id');
			}

			var shape = paper.select("#" + devId);

			// 選択したシェープの現座標を保存（Drag対応）
			shape.data('ot', shape.transform().local);

			// Shift Keyで複数選択
			if(e.shiftKey){
				// 既存選択したのがある場合、ラバーボックスの色を変える
				if(paper.select(".selectDev:not(.multi)")){
					paper.select(".selectDev:not(.multi)").addClass("multi");
				}

				if (!shape.hasClass("layer")){
					// ラバーボックス選択toggle
					if(paper.select(".selectDev.multi[devid=" + devId + "]")){
						// ラバーボックス削除
						paper.select(".selectDev.multi[devid=" + devId + "]").remove();
					}
					else{

						// ラバーボックス作成
						rubberBox(devId,"multi");
					}
				}
				return false;
			}

			if (!shape.hasClass("layer")){
				// ラバーボックス選択toggle
				if(paper.select(".selectDev.multi[devid=" + devId + "]")){
					return false;
				}
			}

			paper.selectAll(".selectDev").forEach(
				function(elem){
					elem.remove();
				}
			);

			// レイアクリック（空いている空間クリック）
			if (shape.hasClass("layer")){
				if (!w2ui.layout.get('right').hidden){
					rightLayoutDsp = "floorInfo";
					floorInfo(siteID); 
					$('#chkGap').prop("checked",autoGapOn);
					$('#alignGap').val(autoGapCm);
				}
			}
			else{
				rightPanelControl(shape);
			}

			e.stopPropagation();
			return false;
		});

		// right panel 表示コントロール
		function rightPanelControl(shape){
			// デバイスクリック
			var devId  = shape.attr('id');
			var devMgid  = shape.attr('devmgid');
			var devType  = shape.attr('devtype');


			// 未配置の場合、ラバボックス色を青にする。他は赤
			if (shape.hasClass("unFix")){
				rubberBox(devId,"unFix");

				if (!w2ui.layout.get('right').hidden){
					if (rightLayoutDsp != "unFixInfo"){
						rightLayoutDsp = "unFixInfo";
			 			unFixInfo(siteID,devMgid,devType,devId);
			 		}

					$("#posH").val(shape.transform().localMatrix.e);
					$("#posV").val(shape.transform().localMatrix.f);

					if(shape.hasClass("unLink")){
						if($('#delElement1').length == 0){
							var delBtn = '<button type="button" id="delElement1" style="padding:5px;margin:7px;" data-toggle="tooltip" data-placement="bottom" title="削除"><img src="../images/garbage.png"/></button>';
							$('#unFixInfoBtn').append(delBtn);
						}
					}
					else{
						if($('#delElement1'))
							$('#delElement1').remove();
					}

					$('#snapObj').prop("checked",snapOn) 
				}
			}
			else if (shape.hasClass("unLink")){
				rubberBox(devId,"unLink");
				if (!w2ui.layout.get('right').hidden){
					rightLayoutDsp = "unLinkInfo";
					unLinkInfo(siteID,devMgid,devType);				
				}
			}
			else{
				// 属性エリア更新
				rubberBox(devId,"");
				if (!w2ui.layout.get('right').hidden){
					rightLayoutDsp = "devInfo";
					devInfo(devId,devMgid,devType);
				}
			}

		}

		// 移動可能なシェープの移動後のラバーボックス処理
		$(document).on('mouseup', 'g.DCVisorDev.unFix', function (e) {
			e.preventDefault();
			
			paper.selectAll(".selectDev").forEach(
				function(elem){
					elem.remove();
					
					var devId = elem.attr("devid");
					if(elem.hasClass("multi")){
				 		rubberBox(devId,"multi");
				 	}
				 	else{
				 		rubberBox(devId,"unFix");
				 	}

				 	SnapPoint = createSnapPoint(siteID);
				}
		 	);

			e.stopPropagation();
		});

		// コンテキストメニュー
		function setShapeContextMenu(){
	        $('g.DCVisorDev').contextMenu('cmShape',
	           	{
		           	bindings: {
						'cmShapeEdit': function(evt) {
							
						},
						'cmShapeMove': function(evt) {
							$('#reLocation').click();
						},
						'cmShapeFix': function(evt) {
							
						},
						'cmShapeDel': function(evt) {
							
						},
						'cmShapeFrontmost': function(evt) {
							
						},
						'cmShapeFront': function(evt) {
							
						},
						'cmShapeBack': function(evt) {
							
						},
						'cmShapeBackmost': function(evt) {
							
						},
						'cmShapeClose': function(evt) {
							
						},

		           	},
		           	menuStyle: {width: '150px'},
		           	itemStyle: {},
		           	itemHoverStyle: {},
		           	onContextMenu: function(e) {
		           		// if ($(e.target).attr('id') == 'dontShow') return false;
		           		// else return true;

		           		return true;
		           	},
		           	onShowMenu: function(e, menu) {

		           		zoomPan.disablePan();
		           		zoomPan.disableZoom();

		           		// 選択のラバーボックスを削除
						paper.selectAll(".selectDev").forEach(
							function(elem){
								elem.remove();
							}
						);

						var devId = $(e.target).parents("g[devmgid]").attr("id");

						var shape = paper.select("#" + devId);

						if(!shape.hasClass("unFix") && !shape.hasClass("unLink")){
							$('#cmShapeFix, #cmShapeDel', menu).remove();
						}
						else if(shape.hasClass("unFix") && shape.hasClass("unLink")){
							$('#cmShapeMove', menu).remove();
						}
						else if(shape.hasClass("unFix")){
							$('#cmShapeMove, #cmShapeDel, #cmShapeFrontmost, #cmShapeFront, #cmShapeBack, #cmShapeBackmost, #s2', menu).remove();
						}
						else if(shape.hasClass("unLink")){
							$('#cmShapeEdit, #s1, #cmShapeMove, #cmShapeFix, #cmShapeFrontmost, #cmShapeFront, #cmShapeBack, #cmShapeBackmost, #s2', menu).remove();
						}

						rightPanelControl(shape);

		           		return menu;
					},
					onHideMenu: function(menu) {

						zoomPan.enablePan();
	           			zoomPan.enableZoom();

		           		return menu;
					}
	        	}
	        );
	    }

		// デバイス配置固定
		$(document).on('click', '#fixPosition, #allPosFix',function (e) {
			e.preventDefault();
			
			if (!confirm('現位置に固定しますか？') ){
				return false;
			}

			var selector;

			if (e.currentTarget.id == "fixPosition"){
				selector = ".selectDev";
			}
			else{
				selector = ".unFix";
			}

			paper.selectAll(selector).forEach(
				function(elem){

					var devId;
					var moveDev;

					if (e.currentTarget.id == "fixPosition"){
						devId = paper.select(".selectDev").attr("devid");
						moveDev = paper.select("#" + devId);

					}
					else{
						devId = elem.attr("id");
						moveDev = elem;
					}


					moveDev.removeClass("unFix");
					// Object Layerにシェープ移動
					moveDev.appendTo(paper.select('#FloorObjectLayer'));
					// Object Layerにラバーボックス移動
					elem.appendTo(paper.select('#FloorObjectLayer'));


					// var moveDev = paper.select("#" + devId);
					// var devMgid =  moveDev.attr("devmgid");
					// var devType = moveDev.attr("devtype");
					// var width = moveDev.attr("width");
					// var depth = moveDev.attr("depth");
					// var doorDir = moveDev.attr("doordir");
					// var RackName = paper.select("#" + devId + " text.RackName").attr("value");
					// var UnitRate = paper.select("#" + devId + " text.UnitRate").attr("value");
					// var WeitRate = paper.select("#" + devId + " text.WeitRate").attr("value");
					// var PowerRate = paper.select("#" + devId + " text.PowerRate").attr("value");

					// var fixRack = {
					// 	LOCATION:siteID,
					// 	X:moveDev.attr("transform").localMatrix.e,
					// 	Y:moveDev.attr("transform").localMatrix.f,
					// 	ID:devId,
					// 	DEVMGID: devMgid,
					// 	DEVTYPE: devType,
					// 	CLASS:moveDev.attr("class"),
					// 	WIDTH: width,
					// 	DEPTH: depth,
					// 	RACKNAME:RackName,
					// 	UNITRATE:UnitRate,
		   //              WEITRATE:WeitRate,
		   //              POWERRATE:PowerRate,
					// 	DOORDIR:doorDir,
					// };

					// var result = $.ajax({
					//     type: "POST",
					//     url: "../php/ajaxElemFix.php",
					//     data: fixRack,
					//     async: false,
					//     cache: false,
					// }).responseText;


				}
			);

			SnapPoint = createSnapPoint(siteID);

			// $("#reDraw").click();


			e.stopPropagation();
		});

		// 手入力座標反映
		$(document).on('click', '#posReplace',function (e) {
			e.preventDefault();
			
			if(isNaN($("#posH").val()) || isNaN($("#posV").val())){
				alert("位置情報を数字で入力してください。");
				return;
			}


			var devId = paper.select(".selectDev").attr("devid");

			var selDev = paper.select("#" + devId);
			selDev.attr("transform","translate(" + $("#posH").val() + "," + $("#posV").val() + ")");			


			paper.selectAll(".selectDev").forEach(
				function(elem){
					elem.remove();
				}
			);

    		setTimeout(function(){
				rubberBox(devId,"unFix");
			}, 50);
	
			e.stopPropagation();
		});


		$(document).on('click', '#reLocation,#reLocationAll',function (e) {
			e.preventDefault();
			
			if (!confirm('図面の選択シェープを再配置可能にしますか？') ){
				return false;
			}

			paper.selectAll(".selectDev").forEach(
				function(elem){
					var devId = elem.attr("devid");

					var selDev = paper.select("#" + devId);
					var devMgid  = selDev.attr('devmgid');
					var devType = selDev.attr("devtype");

					selDev.addClass("unFix");

					elem.addClass("unFix");
					paper.select("#FloorUnFixLayer").append(selDev);

					selDev.altDrag();

				}
			);


 			var devId = paper.select(".selectDev").attr("devid");
 			var devMgid  = paper.select("#" + devId).attr('devmgid');
 			var devType = paper.select("#" + devId).attr("devtype");

 			var selDev = paper.select("#" + devId);

// 			selDev.addClass("unFix");
// 			selDev.altDrag();

// //			paper.select(".selectDev").addClass("unFix");
// 			paper.select("#FloorUnFixLayer").append(selDev);
			if (paper.selectAll(".selectDev").length == 1){
				rightLayoutDsp = "unFixInfo";
				unFixInfo(siteID,devMgid,devType,devId);

				$("#posH").val(selDev.transform().localMatrix.e);
				$("#posV").val(selDev.transform().localMatrix.f);
			}

			e.stopPropagation();
		});

		// シェープ削除		
		$(document).on('click', '#delElement,#delElement1', function (e) {
			e.preventDefault();

			if (!confirm('図面の選択シェープを削除しますか？') ){
				return false;
			}

			beforePan = zoomPan.getPan();
			beforeZoom = zoomPan.getZoom();

			// PHPでelement削除
			paper.selectAll(".selectDev").forEach(
				function(elem){
					var shapeId = elem.attr("devid");
					var result = $.ajax({
					    type: "POST",
					    url: "../php/ajaxElemDel.php",
					    data: {LOCATION:siteID,SHAPE_ID:shapeId},
					    async: false,
					    cache: false,
					}).responseText;

				}
			);

			// 再ロード
			loadSVG(siteID);

			zoomPan.zoom(beforeZoom);
			zoomPan.pan(beforePan);

			e.stopPropagation();
		});

		// シェープリンククリック
		$(document).on('click', '#linkElement', function (e) {
			e.preventDefault();

			if (!confirm('図面の選択シェープと選択デバイスとリンクしますか？') ){
				return false;
			}

			var sel = w2ui['gridUnLink'].getSelection();
			if (sel.length == 1) {
				var selData = w2ui['gridUnLink'].get(sel[0]);

			
				beforePan = zoomPan.getPan();
				beforeZoom = zoomPan.getZoom();

				// PHPでelement削除
				paper.selectAll(".selectDev").forEach(
					function(elem){
						var shapeId = elem.attr("devid");
						var devcd = elem.attr("devtype");
						var devmgid = selData.DEV_MG_ID;

						var linkDev = paper.select("#" + shapeId);

						var linkData = {
							LOCATION:siteID,
							DEVCD:devcd,
							DEVMGID:devmgid,
							SHAPEID:shapeId,
							DOORDIR:linkDev.attr("doordir"),
							POSX:linkDev.attr("transform").localMatrix.e,
							POSY:linkDev.attr("transform").localMatrix.f,
						};

						var result = $.ajax({
						    type: "POST",
						    url: "../php/ajaxElemLink.php",
						    data: linkData,
						    async: false,
						    cache: false,
						}).responseText;

					}
				);

				// 再ロード
				loadSVG(siteID);

				zoomPan.zoom(beforeZoom);
				zoomPan.pan(beforePan);

				rightLayoutDsp = "floorInfo";
				floorInfo(siteID); 
				$('#chkGap').prop("checked",autoGapOn);
				$('#alignGap').val(autoGapCm);
			}
			e.stopPropagation();
		});

		// レイア表示/非表示
		$(document).on('click', 'input.layerDisplay', function (e) {
			var layerId = e.target.name;

			if($(e.target).prop('checked')){
				paper.select("#" + layerId).removeClass("dispHidden");
			}
			else{
				paper.select("#" + layerId).addClass("dispHidden");
			}
		});

		// レイヤ表示状況更新
		$(document).on('click', '#layerUpdate', function (e) {

			var layerDispUpd = [];
			$('input.layerDisplay').each(
				function(i,elem){
					var checkStatus = {};
					if(elem.checked == true){
						checkStatus['layer'] = elem.name;
						checkStatus['visible'] = "1";
					}
					else{
						checkStatus['layer'] = elem.name;
						checkStatus['visible'] = "0";
					}
					layerDispUpd.push(checkStatus);
				}				
			);

			var result = $.ajax({
			    type: "POST",
			    url: "../php/ajaxLayerUpd.php",
			    data: {"LAYERSTATUS":JSON.stringify(layerDispUpd),'LOCATION':siteID},
			    dataType:'json',
			    async: false,
			    cache: false,
			}).responseText;

			$("#reDraw").click();

		});

		// シェープのスナップをチェックした時のスナップポイント作成
		$(document).on('change', '#snapObj', function (e) {

			if ($(this).is(':checked')) {
				snapOn = true;
				SnapPoint = createSnapPoint(siteID);
			}
			else{
				snapOn = false;
			}

		});

		$(document).on('change', '#chkGap', function (e) {

			if ($(this).is(':checked')) {
				autoGapOn = true;
			}
			else{
				autoGapOn = false;
			}

		});

		$(document).on('change', '#alignGap', function (e) {
			autoGapCm = $('#alignGap').val();
		});

		// レイア表示/非表示
		$(document).on('click', 'input.layerDisplay', function (e) {
			var layerId = e.target.name;

			if($(e.target).prop('checked')){
				paper.select("#" + layerId).removeClass("dispHidden");
			}
			else{
				paper.select("#" + layerId).addClass("dispHidden");
			}
		});

		// 未リンク機器のシェープ生成
		$(document).on('click', '#createShape', function (e) {

			if (!confirm('未リンク機器のシェープを生成しますか？') ){
				return false;
			}


			var result = $.ajax({
				type: "POST",
				url: "../php/ajaxCreateShape.php",
				data: {'LOCATION':siteID},
				dataType:'json',
				async: false,
				cache: false,
			}).responseText;

			$("#reDraw").click();


		});

		// 現図面を保存
		$(document).on('click', '#dwgSave', function (e) {
			e.preventDefault();

			if (!confirm('表示図面をデータベースに保存しますか？') ){
				return false;
			}

			paper.selectAll(".selectDev").forEach(
				function(elem){
					elem.remove();
				}
			);

			if ($('#CanvasLayer').parents("g").length > 0 ){
					$('#CanvasLayer').unwrap();
			}

			var svgHead = '<svg id="' + paper.attr("id") + '" width="' + paper.attr("width") + '" height="' + paper.attr("height") + '" >\n';

			var svgDoc = $("#drawArea").html();

			var svgTail = '\n</svg>';


			svgDoc = svgHead + svgDoc + svgTail;

			// var result = $.ajax({
			// 	type: "POST",
			// 	url: "../php/ajaxFloorDwgUpd.php",
			// 	data: {'LOCATION':siteID,DOC:svgDoc},
			// 	dataType:'json',
			// 	async: false,
			// 	cache: false,
			// }).responseText;

			$(function(){
				$.ajax({
					type: "POST",
					url: "../php/ajaxFloorDwgUpd.php",
					data: {'LOCATION':siteID,DOC:svgDoc},
					dataType:'json',
					async: true,
					cache: false,
				})
	                // Ajaxリクエストが成功した時発動
	            .done((data) => {
	                console.log(data);
	            })
	            // Ajaxリクエストが失敗した時発動
	            .fail((data) => {
	                console.log(data);
	            })
	            // Ajaxリクエストが成功・失敗どちらでも発動
	            .always((data) => {

	            })
            });

			$("#reDraw").click();

			e.stopPropagation();

			return true;

		});		

 		// マウス右クリック禁止
	    $(document).on('contextmenu',function(e){
	        return false;
	    });
	
		// MuiltSelect ボックス型のラバーボックス
	 	var areaSelBox;
	 	var areaSelStartCoord;
	 	function setDrag(){
			paper.drag(
				// drag move
				function(dx, dy, posx, posy,e){
					// DC Visor ObjectをDragする場合はイベントを実行しない
					if (ObjDrag) return;

					var areaSelEndCoord = screenPtTosvgPt({x:posx,y:posy});
					var segs = [
						["M",areaSelStartCoord.x,areaSelStartCoord.y],
						["h",areaSelEndCoord.x - areaSelStartCoord.x],
						["v",areaSelEndCoord.y - areaSelStartCoord.y],
						["h",(areaSelEndCoord.x - areaSelStartCoord.x) * -1],
						["z"]
					];

					if(paper.select("#areaSelBox")){
						paper.select("#areaSelBox").attr("path",segs);
					}
					else{
						paper.select("#FloorUnFixLayer").append(paper.path(segs).attr({"id":"areaSelBox","fill":"none","stroke":"#000000","stroke-width":"0.5px","strokeDasharray": "3"}));
					}

				},
				// drag start
				function(posx, posy, e){
					// DC Visor ObjectをDragする場合はイベントを実行しない
					if (ObjDrag) {
						return;
					}
					areaSelStartCoord = screenPtTosvgPt({x:posx,y:posy});

				}, 
				// drag end
				function(){

					// DC Visor ObjectをDragする場合はイベントを実行しない
					if (ObjDrag) return;


					paper.selectAll(".DCVisorDev").forEach(
						function(elem){
							var devId = elem.attr("id");
							var x = elem.attr("transform").localMatrix.e;
							var y = elem.attr("transform").localMatrix.f;
							if (Snap.path.isPointInside(paper.select("#areaSelBox"),x,y)){	
								rubberBox(devId,"multi");
							}
						}
					);

					if(paper.select("#areaSelBox")){
						paper.select("#areaSelBox").remove();
					}


					if(paper.selectAll(".selectDev").length == 1){
						paper.select(".selectDev").removeClass("multi");
						if (!w2ui.layout.get('right').hidden){
							rightLayoutDsp = "devInfo";
							var devId = paper.select(".selectDev").attr("devid");
							var devMgid = paper.select(".selectDev").attr("devmgid");
							var devType = paper.select(".selectDev").attr("devtype");

							var shape = paper.select("#" + devId);

 							if(!shape.hasClass("unFix")){
								devInfo(devId,devMgid,devType);
							}
						}
					}
					else{
						if (!w2ui.layout.get('right').hidden){
							rightLayoutDsp = "floorInfo";
							floorInfo(siteID); 
							$('#chkGap').prop("checked",autoGapOn);
				 			$('#alignGap').val(autoGapCm);
						}
					}

				} 
			);
		}

		// ラバーボックス
		function rubberBox(devId,addClassName){
			if(paper.select("#" + devId)){
				var elem =paper.select("#" + devId)
				var devMgid = elem.attr("devmgid");
				var devType = elem.attr("devtype");
				var bbox = elem.getBBox();
				var rect = paper.rect(bbox).attr({devid:devId,devmgid:devMgid,devtype:devType,class:"selectDev"});
				// ラバボックス追加
				if(addClassName){
					rect.addClass(addClassName);
				}

				if(addClassName == "unFix"){
					paper.select("#FloorUnFixLayer").add(rect);
				}
				else{
					paper.select("#FloorObjectLayer").add(rect);
				}

				console.log(addClassName);
			}
		}


		// 座標変換
	    function screenPtTosvgPt(Pt){
	    	var svgPt = {x:0,y:0};
	    	var pan = zoomPan.getPan();
	    	var zoomRate = zoomPan.getZoom();

			svgPt.x = (Pt.x - $("#drawArea").offset().left - pan.x) * ( 1 / zoomRate);
			svgPt.y = (Pt.y - $("#drawArea").offset().top - pan.y) * ( 1 / zoomRate);

			return svgPt;
	    }

	    $('#contextMenuArea').show();
	    setShapeContextMenu();

	});
