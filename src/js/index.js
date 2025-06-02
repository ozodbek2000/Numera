import $ from "jquery";
import Swiper from "swiper";
import { dropdown } from "./components/dropdown";
import { dropdownSimple } from "./components/dropdown-simple";

$(document).ready(function () {
    $(".header__arrow").click(function (event) {
        $(".header__nav").toggleClass("active");
    });
    dropdown();
    dropdownSimple();
    if ($(window).width() < 1080) {
        const swiper = new Swiper(".cta__top_container, .cta__bottom_container", {
            slidesPerView: 1,
            spaceBetween: 10,
        });
    }
});

console.log("Gulp Webpack сборка работает!");
