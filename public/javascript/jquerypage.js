$(document).ready(() => {
    $('#fp').click(() => {
        $('#first_div').show();
        $('#second_div').hide();
    });

    $('#sp').click(() => {
        $('#first_div').hide();
        $('#second_div').show();
    });

    $('#second_div').hide();
});