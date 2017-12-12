import $ from "jquery";
import {slick} from 'slick-carousel';

$('.reviews__slide').slick({
  infinite: true,
  speed: 900,
  slidesToShow: 1,
  adaptiveHeight: true,
  autoplay: true
});