function main3()
{
    var width =  500;
    var height = 500;

    var scene = new THREE.Scene();

    var fov = 45;
    var aspect = width / height;
    var near = 1;
    var far = 1000;
    
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 5 );
    scene.add( camera );

    var light = new THREE.PointLight(0xffffff);
    light.position.set(1,1,10);
    scene.add(light);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    /*
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    //var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var material = new THREE.MeshLambertMaterial( { color: 0xffffff   } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    */

    var geometry = new THREE.TorusGeometry( 1, 0.3);
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var torus = new THREE.Mesh( geometry, material );
    scene.add( torus );

    var geometry1 = new THREE.BoxGeometry( 1, 1, 1 );
    //var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var material1 = new THREE.MeshLambertMaterial( { color: 0xffffff   } );
    var cube1 = new THREE.Mesh( geometry1, material1 );
    scene.add( cube );
    
    loop();

    function loop()
    {
        requestAnimationFrame( loop );
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.01;
	torus.rotation.z += 0.01;
	cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
	cube.rotation.z += 0.01;
        renderer.render( scene, camera );
    }
}
