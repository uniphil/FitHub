var Skeleton = function (status, canvas, context) {
	this.status = status;
	this.canvas = canvas;
	this.context = context;
};

Skeleton.prototype.convertData = function (data) {
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

Skeleton.prototype.render = function (data) {
	var data = this.convertData(data);

	this.renderJoints(data);
	this.renderLimbs(data);
}

Skeleton.prototype.renderJoints = function (data) {

    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.context.fillStyle = "#FF0000";
    this.context.beginPath();

    // Display the skeleton joints.
    for (var i = 0; i < data.skeletons.length; i++) {
        for (var jointName in data.skeletons[i].joints) {
            var joint = data.skeletons[i].joints[jointName];
            this.context.arc(parseFloat(joint.x), parseFloat(joint.y), 10, 0, Math.PI * 2, true);
        }
    }

    this.context.closePath();
    this.context.fill();

    return this;	
}

Skeleton.prototype.drawLimb = function (data, start, end) {
    var from = data[start], to = data[end];
    if (from && to) {
        this.context.strokeStyle = '#fff';
        this.context.lineWidth = 6;
        this.context.beginPath();
        this.context.moveTo(from.x, from.y);
        this.context.lineTo(to.x, to.y);
        this.context.stroke();
    }
};

Skeleton.prototype.renderLimbs = function (data) {
	for (var i = 0; i < data.skeletons.length; i++) {
		var skeleton = data.skeletons[i].joints;
	    this.drawLimb(skeleton, "head", "shouldercenter");
	    this.drawLimb(skeleton, "shouldercenter", "shoulderleft");
	    this.drawLimb(skeleton, "shoulderleft", "elbowleft");
	    this.drawLimb(skeleton, "elbowleft", "wristleft");
	    this.drawLimb(skeleton, "wristleft", "handleft");
	    this.drawLimb(skeleton, "shouldercenter", "shoulderright");
	    this.drawLimb(skeleton, "shoulderright", "elbowright");
	    this.drawLimb(skeleton, "elbowright", "wristright");
	    this.drawLimb(skeleton, "wristright", "handright");
	    this.drawLimb(skeleton, "shouldercenter", "spine");
	    this.drawLimb(skeleton, "spine", "hipcenter");
	    this.drawLimb(skeleton, "hipcenter", "hipleft");
	    this.drawLimb(skeleton, "hipleft", "kneeleft");
	    this.drawLimb(skeleton, "kneeleft", "ankleleft");
	    this.drawLimb(skeleton, "ankleleft", "footleft");
	    this.drawLimb(skeleton, "hipcenter", "hipright");
	    this.drawLimb(skeleton, "hipright", "kneeright");
	    this.drawLimb(skeleton, "kneeright", "ankleright");
	    this.drawLimb(skeleton, "ankleright", "footright");
	}
};