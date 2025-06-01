const fs = require('fs');

const filePath = 'stories/ObsScore.stories.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Convert all story definitions
const stories = [
  'DualDarkColor', 'DualDarkMono', 'DualLightColor', 'DualLightMono', 'DualGradient',
  'SingleDarkColor', 'SingleDarkMono', 'SingleLightColor', 'SingleLightMono', 'SingleBeige',
  'SolidDarkColor', 'SolidDarkMono', 'SolidLightColor', 'SolidLightMono', 'SolidBeige',
  'SimpleWhite', 'SimpleBlack'
];

stories.forEach(storyName => {
  const pattern = new RegExp(
    `export const ${storyName} = Template\\.bind\\(\\{\\}\\)\\n${storyName}\\.args = \\{`,
    'g'
  );
  
  content = content.replace(pattern, `export const ${storyName}: Story = {\n  args: {`);
});

// Add closing braces for all stories
content = content.replace(/  })(),\n\}/g, '  })(),\n  },\n}');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed ObsScore.stories.tsx');