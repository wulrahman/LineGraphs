
/*  calculate the number of maximum points that can fit in the view given a data set,
    with respect to x offset and x zoom */
let max_items_in_view = (o) => {

    this.max_in_view = (o.setting.canvas.offsetWidth-o.setting.offset.price.x)/o.setting.zoom.x;
    // calcualte max number of items, given a canvas offset x and zoom scalar in the x plane
    if(o.data.length >= this.max_in_view) {
      // since lenght of data is greater than the maximum of item that can be displayed on screen
      this.in_view = this.max_in_view;
    }
    else {
      // set number of items in view to the number of items in the data.
      this.in_view = (o.data.length-o.setting.offset.price.x)/o.setting.zoom.x;
    }
    return this.in_view;
  }

    // graphing functons
let random_data = (function() {
    var close = 0;
    return function() {
        close += (Math.random() < 0.5 ? - Math.random() :  Math.random())*10;
        return close;
    };
    })();

/*
  Grid View

  this code breaks the grid into four plane, where the reference point is the asix object
*/
let draw_grid = (o) => {

    // create a 2d grid object
    this.grid = o.setting.canvas.getContext("2d");

    // set line width
    this.grid.lineWidth = o.setting.style.grid.linewidth;

    // begin grid path
    this.grid.beginPath();

    // draw horizontal grid y-plane bottom
    for (var y = o.setting.style.grid.linewidth/2; y < o.height; y += o.spacing.y) {

      // update current working coordinations and create new line object
      // extend top right grid view in horizontal view
      this.grid.moveTo(o.intersect.x, -y + o.intersect.y);
      this.grid.lineTo(o.intersect.x + o.width, -y + o.intersect.y);
      
      // extent top left grid view in horizontal view
      this.grid.moveTo(o.intersect.x, -y + o.intersect.y);
      this.grid.lineTo(-(o.intersect.x + o.width), -y + o.intersect.y);
      
      // extend bottom left grid view in horizontal view
      this.grid.moveTo(o.intersect.x, y + o.intersect.y);
      this.grid.lineTo(-(o.intersect.x + o.width), y + o.intersect.y);
      
      // extend bottom right grid view in horizontal view
      this.grid.moveTo(o.intersect.x, y + o.intersect.y);
      this.grid.lineTo(o.intersect.x + o.width, y + o.intersect.y);

    }
  
    // draw vertical grid on the x-plane bottom
    for (var x = o.setting.style.grid.linewidth/2; x < o.width; x += o.spacing.x) {

      // update current working coordinations and create new line object
      // extend top right grid view in vertical view
      this.grid.moveTo(x + o.intersect.x, o.intersect.y);
      this.grid.lineTo(x + o.intersect.x, -o.height + o.intersect.y);
      
      // extend top left grid view in vertical view
      this.grid.moveTo(-x + o.intersect.x, o.intersect.y);
      this.grid.lineTo(-x + o.intersect.x, -o.height + o.intersect.y);

      // extend bottom left grid view in vertical view
      this.grid.moveTo(-x + o.intersect.x, o.intersect.y);
      this.grid.lineTo(-x + o.intersect.x, o.height + o.intersect.y);

      // extend bottom right grid view in vertical view
      this.grid.moveTo(x + o.intersect.x, o.intersect.y);
      this.grid.lineTo(x + o.intersect.x, o.height + o.intersect.y);

    }

    // set grid style
    this.grid.strokeStyle = o.setting.style.grid.linecolor;

    //  draw grid
    this.grid.stroke();  

    // close grid path
    this.grid.closePath();

  }


// Axis
let draw_axis = (o) => {

    // create a 2 context object
    this.axis = o.setting.canvas.getContext("2d");

    // begin axis path
    this.axis.beginPath();

    // set line width
    this.axis.lineWidth = o.setting.style.axis.linewidth;

    // update current working coordinations and create new line object
    this.axis.moveTo(0, o.intersect.y);
    this.axis.lineTo(o.setting.canvas.offsetWidth, o.intersect.y);

    this.axis.moveTo(o.intersect.x, 0);
    this.axis.lineTo(o.intersect.x, o.setting.canvas.offsetHeight);

    // set axis style
    this.axis.strokeStyle = o.setting.style.axis.linecolor;

    // draw axis
    this.axis.stroke();

    // close axis path
    this.axis.closePath();

  }

// Draw line
let draw_line = function(o) {

    // determine largest close price
    this.max_value = o.data.close.reduce((max, p) => p > max ? p : max, o.data.close[0]);

    // determine smallest close price
    this.min_value = o.data.close.reduce((min, p) => p < min ? p  : min, o.data.close[0]);

    // calculate range of price
    if(this.min_value > 0) {
      this.price_range = (this.max_value) - (this.min_value)
    }
    else if(this.max_value < 0){
      this.price_range = Math.abs(this.max_value) - Math.abs(this.min_value)
    }
    else {
      this.price_range = Math.abs(this.min_value) +  Math.abs(this.max_value)
    }
    
    // generate plot to fill canvas width - x offset
    // destermine zero baseline, where x == 0 as a scallar value
    this.base_line = scalar(0, 0, o.setting.canvas.offsetHeight, this.min_value, this.max_value) * o.setting.zoom.y;

    // calculate grid spacing relative to range
    this.spacing = {
        x:o.setting.style.grid.spacing.x,
        y:(o.setting.canvas.offsetHeight/this.price_range) * o.setting.style.grid.spacing.y,
      }

    // calculate offset relative to scalar base line
    let offset = {
      x:o.setting.offset.grid.x,
      y:o.setting.canvas.offsetHeight-this.base_line,
    }

    // graw grid with respect to baseline and offset
    draw_grid({
        // make grid close to infinate in size
        height:o.setting.canvas.offsetWidth*100,
        width:o.setting.canvas.offsetWidth*100,
        intersect:offset,
        setting:o.setting,
        spacing:this.spacing,
      });

    // graw axis with respect to baseline and offset
    draw_axis({
        intersect:offset,
        setting:o.setting,
    });

    // create a 2d line object
    this.line = o.setting.canvas.getContext("2d");

    // create background 2d object
    this.background = o.setting.canvas.getContext("2d");

     // set line width
    this.line.lineWidth = o.setting.style.price.linewidth;

    // set postions to offset
    this.line.moveTo(o.setting.offset.price.x, o.setting.offset.price.y);
 
    // begin line path
    this.line.beginPath();

    // begin background path
    this.background.beginPath();

    data.close.map((close, i) => {

        let close_scalar = scalar(close, 0, o.setting.canvas.offsetHeight, this.min_value, this.max_value) * o.setting.zoom.y;

        // let close = o.data();
        // the positons is given by the index of the array where by an index of 1, in a hypothetical case, a
        // a o.zoom.x (zoom in the x plane) being 2 would result in a x coordinate of 2, since 1 * 2 give you 2

        let position = {
          x:o.setting.offset.price.x + i * o.setting.zoom.x, y:(-close_scalar + o.setting.offset.price.y)
        }

        // where the zoom in the x plane also gives the distance between each data point
        // hence the background is equal to o.zoom.x (zoom in the x plane)
        let dimentions = {
            width:o.setting.zoom.x, height:close_scalar - this.base_line
        } 

        price_background_gradient({
            setting:o.setting, close:close, object:this, dimentions:dimentions, position:position,
        });

        this.line.lineTo(position.x, position.y);

    
    });

    // set line style
    this.line.strokeStyle = o.setting.style.price.linecolor;

    // draw line
    this.line.stroke();

    // close line path
    this.line.closePath();

    // close background path
    this.line.closePath();

  };


price_background_gradient = (o) => {
    
    // create linear gradient object, and set linear gradient transition to canvas height
    var gradient = o.object.background.createLinearGradient(0, 0, 0, o.setting.canvas.offsetHeight);

    // if close price is below 0 make set background to red with a transition, and green if above 0
    if(o.close > 0) {
        // start with a red color and gradually transitions to the transition color
        gradient.addColorStop(0, o.setting.style.price.linebackground.high);
        gradient.addColorStop(1, o.setting.style.price.linebackground.transition);
    }
    else {
        // start with a transitions color and gradually transitions to the lime
        gradient.addColorStop(0, o.setting.style.price.linebackground.transition);
        gradient.addColorStop(1, o.setting.style.price.linebackground.low);
    }

    // set gradient as backgrond fill style
    o.object.background.fillStyle = gradient;

    // draw background given dimentions relative to postions of close price
    o.object.background.fillRect(o.position.x, o.position.y, o.dimentions.width, o.dimentions.height);

  }


scalar = (unscaled, min_range, max_range, min, max) => {
    return (((max_range - min_range) * (unscaled - min)) / (max - min)) + min_range;
  }

get_in_view_data = (o) => {

    this.in_view = max_items_in_view({
      data: o.raw.close,
      setting:o.setting,
    });

    data = {
      close:[]
    };
  
    /*  if the client moves the chart right the value of client_x will be decremented,
        and incremented when client moves left */
    this.view_displacement = (Math.abs(o.client.x)-o.setting.offset.price.x)/o.setting.zoom.x
    
    // check to see if user has reached the end of the view (data)
    if(o.client.x < 0) {
      this.splice_start = this.view_displacement;
      this.splice_end = this.view_displacement + this.in_view;
  
      o.setting.offset.grid.x = o.client.x
      // console.log(splice_start, splice_end)
      data.close = o.raw.close.slice(this.splice_start, this.splice_end);
  
    }
    else {

      // calculate incrementer, this will return the value by which the view was shifted
      this.incrementer =  Math.abs(o.client.x - o.client.old.x)
      this.padding_percentage =  Math.abs(this.incrementer/o.setting.canvas.offsetWidth);

      /*  calculate padding with respect to canvas width this is done since the in_view method 
          is only valid given the previously displayed data */
      this.view_padding = (Math.ceil(o.setting.canvas.offsetWidth *this.padding_percentage))/o.setting.zoom.x
    
      this.splice_end = this.in_view + this.view_padding;
      this.splice_start = 0;
      o.setting.offset.price.x = o.client.x
      o.setting.offset.grid.x = o.client.x
  
      // console.log(splice_start, splice_end)
      data.close = o.raw.close.slice(this.splice_start, this.splice_end);
    }

    draw_line({
      data: data,
      setting:o.setting,
    });

  }

clear_canvas = function (o) {
    context = o.setting.canvas.getContext('2d');
    context.clearRect(0, 0, o.setting.canvas.width, o.setting.canvas.height);
  }