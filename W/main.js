function main()
{
    var volume = new KVS.LobsterData();
    var screen = new KVS.THREEScreen();

    screen.init( volume, {
        width: window.innerWidth,
        height: window.innerHeight,
        enableAutoResize: false
    });

    setup();

    screen.loop();
    
    function setup()
    {
	var bounds = Bounds( volume );
	//screen.scene.add( bounds );
	
	var light = new THREE.PointLight();
	light.position.set( 0, 0, 5 );
	
	var Color = "#ff0000";
	
	var isovalue;
	isovalue = 128;

	//var geometry=new THREE.Geometry();
	//var material =new THREE.MeshLambertMaterial();
	
	//IsosurfacesではTHREE.Mesh(Material,Geometry)が帰ってきている
	var surfaces = Isosurfaces( volume, isovalue, Color );
	screen.scene.add( surfaces );

	//GUIパラメータの準備
	var newPara = function()
	{
	    this.color = "#ff0000";
	    this.isovalue = 128;
	   
	    //Lambertianボタン
	    this.Lambertian = function()
	    {
		screen.scene.remove( light );
	    }

	    //Phongボタン
	    this.Phong = function()
	    {
		//ライトを消してつけているだけ
		screen.scene.add( light );
		//var geometry = new THREE.Geometry();
		var geometry = new THREE.Geometry();
		var material = new THREE.ShaderMaterial({
		    vertexColors: THREE.VertexColors,
		    vertexShader: document.getElementById('phong.vert').text,
		    fragmentShader: document.getElementById('phong.frag').text,
		    uniforms:
		    {
			light_position: {type: 'v3', value: light.position},
			camera_position:{type: 'v3', value: screen.camera.position}
		    }
		});
		//volume = new THREE.Mesh(geometry, material)
	    }
/*
	    this.Toon = function()
	    {
		screen.scene.add( light );
		
		var geometry = new THREE.Geometry();
		var material = new THREE.ShaderMaterial({
		    vertexColors: THREE.VertexColors,
		    vertexShader: document.getElementById('phong2.vert').text,
		    fragmentShader: document.getElementById('phong2.frag').text,
		    uniforms:
		    {
			light_position: {type: 'v3', value: light.position},
			camera_position:{type: 'v3', value: screen.camera.position}
		    }
		});


	    }

*/
	    //枠のチェック
	    this.Box = false;

	    //Applyボタン
	    this.Apply = function()
	    {
		screen.scene.remove( surfaces );
		surfaces = Isosurfaces( volume, isovalue, Color );
		screen.scene.add( surfaces );
	    }

	    this.Reset = function()
	    {
		this.color = "#ff0000";
		this.isovalue = 128;
		this.Box = false;
		screen.scene.remove( surfaces );
		surfaces = Isosurfaces( volume, isovalue, Color );
		screen.scene.add( surfaces );
		screen.scene.remove( light );
	    }
	};
	
	//GUI表示
	window.onload = function()
	{
	    Para = new newPara();
	    var gui = new dat.GUI();
	    gui.addColor(Para, 'color').onChange(setValue);
	    gui.add(Para, 'isovalue', 0, 255).step(1).onChange(setValue);  //変更時のイベントonChange
	    //gui.add(Para, 'isovalue', 0, 255).onChange(setValue);
	    gui.add(Para, 'Lambertian');
	    gui.add(Para, 'Phong');
	    //gui.add(Para, 'Toon');
	    gui.add(Para, 'Box').onChange(setValue);
	    gui.add(Para, 'Apply');
	    gui.add(Para, 'Reset');
	};
		
	//変更時の処理
	function setValue()
	{
	    //isovalue値
	    isovalue = Para.isovalue;
	    //color値
	    Color = Para.color;

	    if(Para.Box)
	    {
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
	
    }
}
