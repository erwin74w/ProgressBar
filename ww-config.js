// ww-config.js

export default {
  id: 'your-workflow-progress-id', // <--- IMPORTANT: Change this to a unique ID for your component!
  name: 'Workflow Progress Indicator',
  version: '1.0.0',
  src: 'src/index.js',
  category: 'custom', // This places it under "Custom Components" in WeWeb Studio
  editor: {
    label: {
      en: "Workflow Progress", // This is the name you'll see in the WeWeb Studio Elements panel
    },
    // You can add an icon here if you like, e.g.:
    // icon: 'fontawesome/solid/tasks',
  },
  properties: {
    // 1. Total Number of Steps
    totalSteps: {
      label: { en: "Total Steps" },
      type: "Number", // It's a numerical value
      defaultValue: 5, // A reasonable default
      options: {
        min: 1, // Ensure at least one step
      },
    },
    // 2. Current Step
    currentStep: {
      label: { en: "Current Step" },
      type: "Number",
      defaultValue: 1, // Start at the first step
      options: {
        min: 1,
      },
    },
    // 3. Step Names (Array of Strings)
    stepNames: {
      label: { en: "Step Names" },
      type: "Array", // This will be an array
      options: {
        item: {
          type: "String", // Each item in the array is a string
          defaultValue: "Untitled Step",
        },
      },
      defaultValue: [
        "Introduction",
        "Details",
        "Confirmation",
        "Review",
        "Completion"
      ], // Example names
    },
    // 4. Action for Clicking a Completed Step
    onStepClick: {
      label: { en: "On Completed Step Click" },
      type: "Action", // 'Action' type is used for events/workflows in WeWeb
      options: {
        isEvent: true, // Mark this as an event property
      },
      // You might want to define default parameters for the action if needed, e.g.,
      // defaultValue: { name: 'onStepClick', parameters: [{ name: 'stepName', type: 'String' }] },
    },
  },
};