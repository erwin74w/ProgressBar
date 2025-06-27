// ww-config.js

export default {
  id: 'your-workflow-progress-id', // <--- IMPORTANT: Change this to a unique ID for your component!
  name: 'Workflow Progress Indicator',
  version: '1.0.0',
  src: 'wwElement.vue', // <--- THIS IS THE KEY CHANGE IF IT WAS 'src/index.js'
                        // BASED ON YOUR SCREENSHOT, WEWEB IS LOOKING FOR THIS FILE
  category: 'custom',
  editor: {
    label: {
      en: "Workflow Progress",
    },
  },
  properties: {
    totalSteps: {
      label: { en: "Total Steps" },
      type: "Number",
      defaultValue: 5,
      options: { min: 1 },
    },
    currentStep: {
      label: { en: "Current Step" },
      type: "Number",
      defaultValue: 1,
      options: { min: 1 },
    },
    stepNames: {
      label: { en: "Step Names" },
      type: "Array",
      options: {
        item: { type: "String", defaultValue: "Untitled Step" },
      },
      defaultValue: ["Introduction", "Details", "Confirmation", "Review", "Completion"],
    },
    onStepClick: {
      label: { en: "On Completed Step Click" },
      type: "Action",
      options: { isEvent: true },
    },
  },
};