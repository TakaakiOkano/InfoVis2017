function main()
{
  var width = 500;
  var height = 500;

  var scene = new THREE.Scene();

  var fov = 45;
  var aspect = width / height;
  var near = 1;
  var far = 1000;
  var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  camera.position.set( 0, 0, 5 );
  scene.add( camera );

  var light = new THREE.PointLight();
  light.position.set( 5, 5, 5 );
  scene.add( light );

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( width, height );
  document.body.appendChild( renderer.domElement );

  var vertices = [
    [ -1,  1, 0 ], // 0
    [ -1, -1, 0 ], // 1
    [  1, -1, 0 ]  // 2
  ];

  var faces = [
    [ 0, 1, 2 ], // f0
  ];

  var scalars = [
    0.1,   // S0
    0.2, // S1
    0.8  // S2
  ];


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
  scene.add( lut.setLegendOn( {
        'layout':'horizontal',
        'position': { 'x': 0.6, 'y': -1.1, 'z': 2 },
        'dimensions': { 'width': 0.15, 'height': 1.2 }
        } ) );

  var geometry = new THREE.Geometry();
  var material = new THREE.MeshBasicMaterial();

  var nvertices = vertices.length;
  for ( var i = 0; i < nvertices; i++ )
  {
    var vertex = new THREE.Vector3().fromArray( vertices[i] );
    geometry.vertices.push( vertex );
  }

  var nfaces = faces.length;
  for ( var i = 0; i < nfaces; i++ )
  {
    var id = faces[i];
    var face = new THREE.Face3( id[0], id[1], id[2] );
    geometry.faces.push( face );
  }

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

  var triangle = new THREE.Mesh( geometry, material );
  scene.add( triangle );

  loop();

  function loop()
  {
    requestAnimationFrame( loop );
    renderer.render( scene, camera );
  }

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
