(function($) {        
	$.fn.luckyDraw = function(options) {
		var defaults = {
			height: 40,
			width: 200,
			mainBkg: 'none',
			bottomBkg:  'none',
			middleBkg: 'none',
			topImg:  null,
			topBkg:'#F93288',
			startFun:null,
			compelteFun :null,
		};
		var c = $.extend(defaults, options);
		c.mainId = '#'+$(this).attr('id');
		$(c.mainId).addClass('ld-luckydraw').height(c.height).width(c.width);
		var IDbottomdiv = 'ld-bottomdiv'+ (Math.random() * 100000).toFixed(0);
		var IDmiddlediv = 'ld-middlediv'+ (Math.random() * 100000).toFixed(0);
		var IDtopcanvas = 'ld-topcanvas'+ (Math.random() * 100000).toFixed(0);
		var sHtml = '<div class="ld-bottomdiv" id="'+IDbottomdiv+'" style="height:'+c.height+'px;width:'+c.width+'px;background:'+c.bottomBkg+';"></div><div id="'+IDmiddlediv+'" class="ld-middlediv" style="height:'+c.height+'px;width:'+c.width+'px;background:'+c.middleBkg+'"></div><canvas class="ld-topcanvas" style="height:'+c.height+'px;width:'+c.width+'px;" id="'+IDtopcanvas+'" height="'+c.height+'" width="'+c.width+'"></canvas>';
		$(c.mainId).html(sHtml);
		var canvas = document.getElementById(IDtopcanvas);
		var mainwrap = $(c.mainId)[0];
		canvas.style.height = c.height;
		canvas.style.width = c.width;
		
		
		var POS = {left:mainwrap.offsetLeft,top:mainwrap.offsetTop};
		var L = 15;
		var R = (Math.sqrt(2) * L ).toFixed(0);
		var MPS = [{x:((c.width / 2 - (c.width / 2) * 0.2).toFixed(0)) * 1,y:(c.height / 2),f:0},{x:(c.width / 2),y:(c.height / 2),f:0},{x:((c.width / 2 + (c.width / 2) * 0.2).toFixed(0)) * 1,y:(c.height / 2),f:0}];
		var cans = canvas.getContext('2d');
		
		if(c.topImg){
			var img=new Image();
			img.src = c.topImg;
			img.onload =function(){
				cans.drawImage(img,0,0,c.width,c.height);
			}
		}else{
			cans.fillStyle= c.topBkg;
			cans.fillRect(0,0,c.width,c.height);
		}
		
		
		var flag = false;
		var winFlag  = false;
		var startFlag  = false;

		canvas.addEventListener("touchstart",function(e){
			if(!startFlag){
				startFlag = true;
				if(typeof c.startFun == 'function'){
					c.startFun('#'+IDbottomdiv,'#'+IDmiddlediv,'#'+IDtopcanvas);
				}
			}
			flag = true;
			if(winFlag){
				cans.clearRect(0,0,c.width,c.height);
				if(typeof c.compelteFun == 'function'){
				c.compelteFun('#'+IDbottomdiv,'#'+IDmiddlediv,'#'+IDtopcanvas);
			}
			}
		},false); 
		
		
		canvas.addEventListener("touchmove",function(e){
			e.preventDefault();
			if(flag && e.touches.length == 1){
				var X = e.touches[0].pageX - POS.left
				var Y = e.touches[0].pageY - POS.top;
				X = X * 1.22;
				Y = Y *1.1;
				//圆的中间正方形先除去.
				cans.clearRect(X - L, Y - L, L*2, L*2);
				for(var o = 0 ;o <= 45; o++){
					var lcos = (R * Math.cos(o/180*Math.PI)).toFixed(0);
					var lsin = (R * Math.sin(o/180*Math.PI)).toFixed(0);
					cans.clearRect(1*X - 1*lsin, 1*Y - 1*lcos, lsin * 2, 1);
					cans.clearRect(1*X - 1*lsin, 1*Y + 1*lcos, lsin * 2, 1);
					cans.clearRect(1*X - 1*lcos, 1*Y - 1*lsin, 1, lsin * 2);
					cans.clearRect(1*X + 1*lcos, 1*Y - 1*lsin, 1, lsin * 2);
				}
				
				var sum = 0;
				for(var i = 0; i < MPS.length; i++){
					if(MPS[i].f == 0 && X - L <= MPS[i].x && 1*X + 1*L >= MPS[i].x && Y - L <= MPS[i].y && 1*Y + 1*L >= MPS[i].y){
						 MPS[i].f = 1;
					}
					sum += MPS[i].f;
				}
				if(sum == MPS.length){
					winFlag = true;
				}
			}
			
		},false); 
		canvas.addEventListener("touchend",function(e){
			flag = false;
		},false);
	};
})(jQuery);