
var vid_ratio = 16.0/9.0;
var vid = $('#vidibigi');

$(window).on('load resize', function(e) {
    var height = $(window).height();
    var window_width = $(window).width();
    var width = vid_ratio * height;
    var x_offset = -(width - window_width) / 2
    vid.height(height).width(width).css({'margin-left': x_offset});
});


