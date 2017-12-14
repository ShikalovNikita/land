var $ = require("jquery");
import {slick} from 'slick-carousel';

$(document).ready(function() {
	var itemBox = document.querySelectorAll('.catalog__item'),
		cartContainer = document.getElementById('cart');

	function addEvent(elem, type, handler) {
		if (elem.addEventListener) {
			elem.addEventListener(type, handler, false);
		} else {
			elem.attachEvent('on'+type, function() { handler.call(elem); });
		}
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
			cartData[itemId][3] += 1;
		} else {
			cartData[itemId] = [itemImg, itemTitle, itemPrice, 1];
		}
		for(var items in cartData) {
			totalPrice += Number(cartData[items][2]) * Number(cartData[items][3]);
			totalCount += Number(cartData[items][3]);
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
			totalItems = '<div class="popup__content__table">Товар</div><table>';
			for(var items in cartData) {
				totalPrice += Number(cartData[items][1]) * Number(cartData[items][2]);
				totalItems += '<tr>';
				for(var i = 0; i < cartData[items].length; i++) {
					totalItems += '<td>' + cartData[items][i] + '</td>';
				}
				totalItems += '</tr>';
			}
			totalItems += '</table>'+
										'<div class="zakaz_summa">'+
											'<p><strong>Сумма заказа:</strong> '+totalPrice+'р.</p>'+
											'<p><span>Доставка:</span> 200р.</p>'+
											'<div class="itog_summa">'+
												'<strong>Итого:</strong> '+(totalPrice+200)+
											'</div>'+
										'</div>';
			$('.popup__content').html(totalItems);
			// cartContainer.innerHTML = totalItems;
		} else {
			cartContainer.innerHTML = "В корзине пусто!";
		}
		return false;
	}

	addEvent(document.getElementById('checkout'), 'click', openCart);
	var cartData = getCartData() || {}, totalCount = 0, totalPrice = 0;
	for(var items in cartData) {
		totalPrice += Number(cartData[items][2]) * Number(cartData[items][3]);
		totalCount += Number(cartData[items][3]);
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
});