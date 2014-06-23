#pragma strict

class CameraOrbit extends MonoBehaviour {

	public var target:Transform;
	public var center:Vector3 = new Vector3(0,0.35,0);
	public var angle:Vector3 =new Vector3(45,45,0);
	public var distance:float = 10;

	public var distanceMin:float = 1;
	public var distanceMax:float = 20;

	public var yMin:float = -20;
	public var yMax:float = 80;

	public var xSpeed:float = 25;
	public var ySpeed:float = 50;
	public var zSpeed:float = 15;

	private var basexSpeed:float;
	private var baseySpeed:float;
	private var basezSpeed:float;

	private var x:float = 0;
	private var y:float = 0;

	private var interval:int = 0;

	function Start () {
		// warn if there is no target
		if(!target) print('No camera target selected!');

		//record initial speed vars
		basexSpeed = xSpeed;
		baseySpeed = ySpeed;
		basezSpeed = zSpeed;

		//angle increments;
		x = angle.y;
		y = angle.x;
	}


	function setTarget (target:Transform): void {
		this.target = target;
	}


	function setDistance(mouseZ:float): void {
		distance = Mathf.Clamp(distance - mouseZ * zSpeed, distanceMin, distanceMax);
	}


	function setRotation (mouseX:float, mouseY:float): void {
		x += mouseX * xSpeed;
		y -= mouseY * ySpeed;
		y = ClampAngle(y, yMin, yMax);
		interval = 100;
	}


	function LateUpdate () {
		//if there is no target assign it to root
		if(!target) return;

		var interval:int = this.interval;

		//get new pos and rot from increments
		var rotation:Quaternion = Quaternion.Euler(y, x, 0);
		var position:Vector3 = rotation * new Vector3(0.0f, 0.0f, -distance) + target.position + center;

		//interpolate camera to new pos and rotation
		if(interval) {
			var time = Time.deltaTime;
			transform.position = Vector3.Slerp(transform.position, position, time * interval);
			transform.rotation = Quaternion.Slerp (transform.rotation, rotation, time * interval);
		} else{
			transform.position = position;
			transform.rotation = rotation;
		}
	}


	static function ClampAngle(angle:float , min:float , max:float ): float {
		if (angle < -360)
			angle += 360;
		if (angle > 360)
			angle -= 360;
		return Mathf.Clamp (angle, min, max);
	}

}

