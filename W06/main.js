function main()
{
    var width = 500;
    var height = 500;

    //描画する空間全体scene
    var scene = new THREE.Scene();

    //camera設定
    var fov = 45;
    var aspect = width / height;
    var near = 1;
    var far = 1000;
    
    //camera2種類Orthographic or Perspective
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 5 );  //cameraの位置
    scene.add( camera );             //cameraを追加

    //描画のためのクラスrenderer
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement ); //ウェブページのbodyにrendererのdomElementを追加

    //Objectの構成
    var vertices = [ [-1,1,0],[-1,-1,0],[1,-1,0]]; //v0,v1,v2
    var faces = [ [0,1,2] ];                       //f0:v0,v1,v2
    
    var v0 = new THREE.Vector3().fromArray(vertices[0]);
    var v1 = new THREE.Vector3().fromArray(vertices[1]);
    var v2 = new THREE.Vector3().fromArray(vertices[2]);
    var id = faces[0];
    var f0 = new THREE.Face3(id[0],id[1],id[2]);
    
    var geometry = new THREE.Geometry();
    geometry.vertices.push(v0);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.faces.push(f0);
    
    var material = new THREE.MeshBasicMaterial();
    material.vertexColors = THREE.FaceColors;
    geometry.faces[0].color = new THREE.Color(1,0,0);
    

    //
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    loop();

    //動き
    function loop()
    {
        requestAnimationFrame( loop );  // 関数を呼び続ける おまじないみたいなもの
        cube.rotation.x += 0.001;       // 回転
        cube.rotation.y += 0.001;
        renderer.render( scene, camera );
    }
}
