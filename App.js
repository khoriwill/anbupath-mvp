
import { useState, useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './lib/supabase';
import { AWS_QUESTIONS } from './content/aws-questions';
import { SCRUM_QUESTIONS } from './content/scrum-questions';
import { CISM_QUESTIONS } from './content/cism-questions';
import { SECURITY_QUESTIONS } from './content/security-questions';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Animated, KeyboardAvoidingView, Platform, Linking } from 'react-native';

const T = {
  bg: '#0a0a0f', card: '#12121f', card2: '#1a1a2e',
  accent: '#ff4757', gold: '#ffd700', green: '#2ed573',
  blue: '#4cc9f0', purple: '#7b2fff', orange: '#ff6b35', red: '#ef233c',
  amber: '#f59e0b',
  text: '#ffffff', text2: '#8892a4', border: '#1e2035',
};

const QUESTIONS = [
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

const MODULES = [
  { id: 1, trackId: "pmp", title: "Project Initiation", icon: "🏁", questions: QUESTIONS.slice(0, 5), color: T.blue, desc: "Charters, scope, and kickoff" },
  { id: 2, trackId: "pmp", title: "Planning and Scheduling", icon: "📅", questions: QUESTIONS.slice(5, 10), color: T.purple, desc: "EVM, WBS, and scheduling" },
  { id: 3, trackId: "pmp", title: "Team and Stakeholders", icon: "👥", questions: QUESTIONS.slice(10, 15), color: T.green, desc: "Leadership, quality, and conflict" },
  { id: 16, trackId: "pmp", title: "Risk and Communications", icon: "⚠️", questions: QUESTIONS.slice(15, 29), color: T.blue, desc: "Risk responses, analysis, and stakeholder communications" },
  { id: 17, trackId: "pmp", title: "Procurement, Integration and Agile", icon: "🤝", questions: QUESTIONS.slice(29, 50), color: T.purple, desc: "Contracts, project integration, and Agile methods" },
];

const TRACKS = [
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

function getRank(xp) {
  if (xp >= 200) return { title: "Master", color: T.gold };
  if (xp >= 100) return { title: "Journeyman", color: T.purple };
  return { title: "Apprentice", color: T.blue };
}

function calcReadiness(track, completedModules, moduleXP) {
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

const BADGES = [
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

function checkBadges(xp, streak, completedModules, lastScore) {
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

function getDailyQuestion() {
  var d = new Date();
  var dateStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  var pool = TRACKS.reduce(function(acc, t) {
    return acc.concat(t.modules.reduce(function(a, m) { return a.concat(m.questions); }, []));
  }, []);
  var hash = 0;
  for (var i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) % pool.length;
  }
  return { question: pool[Math.abs(hash)], dateStr: dateStr };
}

function SplashScreen() {
  var fadeAnim = useRef(new Animated.Value(0)).current;
  var slideAnim = useRef(new Animated.Value(30)).current;
  var pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(function() {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start(function() {
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  }, []);
  return (
    <SafeAreaView style={[s.safe, s.center]}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], alignItems: "center" }}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Text style={s.splashIcon}>⚒️</Text>
        </Animated.View>
        <Text style={s.splashName}>CertForge</Text>
        <Text style={s.splashTag}>Forge Your Certification.</Text>
        <View style={s.splashDivider} />
        <Text style={s.splashSub}>PMP · AWS · CISM · Security+</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

function AuthScreen({ onAuth }) {
  var [mode, setMode] = useState("signin");
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [error, setError] = useState("");
  var [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setLoading(true);
    var result = mode === "signup"
      ? await supabase.auth.signUp({ email: email, password: password })
      : await supabase.auth.signInWithPassword({ email: email, password: password });
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
    } else {
      onAuth(result.data.session);
    }
  }

  return (
    <SafeAreaView style={[s.safe, s.center]}>
      <View style={s.authCard}>
        <Text style={s.authLogo}>⚒️</Text>
        <Text style={s.authTitle}>CertForge</Text>
        <Text style={s.authSubtitle}>{mode === "signup" ? "Create your account" : "Welcome back, Forger"}</Text>

        <TextInput
          style={s.authInput}
          placeholder="Email"
          placeholderTextColor={T.text2}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />
        <TextInput
          style={s.authInput}
          placeholder="Password"
          placeholderTextColor={T.text2}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={s.authError}>{error}</Text> : null}

        <TouchableOpacity style={s.authButton} onPress={handleSubmit} activeOpacity={0.85} disabled={loading}>
          <Text style={s.authButtonText}>{loading ? "..." : mode === "signup" ? "Create Account" : "Sign In"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.authToggle} onPress={function() { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}>
          <Text style={s.authToggleText}>{mode === "signin" ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function HomeScreen({ xp, streak, onStart, completedModules, moduleXP, onDashboard, onPractice, dailyChallengeComplete, onStartDaily, weakAreas }) {
  var rank = getRank(xp);
  var nextXP = xp >= 200 ? 200 : xp >= 100 ? 200 : 100;
  var pct = Math.min((xp / nextXP) * 100, 100);
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <View style={s.homeHeader}>
          <View>
            <Text style={s.greeting}>Welcome back,</Text>
            <Text style={s.username}>Forger</Text>
          </View>
          <View style={s.streakBadge}>
            <Text style={s.streakFire}>🔥</Text>
            <Text style={s.streakNum}>{streak}</Text>
          </View>
        </View>

        <View style={s.rankCard}>
          <View style={s.rankRow}>
            <View>
              <Text style={s.rankLabel}>Current Rank</Text>
              <Text style={[s.rankTitle, { color: rank.color }]}>{rank.title}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={s.xpLabel}>Total XP</Text>
              <Text style={[s.xpValue, { color: T.gold }]}>{xp} XP</Text>
            </View>
          </View>
          <View style={s.xpBarBg}>
            <Animated.View style={[s.xpBarFill, { width: pct + "%", backgroundColor: rank.color }]} />
          </View>
          <View style={s.rankFooter}>
            <Text style={s.rankSub}>Apprentice</Text>
            <Text style={s.rankSub}>Journeyman</Text>
            <Text style={s.rankSub}>Master</Text>
          </View>
        </View>

        <TouchableOpacity style={s.dashboardBtn} onPress={onDashboard} activeOpacity={0.8}>
          <Text style={s.dashboardBtnText}>📊 View Progress Dashboard</Text>
        </TouchableOpacity>

        {(function() {
          var dc = getDailyQuestion();
          var dcLabel = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          return (
            <View style={s.dailyCard}>
              <View style={s.dailyCardTop}>
                <Text style={s.dailyCardTitle}>⚡ Daily Challenge</Text>
                <Text style={s.dailyCardDate}>{dcLabel}</Text>
              </View>
              <Text style={s.dailyCardSub}>Complete today's question for bonus XP</Text>
              {dailyChallengeComplete ? (
                <View style={s.dailyDone}>
                  <Text style={s.dailyDoneText}>✅ Completed +25 XP</Text>
                </View>
              ) : (
                <TouchableOpacity style={s.dailyStartBtn} onPress={onStartDaily} activeOpacity={0.85}>
                  <Text style={s.dailyStartBtnText}>Start</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })()}

        {TRACKS.map(function(track, tIdx) {
          return (
            <View key={track.id} style={tIdx > 0 ? { marginTop: 24 } : null}>
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>{track.icon} {track.title}</Text>
                <Text style={s.sectionSub}>{track.description}</Text>
              </View>
              {track.modules.map(function(mod, idx) {
                var isCompleted = completedModules.indexOf(mod.id) !== -1;
                var isLocked = idx > 0 && completedModules.indexOf(track.modules[idx - 1].id) === -1;
                return (
                  <TouchableOpacity key={mod.id} style={[s.moduleCard, { borderLeftWidth: 4, borderLeftColor: isLocked ? T.border : mod.color }, isLocked && s.moduleLocked]} onPress={function() { if (!isLocked) onStart(mod); }} disabled={isLocked} activeOpacity={0.8}>
                    <View style={[s.moduleIconWrap, { backgroundColor: isLocked ? T.border : mod.color + "22" }]}>
                      <Text style={s.moduleIconText}>{isLocked ? "🔒" : mod.icon}</Text>
                    </View>
                    <View style={s.moduleInfo}>
                      <Text style={[s.moduleName, isLocked && { color: T.text2 }]}>{mod.title}</Text>
                      <Text style={s.moduleDesc}>{isLocked ? "Complete previous module first" : mod.desc}</Text>
                      <Text style={s.moduleMeta}>{mod.questions.length} questions · {mod.questions.reduce(function(a, q) { return a + q.xp; }, 0)} XP</Text>
                      {!isLocked && weakAreas && weakAreas.indexOf(mod.id) !== -1 && (
                        <Text style={s.weakAreaLabel}>⚠️ Focus Here</Text>
                      )}
                    </View>
                    <View style={s.moduleRight}>
                      {!isCompleted && !isLocked && <View style={[s.startBtn, { backgroundColor: mod.color }]}><Text style={s.startBtnText}>Start</Text></View>}
                    </View>
                    {isCompleted && (
                      <View style={[s.moduleXPBadge, { backgroundColor: mod.color }]}>
                        <Text style={s.moduleXPBadgeText}>+{moduleXP[mod.id] || 0} XP</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}

        <View style={s.comingSoonCard}>
          <Text style={s.comingSoonTitle}>🔜 More tracks coming soon</Text>
          <Text style={s.comingSoonSub}>AWS Partner and PMI authorized content on the forge</Text>
        </View>

        <TouchableOpacity style={s.practiceBtn} onPress={onPractice} activeOpacity={0.8}>
          <Text style={s.practiceBtnIcon}>🎯</Text>
          <View>
            <Text style={s.practiceBtnTitle}>Practice Mode</Text>
            <Text style={s.practiceBtnSub}>5 random questions from all modules</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function LessonScreen({ module, onComplete, onExit }) {
  var questions = module.questions;
  var [current, setCurrent] = useState(0);
  var [selected, setSelected] = useState(null);
  var [showResult, setShowResult] = useState(false);
  var [earnedXP, setEarnedXP] = useState(0);
  var [correct, setCorrect] = useState(0);
  var shakeAnim = useRef(new Animated.Value(0)).current;
  var pulseAnim = useRef(new Animated.Value(1)).current;
  var fadeAnim = useRef(new Animated.Value(1)).current;
  var q = questions[current];
  var progress = ((current + 1) / questions.length) * 100;

  function animateCorrect() {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.03, duration: 100, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1.03, duration: 100, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  }

  function animateWrong() {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }

  function handleAnswer(idx) {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === q.correct) {
      setEarnedXP(function(prev) { return prev + q.xp; });
      setCorrect(function(prev) { return prev + 1; });
      animateCorrect();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      animateWrong();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  function handleNext() {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(function() {
      if (current + 1 >= questions.length) {
        onComplete(earnedXP, correct, questions.length);
      } else {
        setCurrent(function(prev) { return prev + 1; });
        setSelected(null);
        setShowResult(false);
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      }
    });
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.lessonTop}>
        <TouchableOpacity onPress={onExit} style={s.exitBtn}>
          <Text style={s.exitText}>✕</Text>
        </TouchableOpacity>
        <View style={s.progressBarBg}>
          <View style={[s.progressBarFill, { width: progress + "%", backgroundColor: module.color }]} />
        </View>
        <View style={[s.xpPill, { backgroundColor: module.color + "22" }]}>
          <Text style={[s.xpPillText, { color: module.color }]}>+{q.xp} XP</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>

          <Text style={s.questionNum}>Question {current + 1} of {questions.length}</Text>
          <View style={s.questionCard}>
            <Text style={s.questionText}>{q.question}</Text>
          </View>

          <Animated.View style={{ transform: [{ translateX: shakeAnim }, { scale: pulseAnim }] }}>
            {q.options.map(function(opt, idx) {
              var bgColor = T.card2;
              var borderColor = T.border;
              var textColor = T.text;
              var letterColor = T.text2;
              if (showResult) {
                if (idx === q.correct) { bgColor = T.green + "22"; borderColor = T.green; textColor = T.green; letterColor = T.green; }
                else if (idx === selected) { bgColor = T.accent + "22"; borderColor = T.accent; textColor = T.accent; letterColor = T.accent; }
              } else if (selected === idx) {
                bgColor = module.color + "22"; borderColor = module.color;
              }
              return (
                <TouchableOpacity key={idx} style={[s.optionBtn, { backgroundColor: bgColor, borderColor: borderColor }]} onPress={function() { handleAnswer(idx); }} activeOpacity={0.8} disabled={showResult}>
                  <View style={[s.optionLetterWrap, { borderColor: letterColor }]}>
                    <Text style={[s.optionLetter, { color: letterColor }]}>{["A","B","C","D"][idx]}</Text>
                  </View>
                  <Text style={[s.optionText, { color: textColor }]}>{opt}</Text>
                  {showResult && idx === q.correct && <Text style={{ fontSize: 16 }}>✅</Text>}
                  {showResult && idx === selected && idx !== q.correct && <Text style={{ fontSize: 16 }}>❌</Text>}
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {showResult && (
            <Animated.View style={[s.explanationCard, { borderColor: selected === q.correct ? T.green : T.accent, opacity: fadeAnim }]}>
              <Text style={[s.explanationHeader, { color: selected === q.correct ? T.green : T.accent }]}>
                {selected === q.correct ? "✅ Correct! +" + q.xp + " XP" : "❌ Not quite — learn from this"}
              </Text>
              <Text style={s.explanationText}>{q.explanation}</Text>
              <TouchableOpacity style={[s.nextBtn, { backgroundColor: module.color }]} onPress={handleNext} activeOpacity={0.85}>
                <Text style={s.nextBtnText}>{current + 1 >= questions.length ? "Finish Lesson 🎉" : "Next Question →"}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

var CONFETTI_COLORS = [T.accent, T.gold, T.green, T.blue, T.purple, T.orange, T.green, T.gold];

function ConfettiBurst() {
  var dots = useRef(
    CONFETTI_COLORS.map(function(color, i) {
      var angle = (i / CONFETTI_COLORS.length) * 2 * Math.PI;
      var radius = 130;
      return {
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        opacity: new Animated.Value(1),
        tx: Math.cos(angle) * radius,
        ty: Math.sin(angle) * radius,
        color: color,
      };
    })
  ).current;

  useEffect(function() {
    Animated.parallel(
      dots.map(function(dot) {
        return Animated.parallel([
          Animated.timing(dot.x, { toValue: dot.tx, duration: 800, useNativeDriver: true }),
          Animated.timing(dot.y, { toValue: dot.ty, duration: 800, useNativeDriver: true }),
          Animated.sequence([
            Animated.delay(600),
            Animated.timing(dot.opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
          ]),
        ]);
      })
    ).start();
  }, []);

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, { alignItems: "center", justifyContent: "center" }]}>
      {dots.map(function(dot, i) {
        return (
          <Animated.View key={i} style={{
            position: "absolute",
            width: 12, height: 12, borderRadius: 6,
            backgroundColor: dot.color,
            opacity: dot.opacity,
            transform: [{ translateX: dot.x }, { translateY: dot.y }],
          }} />
        );
      })}
    </View>
  );
}

function ResultScreen({ correct, total, xpEarned, moduleName, onHome }) {
  var pct = Math.round((correct / total) * 100);
  var passed = pct >= 70;
  var scaleAnim = useRef(new Animated.Value(0)).current;
  useEffect(function() {
    Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }).start();
  }, []);
  return (
    <SafeAreaView style={[s.safe, s.center]}>
      {passed && <ConfettiBurst />}
      <Animated.View style={[s.resultContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={s.resultEmoji}>{pct === 100 ? "🏆" : passed ? "⚒️" : "💪"}</Text>
        <Text style={s.resultTitle}>{pct === 100 ? "Forged to Perfection!" : passed ? "Module Forged!" : "Keep Forging!"}</Text>
        <Text style={s.resultSub}>{moduleName}</Text>
        <View style={s.resultStatsRow}>
          <View style={s.resultStat}>
            <Text style={s.resultStatNum}>{correct}/{total}</Text>
            <Text style={s.resultStatLabel}>Correct</Text>
          </View>
          <View style={[s.resultStatDivider]} />
          <View style={s.resultStat}>
            <Text style={[s.resultStatNum, { color: T.gold }]}>+{xpEarned}</Text>
            <Text style={s.resultStatLabel}>XP Earned</Text>
          </View>
          <View style={s.resultStatDivider} />
          <View style={s.resultStat}>
            <Text style={[s.resultStatNum, { color: passed ? T.green : T.accent }]}>{pct}%</Text>
            <Text style={s.resultStatLabel}>Score</Text>
          </View>
        </View>
        <Text style={s.resultMessage}>
          {pct === 100 ? "Perfect score. You are a true Forger." : passed ? "Solid work. Keep the streak alive!" : "Review the explanations and forge again."}
        </Text>
        <TouchableOpacity style={s.homeBtn} onPress={onHome} activeOpacity={0.85}>
          <Text style={s.homeBtnText}>Back to Forge ⚒️</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

function ReadinessRing({ pct, color, size }) {
  var half = size / 2;
  var bw = Math.round(size * 0.1);
  var p = Math.min(Math.max(pct, 0), 100);
  // rRot: -180° (0%) → 0° (50%) — sweeps clockwise through right half
  var rRot = -180 + (Math.min(p, 50) / 50) * 180;
  // lRot: 180° (50%) → 0° (100%) — sweeps clockwise through left half
  var lRot = 180 - (Math.max(p - 50, 0) / 50) * 180;
  return (
    <View style={{ width: size, height: size }}>
      {/* Gray background ring */}
      <View style={{ position: 'absolute', width: size, height: size, borderRadius: half, borderWidth: bw, borderColor: T.border }} />
      {/* Right half: fills 0→50% by rotating a colored rectangle into the right clip */}
      <View style={{ position: 'absolute', top: 0, left: half, width: half, height: size, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: 0, left: -half, width: size, height: size, transform: [{ rotate: rRot + 'deg' }] }}>
          <View style={{ position: 'absolute', top: 0, left: half, width: half, height: size, backgroundColor: color }} />
        </View>
      </View>
      {/* Left half: fills 50→100% */}
      {p > 50 && (
        <View style={{ position: 'absolute', top: 0, left: 0, width: half, height: size, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', top: 0, left: 0, width: size, height: size, transform: [{ rotate: lRot + 'deg' }] }}>
            <View style={{ position: 'absolute', top: 0, left: 0, width: half, height: size, backgroundColor: color }} />
          </View>
        </View>
      )}
      {/* Inner circle creates donut hole */}
      <View style={{ position: 'absolute', top: bw, left: bw, width: size - bw * 2, height: size - bw * 2, borderRadius: (size - bw * 2) / 2, backgroundColor: T.bg }} />
    </View>
  );
}

function DashboardScreen({ xp, completedModules, moduleXP, onBack, goalCert }) {
  var rank = getRank(xp);
  var nextThreshold = xp >= 200 ? 200 : xp >= 100 ? 200 : 100;
  var prevThreshold = xp >= 200 ? 100 : 0;
  var rankPct = Math.min(((xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100, 100);
  var nextRank = xp >= 200 ? null : xp >= 100 ? { title: "Master", color: T.gold } : { title: "Journeyman", color: T.purple };
  var allModules = TRACKS.reduce(function(acc, t) { return acc.concat(t.modules); }, []);
  var overallPct = allModules.length > 0 ? Math.round((completedModules.length / allModules.length) * 100) : 0;
  var totalPossibleXP = allModules.reduce(function(sum, mod) {
    return sum + mod.questions.reduce(function(a, q) { return a + q.xp; }, 0);
  }, 0);

  var CERT_TRACK_MAP = { 'PMP': 'pmp', 'AWS': 'aws', 'Scrum': 'scrum', 'CISM': 'cism', 'Security+': 'security' };
  var goalTrack = goalCert ? TRACKS.find(function(t) { return t.id === CERT_TRACK_MAP[goalCert]; }) : null;
  var readinessPct, readinessTrackName;
  if (goalTrack) {
    readinessPct = calcReadiness(goalTrack, completedModules, moduleXP);
    readinessTrackName = goalCert;
  } else {
    var allReadiness = TRACKS.map(function(t) { return calcReadiness(t, completedModules, moduleXP); });
    readinessPct = Math.round(allReadiness.reduce(function(a, b) { return a + b; }, 0) / allReadiness.length);
    readinessTrackName = "All Tracks";
  }
  var readinessColor = readinessPct >= 90 ? T.green : readinessPct >= 70 ? T.blue : readinessPct >= 40 ? T.amber : T.red;
  var readinessMotivation = readinessPct === 100
    ? "You are ready to forge your certification"
    : readinessPct >= 70 ? "Almost there — push to the finish"
    : readinessPct >= 40 ? "Good progress — stay consistent"
    : "Keep forging — you are just getting started";

  var scaleAnim = useRef(new Animated.Value(0)).current;
  useEffect(function() {
    Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }).start();
  }, []);

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.dashHeader}>
        <TouchableOpacity onPress={onBack} style={s.exitBtn}>
          <Text style={s.exitText}>✕</Text>
        </TouchableOpacity>
        <Text style={s.dashTitle}>Progress Dashboard</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>

          <View style={s.readinessCard}>
            <View style={s.readinessRingWrap}>
              <ReadinessRing pct={readinessPct} color={readinessColor} size={140} />
              <View style={s.readinessCenter}>
                <Text style={[s.readinessPct, { color: readinessColor }]}>{readinessPct}%</Text>
              </View>
            </View>
            <Text style={s.readinessLabel}>Exam Readiness</Text>
            <Text style={[s.readinessTrack, { color: readinessColor }]}>{readinessTrackName}</Text>
            <Text style={s.readinessMotivation}>{readinessMotivation}</Text>
          </View>

          <View style={s.dashOverallCard}>
            <Text style={s.dashCardLabel}>Overall Completion</Text>
            <Text style={s.dashBigPct}>{overallPct}%</Text>
            <View style={s.xpBarBg}>
              <View style={[s.xpBarFill, { width: overallPct + "%", backgroundColor: T.accent }]} />
            </View>
            <Text style={s.dashCardSub}>{completedModules.length} of {allModules.length} modules complete</Text>
          </View>

          <View style={s.dashRankCard}>
            <View style={s.rankRow}>
              <View>
                <Text style={s.rankLabel}>Current Rank</Text>
                <Text style={[s.rankTitle, { color: rank.color }]}>{rank.title}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={s.xpLabel}>Total XP</Text>
                <Text style={[s.xpValue, { color: T.gold }]}>{xp} / {totalPossibleXP} XP</Text>
              </View>
            </View>
            <View style={s.xpBarBg}>
              <View style={[s.xpBarFill, { width: rankPct + "%", backgroundColor: rank.color }]} />
            </View>
            {nextRank ? (
              <Text style={s.dashRankHint}>
                {nextThreshold - xp} XP to reach <Text style={{ color: nextRank.color, fontWeight: "700" }}>{nextRank.title}</Text>
              </Text>
            ) : (
              <Text style={[s.dashRankHint, { color: T.gold }]}>Maximum rank achieved. 🏆</Text>
            )}
          </View>

          <Text style={s.dashSectionTitle}>Module Breakdown</Text>

          {TRACKS.map(function(track) {
            return (
              <View key={track.id}>
                <View style={s.dashTrackHeader}>
                  <Text style={[s.dashTrackTitle, { color: track.color }]}>{track.icon}  {track.title}</Text>
                </View>
                {track.modules.map(function(mod) {
                  var done = completedModules.indexOf(mod.id) !== -1;
                  var earned = moduleXP[mod.id] || 0;
                  var possible = mod.questions.reduce(function(a, q) { return a + q.xp; }, 0);
                  var barPct = possible > 0 ? (earned / possible) * 100 : 0;
                  return (
                    <View key={mod.id} style={[s.dashModuleCard, done && { borderColor: mod.color + "66" }]}>
                      <View style={s.dashModuleTop}>
                        <View style={[s.moduleIconWrap, { backgroundColor: mod.color + "22" }]}>
                          <Text style={s.moduleIconText}>{done ? mod.icon : "🔒"}</Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={s.moduleName}>{mod.title}</Text>
                          <Text style={s.moduleDesc}>{mod.desc}</Text>
                        </View>
                        <View style={{ alignItems: "flex-end" }}>
                          <Text style={[s.dashModuleXP, { color: done ? T.gold : T.text2 }]}>{earned} XP</Text>
                          <Text style={s.dashModulePossible}>of {possible}</Text>
                        </View>
                      </View>
                      <View style={s.xpBarBg}>
                        <View style={[s.xpBarFill, { width: barPct + "%", backgroundColor: done ? mod.color : T.border }]} />
                      </View>
                      <View style={s.dashModuleFooter}>
                        <Text style={s.rankSub}>{mod.questions.length} questions</Text>
                        <Text style={[s.rankSub, { color: done ? T.green : T.text2 }]}>{done ? "✓ Complete" : "Not started"}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

var TRACK_META = {
  pmp:      { label: "PMP",       color: T.blue   },
  aws:      { label: "AWS",       color: T.orange  },
  scrum:    { label: "Scrum",     color: T.green   },
  cism:     { label: "CISM",      color: T.purple  },
  security: { label: "Security+", color: T.red     },
};

function timeAgo(iso) {
  var diff = Date.now() - new Date(iso).getTime();
  var mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + "m ago";
  var hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  return Math.floor(hrs / 24) + "d ago";
}

function CommunityScreen({ onOpenPost }) {
  var [posts, setPosts] = useState([]);
  var [loading, setLoading] = useState(true);
  var [composing, setComposing] = useState(false);
  var [composeTrack, setComposeTrack] = useState("pmp");
  var [composeText, setComposeText] = useState("");
  var [posting, setPosting] = useState(false);

  async function fetchPosts() {
    setLoading(true);
    try {
      var res = await supabase
        .from('community_posts')
        .select('id, track_id, content, created_at, user_id, community_replies(id)')
        .order('created_at', { ascending: false })
        .limit(20);
      console.log('[community_posts] data:', res.data, 'error:', res.error);
      if (res.error) {
        console.error('[community_posts] fetch error:', res.error);
        setLoading(false);
        return;
      }
      var postsData = res.data || [];
      var userIds = postsData.map(function(p) { return p.user_id; }).filter(function(id, i, arr) { return arr.indexOf(id) === i; });
      var usernameMap = {};
      if (userIds.length > 0) {
        var profRes = await supabase.from('profiles').select('id, username').in('id', userIds);
        console.log('[profiles] data:', profRes.data, 'error:', profRes.error);
        if (!profRes.error && profRes.data) {
          profRes.data.forEach(function(p) { usernameMap[p.id] = p.username; });
        }
      }
      setPosts(postsData.map(function(p) {
        return Object.assign({}, p, { profiles: { username: usernameMap[p.user_id] || null } });
      }));
    } catch (e) {
      console.error('[community_posts] unexpected error:', e);
    }
    setLoading(false);
  }

  useEffect(function() { fetchPosts(); }, []);

  async function submitPost() {
    var text = composeText.trim();
    if (!text) return;
    setPosting(true);
    try {
      var userRes = await supabase.auth.getUser();
      if (userRes.data && userRes.data.user) {
        var res = await supabase.from('community_posts').insert({
          user_id: userRes.data.user.id,
          track_id: composeTrack,
          content: text,
        });
        if (!res.error) {
          setComposing(false);
          setComposeText("");
          setComposeTrack("pmp");
          fetchPosts();
        }
      }
    } catch (_) {}
    setPosting(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.commHeader}>
          <Text style={s.commTitle}>Community Forge</Text>
          <Text style={s.commSub}>Connect with fellow Forgers</Text>
        </View>
        <ScrollView contentContainerStyle={s.scrollTabbed} showsVerticalScrollIndicator={false}>
          <View style={s.commBannerLive}>
            <Text style={s.commBannerLiveText}>✅ Community is live — be the first to post.</Text>
          </View>
          <Text style={s.commSectionTitle}>Recent Discussions</Text>
          {loading && <Text style={s.commEmptyText}>Loading...</Text>}
          {!loading && posts.length === 0 && (
            <Text style={s.commEmptyText}>No posts yet. Tap + to start the conversation!</Text>
          )}
          {posts.map(function(post) {
            var meta = TRACK_META[post.track_id] || { label: post.track_id, color: T.text2 };
            var replyCount = post.community_replies ? post.community_replies.length : 0;
            var username = post.profiles ? (post.profiles.username || "Forger") : "Forger";
            return (
              <TouchableOpacity key={post.id} style={[s.topicCard, { borderLeftColor: meta.color }]} onPress={function() { onOpenPost(post); }} activeOpacity={0.8}>
                <View style={[s.topicBadge, { backgroundColor: meta.color + "22" }]}>
                  <Text style={[s.topicBadgeText, { color: meta.color }]}>{meta.label}</Text>
                </View>
                <Text style={s.topicTitle}>{post.content}</Text>
                <View style={s.topicFooter}>
                  <Text style={s.topicUser}>@{username} · {timeAgo(post.created_at)}</Text>
                  <Text style={s.topicReplies}>💬 {replyCount}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaView>

      <TouchableOpacity style={s.composeFab} onPress={function() { setComposing(true); }} activeOpacity={0.85}>
        <Text style={s.composeFabIcon}>+</Text>
      </TouchableOpacity>

      {composing && (
        <View style={s.composeOverlay}>
          <View style={s.composeModal}>
            <View style={s.composeModalHeader}>
              <Text style={s.composeModalTitle}>New Post</Text>
              <TouchableOpacity onPress={function() { setComposing(false); setComposeText(""); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={s.composeModalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.composeLabel}>Track</Text>
            <View style={s.composeTrackRow}>
              {Object.keys(TRACK_META).map(function(key) {
                var m = TRACK_META[key];
                var active = composeTrack === key;
                return (
                  <TouchableOpacity key={key} style={[s.composeTrackChip, active && { backgroundColor: m.color, borderColor: m.color }]} onPress={function() { setComposeTrack(key); }} activeOpacity={0.8}>
                    <Text style={[s.composeTrackChipText, { color: active ? "#fff" : T.text2 }]}>{m.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={s.composeLabel}>Post</Text>
            <TextInput
              style={s.composeInput}
              value={composeText}
              onChangeText={setComposeText}
              placeholder="Share a question, tip, or insight..."
              placeholderTextColor={T.text2}
              multiline
              maxLength={280}
              autoFocus
            />
            <Text style={s.composeCount}>{composeText.length}/280</Text>
            <TouchableOpacity
              style={[s.composePostBtn, (!composeText.trim() || posting) && { opacity: 0.5 }]}
              onPress={submitPost}
              disabled={!composeText.trim() || posting}
              activeOpacity={0.85}
            >
              <Text style={s.composePostBtnText}>{posting ? "Posting..." : "Post"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

function PostDetailScreen({ post, onBack }) {
  var [replies, setReplies] = useState([]);
  var [loading, setLoading] = useState(true);
  var [replyText, setReplyText] = useState("");
  var [submitting, setSubmitting] = useState(false);
  var meta = TRACK_META[post.track_id] || { label: post.track_id, color: T.text2 };
  var postUsername = post.profiles ? (post.profiles.username || "Forger") : "Forger";

  async function fetchReplies() {
    setLoading(true);
    try {
      var res = await supabase
        .from('community_replies')
        .select('id, content, created_at, user_id')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });
      console.log('[community_replies] data:', res.data, 'error:', res.error);
      if (res.error) {
        console.error('[community_replies] fetch error:', res.error);
        setLoading(false);
        return;
      }
      var repliesData = res.data || [];
      var userIds = repliesData.map(function(r) { return r.user_id; }).filter(function(id, i, arr) { return arr.indexOf(id) === i; });
      var usernameMap = {};
      if (userIds.length > 0) {
        var profRes = await supabase.from('profiles').select('id, username').in('id', userIds);
        console.log('[profiles] data:', profRes.data, 'error:', profRes.error);
        if (!profRes.error && profRes.data) {
          profRes.data.forEach(function(p) { usernameMap[p.id] = p.username; });
        }
      }
      setReplies(repliesData.map(function(r) {
        return Object.assign({}, r, { profiles: { username: usernameMap[r.user_id] || null } });
      }));
    } catch (e) {
      console.error('[community_replies] unexpected error:', e);
    }
    setLoading(false);
  }

  useEffect(function() { fetchReplies(); }, []);

  async function submitReply() {
    var text = replyText.trim();
    if (!text) return;
    setSubmitting(true);
    try {
      var userRes = await supabase.auth.getUser();
      if (userRes.data && userRes.data.user) {
        var res = await supabase.from('community_replies').insert({
          post_id: post.id,
          user_id: userRes.data.user.id,
          content: text,
        });
        if (!res.error) {
          setReplyText("");
          fetchReplies();
        }
      }
    } catch (_) {}
    setSubmitting(false);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: T.bg }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.dashHeader}>
          <TouchableOpacity onPress={onBack} style={s.exitBtn}>
            <Text style={s.exitText}>✕</Text>
          </TouchableOpacity>
          <Text style={s.dashTitle}>Discussion</Text>
          <View style={{ width: 34 }} />
        </View>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={[s.postDetailCard, { borderLeftColor: meta.color }]}>
            <View style={[s.topicBadge, { backgroundColor: meta.color + "22" }]}>
              <Text style={[s.topicBadgeText, { color: meta.color }]}>{meta.label}</Text>
            </View>
            <Text style={s.postDetailContent}>{post.content}</Text>
            <Text style={s.postDetailMeta}>@{postUsername} · {timeAgo(post.created_at)}</Text>
          </View>
          <Text style={s.commSectionTitle}>
            {loading ? "Replies" : replies.length + " " + (replies.length === 1 ? "Reply" : "Replies")}
          </Text>
          {loading && <Text style={s.commEmptyText}>Loading replies...</Text>}
          {!loading && replies.length === 0 && (
            <Text style={s.commEmptyText}>No replies yet. Be the first!</Text>
          )}
          {replies.map(function(reply) {
            var rUser = reply.profiles ? (reply.profiles.username || "Forger") : "Forger";
            return (
              <View key={reply.id} style={s.replyCard}>
                <Text style={s.replyUser}>@{rUser} · {timeAgo(reply.created_at)}</Text>
                <Text style={s.replyContent}>{reply.content}</Text>
              </View>
            );
          })}
        </ScrollView>
        <View style={s.replyInputRow}>
          <TextInput
            style={s.replyInput}
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Write a reply..."
            placeholderTextColor={T.text2}
            maxLength={280}
            returnKeyType="send"
            onSubmitEditing={submitReply}
          />
          <TouchableOpacity
            style={[s.replySubmitBtn, (!replyText.trim() || submitting) && { opacity: 0.5 }]}
            onPress={submitReply}
            disabled={!replyText.trim() || submitting}
            activeOpacity={0.85}
          >
            <Text style={s.replySubmitText}>{submitting ? "·" : "↑"}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

function ProfileScreen({ session, xp, streak, completedModules, moduleXP, onSignOut, badges, goalCert }) {
  var [email, setEmail] = useState("");
  var [username, setUsername] = useState("Forger");
  var [editing, setEditing] = useState(false);
  var [editValue, setEditValue] = useState("");
  var [showAbout, setShowAbout] = useState(false);
  var rank = getRank(xp);

  function shareOnLinkedIn() {
    var certTag = goalCert ? ' #' + goalCert.replace(/[^a-zA-Z0-9]/g, '') : '';
    var text = 'I just reached ' + rank.title + ' rank on CertForge with ' + xp + ' XP! Studying for my certification with the best cert prep app out there. #CertForge' + certTag + ' #Certification';
    var url = 'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fcertforge.app&summary=' + encodeURIComponent(text);
    Linking.openURL(url);
  }
  var allModules = TRACKS.reduce(function(acc, t) { return acc.concat(t.modules); }, []);
  var doneModules = allModules.filter(function(m) { return completedModules.indexOf(m.id) !== -1; });

  useEffect(function() {
    supabase.auth.getUser().then(function(res) {
      if (res.data && res.data.user) {
        setEmail(res.data.user.email || "");
        supabase.from('profiles').select('username').eq('id', res.data.user.id).single().then(function(result) {
          if (result.data && result.data.username) setUsername(result.data.username);
        });
      }
    });
  }, []);

  async function saveUsername() {
    setEditing(false);
    var trimmed = editValue.trim();
    if (!trimmed || trimmed === username) return;
    setUsername(trimmed);
    try {
      var res = await supabase.auth.getUser();
      if (res.data && res.data.user) {
        await supabase.from('profiles').upsert({ id: res.data.user.id, username: trimmed }, { onConflict: 'id' });
      }
    } catch (_) {}
  }

  return (
    <View style={{ flex: 1 }}>
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scrollTabbed} showsVerticalScrollIndicator={false}>
        <View style={s.profileNameRow}>
          {editing ? (
            <TextInput
              style={s.profileNameInput}
              value={editValue}
              onChangeText={setEditValue}
              onBlur={saveUsername}
              autoFocus
              maxLength={24}
              placeholderTextColor={T.text2}
            />
          ) : (
            <>
              <Text style={[s.profilePageTitle, { marginBottom: 0 }]}>{username}</Text>
              <TouchableOpacity onPress={function() { setEditValue(username); setEditing(true); }} style={s.profileEditBtn} activeOpacity={0.7}>
                <Text style={s.profileEditIcon}>✏️</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={s.profileCard}>
          <Text style={s.profileEmail}>{email || "—"}</Text>
          <View style={s.profileStatsRow}>
            <View style={s.profileStat}>
              <Text style={[s.profileStatNum, { color: rank.color }]}>{rank.title}</Text>
              <Text style={s.profileStatLabel}>Rank</Text>
            </View>
            <View style={s.profileStatDiv} />
            <View style={s.profileStat}>
              <Text style={[s.profileStatNum, { color: T.gold }]}>{xp}</Text>
              <Text style={s.profileStatLabel}>Total XP</Text>
            </View>
            <View style={s.profileStatDiv} />
            <View style={s.profileStat}>
              <Text style={[s.profileStatNum, { color: T.accent }]}>🔥 {streak}</Text>
              <Text style={s.profileStatLabel}>Streak</Text>
            </View>
          </View>
        </View>

        <Text style={s.profileSectionTitle}>Badges</Text>
        <View style={s.badgeGrid}>
          {BADGES.map(function(badge) {
            var earned = badges && badges.indexOf(badge.id) !== -1;
            return (
              <View key={badge.id} style={[s.badgeCell, !earned && s.badgeCellLocked]}>
                <Text style={s.badgeCellIcon}>{earned ? badge.icon : '🔒'}</Text>
                <Text style={[s.badgeCellTitle, !earned && { color: T.text2 }]}>{badge.title}</Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={s.linkedInBtn} onPress={shareOnLinkedIn} activeOpacity={0.85}>
          <Text style={s.linkedInBtnText}>Share on LinkedIn</Text>
        </TouchableOpacity>

        <Text style={s.profileSectionTitle}>Completed Modules</Text>
        {doneModules.length === 0 && (
          <Text style={s.profileEmpty}>No modules completed yet. Start forging!</Text>
        )}
        {doneModules.map(function(mod) {
          return (
            <View key={mod.id} style={[s.profileModuleRow, { borderLeftColor: mod.color }]}>
              <Text style={s.profileModuleIcon}>{mod.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.profileModuleName}>{mod.title}</Text>
                <Text style={s.profileModuleTrack}>{mod.trackId.toUpperCase()}</Text>
              </View>
              <Text style={[s.profileModuleXP, { color: T.gold }]}>+{moduleXP[mod.id] || 0} XP</Text>
            </View>
          );
        })}

        <TouchableOpacity style={s.signOutBtn} onPress={onSignOut} activeOpacity={0.8}>
          <Text style={s.signOutBtnText}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.aboutRow} onPress={function() { setShowAbout(true); }} activeOpacity={0.8}>
          <Text style={s.aboutRowText}>About CertForge ℹ️</Text>
          <Text style={s.aboutRowArrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>

    {showAbout && (
      <View style={s.aboutOverlay}>
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <View style={s.aboutCard}>
            <Text style={s.aboutCardIcon}>⚒️</Text>
            <Text style={s.aboutCardName}>CertForge</Text>
            <Text style={s.aboutCardVersion}>Beta 1.0</Text>
            <Text style={s.aboutCardMission}>{"CertForge was built to make professional certification accessible, engaging, and actually enjoyable. No more boring PDFs. No more static question banks. Just daily training that forges real knowledge."}</Text>
            <Text style={s.aboutCardCreds}>Built by a certified professional — AWS Solutions Architect · CISM · PMP · PSM II</Text>
            <TouchableOpacity style={s.aboutCloseBtn} onPress={function() { setShowAbout(false); }} activeOpacity={0.85}>
              <Text style={s.aboutCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    )}
    </View>
  );
}

const ONBOARDING_SLIDES = [
  { icon: '⚒️', title: 'Welcome to CertForge', subtitle: 'The certification training dojo. Forge your skills one question at a time.' },
  { icon: '🏆', title: 'Earn XP. Rank Up.', subtitle: 'Answer questions, earn XP, and climb from Apprentice to Journeyman to Master. Every correct answer forges your rank.' },
  { icon: '🎯', title: 'Pick Your Track', subtitle: 'PMP. AWS. CISM. Security+. Scrum. Choose your certification and start forging today.' },
  { title: 'Set Your Goal', subtitle: 'Tell us about your certification journey so we can personalize your experience.' },
];
const GOAL_CERTS = ['PMP', 'AWS', 'Scrum', 'CISM', 'Security+'];
const GOAL_TIMES = ['15 min', '30 min', '1 hour', '2+ hours'];

function OnboardingScreen({ onComplete }) {
  var [slide, setSlide] = useState(0);
  var [goalCert, setGoalCert] = useState('');
  var [goalTime, setGoalTime] = useState('');
  var [goalDate, setGoalDate] = useState('');
  var isLast = slide === ONBOARDING_SLIDES.length - 1;
  var current = ONBOARDING_SLIDES[slide];
  function handleNext() {
    if (isLast) { onComplete(goalCert, goalTime, goalDate); } else { setSlide(slide + 1); }
  }
  return (
    <SafeAreaView style={[s.safe, s.center]}>
      {slide < 3 ? (
        <View style={s.onboardingSlide}>
          <Text style={s.onboardingIcon}>{current.icon}</Text>
          <Text style={s.onboardingTitle}>{current.title}</Text>
          <Text style={s.onboardingSubtitle}>{current.subtitle}</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={s.onboardingGoalSlide} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={s.onboardingTitle}>{current.title}</Text>
          <Text style={[s.onboardingSubtitle, { marginBottom: 28 }]}>{current.subtitle}</Text>

          <Text style={s.onboardingGoalLabel}>Primary certification target</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.onboardingChipScroll} style={{ marginBottom: 24 }}>
            {GOAL_CERTS.map(function(cert) {
              var active = goalCert === cert;
              return (
                <TouchableOpacity key={cert} style={[s.onboardingChip, active && s.onboardingChipActive]} onPress={function() { setGoalCert(active ? '' : cert); }} activeOpacity={0.8}>
                  <Text style={[s.onboardingChipText, active && s.onboardingChipTextActive]}>{cert}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={s.onboardingGoalLabel}>Daily study time</Text>
          <View style={s.onboardingChipRow}>
            {GOAL_TIMES.map(function(t) {
              var active = goalTime === t;
              return (
                <TouchableOpacity key={t} style={[s.onboardingChip, active && s.onboardingChipActive]} onPress={function() { setGoalTime(active ? '' : t); }} activeOpacity={0.8}>
                  <Text style={[s.onboardingChipText, active && s.onboardingChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={s.onboardingGoalLabel}>Exam date (optional)</Text>
          <TextInput
            style={s.onboardingDateInput}
            value={goalDate}
            onChangeText={setGoalDate}
            placeholder="MM/DD/YYYY"
            placeholderTextColor={T.text2}
            keyboardType="numbers-and-punctuation"
            maxLength={10}
          />
        </ScrollView>
      )}
      <View style={s.onboardingDots}>
        {ONBOARDING_SLIDES.map(function(_, i) {
          return <View key={i} style={[s.onboardingDot, i === slide && s.onboardingDotActive]} />;
        })}
      </View>
      <TouchableOpacity style={s.onboardingBtn} onPress={handleNext} activeOpacity={0.85}>
        <Text style={s.onboardingBtnText}>{isLast ? 'Start Forging' : 'Next'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function LeaderboardScreen() {
  var [entries, setEntries] = useState([]);
  var [loading, setLoading] = useState(true);
  var [currentUserId, setCurrentUserId] = useState(null);

  useEffect(function() {
    supabase.auth.getUser().then(function(res) {
      if (res.data && res.data.user) setCurrentUserId(res.data.user.id);
    });
    async function fetchLeaderboard() {
      try {
        var res = await supabase
          .from('leaderboard')
          .select('id, username, total_xp, current_streak, rank, position')
          .order('total_xp', { ascending: false })
          .limit(50);
        console.log('[leaderboard] data:', res.data, 'error:', res.error);
        if (res.error) {
          console.error('[leaderboard] fetch error:', res.error);
        } else {
          setEntries(res.data || []);
        }
      } catch (e) {
        console.error('[leaderboard] unexpected error:', e);
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  var MEDAL = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };
  var today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.lbHeader}>
        <Text style={s.lbTitle}>Weekly Forge Rankings</Text>
        <Text style={s.lbDate}>{today}</Text>
      </View>
      <ScrollView contentContainerStyle={s.scrollTabbed} showsVerticalScrollIndicator={false}>
        {loading && <Text style={s.commEmptyText}>Loading rankings...</Text>}
        {!loading && entries.length === 0 && (
          <Text style={s.commEmptyText}>Be the first Forger on the board — complete a module to appear here.</Text>
        )}
        {entries.map(function(entry, i) {
          var pos = entry.position != null ? entry.position : i + 1;
          var rank = getRank(entry.total_xp || 0);
          var medalColor = MEDAL[pos] || null;
          var isSelf = entry.id === currentUserId;
          return (
            <View key={entry.id} style={[s.lbRow, isSelf && s.lbRowSelf]}>
              <Text style={[s.lbPos, medalColor ? { color: medalColor, fontWeight: '800' } : {}]}>{pos}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.lbUsername}>@{entry.username || "Forger"}</Text>
                <Text style={[s.lbRank, { color: rank.color }]}>{rank.title}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.lbXP}>{entry.total_xp || 0} XP</Text>
                <Text style={s.lbStreak}>🔥 {entry.current_streak || 0}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function TabBar({ tab, onTab }) {
  var tabs = [
    { id: "learn", icon: "📚", label: "Learn" },
    { id: "community", icon: "💬", label: "Community" },
    { id: "leaderboard", icon: "🏆", label: "Leaderboard" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];
  return (
    <View style={s.tabBar}>
      {tabs.map(function(t) {
        var active = tab === t.id;
        return (
          <TouchableOpacity key={t.id} style={s.tabItem} onPress={function() { onTab(t.id); }} activeOpacity={0.7}>
            <Text style={[s.tabIcon, active && { color: T.accent }]}>{t.icon}</Text>
            <Text style={[s.tabLabel, { color: active ? T.accent : T.text2 }]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function App() {
  var [screen, setScreen] = useState("splash");
  var [activeModule, setActiveModule] = useState(null);
  var [xp, setXP] = useState(0);
  var [streak, setStreak] = useState(0);
  var [completedModules, setCompletedModules] = useState([]);
  var [lessonResult, setLessonResult] = useState(null);
  var [moduleXP, setModuleXP] = useState({});
  var loaded = useRef(false);
  var [session, setSession] = useState(null);
  var [remoteLoaded, setRemoteLoaded] = useState(false);
  var [tab, setTab] = useState("learn");
  var [activePost, setActivePost] = useState(null);
  var [badges, setBadges] = useState([]);
  var [newBadge, setNewBadge] = useState(null);
  var [onboardingDone, setOnboardingDone] = useState(true);
  var [dailyChallengeComplete, setDailyChallengeComplete] = useState(false);
  var [weakAreas, setWeakAreas] = useState([]);
  var [goalCert, setGoalCert] = useState('');
  var [goalDailyTime, setGoalDailyTime] = useState('');
  var [goalExamDate, setGoalExamDate] = useState('');

  useEffect(function() {
    supabase.auth.getSession().then(function(result) {
      setSession(result.data.session);
    });
    var listener = supabase.auth.onAuthStateChange(function(_event, sess) {
      setSession(sess);
    });
    return function() { listener.data.subscription.unsubscribe(); };
  }, []);

  useEffect(function() {
    async function load() {
      try {
        var storedXP        = await AsyncStorage.getItem('certforge_xp');
        var storedStreak    = await AsyncStorage.getItem('certforge_streak');
        var storedModules   = await AsyncStorage.getItem('certforge_completedModules');
        var storedModuleXP  = await AsyncStorage.getItem('certforge_moduleXP');
        var lastActive      = await AsyncStorage.getItem('certforge_last_active');
        var storedBadges    = await AsyncStorage.getItem('certforge_badges');
        var storedOnboarding = await AsyncStorage.getItem('certforge_onboarding_complete');
        if (storedOnboarding === null) setOnboardingDone(false);
        var storedDaily = await AsyncStorage.getItem('certforge_daily_challenge_' + today);
        if (storedDaily !== null) setDailyChallengeComplete(true);
        var storedWeakAreas = await AsyncStorage.getItem('certforge_weak_areas');
        if (storedWeakAreas !== null) setWeakAreas(JSON.parse(storedWeakAreas));
        var storedGoalCert  = await AsyncStorage.getItem('certforge_goal_cert');
        var storedGoalTime  = await AsyncStorage.getItem('certforge_goal_daily_time');
        var storedGoalDate  = await AsyncStorage.getItem('certforge_goal_exam_date');
        if (storedGoalCert)  setGoalCert(storedGoalCert);
        if (storedGoalTime)  setGoalDailyTime(storedGoalTime);
        if (storedGoalDate)  setGoalExamDate(storedGoalDate);

        var d = new Date();
        var today = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        var yd = new Date(); yd.setDate(yd.getDate() - 1);
        var yesterday = yd.getFullYear() + '-' + String(yd.getMonth() + 1).padStart(2, '0') + '-' + String(yd.getDate()).padStart(2, '0');

        var parsedXP = storedXP !== null ? JSON.parse(storedXP) : 0;
        var parsedModules = storedModules !== null ? JSON.parse(storedModules) : [];
        if (storedXP !== null) setXP(parsedXP);
        if (storedModules !== null) setCompletedModules(parsedModules);
        if (storedModuleXP !== null) setModuleXP(JSON.parse(storedModuleXP));

        var base = storedStreak !== null ? JSON.parse(storedStreak) : 0;
        var computed = lastActive === today ? base
                     : lastActive === yesterday ? base + 1
                     : 0;
        setStreak(computed);

        var savedBadges = storedBadges !== null ? JSON.parse(storedBadges) : [];
        var computedBadges = checkBadges(parsedXP, computed, parsedModules, null);
        var merged = savedBadges.concat(computedBadges.filter(function(id) { return savedBadges.indexOf(id) === -1; }));
        setBadges(merged);

        await AsyncStorage.setItem('certforge_last_active', today);
      } catch (_) {}
      loaded.current = true;
    }
    load();
  }, []);

  useEffect(function() {
    if (!loaded.current) return;
    AsyncStorage.setItem('certforge_xp', JSON.stringify(xp));
    AsyncStorage.setItem('certforge_streak', JSON.stringify(streak));
    AsyncStorage.setItem('certforge_completedModules', JSON.stringify(completedModules));
    AsyncStorage.setItem('certforge_moduleXP', JSON.stringify(moduleXP));
  }, [xp, streak, completedModules, moduleXP]);

  useEffect(function() {
    if (!loaded.current) return;
    AsyncStorage.setItem('certforge_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(function() {
    if (!session) {
      setRemoteLoaded(false);
      return;
    }

    async function loadFromSupabase() {
      var userId = session.user.id;
      var fbXP = 0, fbStreak = 0, fbModules = [], fbModuleXP = {};

      try {
        var sXP   = await AsyncStorage.getItem('certforge_xp');
        var sStr  = await AsyncStorage.getItem('certforge_streak');
        var sMods = await AsyncStorage.getItem('certforge_completedModules');
        var sModXP = await AsyncStorage.getItem('certforge_moduleXP');
        if (sXP    !== null) fbXP       = JSON.parse(sXP);
        if (sStr   !== null) fbStreak   = JSON.parse(sStr);
        if (sMods  !== null) fbModules  = JSON.parse(sMods);
        if (sModXP !== null) fbModuleXP = JSON.parse(sModXP);
      } catch (_) {}

      try {
        var statsRes = await supabase.from('user_stats').select('total_xp,current_streak').eq('id', userId).single();
        if (statsRes.data) {
          setXP(statsRes.data.total_xp || 0);
          setStreak(statsRes.data.current_streak || 0);
        } else {
          setXP(fbXP);
          setStreak(fbStreak);
        }
      } catch (_) {
        setXP(fbXP);
        setStreak(fbStreak);
      }

      var finalModules = fbModules;
      try {
        var progRes = await supabase.from('progress').select('module_id,score_percentage,xp_earned').eq('user_id', userId);
        if (!progRes.error) {
          var rows = progRes.data || [];
          var doneIds = rows
            .filter(function(r) { return r.score_percentage >= 70; })
            .map(function(r) { return parseInt(r.module_id, 10); });
          var xpMap = {};
          rows.forEach(function(r) { xpMap[parseInt(r.module_id, 10)] = r.xp_earned; });
          setCompletedModules(doneIds);
          setModuleXP(xpMap);
          finalModules = doneIds;
        } else {
          setCompletedModules(fbModules);
          setModuleXP(fbModuleXP);
        }
      } catch (_) {
        setCompletedModules(fbModules);
        setModuleXP(fbModuleXP);
      }

      try {
        var sbBadges = await AsyncStorage.getItem('certforge_badges');
        var existingBadges = sbBadges !== null ? JSON.parse(sbBadges) : [];
        var finalXP = 0, finalStreak = 0;
        try { var sxp = await AsyncStorage.getItem('certforge_xp'); if (sxp) finalXP = JSON.parse(sxp); } catch (_) {}
        try { var sst = await AsyncStorage.getItem('certforge_streak'); if (sst) finalStreak = JSON.parse(sst); } catch (_) {}
        var computedFromLoad = checkBadges(finalXP, finalStreak, finalModules, null);
        var mergedFromLoad = existingBadges.concat(computedFromLoad.filter(function(id) { return existingBadges.indexOf(id) === -1; }));
        setBadges(mergedFromLoad);
      } catch (_) {}

      loaded.current = true;
      setRemoteLoaded(true);
    }

    loadFromSupabase();
  }, [session]);

  useEffect(function() {
    if (screen === "splash") {
      var t = setTimeout(function() { setScreen("home"); }, 2800);
      return function() { clearTimeout(t); };
    }
  }, [screen]);

  useEffect(function() {
    if (!newBadge) return;
    var t = setTimeout(function() { setNewBadge(null); }, 2500);
    return function() { clearTimeout(t); };
  }, [newBadge]);

  function startLesson(mod) { setActiveModule(mod); setScreen("lesson"); }

  function startPractice() {
    var pool = TRACKS.reduce(function(acc, t) {
      return acc.concat(t.modules.reduce(function(a, m) { return a.concat(m.questions); }, []));
    }, []);
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    startLesson({ id: "practice", trackId: "practice", title: "Practice Mode", icon: "🎯", questions: pool.slice(0, 5), color: T.orange, desc: "Random mix from all modules" });
  }

  function startDailyChallenge() {
    var dc = getDailyQuestion();
    startLesson({
      id: 'daily_' + dc.dateStr,
      trackId: 'daily',
      title: 'Daily Challenge',
      icon: '⚡',
      color: T.gold,
      desc: 'Daily question for ' + dc.dateStr,
      questions: [Object.assign({}, dc.question, { xp: 25 })],
    });
  }

  async function finishLesson(earned, correct, total) {
    var newXP = xp + earned;
    var score = Math.round(correct / total * 100);
    var isDaily = activeModule.trackId === 'daily';
    var newCompletedModules = !isDaily && activeModule.id !== "practice" && completedModules.indexOf(activeModule.id) === -1
      ? completedModules.concat([activeModule.id])
      : completedModules;
    setXP(function(prev) { return prev + earned; });
    if (!isDaily && activeModule.id !== "practice") {
      setCompletedModules(function(prev) { return prev.indexOf(activeModule.id) === -1 ? prev.concat([activeModule.id]) : prev; });
      setModuleXP(function(prev) { return Object.assign({}, prev, { [activeModule.id]: (prev[activeModule.id] || 0) + earned }); });
    }
    if (isDaily) {
      var d0 = new Date();
      var todayKey = 'certforge_daily_challenge_' + d0.getFullYear() + '-' + String(d0.getMonth() + 1).padStart(2, '0') + '-' + String(d0.getDate()).padStart(2, '0');
      AsyncStorage.setItem(todayKey, '1');
      setDailyChallengeComplete(true);
    }
    setLessonResult({ correct: correct, total: total, xpEarned: earned, moduleName: activeModule.title });
    setScreen("result");

    if (!isDaily && activeModule.id !== 'practice') {
      var withoutCurrent = weakAreas.filter(function(id) { return id !== activeModule.id; });
      var updatedWeakAreas = score < 70 ? withoutCurrent.concat([activeModule.id]) : withoutCurrent;
      setWeakAreas(updatedWeakAreas);
      AsyncStorage.setItem('certforge_weak_areas', JSON.stringify(updatedWeakAreas));
    }

    var earnedIds = checkBadges(newXP, streak, newCompletedModules, score);
    var newlyEarned = earnedIds.filter(function(id) { return badges.indexOf(id) === -1; });
    if (newlyEarned.length > 0) {
      var updatedBadges = badges.concat(newlyEarned);
      setBadges(updatedBadges);
      var badgeDef = BADGES.find(function(b) { return b.id === newlyEarned[0]; });
      setTimeout(function() { setNewBadge(badgeDef); }, 600);
    }

    var d = new Date();
    var today = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    var now = d.toISOString();
    var userId;
    try { var userRes = await supabase.auth.getUser(); userId = userRes.data.user.id; } catch (_) {}
    if (!userId) return;

    if (!isDaily) {
      try {
        await supabase.from('progress').upsert({
          user_id: userId,
          module_id: String(activeModule.id),
          track_id: activeModule.trackId,
          xp_earned: earned,
          score_percentage: Math.round(correct / total * 100),
          correct_answers: correct,
          total_questions: total,
          completed_at: now,
        }, { onConflict: 'user_id,module_id' });
      } catch (e) { console.log('progress upsert error', e); }
    }

    try {
      await supabase.from('user_stats').upsert({
        id: userId,
        total_xp: newXP,
        current_streak: streak,
        last_active: today,
        rank: getRank(newXP).title,
        updated_at: now,
      }, { onConflict: 'id' });
    } catch (e) { console.log('user_stats upsert error', e); }
  }

  function goHome() { setScreen("home"); setActiveModule(null); setLessonResult(null); }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSession(null);
  }

  if (!session) return <AuthScreen onAuth={setSession} />;
  if (!remoteLoaded) return (
    <SafeAreaView style={[s.safe, s.center]}>
      <Text style={{ color: T.text2, fontSize: 16, fontWeight: '600' }}>Forging your progress...</Text>
    </SafeAreaView>
  );
  if (!onboardingDone) return <OnboardingScreen onComplete={function(cert, time, date) {
    AsyncStorage.setItem('certforge_onboarding_complete', '1');
    if (cert) { AsyncStorage.setItem('certforge_goal_cert', cert); setGoalCert(cert); }
    if (time) { AsyncStorage.setItem('certforge_goal_daily_time', time); setGoalDailyTime(time); }
    if (date) { AsyncStorage.setItem('certforge_goal_exam_date', date); setGoalExamDate(date); }
    setOnboardingDone(true);
  }} />;
  if (screen === "splash") return <SplashScreen />;
  if (screen === "lesson") return <LessonScreen module={activeModule} onComplete={finishLesson} onExit={goHome} />;
  if (screen === "result") return (
    <View style={{ flex: 1 }}>
      <ResultScreen correct={lessonResult.correct} total={lessonResult.total} xpEarned={lessonResult.xpEarned} moduleName={lessonResult.moduleName} onHome={goHome} />
      {newBadge && (
        <View style={s.badgeOverlay}>
          <View style={s.badgeOverlayCard}>
            <Text style={s.badgeOverlayEmoji}>{newBadge.icon}</Text>
            <Text style={s.badgeOverlayUnlocked}>Badge Unlocked!</Text>
            <Text style={s.badgeOverlayTitle}>{newBadge.title}</Text>
            <Text style={s.badgeOverlayDesc}>{newBadge.description}</Text>
          </View>
        </View>
      )}
    </View>
  );
  if (screen === "post_detail") return <PostDetailScreen post={activePost} onBack={function() { setActivePost(null); setScreen("home"); setTab("community"); }} />;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      {tab === "learn" && (screen === "dashboard"
        ? <DashboardScreen xp={xp} completedModules={completedModules} moduleXP={moduleXP} onBack={goHome} goalCert={goalCert} />
        : <HomeScreen xp={xp} streak={streak} onStart={startLesson} completedModules={completedModules} moduleXP={moduleXP} onDashboard={function() { setScreen("dashboard"); }} onPractice={startPractice} dailyChallengeComplete={dailyChallengeComplete} onStartDaily={startDailyChallenge} weakAreas={weakAreas} />
      )}
      {tab === "community" && <CommunityScreen onOpenPost={function(post) { setActivePost(post); setScreen("post_detail"); }} />}
      {tab === "leaderboard" && <LeaderboardScreen />}
      {tab === "profile" && <ProfileScreen session={session} xp={xp} streak={streak} completedModules={completedModules} moduleXP={moduleXP} onSignOut={handleSignOut} badges={badges} goalCert={goalCert} />}
      <TabBar tab={tab} onTab={setTab} />
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  center: { alignItems: "center", justifyContent: "center" },
  scroll: { padding: 20, paddingBottom: 88 },
  scrollTabbed: { padding: 20, paddingBottom: 88 },

  splashIcon: { fontSize: 72, marginBottom: 16 },
  splashName: { fontSize: 42, fontWeight: "800", color: T.text, letterSpacing: -1, marginBottom: 8 },
  splashTag: { fontSize: 16, color: T.accent, fontWeight: "700", marginBottom: 24 },
  splashDivider: { width: 40, height: 2, backgroundColor: T.border, marginBottom: 16 },
  splashSub: { fontSize: 13, color: T.text2, letterSpacing: 1 },

  homeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  greeting: { fontSize: 13, color: T.text2, marginBottom: 2 },
  username: { fontSize: 30, fontWeight: "800", color: T.text, letterSpacing: -0.5 },
  streakBadge: { backgroundColor: T.card, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: T.accent + "44" },
  streakFire: { fontSize: 22 },
  streakNum: { fontSize: 15, fontWeight: "800", color: T.accent, marginTop: 2 },

  rankCard: { backgroundColor: T.card, borderRadius: 16, padding: 18, marginBottom: 24, borderWidth: 1, borderColor: T.border },
  rankRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  rankLabel: { fontSize: 11, color: T.text2, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  rankTitle: { fontSize: 22, fontWeight: "800" },
  xpLabel: { fontSize: 11, color: T.text2, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  xpValue: { fontSize: 20, fontWeight: "800" },
  xpBarBg: { height: 6, backgroundColor: T.border, borderRadius: 3, marginBottom: 8 },
  xpBarFill: { height: 6, borderRadius: 3 },
  rankFooter: { flexDirection: "row", justifyContent: "space-between" },
  rankSub: { fontSize: 10, color: T.text2 },

  sectionHeader: { marginBottom: 14 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: T.text, marginBottom: 3 },
  sectionSub: { fontSize: 12, color: T.text2 },

  moduleCard: { backgroundColor: T.card, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: T.border },
  moduleLocked: { opacity: 0.45 },
  moduleIconWrap: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 14 },
  moduleIconText: { fontSize: 24 },
  moduleInfo: { flex: 1 },
  moduleName: { fontSize: 15, fontWeight: "700", color: T.text, marginBottom: 3 },
  moduleDesc: { fontSize: 11, color: T.text2, marginBottom: 4 },
  moduleMeta: { fontSize: 11, color: T.text2 },
  moduleRight: { marginLeft: 10, alignItems: "center" },
  startBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  startBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  moduleXPBadge: { position: "absolute", top: 10, right: 10, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  moduleXPBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800", letterSpacing: 0.3 },

  comingSoonCard: { marginTop: 8, backgroundColor: T.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border, borderStyle: "dashed", alignItems: "center" },
  comingSoonTitle: { fontSize: 14, color: T.text2, fontWeight: "600", marginBottom: 6 },
  comingSoonSub: { fontSize: 12, color: T.text2, textAlign: "center" },
  comingSoonTags: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" },
  comingSoonTag: { backgroundColor: T.card2, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: T.border },
  comingSoonTagText: { fontSize: 11, color: T.text2, fontWeight: "600" },

  lessonTop: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12, backgroundColor: T.bg },
  exitBtn: { width: 34, height: 34, alignItems: "center", justifyContent: "center", backgroundColor: T.card, borderRadius: 10 },
  exitText: { color: T.text2, fontSize: 14, fontWeight: "700" },
  progressBarBg: { flex: 1, height: 8, backgroundColor: T.border, borderRadius: 4 },
  progressBarFill: { height: 8, borderRadius: 4 },
  xpPill: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  xpPillText: { fontSize: 12, fontWeight: "700" },

  questionNum: { fontSize: 12, color: T.text2, marginBottom: 10, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  questionCard: { backgroundColor: T.card, borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: T.border },
  questionText: { color: T.text, fontSize: 17, fontWeight: "600", lineHeight: 27 },

  optionBtn: { borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "center", borderWidth: 1.5, gap: 12 },
  optionLetterWrap: { width: 28, height: 28, borderRadius: 8, borderWidth: 1.5, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  optionLetter: { fontWeight: "700", fontSize: 13 },
  optionText: { fontSize: 14, flex: 1, lineHeight: 20, fontWeight: "500" },

  explanationCard: { backgroundColor: T.card, borderRadius: 16, padding: 18, marginTop: 4, borderWidth: 2 },
  explanationHeader: { fontSize: 15, fontWeight: "800", marginBottom: 10 },
  explanationText: { color: T.text2, fontSize: 14, lineHeight: 22, marginBottom: 18 },
  nextBtn: { borderRadius: 12, padding: 15, alignItems: "center" },
  nextBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },

  resultContainer: { alignItems: "center", padding: 28 },
  resultEmoji: { fontSize: 80, marginBottom: 16 },
  resultTitle: { fontSize: 28, fontWeight: "800", color: T.text, marginBottom: 6, textAlign: "center" },
  resultSub: { fontSize: 14, color: T.text2, marginBottom: 28 },
  resultStatsRow: { flexDirection: "row", alignItems: "center", marginBottom: 24, backgroundColor: T.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border },
  resultStat: { flex: 1, alignItems: "center" },
  resultStatDivider: { width: 1, height: 40, backgroundColor: T.border },
  resultStatNum: { fontSize: 26, fontWeight: "800", color: T.text, marginBottom: 4 },
  resultStatLabel: { fontSize: 11, color: T.text2, textTransform: "uppercase", letterSpacing: 0.5 },
  resultMessage: { color: T.text2, fontSize: 14, textAlign: "center", lineHeight: 22, marginBottom: 28, paddingHorizontal: 10 },
  homeBtn: { backgroundColor: T.accent, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 44 },
  homeBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  dashboardBtn: { backgroundColor: T.card, borderRadius: 14, paddingVertical: 13, marginBottom: 20, alignItems: "center", borderWidth: 1, borderColor: T.border },
  dashboardBtnText: { color: T.text2, fontWeight: "700", fontSize: 14 },

  dailyCard: { backgroundColor: T.card, borderRadius: 16, padding: 18, marginTop: 12, marginBottom: 4, borderWidth: 1.5, borderColor: T.gold + "55" },
  dailyCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  dailyCardTitle: { fontSize: 15, fontWeight: "800", color: T.gold },
  dailyCardDate: { fontSize: 11, color: T.text2 },
  dailyCardSub: { fontSize: 12, color: T.text2, marginBottom: 14 },
  dailyStartBtn: { backgroundColor: T.gold, borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  dailyStartBtnText: { color: "#000", fontWeight: "800", fontSize: 14 },
  dailyDone: { alignItems: "center", paddingVertical: 8 },
  dailyDoneText: { color: T.gold, fontWeight: "700", fontSize: 14 },

  practiceBtn: { flexDirection: "row", alignItems: "center", backgroundColor: T.orange + "15", borderRadius: 16, padding: 18, marginTop: 12, borderWidth: 1.5, borderColor: T.orange + "66", gap: 14 },
  practiceBtnIcon: { fontSize: 32 },
  practiceBtnTitle: { fontSize: 16, fontWeight: "800", color: T.orange, marginBottom: 2 },
  practiceBtnSub: { fontSize: 12, color: T.text2 },

  dashHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: T.bg },
  dashTitle: { fontSize: 17, fontWeight: "800", color: T.text },

  readinessCard: { backgroundColor: T.card, borderRadius: 20, padding: 24, marginBottom: 14, borderWidth: 1, borderColor: T.border, alignItems: "center" },
  readinessRingWrap: { width: 140, height: 140, marginBottom: 16, alignItems: "center", justifyContent: "center" },
  readinessCenter: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" },
  readinessPct: { fontSize: 36, fontWeight: "800", lineHeight: 40 },
  readinessLabel: { fontSize: 11, color: T.text2, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 },
  readinessTrack: { fontSize: 15, fontWeight: "800", marginBottom: 10 },
  readinessMotivation: { fontSize: 13, color: T.text2, textAlign: "center", lineHeight: 18 },

  dashOverallCard: { backgroundColor: T.card, borderRadius: 16, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: T.border, alignItems: "center" },
  dashBigPct: { fontSize: 56, fontWeight: "800", color: T.accent, marginBottom: 10, lineHeight: 64 },
  dashCardLabel: { fontSize: 11, color: T.text2, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  dashCardSub: { fontSize: 12, color: T.text2, marginTop: 8 },

  dashRankCard: { backgroundColor: T.card, borderRadius: 16, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: T.border },
  dashRankHint: { fontSize: 12, color: T.text2, marginTop: 8 },

  dashSectionTitle: { fontSize: 16, fontWeight: "800", color: T.text, marginBottom: 12 },
  dashTrackHeader: { marginTop: 8, marginBottom: 10 },
  dashTrackTitle: { fontSize: 14, fontWeight: "800", letterSpacing: 0.3 },

  dashModuleCard: { backgroundColor: T.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: T.border },
  dashModuleTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  dashModuleXP: { fontSize: 16, fontWeight: "800" },
  dashModulePossible: { fontSize: 11, color: T.text2 },
  dashModuleFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },

  authCard: { backgroundColor: T.card, borderRadius: 20, padding: 28, width: "88%", borderWidth: 1, borderColor: T.border },
  authLogo: { fontSize: 48, textAlign: "center", marginBottom: 8 },
  authTitle: { fontSize: 28, fontWeight: "800", color: T.text, textAlign: "center", marginBottom: 4 },
  authSubtitle: { fontSize: 13, color: T.text2, textAlign: "center", marginBottom: 28 },
  authInput: { backgroundColor: T.card2, color: T.text, borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 12, borderWidth: 1, borderColor: T.border },
  authButton: { backgroundColor: T.accent, borderRadius: 12, padding: 15, alignItems: "center", marginTop: 4 },
  authButtonText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  authError: { color: T.accent, fontSize: 13, marginBottom: 12, textAlign: "center" },
  authToggle: { marginTop: 20, alignItems: "center" },
  authToggleText: { color: T.text2, fontSize: 13 },

  tabBar: { flexDirection: "row", backgroundColor: T.card, borderTopWidth: 1, borderTopColor: T.border, paddingTop: 10, paddingBottom: 28 },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 4 },
  tabIcon: { fontSize: 22, marginBottom: 3, color: T.text2 },
  tabLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 0.3 },

  commHeader: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  commTitle: { fontSize: 28, fontWeight: "800", color: T.text, marginBottom: 4 },
  commSub: { fontSize: 13, color: T.text2 },
  commBannerLive: { backgroundColor: T.green + "15", borderRadius: 12, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: T.green + "44" },
  commBannerLiveText: { color: T.green, fontSize: 13, fontWeight: "600", textAlign: "center" },
  commEmptyText: { color: T.text2, fontSize: 13, textAlign: "center", marginTop: 20, marginBottom: 10 },
  commSectionTitle: { fontSize: 16, fontWeight: "800", color: T.text, marginBottom: 12 },
  topicCard: { backgroundColor: T.card, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: T.border, borderLeftWidth: 4 },
  topicBadge: { alignSelf: "flex-start", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 8 },
  topicBadgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  topicTitle: { fontSize: 14, fontWeight: "700", color: T.text, lineHeight: 20, marginBottom: 10 },
  topicFooter: { flexDirection: "row", justifyContent: "space-between" },
  topicUser: { fontSize: 11, color: T.text2 },
  topicReplies: { fontSize: 11, color: T.text2 },
  composeFab: { position: "absolute", bottom: 24, right: 20, width: 52, height: 52, borderRadius: 26, backgroundColor: T.accent, alignItems: "center", justifyContent: "center", elevation: 6 },
  composeFabIcon: { color: "#fff", fontSize: 30, lineHeight: 32, fontWeight: "300" },
  composeOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "flex-end" },
  composeModal: { backgroundColor: T.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 44 },
  composeModalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  composeModalTitle: { fontSize: 18, fontWeight: "800", color: T.text },
  composeModalClose: { color: T.text2, fontSize: 16, fontWeight: "700", padding: 4 },
  composeLabel: { fontSize: 11, color: T.text2, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
  composeTrackRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  composeTrackChip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: T.border, backgroundColor: T.card2 },
  composeTrackChipText: { fontSize: 11, fontWeight: "700" },
  composeInput: { backgroundColor: T.card2, color: T.text, borderRadius: 12, padding: 14, fontSize: 14, minHeight: 100, textAlignVertical: "top", borderWidth: 1, borderColor: T.border, marginBottom: 6 },
  composeCount: { fontSize: 11, color: T.text2, textAlign: "right", marginBottom: 16 },
  composePostBtn: { backgroundColor: T.accent, borderRadius: 12, padding: 15, alignItems: "center" },
  composePostBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  postDetailCard: { backgroundColor: T.card, borderRadius: 16, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: T.border, borderLeftWidth: 4 },
  postDetailContent: { fontSize: 16, color: T.text, lineHeight: 24, marginBottom: 10 },
  postDetailMeta: { fontSize: 11, color: T.text2 },
  replyCard: { backgroundColor: T.card, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: T.border },
  replyUser: { fontSize: 11, color: T.text2, marginBottom: 6 },
  replyContent: { fontSize: 14, color: T.text, lineHeight: 20 },
  replyInputRow: { flexDirection: "row", padding: 12, gap: 10, backgroundColor: T.card, borderTopWidth: 1, borderTopColor: T.border },
  replyInput: { flex: 1, backgroundColor: T.card2, color: T.text, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, borderWidth: 1, borderColor: T.border },
  replySubmitBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: T.accent, alignItems: "center", justifyContent: "center" },
  replySubmitText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  profilePageTitle: { fontSize: 28, fontWeight: "800", color: T.text, marginBottom: 20 },
  profileCard: { backgroundColor: T.card, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: T.border },
  profileEmail: { fontSize: 13, color: T.text2, marginBottom: 16, textAlign: "center" },
  profileStatsRow: { flexDirection: "row", alignItems: "center" },
  profileStat: { flex: 1, alignItems: "center" },
  profileStatNum: { fontSize: 18, fontWeight: "800", marginBottom: 4 },
  profileStatLabel: { fontSize: 10, color: T.text2, textTransform: "uppercase", letterSpacing: 0.5 },
  profileStatDiv: { width: 1, height: 36, backgroundColor: T.border },
  profileSectionTitle: { fontSize: 16, fontWeight: "800", color: T.text, marginBottom: 12 },
  profileEmpty: { color: T.text2, fontSize: 13, marginBottom: 16 },
  profileModuleRow: { backgroundColor: T.card, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: T.border, borderLeftWidth: 4, gap: 12 },
  profileModuleIcon: { fontSize: 22 },
  profileModuleName: { fontSize: 14, fontWeight: "700", color: T.text, marginBottom: 2 },
  profileModuleTrack: { fontSize: 10, color: T.text2, letterSpacing: 0.5 },
  profileModuleXP: { fontSize: 15, fontWeight: "800" },
  signOutBtn: { marginTop: 24, backgroundColor: T.card, borderRadius: 14, paddingVertical: 15, alignItems: "center", borderWidth: 1, borderColor: T.accent + "55" },
  signOutBtnText: { color: T.accent, fontWeight: "800", fontSize: 15 },
  weakAreaLabel: { fontSize: 11, color: T.amber, fontWeight: "700", marginTop: 3 },
  linkedInBtn: { backgroundColor: '#0077B5', borderRadius: 14, paddingVertical: 14, alignItems: "center", marginBottom: 20 },
  linkedInBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  aboutRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: T.card, borderRadius: 14, padding: 16, marginTop: 12, borderWidth: 1, borderColor: T.border },
  aboutRowText: { color: T.text, fontSize: 15, fontWeight: "600" },
  aboutRowArrow: { color: T.text2, fontSize: 20, fontWeight: "300" },
  aboutOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: T.bg },
  aboutCard: { backgroundColor: T.card, borderRadius: 24, padding: 32, width: "100%", borderWidth: 1, borderColor: T.border, alignItems: "center" },
  aboutCardIcon: { fontSize: 56, marginBottom: 12 },
  aboutCardName: { fontSize: 28, fontWeight: "800", color: T.text, marginBottom: 4 },
  aboutCardVersion: { fontSize: 13, color: T.text2, marginBottom: 24 },
  aboutCardMission: { fontSize: 14, color: T.text2, lineHeight: 22, textAlign: "center", marginBottom: 16 },
  aboutCardCreds: { fontSize: 12, color: T.text2, textAlign: "center", marginBottom: 28, lineHeight: 18 },
  aboutCloseBtn: { backgroundColor: T.accent, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 40, alignItems: "center" },
  aboutCloseBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },

  profileNameRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  profileNameInput: { fontSize: 28, fontWeight: "800", color: T.text, flex: 1, borderBottomWidth: 1, borderBottomColor: T.border, paddingBottom: 4 },
  profileEditBtn: { marginLeft: 10, padding: 6 },
  profileEditIcon: { fontSize: 16 },

  onboardingSlide: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  onboardingIcon: { fontSize: 80, marginBottom: 28, textAlign: "center" },
  onboardingTitle: { fontSize: 28, fontWeight: "800", color: T.text, textAlign: "center", marginBottom: 16, lineHeight: 34 },
  onboardingSubtitle: { fontSize: 16, color: T.text2, textAlign: "center", lineHeight: 26 },
  onboardingDots: { flexDirection: "row", gap: 8, marginBottom: 32 },
  onboardingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: T.border },
  onboardingDotActive: { backgroundColor: T.accent, width: 20 },
  onboardingBtn: { backgroundColor: T.accent, borderRadius: 14, paddingVertical: 16, alignItems: "center", marginBottom: 40, marginHorizontal: 24, alignSelf: "stretch" },
  onboardingBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  onboardingGoalSlide: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 8 },
  onboardingGoalLabel: { fontSize: 11, fontWeight: "700", color: T.text2, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10 },
  onboardingChipScroll: { flexDirection: "row", gap: 8, paddingRight: 8 },
  onboardingChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  onboardingChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: T.border, backgroundColor: T.card2 },
  onboardingChipActive: { backgroundColor: T.accent, borderColor: T.accent },
  onboardingChipText: { fontSize: 13, fontWeight: "700", color: T.text2 },
  onboardingChipTextActive: { color: "#fff" },
  onboardingDateInput: { backgroundColor: T.card2, color: T.text, borderRadius: 12, padding: 14, fontSize: 15, borderWidth: 1, borderColor: T.border },

  badgeGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 24 },
  badgeCell: { width: "25%", alignItems: "center", paddingVertical: 14, paddingHorizontal: 4 },
  badgeCellLocked: { opacity: 0.35 },
  badgeCellIcon: { fontSize: 28, marginBottom: 5 },
  badgeCellTitle: { fontSize: 9, fontWeight: "700", color: T.text, textAlign: "center", letterSpacing: 0.3 },

  badgeOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  badgeOverlayCard: { backgroundColor: T.card, borderRadius: 24, padding: 32, alignItems: "center", borderWidth: 1, borderColor: T.gold + "66", width: "72%" },
  badgeOverlayEmoji: { fontSize: 64, marginBottom: 12 },
  badgeOverlayUnlocked: { fontSize: 12, fontWeight: "800", color: T.gold, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 },
  badgeOverlayTitle: { fontSize: 22, fontWeight: "800", color: T.text, marginBottom: 6, textAlign: "center" },
  badgeOverlayDesc: { fontSize: 13, color: T.text2, textAlign: "center", lineHeight: 18 },

  lbHeader: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  lbTitle: { fontSize: 28, fontWeight: "800", color: T.text, marginBottom: 4 },
  lbDate: { fontSize: 13, color: T.text2 },
  lbRow: { backgroundColor: T.card, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: T.border, gap: 12 },
  lbRowSelf: { borderLeftWidth: 3, borderLeftColor: T.accent },
  lbPos: { fontSize: 18, fontWeight: "700", color: T.text2, width: 32, textAlign: "center" },
  lbUsername: { fontSize: 14, fontWeight: "700", color: T.text, marginBottom: 2 },
  lbRank: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  lbXP: { fontSize: 15, fontWeight: "800", color: T.gold },
  lbStreak: { fontSize: 11, color: T.text2 },
});
