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


    //GUIパラメータの準備
    var sampleSquare = function()
    {
	this.color = "#ff0000";
	this.isovalue = 128;
	this.apply = function()
	{
	    screen.scene.remove( surfaces );
	    surfaces = Isosurfaces( volume, isovalue, Color );
	    screen.scene.add( surfaces );
	}
	this.Lambertian = function()
	{
	    screen.scene.remove( light );
	}
	this.Phong = function()
	{
	    screen.scene.add( light );
	    
	    var geometry = new THREE.Geometry();
	    var material = new THREE.ShaderMaterial({
		vertexColors: THREE.VertexColors,
		vertexShader: document.getElementById('gouraud2.vert').text,
		fragmentShader: document.getElementById('gouraud2.frag').text,
		uniforms:
		{
		    light_position: {type: 'v3', value: light.position}
		}
	    });
	}
	this.Box = true;
    };
    
    
    //GUI表示
    window.onload = function()
    {
	square = new sampleSquare();
	var gui = new dat.GUI();
	gui.addColor(square, 'color').onChange(setValue);
	gui.add(square, 'isovalue', 0, 255).step(1).onChange(setValue);
	gui.add(square, 'apply');
	gui.add(square, 'Lambertian');
	gui.add(square, 'Phong');
	gui.add(square, 'Box').onChange(setValue);
    };

    
//設定更新処理
	function setValue()
	{
	    isovalue = square.isovalue;
	    Color = square.color;
	    
	    if(square.Box) {
		screen.scene.add( bounds );
	    }
	    else {
		screen.scene.remove( bounds );
	    }
	}
    
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
