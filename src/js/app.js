var $ = require("jquery");
import {slick} from 'slick-carousel';

$(document).ready(function() {
	var itemBox = document.querySelectorAll('.catalog__item'),
		cartContainer = document.getElementById('cart');

	function addEvent(elem, type, handler){
	// if(elem.addEventListener){
		elem.addEventListener(type, handler, false);
		// } else {
		// elem.attachEvent('on'+type, function(){ handler.call( elem ); });
		// }
		return false;
	}

	function getCartData() {
		return JSON.parse(localStorage.getItem('cart'));
	}
	function setCartData(obj) {
		localStorage.setItem('cart', JSON.stringify(obj));
		return false;
	}
	function addToCart(e) {
		this.disabled = true;
		var cartData = getCartData() || {},
			parentBox = this.parentNode,
			itemId = this.getAttribute('data-id'),
			itemTitle = parentBox.querySelector('.catalog__item__description').innerHTML,
			itemPrice = parentBox.querySelector('.catalog__item__price').getAttribute('data-price'),
			itemImg = parentBox.querySelector('.catalog__item__img').innerHTML,
			totalPrice = 0,
			totalCount = 0;
		if(cartData.hasOwnProperty(itemId)) {
			cartData[itemId][2] += 1;
		} else {
			cartData[itemId] = [itemImg, itemTitle, 1, itemPrice];
		}
		for(var items in cartData) {
			totalPrice += Number(cartData[items][3]) * Number(cartData[items][2]);
			totalCount += Number(cartData[items][2]);
		}
		$('.cartCounter').html(totalCount);
		$('.cartSumma').html(totalPrice);
		if(!setCartData(cartData)) {
			setTimeout(function(){
				this.disabled = false;
			},1200);
		}
		
		return false;
	}
	for(var i = 0; i < itemBox.length; i++) {
		addEvent(itemBox[i].querySelector('.catalog__item__cart'), 'click', addToCart);
	}

	$('.catalog__item__cart').on('click', function() {
		var id = $(this).attr('data-id');
		$('.product_'+id).clone().css({
				'position':'absolute',
				'z-index':'9999',
				'left':$(this).offset()['left']-90,
				'top':$(this).offset()['top']-232,
				'width': $(this).width(),
				'height': $(this).height(),
			}).appendTo('body').animate({
								opacity: 0.08,
	                            left: $("#cartContainer").offset()['left'],
	                            top: $("#cartContainer").offset()['top'],
	                            position: 'absolute',
	                        }, 1000, function() {
	                   $(this).remove();
			});
	});

	function openCart(e) {
		var cartData = getCartData(),
			totalItems = '',
			totalPrice = 0;
		if(cartData !== null) {
			totalItems = '<div class="popup__content__list">'+
							'<table class="popup__content__list__table">'+
								'<tr class="popup__content__list__table-head"><td>Товар</td><td>Название</td><td>Кол-во</td><td>Цена</td></tr>';
			for(var items in cartData) {
				totalPrice += Number(cartData[items][3]) * Number(cartData[items][2]);
				totalItems += '<tr>';
				for(var i = 0; i < cartData[items].length; i++) {
					totalItems += '<td>' + cartData[items][i] + '</td>';
				}
				totalItems += '</tr>';
			}
			totalItems += '</table>'+
							'<div class="popup__content__list__description">Ваши товары хранятся в корзине более 30 дней. Вы можете продолжить покупки в любое удобное для вас время.</div>'+
							'<button onclick="localStorage.removeItem(\'cart\'); location.reload();" class="popup__content__list__clearCart">Очистить корзину</button>'+
						'</div>'+
						'<div class="popup__content__price">'+
							'<table>'+
								'<tr><td>Товары</td><td>'+totalPrice+'р.</td></tr>'+
								'<tr><td>Стоимость доставки</td><td>200р.</td></tr>'+
								'<tr class="result_sum"><td>Итого</td><td>'+(totalPrice+200)+'р.</td></tr>'+
							'</table>'+
							'<div id="submitOrder" class="submit_order">Оформить заказ</div>'+
						'</div>';
			$('.popup__content').html(totalItems);

			$('.submit_order').on('click', function() {
				$('.popup__content').hide();
				$('.popup__order').show();
				$('.popup__order__summa').html('<div class="popup__content__price">'+
							'<table>'+
								'<tr><td>Товары</td><td>'+totalPrice+'р.</td></tr>'+
								'<tr><td>Стоимость доставки</td><td>200р.</td></tr>'+
								'<tr class="result_sum"><td>Итого</td><td>'+(totalPrice+200)+'р.</td></tr>'+
							'</table>'+
							'<button id="compliteOrder" class="submit_order">Оформить заказ</button>'+
						'</div>');
				$('#compliteOrder').on('click', function() {
					var client = $("#clientInformation").serializeArray(), indexed_array = {};
					$.map(client, function(n, i){
						indexed_array[n['name']] = n['value'];
					});
					$.ajax({
						url: '/sendOrder.php',
						dataType: 'json',
						type: 'post',
						data: $.extend(indexed_array, cartData),
						success: function(response) {
							if(response.good) {
								$('.popup__order').html('<div class="swal2-icon swal2-success swal2-animate-success-icon" style="display: block;"><div class="swal2-success-circular-line-left" style="background: rgb(255, 255, 255);"></div><span class="swal2-success-line-tip swal2-animate-success-line-tip"></span> <span class="swal2-success-line-long swal2-animate-success-line-long"></span><div class="swal2-success-ring"></div> <div class="swal2-success-fix" style="background: rgb(255, 255, 255);"></div><div class="swal2-success-circular-line-right" style="background: rgb(255, 255, 255);"></div></div><p>Ваш заказ отправлен, ожидайте скоро с Вами свяжется менеджер.</p>');
								localStorage.removeItem('cart');
							} else {
								$('.popup__order').html('<div class="swal2-icon swal2-error"><span class="swal2-x-mark"><span class="swal2-x-mark-line-left"></span><span class="swal2-x-mark-line-right"></span></span></div><p>Ваш заказ не получилось отправить, позвоните нам 8 (909) 700-21-38 и мы решим это!</p>');
							}
						}
					})
				});
			});
			
			// cartContainer.innerHTML = totalItems;
		} else {
			$('.popup__content').html("В корзине пусто!");
		}
		return false;
	}

	addEvent(document.getElementById('checkout'), 'click', openCart);

	var cartData = getCartData() || {}, totalCount = 0, totalPrice = 0;
	for(var items in cartData) {
		totalPrice += Number(cartData[items][3]) * Number(cartData[items][2]);
		totalCount += Number(cartData[items][2]);
	}
	$('.cartCounter').html(totalCount);
	$('.cartSumma').html(totalPrice);
	$('.reviews__slide').slick({
		infinite: true,
		speed: 900,
		slidesToShow: 1,
		adaptiveHeight: true,
		autoplay: true
	});
	$('#orderCall').on('click', function(){
		$('.popup h2').html("Заказать звонок");
		$('.popup__content').html("<div class='orderCall'>"+
										"<p>Оставьте свой телефон и мы вам обязательно перезвоним</p>"+
										"<input type='text' name='phone' id='phoneOrder' placeholder='Ваш телефон'>"+
										"<button class='sendOrderCall'>Отправить</button>"+
									"</div>");

		$('.popup').css({
			'transform':'translate(0%, 0%)',
			'z-index':'9999',
			'padding':'10px 20px'
		});
		
		$('body').addClass('overlay');
		
		$('.popup h1').animate({
			left:'0'
		},1000);
		
		$(this).css({
			'z-index':'-1'
		});
		
		$('.popup__controls__close').on('click',function(){
			$(this).parent().parent().css({
				'transform':'translateY(-300%)'
			});
			$('body').removeClass('overlay');
			
			$(this).parent().siblings('.btn').css({
				'z-index':'1'
			});
		});
		$('.sendOrderCall').on('click', function(){
			$.ajax({
				url: '/orderCall.php',
				dataType: 'json',
				type: 'post',
				data: $('#phoneOrder').val(),
				success: function(response) {
					if(response.good) {
						$('.popup__order').html('<div class="swal2-icon swal2-success swal2-animate-success-icon" style="display: block;"><div class="swal2-success-circular-line-left" style="background: rgb(255, 255, 255);"></div><span class="swal2-success-line-tip swal2-animate-success-line-tip"></span> <span class="swal2-success-line-long swal2-animate-success-line-long"></span><div class="swal2-success-ring"></div> <div class="swal2-success-fix" style="background: rgb(255, 255, 255);"></div><div class="swal2-success-circular-line-right" style="background: rgb(255, 255, 255);"></div></div><p>Отправленно, ожидайте скоро с Вами свяжется менеджер.</p>');
						localStorage.removeItem('cart');
					} else {
						$('.popup__order').html('<div class="swal2-icon swal2-error"><span class="swal2-x-mark"><span class="swal2-x-mark-line-left"></span><span class="swal2-x-mark-line-right"></span></span></div><p>Не получилось отправить, позвоните нам 8 (909) 700-21-38 и мы решим это!</p>');
					}
				}
			});
		});
	});
	$('#checkout').on('click', function(){
		$('.popup').css({
			'transform':'translate(0%, 0%)',
			'z-index':'9999',
			'padding':'10px 20px'
		});
		
		$('body').addClass('overlay');
		
		$('.popup h1').animate({
			left:'0'
		},1000);
		
		$(this).css({
			'z-index':'-1'
		});
		
		$('.popup__controls__close').on('click',function(){
			$(this).parent().parent().css({
				'transform':'translateY(-300%)'
			});

			$('body').removeClass('overlay');
			
			$(this).parent().siblings('.btn').css({
				'z-index':'1'
			});
		});
	});

	$("#menu").on("click","a", function (event) {
		//отменяем стандартную обработку нажатия по ссылке
		event.preventDefault();

		//забираем идентификатор бока с атрибута href
		var id  = $(this).attr('href'),

		//узнаем высоту от начала страницы до блока на который ссылается якорь
			top = $(id).offset().top;
		
		//анимируем переход на расстояние - top за 1500 мс
		$('body,html').animate({scrollTop: top}, 1500);
	});


});