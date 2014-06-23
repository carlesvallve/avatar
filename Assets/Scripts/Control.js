#pragma strict

private var cam:CameraOrbit;
//private var grid:Grid;
//private var ball:Ball;

private var startPos: Vector3;
private var endPos: Vector3;
private var incs: Vector3;

private var rotating: boolean = false;
private var sliding: boolean = false;

private var pinchLength:float = 0f;
private var deltaLength:float = 0f;;

class Control extends MonoBehaviour {

	function Start () {
		// get relevant components
		cam = Camera.main.GetComponent('CameraOrbit') as CameraOrbit;
		//grid = GameObject.Find('Grid').GetComponent('Grid') as Grid;
		//ball = GameObject.Find('Ball').GetComponent('Ball') as Ball;
	}

	function LateUpdate () {

		#if UNITY_EDITOR

			// -------------------------
			// control camera with mouse
			// -------------------------

			if (Input.GetButtonDown("Fire2")) rotating = true;
			if (Input.GetButtonUp("Fire2")) rotating = false;

			cam.setDistance(Input.GetAxis("Mouse ScrollWheel"));
			if(rotating) { 
				cam.setRotation(
					Input.GetAxis("Mouse X"), 
					Input.GetAxis("Mouse Y") * 0.5f
				); 
			}


			// -------------------------
			// control ball with mouse
			// -------------------------

			if (Input.GetButtonDown('Fire1')) {
				startPos = new Vector3(Input.GetAxis('Mouse X'), 0, Input.GetAxis('Mouse Y'));
				sliding = true;
			}

			if (Input.GetButtonUp('Fire1')) {
				sliding = false;
				endPos = new Vector3(Input.GetAxis('Mouse X'), 0, Input.GetAxis('Mouse Y'));
				incs = (endPos - startPos) * 1000;

				/*if (incs.magnitude < 200) {
					if (grid.selectedPlayer) {
						grid.selectedPlayer.moveTo(endPos);
					}
				} else {
					ball.applyForce(incs);
					grid.getNearestPlayerToBall();
				}*/

			}

		#else

			// -------------------------
			// control camera with touch
			// -------------------------

			if(Input.touchCount == 2) {
				rotating = true;

				// Zoom the camera while pinching with 2 fingers

				if(Input.GetTouch(1).phase == TouchPhase.Began){
					pinchLength = Vector2.Distance(Input.GetTouch(0).position, Input.GetTouch(1).position);
				}

				if(Input.GetTouch(0).phase == TouchPhase.Moved || Input.GetTouch(1).phase == TouchPhase.Moved){
					deltaLength = (Vector2.Distance(Input.GetTouch(0).position, Input.GetTouch(1).position) - pinchLength) * 0.01;
					pinchLength = Vector2.Distance(Input.GetTouch(0).position, Input.GetTouch(1).position);

					// set camera distance
					cam.setDistance(deltaLength);
				}

				// Rotate camera by moving with 2 fingers

				for (var i = 0; i < Input.touchCount; ++i) {
					var touch:Touch = Input.GetTouch(i);
					if (touch.phase == TouchPhase.Began) rotating = true;
					if (touch.phase == TouchPhase.Ended) rotating = false;

					if(rotating) { 
						cam.setRotation(
							touch.deltaPosition.x * 0.05f, 
							touch.deltaPosition.y * 0.05f
						); 
					}
				}

			} else if(Input.touchCount == 2) {
				rotating = false;
			}


			// -------------------------
			// control ball with touch
			// -------------------------

			if(!rotating && Input.touchCount == 1) {
				if (Input.GetTouch(0).phase == TouchPhase.Began) {
					startPos = new Vector3(Input.GetTouch(0).position.x, 0, Input.GetTouch(0).position.y);
					sliding = true;
				}

				if (Input.GetTouch(0).phase == TouchPhase.Ended) {
					sliding = false;
					endPos = new Vector3(Input.GetTouch(0).position.x, 0, Input.GetTouch(0).position.y);
					incs = (endPos - startPos) * 5.0;

					//ball.applyForce(incs);	
				}
			}

		#endif

	}

}