$(window).scroll(function () {
    var scroll = $(window).scrollTop();
    // console.log(scroll);
    if (scroll > 70) {
        $("#myNav").addClass("berubah");
    }
    else {
        $("#myNav").removeClass("berubah");
    }
});