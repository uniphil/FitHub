﻿window.onload = function () {
    var status = document.getElementById("status");
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    var skeleton = new Skeleton(status, canvas, context);

    if (!window.WebSocket) {
        status.innerHTML = "Your browser does not support web sockets!";
        return;
    }

    status.innerHTML = "Connecting to server...";

    // Initialize a new web socket.
    var socket = new WebSocket("ws://localhost:8181/KinectHtml5");

    // Connection established.
    socket.onopen = function () {
        status.innerHTML = "Connection successful.";
    };

    // Connection closed.
    socket.onclose = function () {
        status.innerHTML = "Connection closed.";
    }

    // Receive data FROM the server!
    socket.onmessage = function (evt) {
        status.innerHTML = "Kinect data received.";

        // Get the data in JSON format.
        var jsonObject = JSON.parse(evt.data);

        // Render the skeleton(s)
        skeleton.render(jsonObject);

        // Output the angles
        var leftAngle = skeleton.jointAngle(jsonObject, 'handleft', 'shouldercenter', 'hipcenter')[0];
        var rightAngle = skeleton.jointAngle(jsonObject, 'handright', 'shouldercenter', 'hipcenter')[0];
        console.log('left : ' + leftAngle + " | right : " + rightAngle);

        // Inform the server about the update.
        socket.send("Skeleton updated on: " + (new Date()).toDateString() + ", " + (new Date()).toTimeString());
    };
};
