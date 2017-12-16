// document is ready
$(function () {

    // changes the color inputs default value
    $('#colorPicker').val('#00ff9d');
    $('#backgroundPicker').val('#1b1014');
    let currentBackground;

    // creates a grid using sizes inputted by the user.
    function makeGrid() {
        const pixelCanvas = $('#pixel_canvas');
        const gridHeight = $('#input_height').val();
        const gridWidth = $('#input_width').val();
        // clears any existing pixel canvas
        pixelCanvas.empty();
        // creates the table grid
        for (let r = 0; r < gridHeight; r++) {
        let row = $('<tr class="canvasRow"></tr>').appendTo(pixelCanvas);
            for (let c = 0; c < gridWidth; c++) {
                $('<td class="canvasCol"></td>').appendTo(row);
            }
        }

        // sets the background color of the canvas
        $('.canvasCol').css('background-color', $('#backgroundPicker').val());
        currentBackground = $('#backgroundPicker').val();
    }

    function paintCanvas() {
        // assumes mouse isnt clicked
        let clicked = false;
        let shiftClicked = false;
        let currentColor = $('#colorPicker').val();

        // checks if mouse is clicked
        $('.canvasCol').mousedown(function (event) {
            // prevents the user from dragging the table
            event.preventDefault();
            clicked = true;

            const brushSize = $('#brush_Size').val();
            const $this = $(this);
            const cellIndex = $this.index();
            
            // object containing cell locations
            const currentCells = [
                // brush 1
                { cell : $this }, // origin point
                // brush 2
                { cell : $this.closest('td').next('td') }, // right
                { cell : $this.closest('tr').next().children().eq(cellIndex) }, // bottom
                { cell : $this.closest('tr').next().children().eq(cellIndex).closest('td').next('td') }, // bottom right
                // // brush 3
                { cell : $this.closest('td').prev('td') }, // left
                { cell : $this.closest('tr').next().children().eq(cellIndex).closest('td').prev('td') }, // bottom left
                { cell : $this.closest('tr').prev().children().eq(cellIndex) }, // top
                { cell : $this.closest('tr').prev().children().eq(cellIndex).closest('td').next('td') }, // top right
                { cell : $this.closest('tr').prev().children().eq(cellIndex).closest('td').prev('td') } // top left
            ];

            // checks if shift is held while clicking
            if (event.shiftKey) {
                clicked = false;
                shiftClicked = true;
            }

            // eyedropper tool
            if (event.ctrlKey || event.metaKey) {
                clicked = false;
                let hexColor = '';
                // retrieves rgb color value of cell background
                const rgbColor = $(this).css('background-color');
                hexify(rgbColor);

                // converts the retrieved rgb color value to a hexidecimal value
                function hexify(color) {
                    const parts = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                    delete(parts[0]);
                    for (let i = 1; i <= 3; ++i) {
                        parts[i] = parseInt(parts[i]).toString(16);
                        if (parts[i].length == 1) parts[i] = '0' + parts[i];
                    }
                    hexColor = '#' + parts.join('');
                    return hexColor;
                }
                // sets color input value to returned hexidecimal color value
                $('#colorPicker').val(hexColor);
            }

            // paints on click, scales according to selected brush size
            if (clicked) {
                for (let i = 0; i < Math.pow(brushSize, 2); i++) {
                  currentColor = $('#colorPicker').val();
                  currentCells[i].cell.css('background-color', currentColor);
                }
            // if shift is held, will erase instead, also scales with brush size
            } else if (shiftClicked) {
                for (let i = 0; i < Math.pow(brushSize, 2); i++) {
                    currentCells[i].cell.css('background-color', currentBackground);
                }
            }
            
        }).mouseup(function () {
            clicked = false;
            shiftClicked = false;

        }).mousemove(function () {
            const brushSize = $('#brush_Size').val();
            const $this = $(this);
            const cellIndex = $this.index();
            
            // object containing cell locations
            const currentCells = [
                // brush 1
                { cell : $this }, // origin point
                // brush 2
                { cell : $this.closest('td').next('td') }, // right
                { cell : $this.closest('tr').next().children().eq(cellIndex) }, // bottom
                { cell : $this.closest('tr').next().children().eq(cellIndex).closest('td').next('td') }, // bottom right
                // // brush 3
                { cell : $this.closest('td').prev('td') }, // left
                { cell : $this.closest('tr').next().children().eq(cellIndex).closest('td').prev('td') }, // bottom left
                { cell : $this.closest('tr').prev().children().eq(cellIndex) }, // top
                { cell : $this.closest('tr').prev().children().eq(cellIndex).closest('td').next('td') }, // top right
                { cell : $this.closest('tr').prev().children().eq(cellIndex).closest('td').prev('td') } // top left
            ];

            // prevents painting if mouse is released off canvas
            $('body').mouseup(function (){
                clicked = false;
            })

            // paints on click, scales according to selected brush size
            if (clicked) {
                for (let i = 0; i < Math.pow(brushSize, 2); i++) {
                  currentColor = $('#colorPicker').val();
                  currentCells[i].cell.css('background-color', currentColor);
                }
            // if shift is held, will erase instead. also scales with brush size
            } else if (shiftClicked) {
                for (let i = 0; i < Math.pow(brushSize, 2); i++) {
                    currentCells[i].cell.css('background-color', currentBackground);
                }
            }
        });
    }
    
    // resets the canvas
    $('#reset').click(function () {
        $('.canvasCol').css('background-color', currentBackground);
    });

    // toggles grid
    $('#toggleGrid').click(function () {
        $('tr, td').toggleClass('toggleGrid');
    });

    // calls the makeGrid function on form submission
    // prevents the page from refreshing when submitted
    $('#submitGrid').click(function (event) {
        event.preventDefault();
        makeGrid();
        paintCanvas();
    });

});