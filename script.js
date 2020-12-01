if (document.getElementById('c')) {

  // context
  let c_canvas = document.getElementById("c");

  let setting = {
    canvas:c_canvas,
    offset:{
      grid:{
        x:0,
        y:0,
      },
      price:{
        x:0,
        y:c_canvas.offsetHeight,
      },
    },
    zoom: {
      x:1,
      y:1,
    },
    style:{
      background:"#607D8B",
      grid:{
        linecolor:"#668695",
        linewidth:1,
        spacing:{
          x:50,
          y:50,
        },
      },
      price:{
        linecolor:'white',
        linewidth:1,
        linebackground:{
          high:"lime",
          low:"red",
          transition:"#607D8B",
        }
      },
      axis:{
        linecolor:"#000",
        linewidth:1
      }
    }
  }

  raw = {
    close:[]
  };

  for(var i = (setting.offset.price.x); i < 10000; i++) {
    raw.close.push(random_data());
  }

  let client = {
    x:0, y:0,
    old:{
      x:0, y:0
    }
  }

  get_in_view_data({
    client:client,
    setting:setting,
    raw:raw,
  });

  key_events = function(event) {

    event = event || window.event;

    if (event.keyCode == '37') {

        clear_canvas({
          setting:setting,
        });

        // assigning x to old x before updating x locations
        client.old.x = client.x;
        client.x+=50;

        // left arrow
        get_in_view_data({
          client:client,
          setting:setting,
          raw:raw,
        });

    }
    else if (event.keyCode == '39') {  

      clear_canvas({
        setting:setting,
      });

      // assigning x to old x before updating x locations
      client.old.x = client.x;
      client.x-=50;

      // right arrow
      get_in_view_data({
        client:client,
        setting:setting,
        raw:raw,
      });
    }
  }

  document.onkeydown = key_events;


}

