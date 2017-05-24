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

    var isovalue = 128;
    var surfaces = Isosurfaces( volume, isovalue );
    screen.scene.add( surfaces );

    document.addEventListener( 'mousemove', function() {
        screen.light.position.copy( screen.camera.position );
    });

    window.addEventListener( 'resize', function() {
        screen.resize( [ window.innerWidth, window.innerHeight ] );
    });


    // Create color map
    var RESOLUTION = 256;//resolution
    var cmap = [];
    for ( var i = 0; i < RESOLUTION; i++ )
    {
	var S = i / (RESOLUTION-1); // [0,1]
	var R = Math.max( Math.cos( ( S - 1.0 ) * Math.PI ), 0.0 );
	var G = Math.max( Math.cos( ( S - 0.5 ) * Math.PI ), 0.0 );
	var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
	var color = new THREE.Color( R, G, B );
	cmap.push( [ S, '0x' + color.getHexString() ] );
    }
    
    // Draw color map
    var lut = new THREE.Lut( 'rainbow', cmap.length );
    lut.addColorMap( 'mycolormap', cmap );
    lut.changeColorMap( 'mycolormap' );
    screen.scene.add( lut.setLegendOn( {
        'layout':'horizontal',
        'position': { 'x': 0.6, 'y': -1.1, 'z': 2 },
        'dimensions': { 'width': 0.15, 'height': 1.2 }
    } ) );

    var nfaces = faces.length;
    // Assign colors for each vertex
    material.vertexColors = THREE.VertexColors;
    var S_max = Math.max.apply(null,scalars);
    var S_min = Math.min.apply(null,scalars);
    for ( var i = 0; i < nfaces; i++ )
    {
	var id = faces[i];
	var S0 = scalars[ id[0] ];
	var S1 = scalars[ id[1] ];
	var S2 = scalars[ id[2] ];
	var C0 = GetColor(S0,S_min,S_max,cmap); 
	var C1 = GetColor(S1,S_min,S_max,cmap); 
	var C2 = GetColor(S2,S_min,S_max,cmap); 
	geometry.faces[i].vertexColors.push( C0 );
	geometry.faces[i].vertexColors.push( C1 );
	geometry.faces[i].vertexColors.push( C2 );
    }
    
    screen.loop();
    
    
    function GetColor(S,S_min,S_max,cmap){
	var resolution = cmap.length
	var index = Normalize(S,S_min,S_max)*(resolution-1);
	var index0 = Math.floor(index);
	var index1 = Math.min(index0+1,resolution-1);
	var t = index - index0; // t = (index-index0)/(index1-index0)
	var C0 = new THREE.Color().setHex( cmap[ index0 ][1] );
	var C1 = new THREE.Color().setHex( cmap[ index1 ][1] );
	var R = Interpolate(C0.r,C1.r,t);
	var G = Interpolate(C0.g,C1.g,t);
	var B = Interpolate(C0.b,C1.b,t);
	return new THREE.Color(R,G,B);
    }
    
    function Normalize(S,S_min,S_max){ // e.g. S:0.1~0.8 -> S:0~1
	return (S-S_min)/(S_max-S_min);
    }
    
    function Interpolate(S0,S1,t){ 
	return (1-t)*S0+t*S1;
    }
}
