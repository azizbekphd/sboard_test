import * as PIXI from 'pixi.js-legacy';


class ContainersManager {
    public selectedContainer: number = 0;
    public containers: Array<PIXI.Container> = [];

    public addContainer(container: PIXI.Container): void {
        this.containers.push(container);
    }

    public removeContainer(index: number): void {
        this.containers.splice(index, 1);
    }

    public setSelectedContainer(index: number): void {
        this.selectedContainer = index;
    }

    public getSelectedContainer(): PIXI.Container | null {
        return this.containers[this.selectedContainer];
    }

    public setSelectedContainerToLast(): void {
        this.selectedContainer = this.containers.length - 1;
    }
}

export default ContainersManager;
