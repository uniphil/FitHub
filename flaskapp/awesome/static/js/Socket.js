window.onload = function () {
    var status = document.getElementById("status");
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    var skeleton = new Skeleton(status, canvas, context);
    var exercise = new Exercise(skeleton);

    if (!window.WebSocket) {
        status.innerHTML = "Your browser does not support web sockets!";
        return;
    }

    status.innerHTML = "Connecting to server...";

    // Initialize a new web socket.
    var hostport = $('meta[name=hostport]').attr('value');
    var socket = new WebSocket("ws://" + hostport + "/KinectHtml5");

    // Connection established.
    socket.onopen = function () {
        status.innerHTML = "Connected";
        $('.status').hide();
    };

    // Connection closed.
    socket.onclose = function () {
        status.innerHTML = "Connection closed.";
    }

    // Receive data FROM the server!
    socket.onmessage = function (evt) {
        // Get the data in JSON format.
        var jsonObject = JSON.parse(evt.data);

        // Render the skeleton(s)
        skeleton.render(jsonObject);

        // Check for repetition completion
        exercise.updateRepetitions(jsonObject);

        // Inform the server about the update.
        socket.send("Skeleton updated on: " + (new Date()).toDateString() + ", " + (new Date()).toTimeString());
    };
};
