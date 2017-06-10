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
	/* 枠 */
	var bounds = Bounds( volume );
	//screen.scene.add( bounds );

	var light = new THREE.PointLight();
	light.position.set( 0, 0, 5 );
	
	var Color = "#ff0000";
	
	var isovalue;
	isovalue = 128;

	var shadeflag;
	shadeflag=1;

	//var geometry=new THREE.Geometry();
	//var material =new THREE.MeshLambertMaterial();
	
	//IsosurfacesではTHREE.Mesh(material,geometry)が帰ってきている
	var surfaces = Isosurfaces( volume, isovalue, Color,shadeflag);
	screen.scene.add( surfaces );

	//GUIパラメータの準備
	var newPara = function()
	{
	    this.color = "#ff0000";
	    this.isovalue = 128;

	    //Basicボタン
	    this.Basic = function()
	    {
		shadeflag=1;
	    }

	    //Lambertボタン
	    this.Lambert = function()
	    {
		shadeflag=2;
	    }

	    //Phongボタン
	    this.Phong = function()
	    {
		shadeflag=3;
	    }

	    //Applyボタン
	    this.Apply = function()
	    {
		screen.scene.remove( surfaces );
		surfaces = Isosurfaces( volume, isovalue, Color,shadeflag);
		screen.scene.add( surfaces );
	    }

	    this.light = false;

	    //枠のチェック
	    this.Box = false;

	};
	
	//GUI表示
	window.onload = function()
	{
	    Para = new newPara();
	    var gui = new dat.GUI();
	    gui.addColor(Para, 'color').onChange(setValue);
	    gui.add(Para, 'isovalue', 0, 255).step(1).onChange(setValue);  //変更時のイベントonChange
	    gui.add(Para, 'Basic' );
            gui.add(Para, 'Lambert' );
	    gui.add(Para, 'Phong' );
	    gui.add(Para, 'Apply');
	    gui.add(Para, 'light').onChange(setValue);
	    gui.add(Para, 'Box').onChange(setValue);
	   
	};
		
	//変更時の処理
	function setValue()
	{
	    //isovalue値
	    isovalue = Para.isovalue;
	    //color値
	    Color = Para.color;

	    if(Para.light)
	    {
		screen.scene.add( light );
	    }
	    else {
		screen.scene.remove( light );
	    }

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
