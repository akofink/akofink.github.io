// Bio: existing site plus operator-confirmed employer/team/office, November 7, 2026.
// Project claims: public READMEs only. See SOURCES.md for provenance and boundaries.
export const person = {
  name: 'Andrew Kofink',
  first: 'Andrew',
  role: 'Software engineer',
  location: 'New York City',
  intro: 'Software engineer. City dweller. Endlessly curious.',
  origin: 'I grew up on the coast of North Carolina, near Emerald Isle. I studied at North Carolina State University before moving to New York City.',
  home: 'I live in Hell’s Kitchen, close to the opera and ballet performances I love. Away from the screen, I enjoy cycling, cooking, gardening, and finding good food.',
  work: 'I’m a software engineer at Atlassian, working on Bitbucket Cloud in the NYC office. My background is in electrical engineering, and my interests reach across climate change, space exploration, and electronics.',
  hello: 'I enjoy tech events around the city, on topics from Kubernetes to Go. If our paths cross, feel free to say hi.',
  interests: ['Opera & ballet', 'Cycling', 'Cooking', 'Gardening', 'Science & engineering'],
  links: [
    ['Email', 'mailto:ajkofink@gmail.com'],
    ['GitHub', 'https://github.com/akofink'],
    ['Instagram', 'https://instagram.com/akofink']
  ],
  education: ['North Carolina State University', 'https://www.ncsu.edu/']
};
export const projects = [
  {
    id: 'dots', title: 'A setup worth sharing', name: 'dots', status: 'Public setup',
    description: 'My dotfiles bring shell, editor, tmux, and coding-agent setup together. Public installers connect shared agent instructions and skills to each tool; a separate private notes repository holds my personal context.',
    idea: 'Keep reusable setup public and personal context separate. Start with one module rather than adopting someone else’s whole environment.',
    source: 'https://github.com/akofink/dots', action: 'Explore the setup',
    extra: ['Module guide', 'https://github.com/akofink/dots#modules']
  },
  {
    id: 'akagent', title: 'Work that survives a session', name: 'akagent-cli', status: 'Developer tool',
    description: 'A local-first registry and CLI for coding-agent tasks, observations, and recovery. It keeps durable records while Git, tmux, and provider tools remain responsible for their own actions.',
    idea: 'Separate the record of work from the tools that do it. Explicit task identity and acknowledgments make handoffs easier to reason about.',
    source: 'https://github.com/akofink/akagent-cli', action: 'Read the source',
    extra: ['Quick start', 'https://github.com/akofink/akagent-cli/blob/main/docs/quick-start.md']
  },
  {
    id: 'live-staff', title: 'See the note you play', name: 'Live Staff', status: 'Personal preview',
    description: 'A browser app that turns one sustained instrument or voice into live notation. Microphone audio is analyzed locally, not uploaded. The monophonic detector is a proof of concept and can pick the wrong octave.',
    idea: 'A useful music tool can be local-first: keep audio on the device, show the signal clearly, and make the detector’s limits explicit.',
    source: 'https://github.com/akofink/live-staff', action: 'Read the source',
    extra: ['Try Live Staff', 'https://live-staff.akofink.com/']
  },
  {
    id: 'tinderbox', title: 'A world to play with', name: 'Tinderbox', status: 'Game experiment',
    description: 'A falling-element sandbox where fire, wind, rain, and living systems reshape a world. Paint materials, tune rules, and see what happens. It builds on ideas explored in Cascade.',
    idea: 'Expose the rules and let curiosity drive the interaction. A small simulation becomes a place to experiment, not just something to watch.',
    source: 'https://github.com/akofink/tinderbox', action: 'Explore the code',
    extra: ['Play in the browser', 'https://akofink.com/tinderbox/']
  },
  {
    id: 'cascade', title: 'What happens under overload?', name: 'Cascade', status: 'Simulation experiment',
    description: 'A Rust cellular sandbox exploring a fixed work budget per update. Under the bounded policy, extra work waits instead of all running at once; a traditional comparison policy deliberately permits stalls.',
    idea: 'Make overload an explicit design choice. Compare bounded and unbounded work, and show the backlog rather than hiding the tradeoff.',
    source: 'https://github.com/akofink/cascade-game-demo', action: 'Explore the code',
    extra: ['Read the experiment', 'https://akofink.com/cascade-game-demo/']
  }
];
export const designs = [
  {id:'01-editorial', name:'The Sunday edition', type:'Editorial / portrait', description:'A generous serif masthead, a candid portrait, and quiet newspaper columns. A personal introduction that rewards reading.', tradeoff:'Warm and readable; the portrait sets the tone.', palette:['#f1eee6','#242722','#a24a30']},
  {id:'02-botanical', name:'A little room to grow', type:'Organic / illustrated', description:'Deep garden green, a hand-drawn botanical plate, and gently asymmetric sections. The interests lead, not the résumé.', tradeoff:'Expressive without needing a new photograph.', palette:['#183f35','#e5edcf','#d4a461']},
  {id:'03-city-grid', name:'At the intersection', type:'Urban / modular', description:'A city-block grid with bold wayfinding, compact biography, and an oversized identity. A life composed of many neighborhoods.', tradeoff:'Fast to scan; more graphic than intimate.', palette:['#e9edee','#172832','#c5ec51']},
  {id:'04-terminal', name:'Hello, world outside', type:'Technical / interactive', description:'A dark, monospace personal directory. Real expandable interest entries add discovery without pretending to be a command line.', tradeoff:'Distinct developer character; less formal.', palette:['#121b20','#c5e1ce','#eabf79']},
  {id:'05-program', name:'An evening with Andrew', type:'Cultural / theatrical', description:'A concert-program composition in oxblood and ivory. An elegant title page gives way to three acts: origins, work, and life.', tradeoff:'Ceremonial and typographic; deliberately unhurried.', palette:['#481c2b','#f5eade','#be915e']},
  {id:'06-coastal', name:'From the coast, to the city', type:'Airy / landscape', description:'A wide horizon, open blue space, and a flowing origin-to-present narrative. Coastal roots without stock travel photography.', tradeoff:'Calm and spacious; less information above the fold.', palette:['#e8f2f5','#154763','#df8f60']},
  {id:'07-field-notes', name:'Notes from a curious life', type:'Tactile / scrapbook', description:'An annotated portrait, ruled-paper biography, and small interest cards. Personal and collected, rather than professionally packaged.', tradeoff:'Friendly and detailed; intentionally less minimal.', palette:['#e5dfce','#293e56','#a2422c']},
  {id:'08-swiss', name:'Many interests. One Andrew.', type:'Swiss / poster', description:'Vermilion, huge sans-serif type, strict rules, and a numbered index. A graphic identity built from words alone.', tradeoff:'High visual impact; no portrait needed.', palette:['#ef4e32','#201f1b','#fff8e9']},
  {id:'09-letter', name:'A note from Andrew', type:'Intimate / literary', description:'A single carefully set letter on warm paper, with a small portrait seal and a direct invitation to connect. Almost no interface.', tradeoff:'The most restrained option; long-form over scanning.', palette:['#f7f0e6','#3f382f','#76503a']},
  {id:'10-orbit', name:'A constellation of interests', type:'Spatial / expressive', description:'Midnight blue, precise orbital drawing, and a central identity surrounded by interconnected interests. An engineer with a wide orbit.', tradeoff:'Most exploratory composition; linear reading on mobile.', palette:['#111c38','#e2e8fc','#b9c4ff']}
];
