// src/index.js

export default {
    // onLoad: function() {
    //     // This function is called once when the component is loaded
    //     console.log('My Element loaded!');
    // },

    // onPropsChanged: function(newProps, oldProps) {
    //     // This function is called when any component property changes
    //     console.log('Props changed:', newProps);
    // },

    render: function(props) {
        // This function is called to render the component's HTML
        // 'props' object contains all the properties defined in ww-config.js
        
        const element = document.createElement('div');
        element.textContent = 'Hello from My Element!'; // Basic text to show it's working
        
        // You can use the textColor property from ww-config.js
        if (props.textColor) {
            element.style.color = props.textColor;
        }

        return element; // You must return a DOM element
    },

    // onUnload: function() {
    //     // This function is called when the component is removed from the DOM
    //     console.log('My Element unloaded!');
    // }
};