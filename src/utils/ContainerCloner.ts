import * as PIXI from 'pixi.js-legacy';


/**
 * Clones a PIXI.Container to use in another PIXI.Application instance.
 */
export default class ContainerCloner {
    /**
     * Clones a PIXI.Container.
     * @param container - The container to clone.
     * @returns A cloned container.
     */
    static cloneContainer(container: PIXI.Container): PIXI.Container {
        if (container instanceof PIXI.Sprite) {
            const clone = new PIXI.Sprite(container.texture);
            ContainerCloner.copyTransform(container, clone);
            ContainerCloner.copyListeners(container, clone);
            return clone;
        } else if (container instanceof PIXI.Graphics) {
            const clone = container.clone();
            ContainerCloner.copyTransform(container, clone);
            ContainerCloner.copyListeners(container, clone);
            return clone;
        } else if (container instanceof PIXI.Container) {
            const clone = new PIXI.Container();
            for (const child of container.children ?? []) {
                clone.addChild(ContainerCloner.cloneContainer(child as PIXI.Container));
            }
            ContainerCloner.copyTransform(container, clone);
            ContainerCloner.copyListeners(container, clone);
            return clone;
        }
        return container;
    }

    /**
     * Copies listeners from one container to another.
     * @param container - The source container.
     * @param clonedContainer - The destination container.
     * @param eventsToClone - The events to copy.
     */
    static copyListeners(container: PIXI.Container, clonedContainer: PIXI.Container, eventsToClone: string[] = ['pointerdown', 'pointerup']): void {
        for (const event of eventsToClone) {
            if (container.listeners(event)) {
                for (const listener of container.listeners(event)) {
                    clonedContainer.on(event, listener);
                }
            }
        }
    }

    /**
     * Copies the transform from one container to another.
     * @param container - The source container.
     * @param clonedContainer - The destination container.
     */
    static copyTransform(container: PIXI.Container, clonedContainer: PIXI.Container): void {
        clonedContainer.scale.set(container.scale.x, container.scale.y);
        clonedContainer.pivot.set(container.pivot.x, container.pivot.y);
        clonedContainer.angle = container.angle;
        clonedContainer.position.set(container.position.x, container.position.y);
        if (clonedContainer instanceof PIXI.Sprite && container instanceof PIXI.Sprite) {
            clonedContainer.anchor.set(container.anchor.x, container.anchor.y);
        }
    }
}
