import IMessengerQueue from "..";
import { EventEmitter } from 'events';

/**
 * A Node.js event handler that implements the IEvent interface.
 */
class NodeEvent implements IMessengerQueue {
    private emitter: EventEmitter;  // The EventEmitter instance for event management.

    /**
     * Creates a new NodeEvent instance.
     */
    constructor() {
        this.emitter = new EventEmitter();
    }

    /**
     * Subscribe to events of a specific topic with a callback function.
     *
     * @param topic - The topic or event name to subscribe to.
     * @param action - A function to be called when the event is published, receiving a payload as an argument.
     */
    subscribe(topic: string, action: (payload: any) => void): void {
        this.emitter.on(topic, action);
    }

    /**
     * Publish an event to a specific topic with an optional payload.
     *
     * @param topic - The topic or event name to publish.
     * @param payload - Optional data to include with the event.
     */
    publish(topic: string, payload?: any): void {
        this.emitter.emit(topic, payload);
    }

    /**
     * Unsubscribe from events of a specific topic with a callback function.
     *
     * @param topic - The topic or event name to unsubscribe from.
     * @param action - The callback function to remove as a subscriber.
     */
    unsubscribe(topic: string, action: (payload: any) => void): void {
        this.emitter.removeListener(topic, action);
    }

    /**
     * Check if there are active subscribers for a specific event topic.
     *
     * @param topic - The topic or event name to check for active subscribers.
     * @returns True if there are active subscribers; otherwise, false.
     */
    hasSubscribers(topic: string): boolean {
        return this.emitter.listenerCount(topic) > 0;
    }
}

export default new NodeEvent();  // Export a singleton instance of NodeEvent.
