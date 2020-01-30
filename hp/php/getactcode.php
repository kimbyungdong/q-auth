<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>＠割符アクティベーション</title>

	<link rel="stylesheet" href="./css/w2ui-1.5.rc1.min.css">
</head>

<body>

<div align="center">
<div id="form" style="width: 450px; height: 250px;">
	<div class="w2ui-page page-0">
		<div class="w2ui-field">
			<label>ライセンスNo</label>
			<div>
				<input name="LICENSE_CD" type="text" maxlength="100" size="40"/>
			</div>
		</div>
		<div class="w2ui-field">
			<label>認証No</label>
			<div>
				<input name="CPUID" type="text" maxlength="100" size="40"/>
			</div>
		</div>
		<div class="w2ui-field">
			<label>アクティベーション<br>コード</label>
			<div>
				<input name="ACTCD" type="text" maxlength="100" size="35" style="font-weight: bold; " />
			</div>
		</div>
		<br>
		<div><font color=red>★アクティベーションコード発行した日からライセンス期間が計算されます。</font></div>

	</div>
	<div class="w2ui-buttons">
		<button class="w2ui-btn" name="btnGetCode">アクティベーションコード取得</button>
		<button class="w2ui-btn"  name="Reset">クリア</button>
	</div>
</div>
</div>

	<script type="text/javascript" src="./lib/jquery-3.1.1.min.js"></script>
	<script type="text/javascript" src="./lib/w2ui-1.5.rc1.min.js"></script>
	<script>

	jQuery(function ($) {

		function getCode() {		 
				var result = $.ajax({
					type: "POST",
					dataType: 'json',
					url: "./comAjax.php",
					data: {
						fncName: 'getactcode',
						CPUID: $('#CPUID').val(),
						LICENSE_CD: $('#LICENSE_CD').val(),
						ONLINE:'false',
					},
					async: false,
					cache: false,
				}).responseText;

				return result;
	    };


	    w2utils.locale('ja-jp');
	    
	    var setIni = {
	    	form: { 
	    		header: '＠割符アクティベーションコード発行',
	    		name: 'form',
//	    		formHTML: null, 
	    		fields: [
	    		{ name: 'LICENSE_CD', type: 'text', required: true },
	    		{ name: 'CPUID', type: 'text', required: true },
	    		{ name: 'ACTCD', type: 'password', required: false },
	    		],
	    		onRender  : function (event){
	    			setTimeout(function(){
	    				$('#ACTCD').prop('readonly',true);
	    			}, 10);
	    		}, 
	    		actions: {
	    			btnGetCode: function () {
	    				$('#ACTCD').val('');

	    				var errors = this.validate();
	    				if (errors.length > 0) return;

	    				var status = JSON.parse(getCode());


	    				if(status['Status'] == "OK"){
	    					if(status['envFileFlg'] == "false")
		    				{
		    					$('#ACTCD').val(status['ActCode']);
		    				}
		    				else{
								$('#LICENSE_CD').w2tag("このライセンスはオフラインアクティベーション出来ません。", { "class": 'w2ui-error' });
		    				}
		    			}
		    			else{
		    				if(status['ErrMsg'].indexOf("認証") >= 0 ){
	    						$('#CPUID').w2tag(status['ErrMsg'], { "class": 'w2ui-error' });
	    					}
		    				else if(status['ErrMsg'].indexOf("ライセンス") >= 0 ){
	    						$('#LICENSE_CD').w2tag(status['ErrMsg'], { "class": 'w2ui-error' });
	    					}
		    				else{
	    						$('#CPUID').w2tag(status['ErrMsg'], { "class": 'w2ui-error' });
	    					}
	    				}
	    			},
	    			Reset: function () {
	    				w2ui.form.clear();
	    			}, 
	    		}
	    	}
	    }	

		$('#form').w2form(setIni.form);


	});

</script>


</body>
</html>