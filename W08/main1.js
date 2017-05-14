function main1()
{
    var width = 500;
    var height = 500;

    var scene = new THREE.Scene();
    var scene2 = new THREE.Scene();


    var fov = 45;
    var aspect = width / height;
    var near = 1;
    var far = 1000;
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 5 );
    scene.add( camera );
    
    var camera2 = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera2.position.set( 0, 0, 5 );
    scene2.add( camera2 );

    var light = new THREE.PointLight();
    light.position.set( 5, 5, 5 );
    scene.add( light );
    scene2.add( light );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.TorusKnotGeometry( 1, 0.3, 100, 20 );
    //shaderを使うためのmaterial定義
    //shaderコードをmaterialに渡す
    var material = new THREE.ShaderMaterial({
        vertexColors: THREE.VertexColors,                             //色付け
        vertexShader: document.getElementById('gouraud.vert').text,    //vertexshader割り当て
        fragmentShader: document.getElementById('gouraud.frag').text,
	uniforms:{
	    light_position:{type: 'v3',value: light.position}
	}
    });

    var torus_knot = new THREE.Mesh( geometry, material );
    scene.add( torus_knot );
    scene2.add( torus_knot );


    loop();

    function loop()
    {
        requestAnimationFrame( loop );
        torus_knot.rotation.x += 0.01;
        torus_knot.rotation.y += 0.01;
	renderer.setViewport( 1, 1,   0.5 * width - 2, height - 2 );
        renderer.render( scene, camera );
	renderer.setViewport( 0.5 * width + 1, 1,   0.5 * width - 2, height - 2 );
        renderer.render( scene2, camera2 );

    }
}
