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

    //COPYING FORM INPUTS

    $(".calc__inputs_clear a:last-child").on("click", function (e) {
        e.preventDefault();

        // Get dropdown values (selected text from dropdown links) and trim whitespace
        var formOwnership =
            $(
                ".calc__inputs_box:first .calc__inputs_box-input:first-child .dropdown-simple > a"
            )
                .text()
                .trim() || "Не выбрано";
        var organizationForm =
            $(
                ".calc__inputs_box:first .calc__inputs_box-input:last-child .dropdown-simple > a"
            )
                .text()
                .trim() || "Не выбрано";
        var activityType =
            $(".calc__inputs_form .dropdown-simple > a").text().trim() ||
            "Не выбрано";

        // Get input values
        var employeeCount =
            $(
                '.calc__inputs_box--2 .calc__inputs_box-item:first-child input[type="number"]'
            ).val() || "0";
        var monthlyTurnover =
            $(
                '.calc__inputs_box--2 .calc__inputs_box-item:last-child input[type="number"]'
            ).val() || "0";

        // Format the text to copy
        var textToCopy = `1: Форма собственности: ${formOwnership}
2: Организационная форма: ${organizationForm}
3: Основной вид деятельности: ${activityType}
4: Кол-во сотрудников: ${employeeCount}
5: Оборот в месяц: ${monthlyTurnover} UZS`;

        // Copy to clipboard
        if (navigator.clipboard && window.isSecureContext) {
            // Use modern clipboard API
            navigator.clipboard
                .writeText(textToCopy)
                .then(function () {
                    showCopySuccess();
                })
                .catch(function (err) {
                    console.error("Failed to copy: ", err);
                    fallbackCopyTextToClipboard(textToCopy);
                });
        } else {
            // Fallback for older browsers
            fallbackCopyTextToClipboard(textToCopy);
        }
    });

    // Fallback copy method for older browsers
    function fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand("copy");
            if (successful) {
                showCopySuccess();
            } else {
                showCopyError();
            }
        } catch (err) {
            console.error("Fallback: Oops, unable to copy", err);
            showCopyError();
        }

        document.body.removeChild(textArea);
    }

    // Show success message
    function showCopySuccess() {
        // Change button text temporarily
        var $button = $(".calc__inputs_clear a:last-child span");
        var originalText = $button.text();
        $button.text("Скопировано!");
        $button.parent().addClass("copied");

        setTimeout(function () {
            $button.text(originalText);
            $button.parent().removeClass("copied");
        }, 2000);
    }

    // Show error message
    function showCopyError() {
        var $button = $(".calc__inputs_clear a:last-child span");
        var originalText = $button.text();
        $button.text("Ошибка копирования");
        $button.parent().addClass("copy-error");

        setTimeout(function () {
            $button.text(originalText);
            $button.parent().removeClass("copy-error");
        }, 2000);
    }

    //CLEARING FORM INPUTS

    // Handle clear button click
    $(".calc__inputs_clear a:first-child").on("click", function (e) {
        e.preventDefault(); // Prevent default link behavior

        // Clear all number inputs and set them to 0
        $('.calc__inputs_production input[type="number"]').val("0");

        // Clear textarea
        $(".calc__inputs_textarea textarea").val("");

        // Reset all dropdowns to default "ИП"
        $(".dropdown-simple span").text("ИП");

        // Optional: Close any open dropdown menus
        $(".dropdown-simple_list").hide();

        // Optional: Add visual feedback (you can customize this)
        $(this).addClass("clearing");
        setTimeout(() => {
            $(this).removeClass("clearing");
        }, 200);
    });

    // Optional: Handle dropdown functionality if not already implemented
    $(".dropdown-simple > a").on("click", function (e) {
        e.preventDefault();
        $(this).siblings(".dropdown-simple_list").toggle();
    });

    // Optional: Handle dropdown item selection
    $(".dropdown-simple_list li a").on("click", function (e) {
        e.preventDefault();
        const selectedText = $(this).text();
        $(this).closest(".dropdown-simple").find("span").text(selectedText);
        $(this).closest(".dropdown-simple_list").hide();
    });

    // Optional: Close dropdowns when clicking outside
    $(document).on("click", function (e) {
        if (!$(e.target).closest(".dropdown-simple").length) {
            $(".dropdown-simple_list").hide();
        }
    });

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

        // Новый код: получаем выбранный срок
        const selectedPeriod = $(".calc__content_months span.active")
            .text()
            .trim();

        if (!isValidUzbekPhone(phone)) {
            alert(
                "❗ Пожалуйста, введите корректный номер телефона в формате +998 XX XXX XX XX"
            );
            return;
        }

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
    📆 Период оплаты: ${selectedPeriod}
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

    // Свяжитесь с нами
    function formatPhone(input) {
        let cleaned = input.replace(/\D/g, "").slice(0, 12);
        let formatted = "+998 ";
        if (cleaned.length > 3) formatted += cleaned.slice(3, 5) + " ";
        if (cleaned.length > 5) formatted += cleaned.slice(5, 8) + " ";
        if (cleaned.length > 8) formatted += cleaned.slice(8, 10) + " ";
        if (cleaned.length > 10) formatted += cleaned.slice(10, 12);
        return formatted.trim();
    }

    // Валидации
    function isValidEmail(email) {
        return /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(email);
    }
    function isValidUzbekPhone(phone) {
        return /^\+998 \d{2} \d{3} \d{2} \d{2}$/.test(phone);
    }
    function showError(input, message) {
        alert(message);
        input.focus();
    }

    // Отправка в Telegram
    function sendToTelegram(data, form) {
        const message = `
📨 Новое сообщение с формы "Свяжитесь с нами":

👤 Имя: ${data.name}
👥 Фамилия: ${data.surname}
📱 Телефон: ${data.phone}
📧 Email: ${data.email}
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
                alert("Сообщение успешно отправлено!");
                form.find("input").val(""); // очистка формы
                $("#contactPhone").val("+998 ");
            },
            error: function () {
                alert("Произошла ошибка при отправке.");
            },
        });
    }

    $(document).ready(function () {
        // Автоформат номера
        $("#contactPhone").on("input", function () {
            this.value = formatPhone(this.value);
        });

        // Обработка клика
        $("#contactSend").on("click", function (e) {
            e.preventDefault();

            const $form = $(this).closest(".support__columns_inputs");
            const name = $("#contactName").val().trim();
            const surname = $("#contactSurname").val().trim();
            const phone = $("#contactPhone").val().trim();
            const email = $("#contactEmail").val().trim();

            if (!name) return showError($("#contactName"), "Введите имя");
            if (!surname)
                return showError($("#contactSurname"), "Введите фамилию");
            if (!isValidUzbekPhone(phone))
                return showError($("#contactPhone"), "Неверный номер телефона");
            if (!isValidEmail(email))
                return showError($("#contactEmail"), "Неверный email");

            sendToTelegram({ name, surname, phone, email }, $form);
        });
    });
});

console.log("Gulp Webpack сборка работает!");
