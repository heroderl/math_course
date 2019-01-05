(function($) {
    $.fn.upload = function(callback) {
        var _this = $(this),
        $add = $('<li class="item add" ></li>'),
        $input = $('<input type="file" name="file">'),
        config = {
            type : _this.attr('data-type') ? _this.attr('data-type') : 'png,jpg,jpeg,gif',  // 允许上传文件的扩展名，多个扩展名用逗号分割
            size : _this.attr('data-size') ? parseInt(_this.attr('data-size')) : 10240,  // 文件上传单个文件最大容量，图片不传不受该属性限制
            name : _this.attr('data-name') ? _this.attr('data-name') : 'upload',  // 表單發送
            bgimg : _this.attr('data-bgimg') ? _this.attr('data-bgimg') : 'upload'  // 背景圖片
        };

        // 設置input的accept值
        var fileType = '';
        var typearr = config.type.replace(/(^\s+)|(\s+$)/g, '').split(',');
        for(var i in typearr) {
            fileType += '.' + typearr[i] + ',';
        }

        _this.css('background-image', 'url('+ config.bgimg +')').append($add.attr("data-type",config.type))
            .append($input.attr('name', config.name).attr('accept', fileType))
            .on('click', 'li.add', function(){
                // 添加文件
                // 打開<input type="file">文件選擇
                $input.click();
            })
            .on('change', 'input[type="file"]', function(e) {
                var files = e.target.files[0];
                var temp = null;
                if(typeof files == 'object')
                {
                    temp = files;
                }

                // 自定義對文件的判斷
                callback = (typeof callback === 'function') ? callback : function() {};
                if(!callback(files)) {
                    _this.children('input[type="file"]').val('');

                    return;
                }

                console.log(123);

                // 顯示文件内容
                showImg(temp);
            }).on('click', 'li.delete', function(e) {
                // 刪除文件
                _this.attr('data-filename', '').removeClass('inempty').addClass('empty').children('li.item').css({
                    'background-image': '',
                    'background-color': '',
                    'border': ''
                }).removeClass('delete').addClass('add');

                // 清空input[type="file"]的文件
                _this.children('input[type="file"]').val('');
            });
        
        
        function showImg(file) {
            var fileType = {
                image: ['jpg', 'jpeg', 'png', 'bmp']
            };

            if(!Boolean(file)) return;

            // 判斷文件類型是否符合
            var length = file.name.split('.').length;
            if(jQuery.inArray(file.name.split('.')[length - 1], typearr) == -1) {
                _this.children('input[type="file"]').val('');
                return;
            }

            // 判斷文件大小
            if((file.size/1024) >= config.size) {
                _this.children('input[type="file"]').val('');
                alert('文件大小超過' + (config.size / 1024) + 'MB，無法上傳');
                return;
            }
            
            // 判斷文件類型，如果是圖片格式，則顯示圖片；如果是其他，則不顯示
            if($.inArray(file.type.split('/')[1], fileType['image']) !== -1) {  // 是圖片格式
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function() {
                    _this.attr('data-filename', file.name).removeClass('empty').addClass('inempty').children('li.item').css({
                        'background-image': 'url(' + reader.result +')',
                        'background-color': 'lightgray',
                        'border': '1px solid #333',
                    }).removeClass('add').addClass('delete');
                };
            } else {  // 不是圖片格式
                _this.attr('data-filename', file.name).removeClass('empty').addClass('inempty').children('li.item').css({
                    'background-color': 'lightgray',
                    'border': '1px solid #333',
                }).removeClass('add').addClass('delete');
            }

        }


    }
})(jQuery);