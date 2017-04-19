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
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );  //BoxGeometryはCubeデータ 1辺1
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff } ); //color,shading

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
