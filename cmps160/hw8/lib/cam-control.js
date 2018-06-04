/**
 * 
 * @param {PerspectiveCamera} camera 
 * @param {HTMLCanvasElement} canvas
 */
function setupCamera(camera, canvas) {
    let buttonDown = [undefined, undefined, undefined];
    canvas.addEventListener('mousedown', function (ev) {
        buttonDown[ev.button] = [ev.clientX, ev.clientY];
    })
    canvas.addEventListener('mousemove', function (ev) {
        if (buttonDown[0]) {
            const dx = ev.clientX - buttonDown[0][0];
            const dy = ev.clientY - buttonDown[0][1];
            camera.rotate(dx / 10.0, 0, 1, 0);
            camera.rotate(dy / 10.0, 1, 0, 0);
            buttonDown[0][0] = ev.clientX;
            buttonDown[0][1] = ev.clientY;
        }
    })
    canvas.addEventListener('mouseup', function (ev) {
        buttonDown[ev.button] = undefined;
    })

    document.addEventListener('keydown', function (ev) {
        let dir;
        dir = new Vector3(camera.center.elements);
        dir.sub(camera.position).normalize().mul(1);

        switch (ev.key) {
            case 'w':
                break;
            case 'a':
                dir = new Matrix4().setRotate(90, 0, 1, 0).multiplyVector3(dir); // right
                break;
            case 's':
                dir = new Matrix4().setRotate(180, 0, 1, 0).multiplyVector3(dir); // back
                break;
            case 'd':
                dir = new Matrix4().setRotate(-90, 0, 1, 0).multiplyVector3(dir); // left
                break;
            default: return;
        }
        camera.position.add(dir);
        camera.center.add(dir);
    })
}