/* Course content for LBYEC2B, drawn from the revised syllabus.
   Content lives here rather than inside the page component so that a
   syllabus revision is a data edit, and so other pages (a schedule page, a
   per-week page) can read the same source instead of restating it. */

export const meta = {
  code: "LBYEC2B",
  title: "Computer Fundamentals and Programming 2",
  college: "Gokongwei College of Engineering",
  department: "Electronics, Computer, and Electrical Engineering",
  coordinator: "John Anthony Jose, Ph.D.",
  prerequisite: "LBYEC2A, hard prerequisite",
  units: "1",
  weeks: 13,
  passingGrade: 70
};

export const tracks = ["All", "C", "MATLAB", "Project"];

export const weeks = [
  { no: 1, title: "Course overview", detail: "Review of computer programming fundamentals and clarification of prerequisite knowledge.", track: "Foundations", lo: "No mapped outcome", activities: "Discussion, pre-course skills assessment", group: "C",
    body: "Confirm the prerequisite knowledge the course assumes. The pre-course skills assessment is diagnostic and identifies gaps to be closed before the C material begins.", deliverable: "Pre-course skills assessment", due: "During the session", env: "C" },
  { no: 2, title: "Arrays and strings", detail: "Array indexing and manipulation, passing arrays to functions, character and string arrays, string manipulation.", track: "C", lo: "LO1 to LO3", activities: "Discussion, guided activity, machine problem", group: "C",
    body: "Implement array and string handling directly, including the passing of arrays and strings to functions, so that the mechanics of indexing and manipulation are understood rather than assumed.", deliverable: "Machine problem", due: "End of the week", env: "C" },
  { no: 3, title: "Pointers and file I/O", detail: "Computer memory addressing, pointers to basic types, dereferencing, arrays and pointers, pass-by-reference, and file input and output on text files.", track: "C", lo: "LO1 to LO3", activities: "Discussion, guided activity, machine problem", group: "C",
    body: "Reason explicitly about memory. Pointer dereferencing, the relationship between arrays and pointers, and pass by reference are exercised alongside file input and output.", deliverable: "Machine problem", due: "End of the week", env: "C",
    handout: { href: "file-io.html", label: "Handout 03 — Making a program remember" } },
  { no: 4, title: "Structures", detail: "User-defined types, typedef, complex data types, passing structures to functions, pointers to structures.", track: "C", lo: "LO1 to LO3", activities: "Discussion, guided activity, machine problem", group: "C",
    body: "Define composite types with typedef and pass structures and pointers to structures between functions, establishing the habit of modelling data before writing procedures.", deliverable: "Machine problem", due: "End of the week", env: "C" },
  { no: 5, title: "Introduction to MATLAB", detail: "Computational thinking in matrix form, control statements, file I/O, indexing and slicing, debugging, live scripts and functions.", track: "MATLAB", lo: "LO1 to LO3", activities: "Discussion, guided activity, machine problem", group: "MATLAB",
    body: "Transfer the same reasoning to MATLAB, where computation is expressed in matrix form. Control statements, indexing and slicing, debugging, live scripts and functions are introduced.", deliverable: "Machine problem", due: "End of the week", env: "MATLAB" },
  { no: 6, title: "Elementary matrix operations", detail: "Matrix operations, Statistics and Machine Learning Toolbox, tables.", track: "MATLAB", lo: "LO1 to LO4", activities: "Discussion, guided activity, machine problem", group: "MATLAB",
    body: "Apply elementary matrix operations and tables, with an introduction to the Statistics and Machine Learning Toolbox as an instrument rather than an end.", deliverable: "Machine problem", due: "End of the week", env: "MATLAB" },
  { no: 7, title: "Analyzing data in MATLAB", detail: "Extraction, transformation and loading of CSV data, and visualization of data through plots and figures. The term-end project is announced.", track: "MATLAB", lo: "LO4", activities: "Guided activity, discussion, machine problem", group: "MATLAB",
    body: "Build a complete path from raw CSV data to an interpretable figure. The term-end project is announced this week, so the pipeline built here is a rehearsal for it.", deliverable: "Machine problem", due: "End of the week", env: "MATLAB" },
  { no: 8, title: "Graphical user interface, part 1", detail: "App Designer Toolbox, callbacks and properties. The project proposal is announced.", track: "MATLAB", lo: "LO1 to LO3, LO5", activities: "Discussion, guided activity, machine problem", group: "MATLAB",
    body: "Construct an interactive application in App Designer and wire its callbacks and properties. The project proposal is announced this week.", deliverable: "Machine problem", due: "End of the week", env: "MATLAB" },
  { no: 9, title: "Project proposal revision", detail: "Project scoping, formulation of milestones and expected deliverables, building of a mock-up.", track: "Project", lo: "LO2, LO6", activities: "Discussion, guided activity", group: "Project",
    body: "Revise the proposal in consultation: narrow the scope, state milestones and expected deliverables, and produce a mock-up that the team can build against.", deliverable: "Project proposal and mock-up", due: "Week 9", env: "MATLAB and written documents" },
  { no: 10, title: "Graphical user interface, part 2", detail: "Built-in data structures, variable scoping.", track: "MATLAB", lo: "LO1 to LO4", activities: "Reading materials, discussion, guided activity, machine problem", group: "MATLAB",
    body: "Extend the interface work with built-in data structures and a disciplined treatment of variable scoping.", deliverable: "Machine problem", due: "End of the week", env: "MATLAB" },
  { no: 11, title: "Project making", detail: "Implementation of the term-end project with instructor consultation.", track: "Project", lo: "LO1 to LO5", activities: "Discussion, reading materials", group: "Project",
    body: "Implementation week. Teams build against their milestones and consult the instructor on design decisions rather than on code to be supplied.", deliverable: "Project increment", due: "Week 13", env: "MATLAB and written documents" },
  { no: 12, title: "Practical examination", detail: "Assessed against Student Outcome K, the use of techniques, skills and modern engineering tools.", track: "Project", lo: "LO1 to LO4", activities: "Conduct exam", group: "Project",
    body: "An individual examination under supervision, assessed against Student Outcome K. It measures the ability to use the techniques, skills and tools of practice without assistance.", deliverable: "Practical examination", due: "Week 12", env: "As specified by the instructor" },
  { no: 13, title: "Project presentation", detail: "Team demonstration and defense of the submitted program before the class.", track: "Project", lo: "LO1 to LO6", activities: "Project presentation", group: "Project",
    body: "Each team demonstrates and defends its program. Marks reflect the proposal, the submitted code, the documentation, the presentation and the demonstrated mastery of the work.", deliverable: "Project deliverables and presentation", due: "Week 13", env: "MATLAB and written documents" }
];

export const outcomes = [
  { code: "LO1", short: "Apply programming to engineering tasks", title: "Apply computer programming to implement engineering tasks",
    body: "Translate a stated engineering requirement into code that compiles, executes and produces the specified output. Requirements are expressed in the terms of the problem, so interpretation precedes implementation.",
    meta: "Reinforced against Student Outcome K", evidence: "Laboratory activity and machine problem deliverables", weeks: [1, 2, 3, 4, 5, 6, 8, 10, 11, 12, 13] },
  { code: "LO2", short: "Analyze a problem and identify requirements", title: "Analyze a problem and identify its requirements",
    body: "Examine a problem statement and determine the requirements appropriate to a programming-based solution before implementation begins. Requirements identified late are commonly discovered through failure, at greater cost.",
    meta: "Introduced against Student Outcome J", evidence: "Project proposal and project deliverables", weeks: [1, 9, 11, 12, 13] },
  { code: "LO3", short: "Develop algorithms", title: "Develop algorithms for engineering tasks",
    body: "Express a computer-based solution as an algorithm, in pseudo-code or as a flowchart sufficiently precise for another reader to implement. The documentation rubric assesses this ability directly.",
    meta: "Reinforced against Student Outcome K", evidence: "Machine problem documentation and project report", weeks: [1, 2, 3, 4, 5, 8, 11, 12, 13] },
  { code: "LO4", short: "Build pipelines for analyzing data", title: "Build pipelines and transformations for analyzing data",
    body: "Construct pipelines that extract, transform and load data, then analyze and visualize the result in MATLAB so that each figure supports a stated interpretation.",
    meta: "Reinforced against Student Outcome K", evidence: "Machine problem deliverables and practical examination", weeks: [6, 7, 10, 11, 12, 13] },
  { code: "LO5", short: "Develop a graphical user interface", title: "Develop a graphical user interface with MATLAB",
    body: "Develop an interactive MATLAB application in App Designer, with callbacks and properties configured by the student, so that another person can operate the program without reading its code.",
    meta: "Reinforced against Student Outcome K", evidence: "Project deliverables and presentation", weeks: [8, 10, 11, 13] },
  { code: "LO6", short: "Work in a team on a modular program", title: "Work in a team to develop a modular program",
    body: "Work within a team to scope, apportion, implement and defend a modular program that addresses an identified need. Individual contribution is assessed alongside the submitted program through the teamwork rubric.",
    meta: "Reinforced against Student Outcomes D and K", evidence: "Teamwork evaluation, project deliverables and presentation", weeks: [9, 11, 13] }
];

export const journeySteps = [
  { week: 7, label: "Announced", stage: "Week 7", title: "The project is announced",
    body: "The project is announced in the same week that data pipelines are taught, so that students can consider an application while the relevant tools are being learned. Teams are formed and a problem domain is identified.",
    produced: "A team and a candidate problem", judged: "No graded output, although the choice of problem determines the work that follows" },
  { week: 8, label: "Proposal called", stage: "Week 8", title: "The proposal requirement is issued",
    body: "The proposal requirements are issued alongside the first interface work in App Designer. A contemporary issue relevant to computer software related practice must be addressed within the proposal itself and not only mentioned as background.",
    produced: "A draft statement of the problem and its context", judged: "Consideration of contemporary issues, five percent of the project mark" },
  { week: 9, label: "Scoped", stage: "Week 9", title: "Scope, milestones and a mock-up",
    body: "The proposal is revised in consultation with the instructor. The scope is narrowed to what the team can complete, milestones and expected deliverables are stated, and a mock-up is prepared so that the interface is settled before implementation begins.",
    produced: "A revised proposal, a milestone schedule and a working mock-up", judged: "Project proposal, fifteen percent of the project mark" },
  { week: 11, label: "Built", stage: "Weeks 10 and 11", title: "Implementation against the milestones",
    body: "The program is developed in modules and then integrated. Consultation addresses design decisions and defects; code is not supplied by the instructor. Coding standards and inline documentation are observed as the work proceeds rather than added at the end.",
    produced: "A working modular program and its documentation", judged: "Completeness and quality of the program, forty percent, and documentation, fifteen percent" },
  { week: 12, label: "Examined", stage: "Week 12", title: "Practical examination",
    body: "An individual examination under supervision, held in the same week that the project is being completed. It measures unaided performance and is graded separately from the project at fifteen percent of the final grade.",
    produced: "Individual examination output", judged: "Use of techniques, skills and modern engineering tools, Student Outcome K" },
  { week: 13, label: "Defended", stage: "Week 13", title: "Demonstration and defense",
    body: "The team demonstrates the program and answers questions on it. Mastery is assessed through explanation, tracing and modification of the submitted code, which is also the means by which compliance with the artificial intelligence policy is verified.",
    produced: "Project deliverables, written report and presentation", judged: "Project presentation, twenty five percent of the project mark, and the teamwork evaluation" }
];

export const scenarios = [
  { text: "Asking a chatbot to explain a compiler error message you do not understand.", verdict: "Not permitted", reason: "The policy covers AI assistants and chatbots, with no exception for explanation. Bring the error to the instructor, to a classmate in discussion, or to the documentation." },
  { text: "Leaving an AI completion extension switched on in your editor while you type your own code.", verdict: "Not permitted", reason: "AI coding assistants and editor extensions are named in the policy. Suggestions influence the submitted code whether they are accepted or rejected, so such extensions are disabled for coursework." },
  { text: "Using the AI feature built into MATLAB to draft a script for a machine problem.", verdict: "Not permitted", reason: "AI features built into MATLAB and other course tools are covered in the same terms as any external assistant." },
  { text: "Reading the AI-generated summary that appears at the top of your search results.", verdict: "Not permitted", reason: "AI-generated summaries in search results are named in the policy. Open the underlying documentation and read the source directly." },
  { text: "Consulting the MATLAB documentation, the C standard library reference, or the prescribed textbooks.", verdict: "Permitted", reason: "Reference material is expected. Documentation, the prescribed textbooks and the instructor's activity materials are the intended sources for this course." },
  { text: "Discussing an algorithm at a whiteboard with your team, then each writing your own code.", verdict: "Permitted", reason: "Collaboration within the team is required by LO6. The code, the documentation and the explanation of both must nevertheless be your own." },
  { text: "Using a spelling and grammar checker on your written project report.", verdict: "Ask the instructor", reason: "The policy permits tools that the instructor allows. Consult the instructor before use, noting that the answer may depend on whether the tool rewrites text or only flags it." },
  { text: "Submitting without the signed declaration because no AI tool was used anyway.", verdict: "Not permitted", reason: "Every submission must carry the signed declaration. A missing or false declaration is handled under the cheating policy and the Student Handbook." }
];

export const rubrics = {
  "Laboratory work": [
    { criterion: "Completeness and quality", weight: "Whole activity",
      Exemplary: "All activity items have been accomplished at a 90 to 100 percent quality level, weighted according to the relevance of each item.",
      Satisfactory: "Some items were not accomplished, or some items were submitted below a 90 percent quality level, weighted according to item relevance.",
      Developing: "Fewer than 80 percent of the items were accomplished, or all items were submitted below an 80 percent quality level.",
      Beginning: "Fewer than 70 percent of the items were accomplished, or all items were submitted below a 70 percent quality level." }
  ],
  "Machine problem": [
    { criterion: "Completeness and quality of submitted programs", weight: "70 percent",
      Exemplary: "All required programs were submitted, all are working and satisfy the stated requirements for input, output and functionality, and all observe the coding standards set by the instructor.",
      Satisfactory: "All required programs were submitted, with minor issues in the satisfaction of requirements or with major coding standards left unmet.",
      Developing: "All required programs were submitted, but there are major issues in the satisfaction of the stated requirements.",
      Beginning: "Not all required programs were submitted, or all were submitted but most do not satisfy the stated requirements." },
    { criterion: "Documentation", weight: "30 percent",
      Exemplary: "All relevant parts of the code carry inline documentation, and the written document presents a well specified pseudo-code or flowchart that accurately describes the submitted programs, together with a complete walkthrough.",
      Satisfactory: "Satisfies at least 80 percent of the exemplary criteria.",
      Developing: "Satisfies at least 70 percent of the exemplary criteria.",
      Beginning: "Does not satisfy at least 70 percent of the exemplary criteria." }
  ],
  Project: [
    { criterion: "Consideration of contemporary issues", weight: "5 percent",
      Exemplary: "The whole of the proposal requirement considers contemporary issues relevant to computer software related work.",
      Satisfactory: "The proposal contains one or two factors that consider contemporary issues.",
      Developing: "The proposal discusses a background of contemporary issues but does not carry them into the proposal itself.",
      Beginning: "No contemporary issues are considered in the project proposal." },
    { criterion: "Project proposal", weight: "15 percent",
      Exemplary: "The proposal was submitted on time, all project requirements are amply satisfied, and the proposal is well specified.",
      Satisfactory: "Satisfies at least 80 percent of the exemplary criteria.",
      Developing: "Satisfies at least 70 percent of the exemplary criteria.",
      Beginning: "Satisfies less than 70 percent of the exemplary criteria." },
    { criterion: "Completeness and quality of program", weight: "40 percent",
      Exemplary: "All required program components were submitted, all are working and satisfy the stated requirements, and all observe the coding standards set by the instructor.",
      Satisfactory: "All required components were submitted, with minor issues in the satisfaction of requirements or with major coding standards left unmet.",
      Developing: "All required programs were submitted, but there are major issues in the satisfaction of the stated requirements.",
      Beginning: "Not all required programs were submitted, or all were submitted and none satisfies the stated requirements." },
    { criterion: "Documentation", weight: "15 percent",
      Exemplary: "All relevant parts of the code carry inline documentation, the written report provides every required section with ample discussion, and the report conforms fully to the required format.",
      Satisfactory: "Satisfies at least 80 percent of the exemplary criteria.",
      Developing: "Satisfies at least 70 percent of the exemplary criteria.",
      Beginning: "Does not satisfy at least 70 percent of the exemplary criteria." },
    { criterion: "Project presentation", weight: "25 percent",
      Exemplary: "Demonstrates mastery of the submitted program.",
      Satisfactory: "Mostly demonstrates mastery of the submitted program.",
      Developing: "Generally demonstrates mastery of the submitted program.",
      Beginning: "Lacks overall mastery of the submitted program." }
  ],
  Teamwork: [
    { criterion: "Contribution towards the attainment of the objectives", weight: "Criterion 1",
      Exemplary: "The member is fully engaged, exchanges ideas effectively towards the objectives, performs all tasks very effectively, attends all meetings, participates enthusiastically and is very reliable.",
      Satisfactory: "The member is engaged most of the time, performs all assigned tasks, attends meetings regularly, usually participates effectively and is generally reliable.",
      Developing: "The member is engaged but can be distracted, performs assigned tasks only after many reminders, attends meetings without contributing constructively and at times expects others to do the work.",
      Beginning: "The member is engaged only with encouragement from others, does not perform assigned tasks, often misses meetings and relies on others to do the work." },
    { criterion: "Ability to function on multidisciplinary teams", weight: "Criterion 2",
      Exemplary: "Values disciplinary and personal style differences and promotes their use in team processes to produce a higher quality outcome.",
      Satisfactory: "Understands disciplinary and personal style differences and supports their use in team processes.",
      Developing: "Is willing to take disciplinary and personal style differences into account in team processes.",
      Beginning: "Has a limited understanding of the value of such differences and limits the effectiveness of the team by not accounting for them." }
  ]
};

export const rubricTabs = ["Laboratory work", "Machine problem", "Project", "Teamwork"];
export const levels = ["Exemplary", "Satisfactory", "Developing", "Beginning"];
export const levelBands = { Exemplary: "90 to 100", Satisfactory: "80 to 89", Developing: "70 to 79", Beginning: "Below 70" };

/* The five graded components and their published weights. `weight` drives both
   the assessment bars and the standing calculator, so the two can never drift
   apart. `bar` is the width of each bar relative to the largest weight. */
export const components = [
  { key: "lab", label: "Laboratory work", weight: 25, default: 85 },
  { key: "mp", label: "Machine problems and report", weight: 25, default: 85 },
  { key: "project", label: "Project", weight: 30, default: 85 },
  { key: "exam", label: "Practical examination", weight: 15, default: 80 },
  { key: "eval", label: "Teacher's evaluation", weight: 5, default: 90 }
];

export const projectMix = [
  { label: "Program", pct: 40, bg: "var(--green-700)", fg: "var(--neutral-0)", title: "Completeness and quality of the program, forty percent" },
  { label: "Presentation", pct: 25, bg: "var(--green-300)", fg: "var(--green-900)", title: "Project presentation, twenty five percent" },
  { label: "Proposal", pct: 15, bg: "var(--gold-500)", fg: "var(--neutral-900)", title: "Project proposal, fifteen percent" },
  { label: "Documentation", pct: 15, bg: "var(--gold-200)", fg: "var(--neutral-900)", title: "Documentation, fifteen percent" },
  { label: "Contemporary issues", pct: 5, bg: "var(--neutral-200)", fg: "var(--neutral-900)", title: "Consideration of contemporary issues, five percent" }
];

export const deliverables = [
  { name: "Laboratory activity deliverables", lo: "LO1 to LO3", due: "End of class session" },
  { name: "Machine problem deliverables", lo: "LO1 to LO4", due: "End of the week" },
  { name: "Practical examination", lo: "LO1 to LO4", due: "Week 12" },
  { name: "Project deliverables", lo: "LO1 to LO6", due: "Week 13" }
];

export const policies = [
  { eyebrow: "Cheating", title: "Fabrication and plagiarism", body: "Evidence of fabrication or plagiarism, as defined by the University in its Student Handbook, results in downgrading for the course. A student who cheats on any assignment, project or examination is assigned a failing grade for the course." },
  { eyebrow: "Attendance", title: "Attendance", body: "Attendance is strictly monitored in accordance with the Student Handbook." },
  { eyebrow: "Submission", title: "Submission through Canvas", body: "All deliverables are submitted through Canvas. Submissions by electronic mail are not accepted unless the instructor advises otherwise." },
  { eyebrow: "Late work", title: "Late submission", body: "As a general rule, late submissions are not accepted. Where a submission is accepted late, a deduction of 1.5 percent per day is applied, and no submission is accepted after the hard deadline specified by the instructor near the end of the term." }
];

/* Each reference links into AnimoSearch, the DLSU library discovery service,
   so a student can go straight to the holdings rather than to a bookseller. */
const ANIMOSEARCH = "https://animosearch.dlsu.edu.ph/discovery/search";
export const references = [
  { text: "Kernighan, B. W., & Ritchie, D. M. (1988). The C programming language (2nd ed.). Prentice Hall.", keywords: "Kernighan Ritchie C programming language" },
  { text: "Reddy, R., & Ziegler, C. (2010). C programming for scientists and engineers with applications. Jones and Bartlett.", keywords: "Reddy Ziegler C programming scientists engineers" },
  { text: "Attaway, S. (2022). MATLAB: A practical introduction to programming and problem solving (6th ed.). Butterworth-Heinemann.", keywords: "Attaway MATLAB practical introduction programming problem solving" },
  { text: "Moore, H. (2017). MATLAB for engineers (5th ed.). Pearson.", keywords: "Moore MATLAB for engineers" },
  { text: "Palm, W. (2018). MATLAB for engineering applications (4th ed.). McGraw-Hill Education.", keywords: "Palm MATLAB engineering applications" }
].map((r) => ({
  ...r,
  url: `${ANIMOSEARCH}?query=any,contains,${encodeURIComponent(r.keywords)}&tab=Everything&search_scope=MyInst_and_CI`
}));

export const onlineResources = [
  { href: "https://www.mathworks.com/help/matlab/", label: "MATLAB Documentation", suffix: ", MathWorks" },
  { href: "https://www.tutorialspoint.com/cprogramming/", label: "C Programming Tutorial", suffix: ", tutorialspoint" },
  { href: "https://www.w3schools.com/c/", label: "C Tutorial", suffix: ", W3Schools" },
  { href: "https://www.programmingsimplified.com/", label: "Programming Simplified", suffix: "" }
];

export const navSections = [
  { id: "course", label: "Course description" },
  { id: "structure", label: "Structure" },
  { id: "outcomes", label: "Learning outcomes" },
  { id: "plan", label: "Learning plan" },
  { id: "assessment", label: "Assessment" },
  { id: "calculator", label: "Standing" },
  { id: "rubrics", label: "Rubrics" },
  { id: "policies", label: "Policies" },
  { id: "references", label: "References" }
];
