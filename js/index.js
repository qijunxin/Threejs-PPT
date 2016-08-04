var breakDown;
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

	function breakdownGeometry(sourceGeometry) {
	    var geom = new THREE.Geometry()
	    var randVect = function(amount) {
	        return new THREE.Vector3(Math.random() * amount, Math.random() * amount , Math.random() * amount)
	    }
	    var makeTri = function(geom, vertA, vertB, vertC, normal) {
		    var delta = normal.clone().multiplyScalar(0.5).multiply(randVect(1))
		    geom.vertices.push(vertA.clone().add(delta))
		    geom.vertices.push(vertB.clone().add(delta))
		    geom.vertices.push(vertC.clone().add(delta))
		    var vertIndex = geom.vertices.length - 3
		    var newFace = new THREE.Face3(vertIndex, vertIndex + 1, vertIndex + 2, normal)
		    geom.faces.push(newFace)
	    }

	    var faces = sourceGeometry.faces
	    for (var i = 0; i < faces.length; i++) {
		    var face = faces[i]
		    var vertA = sourceGeometry.vertices[face.a]
		    var vertB = sourceGeometry.vertices[face.b]
		    var vertC = sourceGeometry.vertices[face.c]
		    var vertD = new THREE.Vector3().addVectors(vertA, vertB).multiplyScalar(0.5)
		    var vertE = new THREE.Vector3().addVectors(vertB, vertC).multiplyScalar(0.5)
		    var vertF = new THREE.Vector3().addVectors(vertC, vertA).multiplyScalar(0.5)

		    makeTri(geom, vertA, vertD, vertF, face.normal)
		    makeTri(geom, vertD, vertB, vertE, face.normal)
		    makeTri(geom, vertE, vertC, vertF, face.normal)
		    makeTri(geom, vertD, vertE, vertF, face.normal)

	  	}

		geom.verticesNeedUpdate = true
		geom.normalsNeedUpdate = true
		return geom
	}


	var currentGeometry = new THREE.SphereGeometry(3, 10, 10)
	var mat = new THREE.MeshLambertMaterial({shading: THREE.FlatShading,wireframe:true})
	currentMesh = new THREE.Mesh(currentGeometry, mat)
	scene.add(currentMesh)

	breakDown = function() {
	    scene.remove(currentMesh)
	    currentGeometry = breakdownGeometry(currentGeometry)
	    mat = new THREE.MeshLambertMaterial({shading: THREE.FlatShading})
	    currentMesh = new THREE.Mesh(currentGeometry, mat)
	    scene.add(currentMesh)
    };
	document.getElementById('mesh-container').addEventListener('click', breakDown,false);

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
var clearStarDemo = function(){
	document.getElementById('star-demo').innerHTML = "";
}
var initStarDemo = function(){
	var cotem = {
	    name: "双鱼座",
	    vertices: [[-28.47, 20.14, 20.134999999999998], [-33.33, 15.280000000000001, 6.945], [-30, 13.89, 3.1950000000000003], [-25.7, 9.030000000000001, -.41499999999999915], [-22.92, -1.67, 3.1950000000000003], [-18.61, -23.61, -29.445], [-12.5, -10.55, -11.255000000000003], [-7.920000000000002, -1.9399999999999995, -21.255000000000003], [-1.5300000000000011, 6.11, 11.524999999999999], [8.61, 9.580000000000002, -2.2250000000000014], [11.25, 14.17, 17.085], [10.420000000000002, 14.31, 29.445], [19.58, 19.45, 6.384999999999998], [16.799999999999997, 18.75, 24.445], [30, 23.61, -1.115000000000002], [20.549999999999997, 15.700000000000001, 20.975], [13.939999999999998, 13.610000000000001, 20.975]],
	    materials: [4, 2, 4, 4, 3, 3, 2, 2, 4, 3, 4, 4, 3, 2, 2, 1, 2],
	    sizes: [10, 10, 20, 20, 25, 20, 20, 25, 10, 10, 20, 10, 20, 10, 10, 10, 10]
	}
	var container,renderer, scene, camera, particleSystem;
	
	var starTexture = [
		'data:image/png;base64,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',
		'data:image/png;base64,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',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAeFBMVEUAAAACBgkDCQ0ECxEGDhUGEBgIExwOIC4LGyYSKDcJFyEZNEcWL0EhQFYnR1wdOk9QcYUxU2oqPEkgLzhDaH4uTmQWIit7na9oiZ1cfY89X3U6Wm4+VWOsxtKKq7s2SVZvkqReg5dJY3PK3eWcuMdKaH39///f7O/iGy/IAAAE/UlEQVR42u2ah3LbMBBEdUQhCUpUsySruaX9/x9m7wAEilImmYBkksHapuixZ/bhGiDas6KioqKioqKioqKif1w0m1y/ifA/+NO0AHCcGoDo7ruRRdDkAJQiTxPkoCJK/lOEoBICmhKgirY0CQApVRF0UxDjilQkwFc1RQhUJKCYjnFFlf5CUCkmmMWPcYQIaA2CCOBRxhzMGvIEVeXTMXIxKqeNEMA+oozTkBRenDNGEJRmgWRIAPr23uyttYygDYtjAA0WAaL7zY+2eyMExvCrxAC6ARgMIcw/t3XWMQIi4ZjE1+JwbZDySyK13VrnnIVwDQQDRSD53hLsN41zjbO4NFayoH8UgUztSRGBuP2V2WxhDQiHCwNA+MGgp2Y4Q2Er0PvnuqnrxskFZWCNIuh2vdnHE4V2r7j97POmqWGOi8QgAKRMDTGbSPodABbaXtoIILnwAHHVQ/infVBZzv3luW7B0AqHs1wCSX4wUf5pUMnsN0h90711dQAAgQeISVLQEAAQ4s/jj03PlxbuLatujMaatZIWEUhmkR7MmgFIGZ6BDRbfrTawns/buQAobQCAqwmzOXcNEBMobgCeADVs397YHWprFzYF7V+U8mMhfwqU+NcQnBfHHgDdsgMAoBwEe5Gfi8OUALy49OA8/7Dq4M8AzAQ1LFDoapZbsbtCBDjyXdc/npeLXd+1QeAKDZHfPZz/dASA/XKxOL6sz6f1ohNxMXA15I4+UfTX3l4yMId/v1s9Pa6OD+u+XywWy467waIf859QA0Bavw/A7mH1dD0cXlendQ9/Cb8JJ8TsEDEIaDfuwZYB1g+PT++uT4fXB2Rhzv5OejAhUP443FTBcscAH6+H1xPakf3j0cBvWkNAxDBYJuh6AFw/XQ/H8wL27O/CaVkFhGFywdOYJyFS8PpyeH99WZ3RiewfAHwaRDQABCltHda/6Nenh9Xx8f3LeSclyAkIEdDJPzMCSQBcPV+i8fq+353Or4edTIFWEEwIwPft/xSCSLbDhruQRzDUL3YvH2DO8gcTnarwRjkOqBTOY2En6NgSN/PT45JLMJahCfG/s6c/W358GqNsAwkC+8tddzzJ4mUf4m1ZZ188BSkjde7gC7U1bmw9b9fHTmYA4Gx4y6woyS+d/tCfM+APOzwFWJxwfHIWVhdJvzXheF4piKCsDwVUrC7FPs41vucQiLZfdQIAPnyqdCz2mc/0bDCe82RD8OZYrm44GW+XCIDfMzr3VhDXEwUEMEhCGAAIm7d5APA1oLx1HoT7ig5BUIr7TQAwl/EuJQKANe9b9eAc1kKegL0NbJRy8g61u7QASEM4I0HwvU8JosCpVpWV/qufN86mx0XZHhn9YIBTJa1GMw9gjHPt814yEAkEcjaQiAV/ATB8DAPBZoNXSMH7512Qa0+scFMp0o6nn7H1pokBIGhYAgEgD6AYgIfTdssVIAADE5AH4FuYKcvdUCELWwd37z84ApGvMLY2Pu1a7/fhHDI0AX0BIIU7reHpCQyTJII4CfPHIAZAyl0CQOxsXDSXIAVnyk5AXwMg7sGR0oOq2xmSn0CWFwCkE9Ie8fUZxBsP4k8J5Hboxrt71/wA6caHIQB97U7DQNAtwFR/QL+9Gf1vp7BLGfAUYysBBKJxEZIfTf4vPBSRxhX9Lf/D9IsA/4vt38jyN4WiqKioqKioqKioqKjoX9ZnCOgz7N8EW4sAAAAASUVORK5CYII=',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAeFBMVEUAAAACBAgEBwwHCxELEhoHDhcOGCIVICwWJDEdLTonPE0RHCcaKTcgMkI4UWYeLz8sQFEmOEhMaIEvRVciNkaZtsl/nrVUcIk2TGAvSl9bepJFYHY9VmzB2eanwtRzkqvm9PnM4u1riqNjgZk/XHWNqsH6//+50OBE0LCDAAAEC0lEQVR42u2aCVPjMAyFUZw4Z5O06X1wtBz//x+uLNlV2Q7H7ERTmPUHQ+sUeM/Plu0G7iKRSCQSiUQikUgkEhkJuPu/Afr4Pr83/o/6CbfNAD69rD/YksBNBkY7evjHBFRdwdeWQCFhaV/nAtdGsKU2EF5OAoArQ+NHDtcJALcZSUACGQ9JPQhIG5DEORCvIBFoOAAnIYoJ6pOBd1f4uVoGgHAb2EAiMYBJEIUy9F0UA0AkBLlgV9RS0JehDf0OnTcIarIwG1JaiGTkOXUWQ3XWp0vGSACg54C0gz4nwDFQAxCR13EQxJ1uZghuIeDQ2g3OUz05O8iyzARSZ4S+R2+LTBI/1yl2JEP8lzTN8CqXgx4owA5YHFVT+UIzgT3qeaBJTwZQ0jrwAcXx0Q0G66uS+AmPknWd53mN2NTWNuirHwaBJj1KFkXRNE2BoBObGodq/4OJJEVsXjRd102QrmnKPDWcgE4FcAIBdJDnTn9aEfPJtLRUj8oVABB2gSwvy3IyHTaOvhr6wlpNfUkgceD8r8u+qob2GWk37XpS0BzQ2gglAF//ts6bqt3vZ9vtdjWb7apJWdS0Coi6TgKJCfrdtF1tj8vl8uG43ffTrsktBaAJ6nsDTn9oV8vFPfJy2q2reYkGtPQlAd5/U1uU877dnV7enp6eDouH1X4gA+cqefcxjryD5yAl4AysHhaHx9fHp/vl9nmY4xDwVpSwBwHGW4LAT8O0LrpqPSMDr84AJVD7pZAAYtz1D84GMhyD6Xp2RAOPmAAOQT+hBCQCGYux1wEATIAM7E7Lt8Ph8LY4ztoKy5CqgNTHHYLQDZB1KK3RwLBfLV8Wi8XL8rQbpmVhUyP6405BeT/EHrgMqnZ1Oh0fcBlY7frOjYBkP/o2DJeFYGgOdNV+9zxz7FpcinMKYPz+gzzxPnwdFt2w3mzW7bpt203V9w1OQWA0VqCzFQ4gwzGY9rgP03bc9/NyUuYmqEv3NayE3aDBY0iHWzI+TOZYg0WeGlDaCyWBcBp2ZeBpyqYpXQ1anASSgJaRcBywtSXqOmcsn8p1E+Aa4DK0aZqRpiXoRI4GjOJ9Q1kKUMnJGyILTnxb8TjkP8EYlud36CwrbxCV5qFYcJIkRvrsgCqTH/Gqqjz23wMeFg29T5RuEIkFlrp4+5U4wmVfJSpVyLDSZczgRyLxl1UdeB25ASIGgHQhFIpa/88yAuvxAkGv6N0fgZCuwHriQ65oOKC6v/rV1P4reVAKQBQE8cAGGIUMProHHo5Ll6+q3KiEz4IF0SWkOab8F3slfPQT+hYkAbEhp0h9efUEZEZ9nYDO3zS/K68HfHOQFE3Aj/ongh9qISYAN3dwc/0fQIwgEolEIpFIJBKJ/E7+AIJjJo2y+HjdAAAAAElFTkSuQmCC'
	];
	var pointMaterial = new THREE.ShaderMaterial({
	    uniforms: {
	        texture1: {
	            type: "t",
	            value: new THREE.TextureLoader().load(starTexture[0])
	        },
	        texture2: {
	            type: "t",
	            value: new THREE.TextureLoader().load(starTexture[1])
	        },
	        texture3: {
	            type: "t",
	            value: new THREE.TextureLoader().load(starTexture[2])
	        },
	        texture4: {
	            type: "t",
	            value: new THREE.TextureLoader().load(starTexture[3])
	        },
	        timeline: {
	            type: "f",
	            value: 0
	        }
	    },
	    vertexShader: document.getElementById("vertex-shader").textContent,
	    fragmentShader: document.getElementById("fragment-shader").textContent,
	    blending: THREE.AdditiveBlending,
	    depthTest: false,
	    transparent: true
	});
	
	init();
	animate();

	function init(){
		var vertices = cotem.vertices, 
			positions = new Float32Array(3 * vertices.length), 
			singleSizes = new Float32Array(vertices.length), 
			idxs = new Float32Array(vertices.length), 
			matids = new Float32Array(vertices.length), 
			singleSizes = new Float32Array(vertices.length),
			geometry, 
			sizes = cotem.sizes, 
			materials = cotem.materials;

		container = document.getElementById('star-demo');

		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(container.offsetWidth,container.offsetHeight);
		renderer.setClearColor(0x232323);
		container.appendChild(renderer.domElement);

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(45,container.offsetWidth/container.offsetHeight,0.1,1000);
		camera.position.z = -200;
		camera.lookAt(scene.position);

		geometry = new THREE.BufferGeometry();
		for(var i = 0; i < vertices.length; i++){
			vertices[i] = (new THREE.Vector3()).fromArray(vertices[i]);
		}
		for (var i = 0; i < vertices.length; i++){
			positions[3 * i] = vertices[i].x;
			positions[3 * i + 1] = vertices[i].y;
			positions[3 * i + 2] = vertices[i].z;
			matids[i] = materials[i];
			idxs[i] = i;
			singleSizes[i] = sizes[i];
			geometry.addAttribute("position", new THREE.BufferAttribute(positions,3));
			geometry.addAttribute("idx", new THREE.BufferAttribute(idxs,1));
			geometry.addAttribute("matid", new THREE.BufferAttribute(matids,1));
			geometry.addAttribute("size", new THREE.BufferAttribute(singleSizes,1)); 
		}
	    
	    particleSystem = new THREE.Points(geometry,pointMaterial);
	    scene.add(particleSystem);
	}
    
    function animate(){
    	requestAnimationFrame(animate);
    	pointMaterial.uniforms.timeline.value += 0.05;
    	renderer.render(scene,camera);
    } 
}
/******************************************/
var clearSimple = function(){
	document.getElementById("demo-1-container").innerHTML = "";
}
var simpleDemo = function(){
	var renderer, camera, scene, light, cube, shadow;
	var rotationDown = 0,mouseXDown = 0,rotationMove = 0,mouseXMove = 0;
	var container = document.getElementById("demo-1-container");
	initScene();
	animate();
	function initScene(){
		renderer = new THREE.WebGLRenderer({antialias:true});
		renderer.setSize(container.offsetWidth,container.offsetHeight);
		renderer.setClearColor(0x232323);
		container.appendChild(renderer.domElement);

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(45,container.offsetWidth/container.offsetHeight,1,1000);
		camera.position.z = 550;
		camera.lookAt(scene.position);
		scene.add(camera);

		light = new THREE.DirectionalLight(0xf0f0f0);
		light.position.set(0,0,5);
		scene.add(light);

		var geometry = new THREE.BoxGeometry(200,200,200);
		var texture = new THREE.TextureLoader().load('../image/texture.jpg');
		var material = new THREE.MeshLambertMaterial( {map:texture});
		cube = new THREE.Mesh( geometry, material);
		scene.add(cube);

	}

	function animate(){
		requestAnimationFrame(animate);
		cube.rotation.y += 0.01;
		cube.rotation.x += 0.01;
		renderer.render(scene,camera);
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
		var texture = loader.load( '../image/land_ocean_ice_cloud_2048.jpg');
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
var clearCow = function(){
	document.getElementById('cow-demo').innerHTML = "";
}
var cowDemo = function(){

	var scene, 
	    camera,
	    container,
	  	aspectRatio,
	    renderer,
		container;
	var HEIGHT,
	  	WIDTH;

	function init(){
		container = document.getElementById('cow-demo');
	  	scene = new THREE.Scene();
	  	scene.fog = new THREE.Fog( 0x363d3d, -1, 3000 );
	  	HEIGHT = container.offsetWidth;
	  	WIDTH = container.offsetHeight;
		camera = new THREE.PerspectiveCamera(60,WIDTH / HEIGHT,1,2000);
	    camera.position.z = 800;  
	    camera.position.y = 300;
	    camera.lookAt(new THREE.Vector3(0,0,0));    
	    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
	    renderer.setSize(WIDTH, HEIGHT);
	    container.appendChild(renderer.domElement);
	}

	function createLights() {
	    light = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)
	  
	    shadowLight = new THREE.DirectionalLight(0xffffff, .8);
	    shadowLight.position.set(200, 200, 200);
	    shadowLight.castShadow = true;
	 	
	    backLight = new THREE.DirectionalLight(0xffffff, .4);
	    backLight.position.set(-100, 200, 50);
	    backLight.castShadow = true;
	 	
	    scene.add(backLight);
	    scene.add(light);
	    scene.add(shadowLight);
	}

	function createCows(){
	    cow = new Cow();
	    scene.add(cow.threegroup);  
	}

	Cow = function(){
	    this.threegroup = new THREE.Group();
	    this.whiteMat = new THREE.MeshLambertMaterial ({
	        color: 0xffffff, 
	        shading:THREE.FlatShading
	    });
	  
	    this.blackMat = new THREE.MeshLambertMaterial ({
	        color: 0x000000, 
	        shading:THREE.FlatShading
	    });
	  
	    this.greyMat = new THREE.MeshLambertMaterial ({
	        color: 0x999999, 
	        shading:THREE.FlatShading
	    });
	  
	    this.pinkMat = new THREE.MeshLambertMaterial ({
	        color: 0xfaa288, 
	        shading:THREE.FlatShading
	    });
	  
	    this.greenMat = new THREE.MeshLambertMaterial ({
	        color: 0x6ec098, 
	        shading:THREE.FlatShading
	    });
	  
	    this.orangeMat = new THREE.MeshLambertMaterial ({
	        color: 0xef704f, 
	        shading:THREE.FlatShading
	    });
	  
	    this.yellowMat = new THREE.MeshLambertMaterial ({
	        color: 0xd7a25e, 
	        shading:THREE.FlatShading
	    });
	  
	    this.wireMat = new THREE.LineBasicMaterial ({
	        color:0xffffff,
	        linewidth:1
	    });
	  
	    var bodyGeom = new THREE.BoxGeometry(100, 100, 100);
	    var spotGeom = new THREE.BoxGeometry(20,20, 20);
	    var tailGeom  = new THREE.BoxGeometry(10,10, 30);
	    tailGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, -20 ) );
	    var faceGeom  = new THREE.BoxGeometry(100,100, 100);
	    var ringGeom = new THREE.TorusGeometry(200, 3, 4, 4)
	    var ringGeom2 = new THREE.TorusGeometry(50, 3, 4, 4)
	  
	    var wireGeom = new THREE.Geometry();
	    wireGeom.vertices.push(
	        new THREE.Vector3( 0, 0, 0 ),
	        new THREE.Vector3( 0, 2000, 0 )
	    );
	  	  
	    this.body = new THREE.Mesh(bodyGeom, this.whiteMat);
	  
	    this.spot1 = new THREE.Mesh(spotGeom, this.blackMat);
	    this.spot1.position.y = 41;
	    this.spot1.position.x = 41;
	    this.spot1.position.z = 25;
	  
	    this.spot2 = new THREE.Mesh(spotGeom, this.blackMat);
	    this.spot2.scale.set(2,2,2);
	    this.spot2.position.y = 31;
	    this.spot2.position.x = -31;
	    this.spot2.position.z = -31;
	  
	    this.spot3 = new THREE.Mesh(spotGeom, this.blackMat);
	    this.spot3.scale.set(2.5,2.5,2.5);
	    this.spot3.position.y = -26;
	    this.spot3.position.x = 26;
	    this.spot3.position.z = 26;
	  
	    this.spot4 = new THREE.Mesh(spotGeom, this.blackMat);
	    this.spot4.position.y = -41;
	    this.spot4.position.x = 41;
	    this.spot4.position.z = -41;
	  
	    this.tail = new THREE.Mesh( tailGeom, this.whiteMat);
	    this.tail.position.y = 45;
	    this.tail.position.z = -60;

	    this.face = new THREE.Mesh(faceGeom, this.pinkMat);
	    this.face.position.z = 100;
	  
	    this.nostril1 = new THREE.Mesh(spotGeom, this.blackMat);
	    this.nostril1.scale.set(.5,.5,1);
	    this.nostril2 = this.nostril1.clone();
	    this.nostril1.position.z = this.nostril2.position.z =141;
	    this.nostril1.position.y = this.nostril2.position.y =35;
	    this.nostril1.position.x = -35;
	    this.nostril2.position.x = 35;
	  
	    this.leftEye = new THREE.Mesh(spotGeom, this.whiteMat);
	    this.leftEye.scale.set(1,2.5,2.5);
	    this.leftEye.position.x = 41;
	    this.leftEye.position.y = 22;
	    this.leftEye.position.z = 100;
	  
	    this.rightEye = this.leftEye.clone();
	    this.rightEye.position.x = -41;
	  
	    this.leftIris = new THREE.Mesh(spotGeom, this.blackMat);
	    this.leftIris.scale.set(.5,.5,.5);
	    this.leftIris.position.x = 50;
	    this.leftIris.position.y = 26;
	    this.leftIris.position.z = 110;
	  
	    this.rightIris = this.leftIris.clone();
	    this.leftIris.position.x = -50;
	  
	    this.leftEar = new THREE.Mesh(spotGeom, this.pinkMat);
	    this.leftEar.position.x = 60;
	    this.leftEar.position.y = 40;
	    this.leftEar.position.z = 60;
	  
	    this.rightEar = this.leftEar.clone();
	    this.leftEar.position.x = -60;
	  
	    this.leftHorn = new THREE.Mesh(spotGeom, this.greyMat);
	    this.leftHorn.position.x = 25;
	    this.leftHorn.position.y = 60;
	    this.leftHorn.position.z = 60;
	  
	    this.rightHorn = this.leftHorn.clone();
	    this.rightHorn.position.x = -25;
	  
	    this.mouth = new THREE.Mesh(spotGeom, this.blackMat);
	    this.mouth.scale.set(1,1,1);
	    this.mouth.position.y = -40;
	    this.mouth.position.z = 141;
	  
	    this.lips = new THREE.Mesh(spotGeom, this.pinkMat);
	    this.lips.scale.set(2,.5,1);
	    this.lips.position.y = -55;
	    this.lips.position.z = 140;
	  
	    this.ring1 = new THREE.Mesh(ringGeom, this.yellowMat);
	    this.ring1.position.y = 0;
	    this.ring1.position.z = 0;
	    this.ring1.rotation.x = -Math.PI/8;
	  
	    this.ring2 = new THREE.Mesh(ringGeom, this.orangeMat);
	    this.ring2.scale.set(1.3,1.3,1.3);
	    this.ring2.position.y = 0;
	    this.ring2.position.z = 25;
	    this.ring2.rotation.x = -Math.PI/8;
	  
	    this.ring3 = new THREE.Mesh(ringGeom, this.greenMat);
	    this.ring3.position.y = 0;
	    this.ring3.position.z = 50;
	    this.ring3.rotation.x = -Math.PI/8;
	  
	    this.ring4 = new THREE.Mesh(ringGeom2, this.yellowMat);
	    this.ring4.position.y = 80;
	    this.ring4.position.z = 100;
	    this.ring4.rotation.x = -Math.PI/2;
	  
	    this.leg1 = new THREE.Mesh(spotGeom, this.pinkMat);
	    this.leg1.position.x = -40;
	    this.leg1.position.y = -60;
	    this.leg1.position.z = -40;
	  
	    this.leg2 = this.leg1.clone();
	    this.leg2.position.x = 40;
	  
	    this.leg3 = this.leg1.clone();
	    this.leg3.position.z = 40;
	  
	    this.leg4 = this.leg3.clone();
	    this.leg4.position.x = 40;
	  
	    this.udder = new THREE.Mesh(spotGeom, this.pinkMat);
	    this.udder.scale.set(2,1,2);
	    this.udder.position.y = -55;
	    this.udder.position.z = -10;

	    this.wire = new THREE.Line(wireGeom, this.wireMat);
	    this.wire.position.z = 50;
	  
	    this.threegroup.add(this.body);
	    this.threegroup.add(this.spot1);
	    this.threegroup.add(this.spot2);
	    this.threegroup.add(this.spot3);
	    this.threegroup.add(this.spot4);
	    this.threegroup.add(this.tail);
	    this.threegroup.add(this.face);
	    this.threegroup.add(this.nostril1);
	    this.threegroup.add(this.nostril2);
	    this.threegroup.add(this.leftEye);
	    this.threegroup.add(this.rightEye);
	    this.threegroup.add(this.leftIris);
	    this.threegroup.add(this.rightIris);
	    this.threegroup.add(this.leftEar);
	    this.threegroup.add(this.rightEar);
	    this.threegroup.add(this.leftHorn);
	    this.threegroup.add(this.rightHorn);
	    this.threegroup.add(this.mouth);
	    this.threegroup.add(this.lips);
	    this.threegroup.add(this.ring1);
	    this.threegroup.add(this.ring2);
	    this.threegroup.add(this.ring3);
	    this.threegroup.add(this.ring4);
	    this.threegroup.add(this.leg1);
	    this.threegroup.add(this.leg2);
	    this.threegroup.add(this.leg3);
	    this.threegroup.add(this.leg4);
	    this.threegroup.add(this.udder);
	    this.threegroup.add(this.wire);
	  
	    this.threegroup.traverse( function ( object ) {
			if ( object instanceof THREE.Mesh ) {
				object.castShadow = true;
				object.receiveShadow = true;
			}
		} );
	}

	Cow.prototype.blink = function(){  
	    TweenMax.to(this.leftEye.scale, .3, {y:0, ease:Strong.easeInOut, yoyo:true, repeat:3});
	  
	    TweenMax.to(this.rightEye.scale, .3, {y:0, ease:Strong.easeInOut, yoyo:true, repeat:3});
	  
	    TweenMax.to(this.leftIris.scale, .3, {y:0, ease:Strong.easeInOut, yoyo:true, repeat:3});
	    TweenMax.to(this.rightIris.scale, .3, {y:0, ease:Strong.easeInOut, yoyo:true, repeat:3});
	}
	var angleLegs = 0;
	function loop(){
		angleLegs += .2;
		var sin = Math.sin(angleLegs);
		var cos = Math.cos(angleLegs);

		renderer.render(scene, camera);
		cow.threegroup.rotation.y +=0.01;

		cow.ring1.rotation.z += .005;
		cow.ring2.rotation.z -= .005;
		cow.ring3.rotation.z += .01;
		cow.ring4.rotation.z += .1;


		cow.leg1.position.z = -40 + cos*10;
		cow.leg2.position.z = -40 + sin*10;
		cow.leg3.position.z = 40 + sin*10;
		cow.leg4.position.z = 40 + cos*10;
		cow.threegroup.position.y = cos*10;

		cow.leftEar.position.y = cow.rightEar.position.y = 35 + Math.sin(angleLegs)*5;
		cow.mouth.position.y = -40 + sin*5;
		cow.mouth.scale.set(1, .5 + Math.abs(cos)*.5, 1);
		cow.lips.position.y = -50 + sin*5;
		cow.tail.rotation.x = sin;
		cow.udder.position.y = -55 + sin*10;
		cow.ring4.position.y = 80 + sin*10;
		requestAnimationFrame(loop);
	}

	init();
	createLights();
	createCows();
	loop();
	cow.blink();
	blinkInterval = setInterval(function(){
	  cow.blink();
	}, 4000);
}
/******************************************/
var cleargreenDemo = function(){
	document.getElementById('demo-container').innerHTML = "";
}
var animateForDemo = function(){
	var num = 280;
	var rotating = true;
	var camera, scene, renderer, group, controls;

	var objects = [];
	var targets = [];
	var icons=['wechat','exchange','cog','comments','cube','envelope','fax','eye','fire','gears',
			  'group','history','renren','image','info','fax','flash','camera','weibo','gift',
	          'crop','qrcode','plug','share','signal','sort','money','weixin','mobile','plane',
	          'plus','phone','music','pencil','sitemap','star','spinner','tags','tablet','tasks'];

	init();
	animate();

	function init() {
		var container = document.getElementById('demo-container');
		renderer = new THREE.CSS3DRenderer();
		renderer.setSize(container.offsetWidth,container.offsetHeight);
		container.appendChild(renderer.domElement);

		camera = new THREE.PerspectiveCamera( 40, container.offsetWidth/container.offsetHeight, 1, 7000 );
		camera.position.z = 4000;

		scene = new THREE.Scene();
		group = new THREE.Object3D();


		for ( var i = 0; i < num; i ++ ) {

			var element = document.createElement( 'div' );
			element.className = 'element';
			element.innerHTML='<i class="fa fa-'+icons[i%40]+'"></i>';

			var object = new THREE.CSS3DObject( element );
			object.position.x = Math.random() * 4000 - 2000;
			object.position.y = Math.random() * 4000 - 2000;
			object.position.z = Math.random() * 2000 - 2000;
			group.add( object );

			objects.push( object );
		}
		scene.add(group);

		// sphere
		var vector = new THREE.Vector3();

		for ( var i = 0, l = objects.length; i < l; i ++ ) {

			var phi = Math.acos( -1 + ( 2 * i ) / l );
			var theta = Math.sqrt( l * Math.PI ) * phi;

			var object = new THREE.Object3D();

			object.position.x = 800 * Math.cos( theta ) * Math.sin( phi );
			object.position.y = 800 * Math.sin( theta ) * Math.sin( phi );
			object.position.z = 800 * Math.cos( phi );

			vector.copy( object.position ).multiplyScalar( 2 );

			object.lookAt( vector );

			targets.push( object );

		}

		controls = new THREE.TrackballControls( camera, renderer.domElement );
		controls.rotateSpeed = 1;
		controls.minDistance = 500;
		controls.maxDistance = 6000;

		transform();
		console.log(group.position)

	}

	function transform() {
		var duration = 2000;

		TWEEN.removeAll();

		for ( var i = 0; i < objects.length; i ++ ) {

			var object = objects[ i ];
			var target = targets[ i ];

			new TWEEN.Tween( object.position )
				.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();

			new TWEEN.Tween( object.rotation )
				.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
				.easing( TWEEN.Easing.Exponential.InOut )
				.start();

		}

		new TWEEN.Tween( this )
			.to( {}, duration * 2 )
			.start();

	}

	function animate(){
		requestAnimationFrame(animate);
		if(rotating){
			group.rotation.y += 0.03;
		}
		TWEEN.update();
		controls.update();
		renderer.render(scene,camera);
	}
	document.getElementById('stop-animate').addEventListener('click',function(e){
		rotating = !rotating;
		if(rotating){
			e.target.innerHTML="暂停";
		}else{
			e.target.innerHTML="开始";
		}
	},false);
}
