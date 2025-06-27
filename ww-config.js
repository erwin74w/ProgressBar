export default {
  // Add the 'category' property here, at the same level as 'editor' and 'properties'
  category: 'custom', // <--- ADD THIS LINE

  editor: {
    label: {
      en: "My Element", // Note: This will be the name shown in the Elements panel
    },
  },
  properties: {
    textColor: {
      label: {
        en: "Text color",
      },
      type: "Color",
      defaultValue: "#F23636",
    },
  },
};