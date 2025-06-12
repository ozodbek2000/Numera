import $ from "jquery";
import Swiper from "swiper";
import { dropdown } from "./components/dropdown";
import { dropdownSimple } from "./components/dropdown-simple";

$(document).ready(function () {
    $(".header__theme").click(function (event) {
        $("body").toggleClass("light");
    });
    $(document).on("keydown", function (event) {
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
        const swiper = new Swiper(
            ".cta__top_container, .cta__bottom_container",
            {
                slidesPerView: 1,
                spaceBetween: 10,
            }
        );
    }

    if ($(window).width() < 1080) {
        new Swiper(".story__swiper", {
            spaceBetween: 10,
            breakpoints: {
                0: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
            },
        });
    }

    // FORM
    const botToken = "8025593472:AAGfwJG1NL5nwWmB2L1DJK7pu4Z5xUaKa7E";
    const chatId = "-1002710037990";
    let alreadySent = false;

    // Формат номера телефона
    $("#userPhone").on("input", function () {
        let input = $(this).val().replace(/\D/g, "");
        if (input.startsWith("998")) input = input.slice(3);

        let formatted = "+998";
        if (input.length > 0) formatted += " " + input.substring(0, 2);
        if (input.length > 2) formatted += " " + input.substring(2, 5);
        if (input.length > 5) formatted += " " + input.substring(5, 7);
        if (input.length > 7) formatted += " " + input.substring(7, 9);

        $(this).val(formatted);
    });

    // Проверка номера Узбекистана
    function isValidUzbekPhone(phone) {
        const cleaned = phone.replace(/\s/g, "");
        return /^\+998\d{9}$/.test(cleaned);
    }

    // Проверка email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function sendToBot(actionType) {
        if (alreadySent) return;

        const name = $("#userName").val().trim();
        const email = $("#userEmail").val().trim();
        const phone = $("#userPhone").val().trim();
        const autoRenew = $("#autoRenew").is(":checked") ? "Да" : "Нет";

        // Валидация телефона
        if (!isValidUzbekPhone(phone)) {
            alert(
                "❗ Пожалуйста, введите корректный номер телефона в формате +998 XX XXX XX XX"
            );
            return;
        }

        // Валидация email
        if (!isValidEmail(email)) {
            alert(
                "❗ Пожалуйста, введите корректный Email (пример: example@mail.com)"
            );
            return;
        }

        const message = `
💬 Новая заявка (${actionType}):

👤 Имя: ${name}
📧 Email: ${email}
📱 Телефон: ${phone}
🔁 Автопродление: ${autoRenew}
        `;

        $.ajax({
            url: `https://api.telegram.org/bot${botToken}/sendMessage`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "HTML",
            }),
            success: function () {
                alert("✅ Данные успешно отправлены!");

                // Очистка
                $("#userName").val("");
                $("#userEmail").val("");
                $("#userPhone").val("+998");
                $("#autoRenew").prop("checked", false);

                alreadySent = true;
                setTimeout(() => {
                    alreadySent = false;
                }, 3000);
            },
            error: function () {
                alert("⚠️ Ошибка при отправке. Попробуйте позже.");
            },
        });
    }

    $(document).ready(function () {
        $("#payNow").on("click", function (e) {
            e.preventDefault();
            sendToBot("Оплата");
        });

        $("#needHelp").on("click", function (e) {
            e.preventDefault();
            sendToBot("Консультация");
        });
    });
});

console.log("Gulp Webpack сборка работает!");
