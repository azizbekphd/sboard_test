import { Application } from './Application';


export class EventManager {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public initButtonClickEvents(): void {
        document.querySelector("#export-as-pdf")!.addEventListener("click", () => {
            this.app.skiaRenderer.exportToPDF(this.app.containersManager.containers);
        });

        document.querySelector("#generate-random-container")!.addEventListener("click", () => {
            this.app.addRandomContainer();
        });
    }
}
