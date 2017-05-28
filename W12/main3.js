function main()
{
    var volume = new KVS.LobsterData();
    var screen = new KVS.THREEScreen();

    screen.init( volume, {
        width: window.innerWidth,
        height: window.innerHeight,
        enableAutoResize: false
    });

    var bounds = Bounds( volume );
    screen.scene.add( bounds );

    var light = new THREE.PointLight();
    light.position.set( 0, 0, 5 );
    screen.scene.add( light );

    var isovalue = 128;
    var surfaces = Isosurfaces( volume, isovalue );
    screen.scene.add( surfaces );

    var geometry = new THREE.Geometry();
    var material = new THREE.ShaderMaterial({
	vertexColors: THREE.VertexColors,              //色付け
	vertexShader: document.getElementById('phong.vert').text,   //vertexshader割り当て
	fragmentShader: document.getElementById('phong.frag').text,
	uniforms: {
	    light_position: {type: 'v3', value: light.position},
	    camera_position:{type: 'v3',value: screen.camera.position}
	}
    });
    
    
    //マウス
    document.addEventListener( 'mousemove', function() {
        screen.light.position.copy( screen.camera.position );
    });
    //リサイズ
    window.addEventListener( 'resize', function() {
        screen.resize( [ window.innerWidth, window.innerHeight ] );
    });
    screen.loop();
}
