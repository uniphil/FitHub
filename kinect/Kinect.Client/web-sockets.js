window.onload = function () {
    var status = document.getElementById("status");
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

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
        var jsonObject = eval('(' + evt.data + ')');

        jsonObject = convertJsonData(jsonObject);

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#FF0000";
        context.beginPath();

        /* var repCompleted = false; */

        // Display the skeleton joints.
        for (var i = 0; i < jsonObject.skeletons.length; i++) {
            for (var jointName in jsonObject.skeletons[i].joints) {
                var joint = jsonObject.skeletons[i].joints[jointName];
                context.arc(parseFloat(joint.x), parseFloat(joint.y), 10, 0, Math.PI * 2, true);
            }
        }

        context.closePath();
        context.fill();

        for (var i = 0; i < jsonObject.skeletons.length; i++) {
            draw(jsonObject.skeletons[i].joints);
        }

        /*
        if (repCompleted) {
            throttledUpdate();
        }
        */

        // Inform the server about the update.
        socket.send("Skeleton updated on: " + (new Date()).toDateString() + ", " + (new Date()).toTimeString());
    };

    /*

    var throttledUpdate = _.debounce(function () {
            var repetitions = $("#repetitions"),
                numberReps = parseInt(repetitions.html());

            repetitions.html(numberReps + 1);
        }, 100);

    */

    var drawLimb = function (data, start, end) {
        var from = data[start], to = data[end];

        if (from && to) {
            context.strokeStyle = '#fff'; // red
            context.lineWidth = 6;
            context.beginPath();
            context.moveTo(from.x, from.y);
            context.lineTo(to.x, to.y);
            context.stroke();
        }
    };

    var draw = function (data) {
        drawLimb(data, "head", "shouldercenter");
        drawLimb(data, "shouldercenter", "shoulderleft");
        drawLimb(data, "shoulderleft", "elbowleft");
        drawLimb(data, "elbowleft", "wristleft");
        drawLimb(data, "wristleft", "handleft");
        drawLimb(data, "shouldercenter", "shoulderright");
        drawLimb(data, "shoulderright", "elbowright");
        drawLimb(data, "elbowright", "wristright");
        drawLimb(data, "wristright", "handright");
        drawLimb(data, "shouldercenter", "spine");
        drawLimb(data, "spine", "hipcenter");
        drawLimb(data, "hipcenter", "hipleft");
        drawLimb(data, "hipleft", "kneeleft");
        drawLimb(data, "kneeleft", "ankleleft");
        drawLimb(data, "ankleleft", "footleft");
        drawLimb(data, "hipcenter", "hipright");
        drawLimb(data, "hipright", "kneeright");
        drawLimb(data, "kneeright", "ankleright");
        drawLimb(data, "ankleright", "footright");
    };

    var convertJsonData = function (data) {
        joints = {}
        for (var i = 0; i < data.skeletons.length; i++) {
            for (var j = 0; j < data.skeletons[i].joints.length; j++) {
                var joint = data.skeletons[i].joints[j];
                joints[joint.name] = {
                    x: joint.x,
                    y: joint.y,
                    z: joint.z
                }
            }
            data.skeletons[i].joints = joints;
        }

        return data;
    }
};