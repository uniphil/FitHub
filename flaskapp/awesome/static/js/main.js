
var vid_ratio = 16.0/9.0;
var vid = $('#vidibigi');

$(window).on('load resize', function(e) {
    var height = $(window).height();
    var window_width = $(window).width();
    var width = vid_ratio * height;
    var x_offset = -(width - window_width) / 2
    vid.height(height).width(width).css({'margin-left': x_offset});
});


$(document).ready(function() {

    var form = $('#pitch')

    form.on('submit', function(e){
        e.stopPropagation();
        // lock the form
        $("#signupins").addClass('disabled');
        $("#pitch input, #pitch button").attr("disabled", "disabled");

        // get the person's shtuff
        var name = $('#name').val();
        var email = $("#email").val();
        var csrf_token = $("#csrf_token").val();

        // send the ajax request
        $.ajax({
            type: "POST",
            url: "/",
            data: {
                name: name,
                email: email,
                csrf_token: csrf_token
            }
        }).done(function( msg ) {
            // drop the form
            $("#signupins").slideUp().removeClass('disabled').text('You\'re first in line!').slideDown();


        }).error(function( msg ) {
            // release the form so they can fix.
            $("#signupins").removeClass('disabled')
            $("#pitch input, #pitch button").removeAttr("disabled");
        });

        // prevent the form fom submitting
        return false;
    });

});