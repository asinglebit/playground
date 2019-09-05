import {
    Manager
} from 'common/core/manager';

export const init = container => {
    const manager = new Manager();
    const scene = manager.new(container, 'scene');
    const root = scene.root();
    const Rect = scene.factory().Rect;
    const rect = new Rect();
    
    window.addEventListener('resize', function(event) {
        scene.resize();
    });
    
    scene.render();
    
    rect
        .pivot(0, 0)
        .width(100)
        .height(100);

    let a = 0;
    setInterval(() => {
        a += 0.01;
        rect.translate(Math.sin(a)*10, Math.cos(a)*10)
    }, 1000 / 60)
    
    root
        .append(rect);
    
    scene.start();
}
