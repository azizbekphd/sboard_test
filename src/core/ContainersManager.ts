import * as PIXI from 'pixi.js-legacy';


class ContainersManager {
    private containers: Array<PIXI.Container> = [];

    public addContainer(container: PIXI.Container): void {
        this.containers.push(container);
    }

    public removeContainer(container: PIXI.Container): void {
        this.containers.splice(this.containers.indexOf(container), 1);
    }

    public getContainers(): Array<PIXI.Container> {
        return this.containers;
    }
}

export default ContainersManager;
