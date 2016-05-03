function Word_Writer(selector)
{
	var gb_status = 1;		// 当前光标的状态，1 为显示，否则是隐藏
	var gb_color;
	this.gbColor = "blue";		// 光标显示的颜色
	var ScreenWordLeft = "";		// 光标左侧的内容
	var ScreenWordRight = "";		// 光标右侧的内容
	var gb_selector, gb_height;		// 光标元素的选择器和光标的高度
	var code_left, code_gb_left, code_gb_right, code_right;		// 左侧代码，光标代码，右侧代码
	// 默认要输出的内容
	var words;
	this.words = new Array(
		"Word Writer",
		"是一个打字特效插件",
		"我希望他比你想象的更加强大",
		"作者：帅气的稻米鼠~"
	);
	// 定义预处理函数
	var ToShow = new Array();
	function htmlEncode(str){		// 将标点转换为实体字符
        var i,s={
            "&amp;": /&/g,
            "&quot;": /"/g,
            "&apos;": /'/g,
            "&lt;": /</g,
            "&gt;": />/g,
            "<br>": /\n/g,
            "&nbsp;": / /g,
            "&nbsp;&nbsp;&nbsp;&nbsp;": /\t/g
        };
        for(i in s){
            str=str.replace(s[i],i);
        }
        return str;
    }
	function WordA(Line){		// 动作命令处理
		for(var i = 0; i < Line.length; i++){
			switch(Line.substr(i,1
				)){
				case "<":		// 光标向左
					if(ScreenWordLeft.length >= 1){
						ScreenWordRight = ScreenWordLeft.substr(ScreenWordLeft.length-1,1)+ScreenWordRight;
						ScreenWordLeft = ScreenWordLeft.substring(0,ScreenWordLeft.length-1);
					}
					ToShow[ToShow.length] = new Array(3,ScreenWordLeft,ScreenWordRight);
					break;
				case ">":		// 光标向右
					if(ScreenWordRight.length >= 1){
						ScreenWordLeft = ScreenWordLeft+ScreenWordRight.substr(0,1);
						ScreenWordRight = ScreenWordRight.substring(1,ScreenWordLeft.length);
					}
					ToShow[ToShow.length] = new Array(3,ScreenWordLeft,ScreenWordRight);
					break;
				case "-":		// 删除前一个字符
					if(ScreenWordLeft.length >= 1){
						ScreenWordLeft = ScreenWordLeft.substring(0,ScreenWordLeft.length-1);
					}
					ToShow[ToShow.length] = new Array(2,ScreenWordLeft,ScreenWordRight);
					break;
				case "=":		// 等待一定的时间
					// statements_1
					ToShow[ToShow.length] = new Array(3,ScreenWordLeft,ScreenWordRight);
					break;
				case "|":		// 清空内容
					// statements_1
					while (ScreenWordRight.length >= 1) {
						ScreenWordLeft = ScreenWordLeft+ScreenWordRight.substr(0,1);
						ScreenWordRight = ScreenWordRight.substring(1,ScreenWordLeft.length);
						ToShow[ToShow.length] = new Array(3,ScreenWordLeft,ScreenWordRight);
					}
					ToShow[ToShow.length] = new Array(12,ScreenWordLeft,ScreenWordRight);
					while (ScreenWordLeft.length >= 1) {
						ScreenWordLeft = ScreenWordLeft.substring(0,ScreenWordLeft.length-1);
						ToShow[ToShow.length] = new Array(2,ScreenWordLeft,ScreenWordRight);
					}
					break;
				default:
					break;
			}
		}
	}
	function WordW(Line){		// 处理文字内容
		for(var i = 0; i < Line.length; i++){
			ScreenWordLeft = ScreenWordLeft+Line.substr(i,1);
			ToShow[ToShow.length] = new Array(3,ScreenWordLeft,ScreenWordRight);
		}
	}
	// 预处理函数
	function WordReady(){
		code_left = '<div class="writer-box">';		// 左侧代码
		code_gb_left = '<div class="gb" style="position: relative;display: inline-block;"><div class="gb-line" style="';
		code_gb_right = '"></div></div>';		// 光标代码
		code_right = '</div>';		// 右侧代码
		for (var i = 0; i < words.length; i++) {
			if(words[i] != null && words[i] != "" && words[i] != undefined){
				var ThisLine = words[i];
				if(ThisLine.substr(0,1) == "<" || ThisLine.substr(0,1) == ">"  || ThisLine.substr(0,1) == "-" || ThisLine.substr(0,1) == "=" || ThisLine.substr(0,1) == "|"){
					WordA(ThisLine);
				}else{
					if(ThisLine.substr(0,1) == "\\"){
						ThisLine = ThisLine.substring(1,ThisLine.length);
					}
					WordW(ThisLine);
				}
			}
		}
		for(var i = 0; i < ToShow.length; i++){
			ToShow[i][1] = htmlEncode(ToShow[i][1]);
			ToShow[i][2] = htmlEncode(ToShow[i][2]);
		}
	}
	// 输出函数
	var index = 0;
	var output_time = 1;
	function op(){
		index++;
		var gb_style = gb_selector.attr('style');
		selector.html(code_left+ScreenWordLeft+code_gb_left+gb_style+code_gb_right+ScreenWordRight+code_right);
	}
	function OutPut(){
		if(index == ToShow.length){
			index = 0;
		}
		if(output_time == ToShow[index][0]){
			output_time = 1;
			ScreenWordLeft = ToShow[index][1];
			ScreenWordRight = ToShow[index][2];
			op();
		}else{
			output_time++;
		}
	}

	// 光标函数
	var gb_time = 1;
	function gb(){
		if(gb_time == 3){
			if(gb_status != 1){
				gb_selector.css({
					'border': '2px solid ' + gb_color
				});
				gb_status = 1;
			}else{
				gb_selector.css({
					'border': '2px solid rgba(0,0,0,0)'
				});
				gb_status = 0;
			}
			gb_time = 1;
		}else{
			gb_time++;
		}
		OutPut();
		t=setTimeout(gb,100);
	}

	// 主函数
	this.WriteNow = WriteNow;
	function WriteNow(){
		words = this.words;
		gb_color = this.gbColor;
		WordReady();
		selector.html(code_left+code_gb_left+'position: absolute;left: -1px;'+code_gb_right+code_right);
		gb_selector = selector.find(".gb-line");
		gb_height = selector.find(".writer-box").css("font-size");
		gb_selector.css({
			'border': '2px solid ' + gb_color,
			'height': gb_height,
			'top': '-'+gb_height
		});
		gb();
	}
}