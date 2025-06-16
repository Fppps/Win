// Widget.js

/**
 * @class Widget
 * @description A base class for creating custom UI widgets for applications.
 * Widgets are self-contained, reusable UI components.
 */
class Widget {
    /**
     * @property {string} id - A unique identifier for the widget instance.
     */
    id;

    /**
     * @property {HTMLElement|null} containerElement - The DOM element where the widget will be rendered.
     */
    containerElement = null;

    /**
     * @property {object} config - Configuration options for the widget.
     */
    config;

    /**
     * Creates an instance of Widget.
     * @param {string} id - A unique ID for this widget instance.
     * @param {object} config - Configuration object for the widget.
     * @param {string} [config.type='default'] - The type of widget (e.g., 'button', 'chart', 'data-display').
     * @param {string} [config.initialContent=''] - Initial HTML content or text for the widget.
     * @param {object} [config.styles={}] - CSS properties to apply to the widget's main element.
     * @param {string[]} [config.classes=[]] - Tailwind CSS classes to apply.
     * @param {function} [config.onClick=null] - Optional click handler for the widget.
     * @param {any} [data=null] - Initial data to be used by the widget.
     */
    constructor(id, config = {}, data = null) {
        if (!id) {
            console.error("Widget requires a unique ID.");
            throw new Error("Widget requires a unique ID.");
        }
        this.id = id;
        this.config = {
            type: 'default',
            initialContent: '',
            styles: {},
            classes: [],
            onClick: null,
            ...config
        };
        this.data = data; // Data property to hold dynamic data for the widget
    }

    /**
     * Renders the widget into a specified DOM element.
     * @param {HTMLElement} parentElement - The DOM element to append the widget to.
     * @returns {HTMLElement} The created widget element.
     */
    render(parentElement) {
        if (!parentElement || !(parentElement instanceof HTMLElement)) {
            console.error("Invalid parent element provided for widget rendering.");
            return null;
        }

        this.containerElement = document.createElement('div');
        this.containerElement.id = `widget-${this.id}`;
        this.containerElement.className = `widget ${this.config.classes.join(' ')}`;

        // Apply inline styles
        for (const [key, value] of Object.entries(this.config.styles)) {
            this.containerElement.style[key] = value;
        }

        // Set initial content
        this.containerElement.innerHTML = this.config.initialContent;

        // Attach click handler if provided
        if (typeof this.config.onClick === 'function') {
            this.containerElement.addEventListener('click', this.config.onClick);
        }

        parentElement.appendChild(this.containerElement);
        return this.containerElement;
    }

    /**
     * Updates the content or properties of the widget.
     * This method can be overridden by subclasses for specific update logic.
     * @param {string} newContent - The new HTML content for the widget.
     * @param {object} [newStyles={}] - New CSS styles to apply.
     * @param {string[]} [newClasses=[]] - New CSS classes to apply (replaces existing).
     * @param {any} [newData=null] - New data for the widget.
     */
    update(newContent = null, newStyles = {}, newClasses = [], newData = null) {
        if (!this.containerElement) {
            console.warn(`Widget with ID '${this.id}' has not been rendered yet.`);
            return;
        }

        if (newContent !== null) {
            this.containerElement.innerHTML = newContent;
        }

        // Update styles
        for (const [key, value] of Object.entries(newStyles)) {
            this.containerElement.style[key] = value;
        }

        // Update classes (replace existing ones managed by the widget)
        if (newClasses.length > 0) {
            this.containerElement.className = `widget ${newClasses.join(' ')}`;
        }

        if (newData !== null) {
            this.data = newData;
        }
    }

    /**
     * Removes the widget from the DOM and cleans up event listeners.
     */
    destroy() {
        if (this.containerElement) {
            if (typeof this.config.onClick === 'function') {
                this.containerElement.removeEventListener('click', this.config.onClick);
            }
            this.containerElement.remove();
            this.containerElement = null;
        }
    }
}