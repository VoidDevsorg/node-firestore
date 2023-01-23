import { getFirestore } from '@firebase/firestore';
import { EventEmitter } from 'events';
import { Schema } from './Schema';

export class Firestore extends EventEmitter {
    app: any;
    Schema: any;
    database: any;

    constructor(app?: any, options?: any) {
        super();
        if (!app) throw new Error("App is required.");
        
        this.app = app;
        this.Schema = Schema;
        this.database = getFirestore(app);

        if (options?.alwaysOn) {
            setInterval(() => {
                this.emit("ping", "Pong!");
            }, 1000 * 60 * 5);
        }

        return this;
    }
}