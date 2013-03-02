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

Skeleton.prototype.jointAngle = function(data, jointName) {
  var surroundingJoints = {
    'elbowleft'  : ['wristleft', 'shoulderleft'],
    'elbowright' : ['wristright', 'shoulderright'],
    'kneeleft'   : ['hipleft', 'ankleleft'],
    'kneeright'  : ['hipleft', 'ankleright']
  };

  // make sure we care about this joint
  if (!_.has(surroundingJoints, jointName + 'left')) {
    throw "unsported joint '" + jointName + "' must be one of [" + _.keys(surroundingJoints).join(',') + "]";
  }

  var getAngle = function (p1, p2, p3) {
    var v1 = { x : p1.x - p2.x, y : p1.y - p2.y, z : p1.z - p2.z };
    var v2 = { x : p3.x - p2.x, y : p3.y - p2.y, z : p3.z - p2.z };
    var mag1 = Math.sqrt(v1.x*v1.x + v1.y*v1.y + v1.z*v1.z);
    var mag2 = Math.sqrt(v2.x*v2.x + v2.y*v2.y + v2.z*v2.z);
    var dot = v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
    return Math.acos(dot / mag1 / mag2) * 180 / 3.14159;
  };

  var angles = [];
  _.each(data.skeletons, function(skeleton) {
    var leftJoint = jointName + 'left';
    var rightJoint = jointName + 'right';
    var joint = skeleton.joints;

    angles.push({
      left  : getAngle(joint[surroundingJoints[leftJoint][0]], joint[leftJoint], joint[surroundingJoints[leftJoint][1]]),
      right : getAngle(joint[surroundingJoints[rightJoint][0]], joint[rightJoint], joint[surroundingJoints[rightJoint][1]])
    });
  });
  return angles;
}
