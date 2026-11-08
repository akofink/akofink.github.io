export const parts = [
  {
    id: "frame",
    n: "01",
    name: "The frame",
    mechanic: "Steel tubes / joined at useful boundaries",
    title: "A setup worth sharing.",
    lead: "Some things should fit together without becoming one inseparable thing.",
    body: "My dots setup brings shell, editor, tmux and coding-agent tools together in modules. Public instructions and skills are reusable; a separate private notes repository holds personal context. The boundary matters as much as the connection.",
    projects: [
      [
        "dots",
        "Modular setup and shared agent skills. Start with one useful module, not an entire borrowed environment.",
        "https://github.com/akofink/dots",
      ],
    ],
    idea: "Share the reusable structure. Keep personal context separate. Make it possible to start with one piece.",
    annotation:
      "A double triangle. Each tube has a job; the joints make a system. This frame is an illustration, not a claim about a bicycle I own.",
  },
  {
    id: "drive",
    n: "02",
    name: "The drivetrain",
    mechanic: "Cranks / spindle / bearings / one fixed cog",
    title: "Give the work a memory.",
    lead: "A session can end without the work losing its place.",
    body: "akagent-cli is a local-first registry for task identity, observations and recovery. It records the work; Git, tmux and provider tools still carry out their own actions. I’m interested in tools that make the next handoff easier to understand.",
    projects: [
      [
        "akagent-cli",
        "A durable record of tasks and observations. Not a process launcher.",
        "https://github.com/akofink/akagent-cli",
      ],
    ],
    idea: "Separate the record of work from the tools that do it. Explicit identity makes recovery easier to reason about.",
    annotation:
      "The crank turns a spindle supported by bearings. A single chainring connects to a single fixed rear cog and lockring. Parts are separated along a schematic axis for clarity, not as a maintenance sequence.",
  },
  {
    id: "steering",
    n: "03",
    name: "The steering",
    mechanic: "Headset / steerer / fork / a change of direction",
    title: "Follow a small question.",
    lead: "Curiosity is allowed to take the long way.",
    body: "What would it look like to see the note you play? Live Staff explores one sustained instrument or voice becoming notation in the browser. Its microphone analysis stays on the device. It’s a monophonic proof of concept, and the detector can choose the wrong octave.",
    projects: [
      [
        "Live Staff",
        "Local audio analysis, visible notation and deliberately stated limits.",
        "https://github.com/akofink/live-staff",
      ],
      [
        "Try the personal preview",
        "This leaves the site. Microphone access is optional there, never requested here.",
        "https://live-staff.akofink.com/",
      ],
    ],
    idea: "Start with a small, legible question. Show the signal, keep input local, and say where the prototype can be wrong.",
    annotation:
      "Two bearing positions support the steerer through the head tube. The lower race sits at the fork crown. The enlarged plate separates the stack so its relationships can be read.",
  },
  {
    id: "wheels",
    n: "04",
    name: "The wheels",
    mechanic: "Tire / rim / crossed spokes / hub",
    title: "Let the rules show.",
    lead: "A small world gets interesting when you can change what happens inside it.",
    body: "Tinderbox is a falling-element sandbox of interacting materials, weather and living systems. Cascade asks a different question: what happens when a simulation has a fixed work budget? Its bounded policy lets extra work wait; an intentionally unbounded comparison permits stalls.",
    projects: [
      [
        "Tinderbox",
        "A world to paint, tune and explore.",
        "https://github.com/akofink/tinderbox",
      ],
      [
        "Cascade",
        "A cellular sandbox for making overload an explicit design choice.",
        "https://github.com/akofink/cascade-game-demo",
      ],
    ],
    idea: "Expose the rules. Show the backlog. Let people experiment with the tradeoff instead of hiding it.",
    annotation:
      "A tire surrounds the rim; tensioned spokes connect rim to hub flanges around the axle. The separated layers explain the structure. They are not detachable solid discs or a wheel-building guide.",
  },
  {
    id: "cockpit",
    n: "05",
    name: "The cockpit",
    mechanic: "Bars / two levers / cables / rim calipers",
    title: "Make the limits legible.",
    lead: "Useful tools don’t need to pretend they do everything.",
    body: "I’m a software engineer at Atlassian, working on Bitbucket Cloud in the NYC office. My background spans electrical engineering and full-stack software, including work at Red Hat. In my personal projects, I like clear boundaries: local inputs, explicit work budgets, and tools that don’t hide what they’re responsible for.",
    projects: [
      [
        "Local-first music",
        "Live Staff keeps audio on the device and names the detector’s limits.",
        "https://github.com/akofink/live-staff",
      ],
      [
        "Explicit work budgets",
        "Cascade makes pending work part of the experiment.",
        "https://github.com/akofink/cascade-game-demo",
      ],
    ],
    idea: "A limitation stated clearly can be more useful than a capability described vaguely.",
    annotation:
      "Two levers route cables to front and rear calipers. The pads act on the rim’s braking surfaces, not on a disc. This schematic is not riding, brake adjustment or safety advice.",
  },
  {
    id: "saddle",
    n: "06",
    name: "The human part",
    mechanic: "Saddle / rails / seatpost / room for a life",
    title: "Not everything is a project.",
    lead: "There is a person outside the workbench.",
    body: "I live and work in New York City. Away from the screen, there’s cycling, cooking, gardening, opera and ballet. Some interests become experiments. Others are simply a good reason to close the laptop.",
    projects: [
      [
        "Andrew on GitHub",
        "The public work, when you want to look a little closer.",
        "https://github.com/akofink",
      ],
    ],
    idea: "Leave room for an interest that never needs to become a productivity tool.",
    annotation:
      "The saddle’s shell is supported by rails, clamped to a seatpost inside the seat tube. The illustrated bicycle is a creative model, not a personal inventory.",
  },
];
