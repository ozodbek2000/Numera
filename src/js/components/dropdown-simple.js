import $ from "jquery";

const dropdownSimple = () => {
    $(".dropdown-simple > a").click(function(e) {
        e.preventDefault();
        $(this).siblings(".dropdown-simple_list").toggleClass("active");
    });

    $(".dropdown-simple_list li a").click(function(e) {
        e.preventDefault();
        const value = $(this).text();
        $(this).closest(".dropdown-simple").find("> a span").text(value);
        $(".dropdown-simple_list").removeClass("active");
    });

    $(document).click(function(e) {
        if (!$(e.target).closest('.dropdown-simple').length) {
            $(".dropdown-simple_list").removeClass("active");
        }
    });
    console.log('shit')
};

export { dropdownSimple };
