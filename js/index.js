var breakDown, addTexture;
var clearMesh = function(){
	document.getElementById('mesh-container').innerHTML ="";
	document.getElementById('mesh-container').style="transform:translateX(0px)";
	document.getElementById('mesh-desc').style = "opacity:0";
}
var initForMesh = function(){
	var renderer, 
	    scene,
	    camera,
	    currentMesh,
	    texture,
	    width, height;
	width = 600;
	height = 600;
	renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x232323);
	renderer.setSize(width, height);	
	document.getElementById('mesh-container').appendChild(renderer.domElement);
	scene = new THREE.Scene();
	camera =new THREE.PerspectiveCamera( 45, width / height, 1, 1000 )
	scene.add(camera)
	camera.position.z = 10

	var light = new THREE.PointLight( 0x4A90E2, 2, 50)
	light.position.x = 20
	light.position.y = 0
	scene.add(light)
	light.position.z = 10

	light = new THREE.PointLight(0xB8E986, 2, 50)
	light.position.x = -20
	light.position.y = 0
	light.position.z = 10
	scene.add(light)

	var segment = 10;
	function breakdownGeometry() {
		segment+=4;
	    return new THREE.SphereGeometry(3, segment, segment);
	}

	var currentGeometry = new THREE.SphereGeometry(3, 10, 10)
	var mat = new THREE.MeshLambertMaterial({shading: THREE.FlatShading,wireframe:true})
	currentMesh = new THREE.Mesh(currentGeometry, mat)
	scene.add(currentMesh)

	breakDown = function() {
	    scene.remove(currentMesh)
	    currentGeometry = breakdownGeometry()
	    currentMesh = new THREE.Mesh(currentGeometry, mat)
	    scene.add(currentMesh)
    };

    addTexture = function(){
    	scene.remove(currentMesh);
    	texture = new THREE.TextureLoader().load('https://p0.ssl.qhimg.com/t0108371a1bb1b8e245.jpg');
    	mat = new THREE.MeshBasicMaterial({map:texture});
	    currentMesh = new THREE.Mesh(currentGeometry, mat)
	    scene.add(currentMesh)
    }
	document.getElementById('mesh-container').addEventListener('click', breakDown,false);
	document.getElementById('addTexture').addEventListener('click',addTexture,false);

    var animate = function(){
    	requestAnimationFrame(animate)
    	currentMesh.rotation.y  += 0.01
    	renderer.render(scene, camera)  
    };
    animate();
}

var animateForMesh = function() {
	initForMesh();
	setTimeout(function(){
		document.getElementById('mesh-container').style="transform:translateX(-300px)";
		document.getElementById('mesh-desc').style = "opacity:1";
	}, 1000);
}
/******************************************/
var clearCameraDemo = function(){
	document.getElementById('camera-container').innerHTML ="";
}
var initCameraDemo = function(){
	var container,SCREEN_WIDTH,SCREEN_HEIGHT,aspect;
	var camera, scene, renderer, mesh;
	var cameraRig, activeCamera, activeHelper;
	var cameraPerspective, cameraOrtho;
	var cameraPerspectiveHelper, cameraOrthoHelper;
	var frustumSize = 600;

	init();
	animate();

	function init() {
		container = document.getElementById('camera-container');
		SCREEN_WIDTH = container.offsetWidth;
		SCREEN_HEIGHT = container.offsetHeight;
		aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 1, 10000 );
		camera.position.z = 2500;

		cameraPerspective = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 150, 1000 );

		cameraPerspectiveHelper = new THREE.CameraHelper( cameraPerspective );
		scene.add( cameraPerspectiveHelper );

		//
		cameraOrtho = new THREE.OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 150, 1000 );

		cameraOrthoHelper = new THREE.CameraHelper( cameraOrtho );
		scene.add( cameraOrthoHelper );

		//

		activeCamera = cameraPerspective;
		activeHelper = cameraPerspectiveHelper;


		// counteract different front orientation of cameras vs rig

		cameraOrtho.rotation.y = Math.PI;
		cameraPerspective.rotation.y = Math.PI;

		cameraRig = new THREE.Group();

		cameraRig.add( cameraPerspective );
		cameraRig.add( cameraOrtho );

		scene.add( cameraRig );

		//

		mesh = new THREE.Mesh(
			new THREE.SphereBufferGeometry( 100, 16, 8 ),
			new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
		);
		scene.add( mesh );

		var mesh2 = new THREE.Mesh(
			new THREE.SphereBufferGeometry( 50, 16, 8 ),
			new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } )
		);
		mesh2.position.y = 150;
		mesh.add( mesh2 );

		var mesh3 = new THREE.Mesh(
			new THREE.SphereBufferGeometry( 5, 16, 8 ),
			new THREE.MeshBasicMaterial( { color: 0x0000ff, wireframe: true } )
		);
		mesh3.position.z = 150;
		cameraRig.add( mesh3 );

		//

		var geometry = new THREE.Geometry();

		for ( var i = 0; i < 10000; i ++ ) {

			var vertex = new THREE.Vector3();
			vertex.x = THREE.Math.randFloatSpread( 2000 );
			vertex.y = THREE.Math.randFloatSpread( 2000 );
			vertex.z = THREE.Math.randFloatSpread( 2000 );

			geometry.vertices.push( vertex );

		}

		var particles = new THREE.Points( geometry, new THREE.PointsMaterial( { color: 0x888888 } ) );
		scene.add( particles );


		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
		renderer.domElement.style.position = "relative";
		renderer.setClearColor(0x232323);
		container.appendChild( renderer.domElement );

		renderer.autoClear = false;

		var cameraO = false;
		document.getElementById('change-camera').addEventListener( 'click', function(){
			cameraO = !cameraO;
			if(cameraO){
				activeCamera = cameraOrtho;
				activeHelper = cameraOrthoHelper;
			}else{
				activeCamera = cameraPerspective;
				activeHelper = cameraPerspectiveHelper;
			}
		}, false );

	}

	function animate() {
		requestAnimationFrame( animate );
		render();
	}


	function render() {

		var r = Date.now() * 0.0005;

		mesh.position.x = 700 * Math.cos( r );
		mesh.position.z = 700 * Math.sin( r );
		mesh.position.y = 700 * Math.sin( r );

		mesh.children[ 0 ].position.x = 70 * Math.cos( 2 * r );
		mesh.children[ 0 ].position.z = 70 * Math.sin( r );

		if ( activeCamera === cameraPerspective ) {

			cameraPerspective.fov = 35 + 30 * Math.sin( 0.5 * r );
			cameraPerspective.far = mesh.position.length();
			cameraPerspective.updateProjectionMatrix();

			cameraPerspectiveHelper.update();
			cameraPerspectiveHelper.visible = true;

			cameraOrthoHelper.visible = false;

		} else {

			cameraOrtho.far = mesh.position.length();
			cameraOrtho.updateProjectionMatrix();

			cameraOrthoHelper.update();
			cameraOrthoHelper.visible = true;

			cameraPerspectiveHelper.visible = false;

		}

		cameraRig.lookAt( mesh.position );

		renderer.clear();

		activeHelper.visible = false;

		renderer.setViewport( 0, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT );
		renderer.render( scene, activeCamera );

		activeHelper.visible = true;

		renderer.setViewport( SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT );
		renderer.render( scene, camera );

	}
}


/******************************************/
var clearRAF = function(){
	document.getElementById( 'raf-demo' ).innerHTML = "";
}
var RAFDemo = function(){
	var container;
	var camera, scene, renderer, mesh;

	init();
	animate();

	function init() {

		container = document.getElementById( 'raf-demo' );

		camera = new THREE.PerspectiveCamera( 60, container.offsetWidth / container.offsetHeight, 1, 2000 );
		camera.position.z = 500;

		scene = new THREE.Scene();

		// earth

		var loader = new THREE.TextureLoader();
		var texture = loader.load( 'https://p2.ssl.qhimg.com/t014de28b7cbcea05f7.jpg');
		var geometry = new THREE.SphereGeometry( 200, 20, 20 );

		var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
		mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setClearColor(0x232323);
		renderer.setSize( container.offsetWidth, container.offsetHeight);
		container.appendChild( renderer.domElement );
	}

	function animate() {

		requestAnimationFrame( animate );

		mesh.rotation.y -= 0.005;

		renderer.render( scene, camera );
	}

}

/******************************************/
