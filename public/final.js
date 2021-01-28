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

$('#myNav .navbar-nav a').on('click', function () {
    $('#myNav .navbar-nav').find('div.active').removeClass('active');
    $(this).parent('div').addClass('active');
});