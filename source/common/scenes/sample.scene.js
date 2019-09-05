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
        .at(250, 0)
        .pivot(250, 0)
        .width(100)
        .height(100);
    
    root
        .append(rect);
    
    scene.start();
}
