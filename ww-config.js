export default {
  id: 'erwin74w-progressbar',     // Your UNIQUE Component ID
  name: 'My Custom Progressbar',
  version: '1.0.0',
  src: 'src/index.js',           // <--- ENSURE THIS IS CORRECT AND MATCHES YOUR NEW FILE

  category: 'custom',

  editor: {
    label: {
      en: "My Element", // This is what you will search for
    },
  },
  properties: {
    textColor: {
      label: { en: "Text color" },
      type: "Color",
      defaultValue: "#F23636",
    },
    // Add any other properties for your progress bar logic here
  },
};