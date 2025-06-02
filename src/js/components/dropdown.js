import $ from "jquery";

const dropdown = () => {
    $(".dropdown__title").click(function (event) {
        event.stopPropagation();
        const dropdown = $(this).closest(".dropdown");
        dropdown.find(".dropdown_list").toggleClass("active");
    });

    $(".dropdown__item").click(function (event) {
        const dropdown = $(this).closest(".dropdown");
        const selectedText = $(this).text();
        dropdown.find(".dropdown__title span").text(selectedText);
        dropdown.find(".dropdown_list").removeClass("active");
    });

    $(document).click(function () {
        $(".dropdown_list").removeClass("active");
    });
};

export { dropdown };
