var Exercise = function (skeleton) {
	this.skeleton = skeleton;
	this.repetitions = 0;
	this.prevAngle = null;
	this.currAngle = null;
	this.prevAngleChange = null;
	this.currAngleChange = null;
};

Exercise.prototype.getCurrentAngle = function (data) {
	this.prevAngle = this.currAngle;
	this.currAngle = this.skeleton.jointAngle(data, "handleft", "shouldercenter", "hipcenter")[0];
}

Exercise.prototype.getCurrentAngleChange = function () {
	this.prevAngleChange = this.currAngleChange;
	this.currAngleChange = this.getAngleChange();
}

Exercise.prototype.getAngleChange = function () {
	return this.currAngle - this.prevAngle;
}

Exercise.prototype.checkConstraints = function () {
	if (this.prevAngleChange > 0 && this.currAngleChange < 0) {
		if (this.prevAngle > 130 && this.currAngle > 130) {
			return true;
		}
	}
}

Exercise.prototype.updateRepetitions = function (jsonObject) {
	this.getCurrentAngle(jsonObject);
	this.getCurrentAngleChange();

	console.log({
		"prevAngle": this.prevAngle,
		"currAngle": this.currAngle,
		"prevAngleChange": this.prevAngleChange,
		"currAngleChange": this.currAngleChange
	})

	if (this.checkConstraints()) {
		$("#repetitions").html(++this.repetitions);
	}
}

