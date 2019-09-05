import {
    Manager
} from 'common/core/manager';

export const init = container => {
    const manager = new Manager();
    const scene = manager.new(container, 'scene');
    const root = scene.root();
    const Rect = scene.factory().Rect;
    const rect = new Rect();
    const rect2 = new Rect();
    
    window.addEventListener('resize', function(event) {
        scene.resize();
    });
    
    scene.render();
    
    rect
        .pivot(0, 0)
        .width(300)
        .height(100);
    rect2
        .pivot(0, 0)
        .width(300)
        .height(100);

    let a = 0;
    setInterval(() => {
        a += 0.01;
        rect
            .translate(Math.sin(a)*10, Math.cos(a)*10)
            .rotate(Math.sin(a)*1000)
        rect2
            .translate(Math.cos(a)*10, Math.sin(a)*10)
            .rotate(Math.sin(a)*1000)
    }, 1000 / 60)
    
    root
        .append(rect)
        .append(rect2);
    
    scene.start();
    console.log(root)
}
