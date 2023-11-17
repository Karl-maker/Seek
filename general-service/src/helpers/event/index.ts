/**
 * Represents an event handling interface for managing subscriptions and publications of events.
 */
export default interface IMessengerQueue {
    /**
     * Subscribe to events of a specific topic with a callback function.
     *
     * @param topic - The topic or event name to subscribe to.
     * @param action - A function to be called when the event is published, receiving a payload as an argument.
     */
    subscribe(topic: string, action: (payload: any) => void): void;

    /**
     * Publish an event to a specific topic with an optional payload.
     *
     * @param topic - The topic or event name to publish.
     * @param payload - Optional data to include with the event.
     */
    publish(topic: string, payload?: any): void;

    /**
     * Unsubscribe from events of a specific topic with a callback function.
     *
     * @param topic - The topic or event name to unsubscribe from.
     * @param action - The callback function to remove as a subscriber.
     */
    unsubscribe(topic: string, action: (payload: any) => void): void;

    /**
     * Check if there are active subscribers for a specific event topic.
     *
     * @param topic - The topic or event name to check for active subscribers.
     * @returns True if there are active subscribers; otherwise, false.
     */
    hasSubscribers(topic: string): boolean;
}
