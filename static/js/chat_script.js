(function () {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };
    $(function () {
        var getMessageText, sendMessage,sendRequest,getCookie,setCookie;
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text,message_side) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();

            $('[data-toggle="popover"]').popover({
                placement : 'right'
            });
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        setCookie = function (name, value, options) {
          options = options || {};

          var expires = options.expires;

          if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
          }
          if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
          }

          value = encodeURIComponent(value);

          var updatedCookie = name + "=" + value;

          for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
              updatedCookie += "=" + propValue;
            }
          }

          document.cookie = updatedCookie;
        }
        
        
        getCookie = function (name) {
          var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
          ));
          return matches ? decodeURIComponent(matches[1]) : undefined;
        };
        sendRequest = function (text) {
		$('html, body').animate({
		    scrollTop: $("#sendBtn").offset().top
		  }, 2000);

            var sessionId = getCookie("session_id");
            var lat = getCookie("latitude");
            var lng = getCookie("longitude");

            // TODO: outsource $.get address string to config file
            $.get("http://webengineering.ins.hs-anhalt.de:41266/get_answer", {session_id: sessionId, user_text: text, latitude: lat, longitude: lng}).done(function(data) {
                resp = JSON.parse(data);
                if (!sessionId) {
	                delay = new Date(new Date().getTime() + 15*60*1000);
                    setCookie('session_id', resp['session_id'], {expires: delay});
                }
                sendMessage(resp['system_text'],'left');
            });
        };

        $('.send_message').click(function (e) {
            var rawText = getMessageText();
            sendMessage(rawText,'right');
            sendRequest(rawText);
        });


        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                var rawText = getMessageText();
                sendMessage(rawText,'right');
                sendRequest(rawText);
            }
        });

        sendMessage('Hello! Do you have any questions?','left');

    });
}.call(this));
