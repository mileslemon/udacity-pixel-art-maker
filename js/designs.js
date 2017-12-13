// document is ready
// put all code in here
$(function(){

    // creates a grid using sizes inputted by the user.
    function makeGrid() {
        var sizePicker = $('#sizePicker');
        var pixelCanvas = $('#pixel_canvas');
        var gridHeight = $('#input_height').val();
        var gridWidth = $('#input_width').val();

        pixelCanvas.empty();

        for (var i = 0; i < gridHeight; i++) {
        var row = $('<tr class="canvasRow"></tr>').appendTo(pixelCanvas);
            for (var j = 0; j < gridWidth; j++) {
                $('<td class="canvasCol"></td>').appendTo(row);
            }
        }
    }

    function paintCanvas() {

        // paints table cell with selected color on click
        // changes cell color to background color on shift click
        $('.canvasCol').click( function(event) {
            var color = $('#colorPicker').val();
            $(this).css("background-color", color);
            if (event.ctrlKey) {
                $(this).css("background-color", "#fff");
            }
        });   

    }
    

    // calls the makeGrid function on form submission
    // prevents the page from refreshing when submitted
    $('#submitGrid').click( function( event ){
        event.preventDefault();
        makeGrid();
        paintCanvas();
    });


});

