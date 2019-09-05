import {
    Manager
} from 'common/core/manager';

export const init = container => {
    const manager = new Manager();
    const scene = manager.new(container, 'scene');
    const root = scene.root();
    const Rect = scene.factory().Rect;

    const rects = new Array(100).fill(null).map((value, index) => {

        const rect = new Rect()
            .width(1.0)
            .height(4.0)
            .rotate(90)
            .translate(index % 10 * 2 - 10, index  % 5 - 10)
        root
            .append(rect)
        return rect;
    })
    
    window.addEventListener('resize', function(event) {
        scene.resize();
    });
    
    scene.render();
    

    let a = 0;
    setInterval(() => {
        a += 0.001;
        rects.map((rect, index) => {
            rect
               .translate(index % 10 * 2 - 10 + Math.sin(a * 100),  index  / 3 - 10 +  Math.cos(a * 100))
                .rotate(Math.sin(a)*1000)
        })
    }, 1000 / 60)
    
    scene.start();
}
