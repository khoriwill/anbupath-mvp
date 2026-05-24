import { T } from "./theme";


export const QUESTIONS = [
  { id: 1, question: "A project manager notices the team is consistently missing deadlines. What should they do FIRST?", options: ["Escalate to the sponsor immediately", "Identify the root cause of the delays", "Add more resources to the project", "Update the project schedule"], correct: 1, explanation: "Always identify root cause first. Adding resources or escalating without understanding WHY delays happen will not fix the problem.", xp: 10 },
  { id: 2, question: "What does the Critical Path represent in project management?", options: ["The most expensive tasks in the project", "Tasks that require the most resources", "The longest sequence of dependent tasks that determines project duration", "Tasks assigned to senior team members"], correct: 2, explanation: "The Critical Path is the longest sequence of dependent tasks. Any delay on the critical path directly delays the entire project end date.", xp: 10 },
  { id: 3, question: "What is the PRIMARY purpose of a project charter?", options: ["To define detailed project tasks and timelines", "To formally authorize the project and the project manager", "To list all project risks and mitigation strategies", "To document the project budget breakdown"], correct: 1, explanation: "The project charter formally authorizes the project to exist and gives the PM authority to apply organizational resources. It is the project birth certificate.", xp: 10 },
  { id: 4, question: "Which document formally defines the project scope, deliverables, and boundaries?", options: ["Project charter", "Scope management plan", "Scope statement", "WBS dictionary"], correct: 2, explanation: "The scope statement formally defines what is and is not included in the project. It is the foundation for all scope decisions going forward.", xp: 10 },
  { id: 5, question: "A project sponsor asks you to start work before the project charter is signed. What do you do?", options: ["Start immediately to show responsiveness", "Refuse and explain the charter must be signed first", "Start planning but not executing", "Escalate to the PMO"], correct: 1, explanation: "Without a signed charter the project is not formally authorized. Starting work without authorization puts the project and PM at risk.", xp: 15 },
  { id: 6, question: "What does a CPI of 0.85 mean for your project?", options: ["The project is ahead of schedule", "For every dollar spent you are getting 85 cents of value", "The project is 85 percent complete", "The project has 85 percent stakeholder satisfaction"], correct: 1, explanation: "CPI equals Earned Value divided by Actual Cost. A CPI of 0.85 means you are only getting 85 cents of work done for every dollar spent. Under 1.0 means over budget.", xp: 15 },
  { id: 7, question: "A stakeholder requests a major scope change mid-project. What is the CORRECT response?", options: ["Implement it immediately to keep the stakeholder happy", "Reject it - scope cannot change once the project starts", "Submit it through the Integrated Change Control process", "Add it to the backlog for the next project"], correct: 2, explanation: "All changes go through Integrated Change Control. This ensures impacts on scope, schedule, cost, and quality are analyzed before any change is approved.", xp: 15 },
  { id: 8, question: "Your SPI is 1.2. What does this tell you?", options: ["The project is over budget", "The project is ahead of schedule", "The project is behind schedule", "The project is under budget"], correct: 1, explanation: "SPI equals Earned Value divided by Planned Value. An SPI above 1.0 means you are completing more work than planned. The project is ahead of schedule.", xp: 15 },
  { id: 9, question: "What is the purpose of a Work Breakdown Structure?", options: ["To assign tasks to team members", "To decompose project scope into manageable work packages", "To create the project schedule", "To identify project risks"], correct: 1, explanation: "The WBS breaks down the total project scope into smaller, manageable work packages. It is the foundation for scheduling, costing, and resource planning.", xp: 10 },
  { id: 10, question: "Which scheduling technique uses optimistic, pessimistic, and most likely estimates?", options: ["Critical Path Method", "PERT", "Gantt Chart", "Kanban"], correct: 1, explanation: "PERT uses three-point estimates to calculate expected duration and account for uncertainty in scheduling.", xp: 15 },
  { id: 11, question: "Which conflict resolution technique leads to the BEST long-term outcomes on project teams?", options: ["Smoothing - minimize the conflict to keep peace", "Forcing - use authority to make a decision", "Withdrawing - avoid the conflict entirely", "Collaborating - work together to find a solution"], correct: 3, explanation: "Collaborating is the best technique. Both parties work together to find a solution that satisfies everyone. It builds trust and long-term team health.", xp: 10 },
  { id: 12, question: "What is the difference between quality assurance and quality control?", options: ["QA checks the final product, QC prevents defects during the process", "QA is process-focused and preventive, QC is product-focused and detective", "QA is done by the team, QC is done by external auditors", "There is no difference"], correct: 1, explanation: "QA is process-oriented and prevents defects by auditing processes. QC is product-oriented and detects defects in deliverables. Prevention before inspection.", xp: 15 },
  { id: 13, question: "A team member says they disagree with a decision but will support it. This is an example of:", options: ["Smoothing", "Compromise", "Consent", "Consensus"], correct: 3, explanation: "Consensus means everyone can live with the decision and agrees to support it even if it was not their first choice. This is the gold standard for team decision making.", xp: 10 },
  { id: 14, question: "What is the RACI matrix used for?", options: ["Tracking project costs", "Defining roles and responsibilities", "Managing project risks", "Scheduling project tasks"], correct: 1, explanation: "RACI stands for Responsible, Accountable, Consulted, and Informed. It clarifies who does what on a project and prevents confusion about ownership.", xp: 10 },
  { id: 15, question: "A key team member resigns mid-project. What should the PM do FIRST?", options: ["Immediately hire a replacement", "Assess the impact on the project schedule and deliverables", "Escalate to the project sponsor", "Redistribute the work among remaining team members"], correct: 1, explanation: "Always assess impact first. Understanding how the departure affects scope, schedule, and quality allows the PM to make informed decisions about next steps.", xp: 15 },

  // Risk Management
  { id: 16, question: "Which process involves systematically finding, documenting, and categorizing project risks?", options: ["Qualitative risk analysis", "Risk identification", "Risk response planning", "Risk monitoring"], correct: 1, explanation: "Risk identification finds and documents risks before they occur. It should involve the whole team and be performed iteratively throughout the project, not just during planning.", xp: 10 },
  { id: 17, question: "What is the PRIMARY difference between qualitative and quantitative risk analysis?", options: ["Qualitative uses numbers; quantitative uses descriptions", "Qualitative prioritizes risks subjectively; quantitative assigns numerical probability and impact values", "Qualitative is done by the team; quantitative is done by consultants", "Qualitative comes after quantitative in the risk process"], correct: 1, explanation: "Qualitative risk analysis uses subjective scales (high/medium/low) to prioritize risks quickly. Quantitative uses numerical data to calculate probability and financial impact. Qualitative always comes first.", xp: 15 },
  { id: 18, question: "A project manager removes a risky activity entirely from the project plan. This is an example of which risk response strategy?", options: ["Transfer", "Mitigate", "Avoid", "Accept"], correct: 2, explanation: "Avoid means changing the project plan to eliminate the risk or protect the objective from its impact. Removing the risky activity eliminates that risk entirely — the most complete response.", xp: 10 },
  { id: 19, question: "Purchasing insurance and outsourcing risky work to a third party are both examples of which risk response?", options: ["Accept", "Mitigate", "Avoid", "Transfer"], correct: 3, explanation: "Transfer shifts the financial impact of a risk to a third party through insurance, warranties, or contracts. It does not eliminate the risk but moves the consequence to someone else.", xp: 10 },
  { id: 20, question: "A PM adds extra testing cycles to reduce the probability of a critical defect reaching production. This is an example of:", options: ["Risk transfer", "Risk acceptance", "Risk mitigation", "Risk avoidance"], correct: 2, explanation: "Mitigation reduces the probability or impact of a risk to an acceptable threshold. Adding testing reduces the likelihood of defects — that is mitigation, not avoidance (which would remove the activity).", xp: 10 },
  { id: 21, question: "The risk register is BEST described as:", options: ["A list of approved project changes", "A document recording identified risks, their analysis, and planned responses", "A log of issues that have already occurred", "A contract clause listing project liabilities"], correct: 1, explanation: "The risk register captures identified risks, probability/impact ratings, risk owners, and response strategies. It is updated continuously throughout the project and is the central risk management artifact.", xp: 10 },
  { id: 22, question: "What does a Monte Carlo simulation produce in project risk management?", options: ["A single-point estimate of project cost", "A ranked list of risks by severity", "A probability distribution of possible project outcomes", "A network diagram of critical path activities"], correct: 2, explanation: "Monte Carlo simulation runs thousands of scenarios with varying inputs to produce a range of possible outcomes with associated probabilities. It quantifies schedule and cost risk numerically.", xp: 15 },

  // Communications Management
  { id: 23, question: "Sending a project status email to all stakeholders is an example of which communication method?", options: ["Interactive communication", "Pull communication", "Push communication", "Formal communication"], correct: 2, explanation: "Push communication sends information to specific recipients who may or may not engage with it. Emails, memos, and reports are push. Interactive is real-time exchange. Pull is self-service (e.g., intranet).", xp: 10 },
  { id: 24, question: "A PM calls a meeting to discuss a critical issue with two key stakeholders. This is an example of:", options: ["Push communication", "Pull communication", "Interactive communication", "Formal written communication"], correct: 2, explanation: "Interactive communication is real-time two-way exchange. Meetings, phone calls, and video calls are interactive — they allow immediate feedback and clarification unlike push or pull methods.", xp: 10 },
  { id: 25, question: "A project team grows from 5 to 10 members. How many additional communication channels are created?", options: ["5", "35", "25", "45"], correct: 1, explanation: "Channels = n(n-1)/2. For 5: 5×4/2 = 10. For 10: 10×9/2 = 45. The difference is 35 additional channels — showing how communication complexity grows exponentially with team size.", xp: 15 },
  { id: 26, question: "The communications management plan should define all of the following EXCEPT:", options: ["Who receives what information", "How often communication occurs", "The method of communication for each stakeholder", "The budget for each project deliverable"], correct: 3, explanation: "The communications management plan covers who needs what information, when, in what format, and via which channel. Deliverable budgets belong in the cost management plan, not the communications plan.", xp: 10 },
  { id: 27, question: "Which type of project report provides a comprehensive snapshot of project status including scope, schedule, cost, and risk?", options: ["Variance report", "Forecast report", "Status report", "Lessons learned report"], correct: 2, explanation: "A status report gives a current snapshot of project health across all knowledge areas. Variance reports focus on deviations. Forecasts project future performance. Lessons learned are produced at project close.", xp: 10 },
  { id: 28, question: "A stakeholder complains they cannot find the latest project documents. This is BEST addressed by:", options: ["Sending weekly email summaries to all stakeholders", "Establishing a centralized document management system", "Increasing the frequency of status meetings", "Updating the project charter to define access rules"], correct: 1, explanation: "A centralized document management system (pull communication) ensures stakeholders can access current information on demand. It prevents version confusion and reduces PM communication overhead.", xp: 10 },
  { id: 29, question: "Which factor is MOST likely to create communication barriers on a global project team?", options: ["Having a detailed communications management plan", "Cultural differences and language barriers", "Using collaborative project management software", "Holding weekly video conferences"], correct: 1, explanation: "Cultural differences and language barriers are the most significant communication barriers on global teams. They affect meaning, interpretation, and trust — a good communications plan explicitly addresses these.", xp: 15 },

  // Procurement Management
  { id: 30, question: "Under a Firm Fixed Price (FFP) contract, who bears the MOST financial risk?", options: ["The buyer", "The seller", "They share risk equally", "The project manager"], correct: 1, explanation: "In FFP contracts the seller commits to a fixed price. If actual costs exceed that price the seller absorbs the loss. FFP places maximum financial risk on the seller and maximum certainty for the buyer.", xp: 10 },
  { id: 31, question: "Which contract type reimburses the seller for all legitimate costs plus a fixed fee regardless of performance?", options: ["Firm Fixed Price", "Time and Material", "Cost Plus Fixed Fee", "Fixed Price Incentive Fee"], correct: 2, explanation: "CPFF reimburses allowable costs and adds a fixed profit fee. The buyer bears most of the risk since costs can overrun. It is used when scope is uncertain and difficult to define upfront.", xp: 15 },
  { id: 32, question: "A Time and Material (T&M) contract is MOST appropriate when:", options: ["Project scope is fully defined upfront", "The seller needs maximum profit certainty", "Scope is not well-defined and work hours are uncertain", "The buyer wants to transfer all financial risk to the vendor"], correct: 2, explanation: "T&M contracts pay for actual time and materials used. They suit situations where scope cannot be precisely defined — such as staff augmentation or small projects with evolving requirements.", xp: 15 },
  { id: 33, question: "A make-or-buy analysis is PRIMARILY used to:", options: ["Determine the project schedule duration", "Decide whether to produce a deliverable internally or purchase it externally", "Select the winning vendor from a shortlist", "Negotiate contract terms with suppliers"], correct: 1, explanation: "Make-or-buy analysis compares the cost and strategic value of producing a deliverable in-house versus outsourcing it. It is a key input to procurement planning and drives the procurement strategy.", xp: 10 },
  { id: 34, question: "Which procurement document is used when detailed technical specifications are defined and price is the primary selection criterion?", options: ["Request for Proposal (RFP)", "Request for Quotation (RFQ)", "Invitation for Bid (IFB)", "Statement of Work (SOW)"], correct: 2, explanation: "An IFB is used when technical requirements are clear and price is the primary selection factor. RFP is used when technical approach and solution matter. RFQ is used for simpler commodity-based purchases.", xp: 15 },
  { id: 35, question: "A PM uses a weighted scoring model during vendor selection. What is the PRIMARY advantage of this approach?", options: ["It is the fastest vendor selection method", "It eliminates the need for vendor interviews", "It provides an objective, criteria-based comparison across all vendors", "It guarantees the lowest-cost vendor is selected"], correct: 2, explanation: "A weighted scoring model assigns importance weights to each selection criterion and scores each vendor objectively. This reduces bias and ensures all important factors — not just price — are considered.", xp: 10 },
  { id: 36, question: "Which activity is MOST important during procurement closeout?", options: ["Signing the original contract", "Completing the make-or-buy analysis", "Verifying all deliverables were received and formally accepted", "Issuing the request for proposal to future vendors"], correct: 2, explanation: "Contract closeout requires formal verification that all contracted deliverables were completed and accepted and that all payments and obligations are fulfilled. Incomplete closeout creates legal and financial liability.", xp: 10 },

  // Integration Management
  { id: 37, question: "The project management plan is BEST described as:", options: ["A high-level summary of the project objectives", "An integrated document defining how the project will be executed, monitored, and closed", "A log of approved changes to project scope", "A financial document tracking project expenditures"], correct: 1, explanation: "The project management plan integrates all subsidiary plans (scope, schedule, cost, quality, risk, etc.) into a unified guide for how the project will be run from initiation through closure.", xp: 10 },
  { id: 38, question: "The Direct and Manage Project Work process produces which of the following outputs?", options: ["The project charter", "Deliverables and work performance data", "The risk register", "Approved change requests"], correct: 1, explanation: "Direct and Manage Project Work is the core execution process. Its key outputs are deliverables, work performance data (raw measurements), change requests, and updates to project documents.", xp: 10 },
  { id: 39, question: "A PM compares actual project performance against the project management plan and initiates corrective action. This describes which process?", options: ["Direct and Manage Project Work", "Close Project or Phase", "Monitor and Control Project Work", "Perform Integrated Change Control"], correct: 2, explanation: "Monitor and Control Project Work involves tracking, reviewing, and regulating progress against the plan. When variances are found, corrective or preventive actions are initiated through change requests.", xp: 10 },
  { id: 40, question: "Which body is typically responsible for reviewing and approving major project change requests?", options: ["The project manager alone", "The project team by vote", "The Change Control Board (CCB)", "The project sponsor only"], correct: 2, explanation: "The Change Control Board reviews, evaluates, and formally approves or rejects changes to project baselines. The PM may handle minor changes, but significant scope, cost, or schedule changes go to the CCB.", xp: 15 },
  { id: 41, question: "During the Close Project process, what should the project manager verify FIRST?", options: ["Archive project documents and release team members", "All project work is complete and acceptance criteria are formally met", "Celebrate with the project team", "Prepare the final invoice for the customer"], correct: 1, explanation: "Before closing, the PM must verify all deliverables are complete and formally accepted. Only then can resources be released, documents archived, and the project officially declared closed.", xp: 15 },
  { id: 42, question: "When should lessons learned IDEALLY be captured on a project?", options: ["Only at project closure", "Only when something goes wrong", "Continuously throughout the project lifecycle", "During the planning phase only"], correct: 2, explanation: "Lessons learned should be captured continuously — not just at the end. Continuous capture ensures insights are not lost and can be applied to benefit the current project as well as future ones.", xp: 10 },
  { id: 43, question: "What is the correct sequence of work performance artifacts in project monitoring and control?", options: ["Reports → data → information", "Data → information → reports", "Information → data → reports", "Data → reports → information"], correct: 1, explanation: "Raw measurements (data) are collected during execution, analyzed into meaningful information, then communicated to stakeholders as reports. Data is raw facts; information provides context; reports communicate findings.", xp: 15 },

  // Agile and Hybrid
  { id: 44, question: "Which situation BEST warrants an Agile approach over a predictive (waterfall) approach?", options: ["Requirements are fully defined and stable from the start", "The project has a fixed scope, fixed schedule, and fixed budget", "Requirements are likely to change and early delivery of value is important", "Regulatory compliance requires formal phase-gate sign-offs"], correct: 2, explanation: "Agile is ideal when requirements are expected to evolve. It delivers working increments frequently, allowing stakeholders to refine priorities based on real feedback rather than upfront specifications.", xp: 10 },
  { id: 45, question: "The purpose of sprint planning in Scrum is to:", options: ["Review completed work and gather stakeholder feedback", "Identify and remove team impediments", "Select backlog items and define the plan for the upcoming sprint", "Reflect on team processes and identify improvements"], correct: 2, explanation: "Sprint planning defines what work will be done in the sprint (the sprint goal and selected backlog items) and how the team plans to accomplish it. It sets the direction for the entire sprint.", xp: 10 },
  { id: 46, question: "In Agile, a team's velocity is BEST used for:", options: ["Measuring individual team member performance", "Forecasting how much work the team can complete in future sprints", "Determining the project budget", "Prioritizing the product backlog"], correct: 1, explanation: "Velocity measures the average story points completed per sprint. It is used to forecast delivery timelines and estimate how many sprints are needed to complete the remaining backlog.", xp: 10 },
  { id: 47, question: "A sprint burndown chart shows the remaining work line consistently above the ideal line. This indicates:", options: ["The team is ahead of schedule", "The team is completing work exactly on track", "The team is behind and may not complete the sprint", "The team's velocity has increased this sprint"], correct: 2, explanation: "On a burndown chart, actual remaining work above the ideal line means less work is being completed than planned. This signals the team is behind and may not finish all sprint commitments.", xp: 10 },
  { id: 48, question: "A hybrid project approach is BEST described as:", options: ["Using Agile ceremonies with no formal documentation", "Applying predictive methods for stable work and Agile delivery for uncertain or evolving components", "Full waterfall execution with Agile retrospectives added only at the end", "Running Scrum for all phases regardless of context"], correct: 1, explanation: "Hybrid combines predictive methods where requirements are stable (governance, compliance, budgeting) with Agile methods where flexibility and fast delivery add value. The mix is tailored to project context.", xp: 15 },
  { id: 49, question: "What is the PRIMARY outcome of an Agile retrospective?", options: ["A list of completed user stories from the sprint", "A reprioritized product backlog for the next sprint", "Actionable process improvements for the next sprint", "Updated project documentation for the sponsor"], correct: 2, explanation: "The retrospective focuses on continuous improvement. The team reflects on what went well, what did not, and commits to specific process changes for the next sprint. It is not about product progress.", xp: 10 },
  { id: 50, question: "The Definition of Done (DoD) in Agile is BEST described as:", options: ["A list of features the product owner wants in the next release", "A shared team agreement on quality criteria that must be met before work is considered complete", "The acceptance criteria written for a single user story", "A document signed by the sponsor to formally approve the project"], correct: 1, explanation: "The Definition of Done is a team-wide quality standard applied to all work items. It ensures everyone agrees on what 'complete' means, preventing partially finished work from being counted as done.", xp: 10 },
];

export const MODULES = [
  { id: 1, trackId: "pmp", title: "Project Initiation", icon: "🏁", questions: QUESTIONS.slice(0, 5), color: T.blue, desc: "Charters, scope, and kickoff" },
  { id: 2, trackId: "pmp", title: "Planning and Scheduling", icon: "📅", questions: QUESTIONS.slice(5, 10), color: T.purple, desc: "EVM, WBS, and scheduling" },
  { id: 3, trackId: "pmp", title: "Team and Stakeholders", icon: "👥", questions: QUESTIONS.slice(10, 15), color: T.green, desc: "Leadership, quality, and conflict" },
  { id: 16, trackId: "pmp", title: "Risk and Communications", icon: "⚠️", questions: QUESTIONS.slice(15, 29), color: T.blue, desc: "Risk responses, analysis, and stakeholder communications" },
  { id: 17, trackId: "pmp", title: "Procurement, Integration and Agile", icon: "🤝", questions: QUESTIONS.slice(29, 50), color: T.purple, desc: "Contracts, project integration, and Agile methods" },
];

export const TRACKS = [
  {
    id: "pmp",
    title: "PMP Foundations",
    icon: "📋",
    color: T.blue,
    description: "Project Management Professional",
    modules: MODULES,
  },
  {
    id: "aws",
    title: "AWS Cloud Practitioner",
    icon: "☁️",
    color: T.orange,
    description: "Amazon Web Services",
    modules: [
      { id: 4, trackId: "aws", title: "Cloud Concepts", icon: "🌩️", questions: AWS_QUESTIONS.slice(0, 8), color: T.orange, desc: "Regions, AZs, and cloud fundamentals" },
      { id: 5, trackId: "aws", title: "AWS Services", icon: "⚙️", questions: AWS_QUESTIONS.slice(8, 16), color: T.orange, desc: "Compute, storage, database, and networking" },
      { id: 6, trackId: "aws", title: "Security and Billing", icon: "🔐", questions: AWS_QUESTIONS.slice(16, 25), color: T.orange, desc: "IAM, Shield, pricing, and support" },
      { id: 18, trackId: "aws", title: "Cloud Economics and Security", icon: "💰", questions: AWS_QUESTIONS.slice(25, 45), color: T.orange, desc: "Pricing models, cost tools, deep-dive services, and compliance" },
      { id: 19, trackId: "aws", title: "Architecture and Migration", icon: "🏗️", questions: AWS_QUESTIONS.slice(45, 75), color: T.orange, desc: "Well-Architected Framework, DR, and migration strategies" },
    ],
  },
  {
    id: "scrum",
    title: "Scrum Fundamentals",
    icon: "🔄",
    color: T.green,
    description: "PSM I Preparation",
    modules: [
      { id: 7, trackId: "scrum", title: "Scrum Theory", icon: "📖", questions: SCRUM_QUESTIONS.slice(0, 8), color: T.green, desc: "Empiricism, pillars, and Scrum values" },
      { id: 8, trackId: "scrum", title: "Roles and Events", icon: "👥", questions: SCRUM_QUESTIONS.slice(8, 16), color: T.green, desc: "Team roles, Sprint events, and Daily Scrum" },
      { id: 9, trackId: "scrum", title: "Artifacts and Done", icon: "📦", questions: SCRUM_QUESTIONS.slice(16, 25), color: T.green, desc: "Backlogs, Increment, and Definition of Done" },
      { id: 20, trackId: "scrum", title: "Sprint Execution and Backlog", icon: "🏃", questions: SCRUM_QUESTIONS.slice(25, 45), color: T.green, desc: "Scrum values, sprint mechanics, and backlog management" },
      { id: 21, trackId: "scrum", title: "Scaling and Leadership", icon: "📈", questions: SCRUM_QUESTIONS.slice(45, 75), color: T.green, desc: "Scaling frameworks, backlog advanced, and Scrum Master servant leadership" },
    ],
  },
  {
    id: "cism",
    title: "CISM",
    icon: "🔐",
    color: T.purple,
    description: "Certified Information Security Manager",
    modules: [
      { id: 10, trackId: "cism", title: "Security Governance", icon: "🏛️", questions: CISM_QUESTIONS.slice(0, 8), color: T.purple, desc: "Governance frameworks, strategy, and alignment" },
      { id: 11, trackId: "cism", title: "Risk Management", icon: "⚖️", questions: CISM_QUESTIONS.slice(8, 16), color: T.purple, desc: "Risk assessment, response, and treatment" },
      { id: 12, trackId: "cism", title: "Incident Management", icon: "🚨", questions: CISM_QUESTIONS.slice(16, 25), color: T.purple, desc: "Incident response, recovery, and lessons learned" },
      { id: 22, trackId: "cism", title: "Risk and Program Management", icon: "🛡️", questions: CISM_QUESTIONS.slice(25, 45), color: T.purple, desc: "Governance deep dive, advanced risk, and security program" },
      { id: 23, trackId: "cism", title: "Incidents and Emerging Threats", icon: "🔍", questions: CISM_QUESTIONS.slice(45, 75), color: T.purple, desc: "Incident lifecycle, forensics, BCP/DR, and emerging security topics" },
    ],
  },
  {
    id: "security",
    title: "Security+",
    icon: "🛡️",
    color: T.red,
    description: "CompTIA Security+",
    modules: [
      { id: 13, trackId: "security", title: "Threats and Attacks", icon: "⚠️", questions: SECURITY_QUESTIONS.slice(0, 8), color: T.red, desc: "Malware, social engineering, and attack types" },
      { id: 14, trackId: "security", title: "Cryptography and PKI", icon: "🔑", questions: SECURITY_QUESTIONS.slice(8, 16), color: T.red, desc: "Encryption, hashing, and certificate management" },
      { id: 15, trackId: "security", title: "Network Security", icon: "🌐", questions: SECURITY_QUESTIONS.slice(16, 25), color: T.red, desc: "Firewalls, VPNs, and network hardening" },
      { id: 24, trackId: "security", title: "Implementation and Architecture", icon: "🔧", questions: SECURITY_QUESTIONS.slice(25, 45), color: T.red, desc: "Advanced threats, secure architecture, wireless, PKI, and email security" },
      { id: 25, trackId: "security", title: "Operations and Compliance", icon: "📜", questions: SECURITY_QUESTIONS.slice(45, 75), color: T.red, desc: "EDR, DLP, SIEM, digital forensics, DR testing, and GRC frameworks" },
    ],
  },
];

export function getRank(xp) {
  if (xp >= 200) return { title: "Master", color: T.gold };
  if (xp >= 100) return { title: "Journeyman", color: T.purple };
  return { title: "Apprentice", color: T.blue };
}

export function calcReadiness(track, completedModules, moduleXP) {
  var mods = track.modules;
  var done = mods.filter(function(m) { return completedModules.indexOf(m.id) !== -1; });
  var base = (done.length / mods.length) * 70;
  var bonus = 0;
  if (done.length > 0) {
    var totalAcc = done.reduce(function(sum, m) {
      var earned = moduleXP[m.id] || 0;
      var maxXP = m.questions.reduce(function(a, q) { return a + q.xp; }, 0);
      return sum + (maxXP > 0 ? (earned / maxXP) * 100 : 0);
    }, 0);
    bonus = (totalAcc / done.length) * 0.30;
  }
  return Math.min(Math.round(base + bonus), 100);
}

export const BADGES = [
  { id: 'first_lesson',     title: 'First Forge',     description: 'Complete your first lesson',      icon: '🔨' },
  { id: 'perfect_score',    title: 'Flawless',         description: 'Score 100% on any lesson',        icon: '⭐' },
  { id: 'streak_3',         title: 'On Fire',          description: 'Maintain a 3-day streak',         icon: '🔥' },
  { id: 'streak_7',         title: 'Weekly Warrior',   description: '7-day streak',                    icon: '⚡' },
  { id: 'pmp_complete',     title: 'PMP Forged',       description: 'Complete all PMP modules',        icon: '📋' },
  { id: 'aws_complete',     title: 'Cloud Forged',     description: 'Complete all AWS modules',        icon: '☁️' },
  { id: 'scrum_complete',   title: 'Scrum Forged',     description: 'Complete all Scrum modules',      icon: '🔄' },
  { id: 'cism_complete',    title: 'CISM Forged',      description: 'Complete all CISM modules',       icon: '🔐' },
  { id: 'security_complete', title: 'Security Forged', description: 'Complete all Security+ modules',  icon: '🛡️' },
  { id: 'all_tracks',       title: 'Master Forger',    description: 'Complete all 5 tracks',           icon: '🏆' },
  { id: 'rank_master',      title: 'Ascended',         description: 'Reach Master rank',               icon: '👑' },
];

export function checkBadges(xp, streak, completedModules, lastScore) {
  var has = function(ids) { return ids.every(function(id) { return completedModules.indexOf(id) !== -1; }); };
  var earned = [];
  if (completedModules.length >= 1) earned.push('first_lesson');
  if (lastScore === 100) earned.push('perfect_score');
  if (streak >= 3) earned.push('streak_3');
  if (streak >= 7) earned.push('streak_7');
  if (has([1, 2, 3, 16, 17])) earned.push('pmp_complete');
  if (has([4, 5, 6, 18, 19])) earned.push('aws_complete');
  if (has([7, 8, 9, 20, 21])) earned.push('scrum_complete');
  if (has([10, 11, 12, 22, 23])) earned.push('cism_complete');
  if (has([13, 14, 15, 24, 25])) earned.push('security_complete');
  if (completedModules.length >= 25) earned.push('all_tracks');
  if (xp >= 200) earned.push('rank_master');
  return earned;
}

