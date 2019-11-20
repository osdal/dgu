$(function(){
    $(window).scroll(function() {
        if($(this).scrollTop() >= 300) {
    $('.main_menu').addClass(' sticky-menu ');
    }
    else{
    $('.main_menu').removeClass(' sticky-menu ');
        }
    });

    $(".main_menu").on("click","a", function (event) {
                //отменяем стандартную обработку нажатия по ссылке
                event.preventDefault();
      
                //забираем идентификатор бока с атрибута href
                var id  = $(this).attr('href'),
       
                //узнаем высоту от начала страницы до блока на который ссылается якорь
                    top = $(id).offset().top;
                //анимируем переход на расстояние - top за 1500 мс
                $('body,html').animate({scrollTop: top}, 1000);
       
            });

  
    $('#replyTop').validate({
        rules: {
            telephone: {
                required: true,
                number: true,
                minlength: 7
            }
        },
        messages: {
            telephone: {
                required: 'Обязательное поле',
                number: 'Введите номер телефона в формате "0501234567"',
                minlength: 'Введите номер телефона в формате "0501234567"'
            }
        }
    });

    $('#bottomForm').validate({
        rules: {
            phoneNumber: {
                required: true,
                number: true,
                minlength: 7
            }
        },
        messages: {
            phoneNumber: {
                required: 'Обязательное поле',
                number: 'Введите номер телефона в формате "0501234567"',
                minlength: 'Введите номер телефона в формате "0501234567"'
            }
        }
    });


    let recallBottomWidth =  $('.recall_bottom').width();
    let bottomInput = $('#bottom_input').width();
    $('#phoneNumber-error').css('left', recallBottomWidth-bottomInput);

    console.log(recallBottomWidth);
        
});