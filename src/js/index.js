import $ from "jquery";
import Swiper from "swiper";
import { dropdown } from "./components/dropdown";
import { dropdownSimple } from "./components/dropdown-simple";

$(document).ready(function () {
    $(".header__theme").click(function (event) {
        $("body").toggleClass("light");
    });
    $(document).on("keydown", function(event) {
        if (event.key === "t" || event.key === "T") {
            $("body").toggleClass("light");
        }
    });
    
    $(".header__arrow").click(function (event) {
        $(".header__nav").toggleClass("active");
    });
    $(".calc__content_months > span").click(function (event) {
        $(".calc__content_months > span").removeClass("active");
        $(this).addClass("active");
    });
    $(".calc__tarifs > .calc__tarifs_item").click(function (event) {
        $(".calc__tarifs > .calc__tarifs_item").removeClass("active");
        $(this).addClass("active");
    });
    $(".faq-item").click(function (event) {
        $(this).toggleClass("active");
    });
    dropdown();
    dropdownSimple();
    if ($(window).width() < 1080) {
        const swiper = new Swiper(".cta__top_container, .cta__bottom_container", {
            slidesPerView: 1,
            spaceBetween: 10,
        });
    }

    if ($(window).width() < 1080) {
        new Swiper(".story__swiper", {
            spaceBetween: 10,
            breakpoints: {
                0: {
                    slidesPerView: 1
                },
                768: {
                    slidesPerView: 2
                }
            }
        });
    }
});

console.log("Gulp Webpack сборка работает!");