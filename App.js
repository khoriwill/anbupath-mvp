
import { useState, useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './lib/supabase';
import { AWS_QUESTIONS } from './content/aws-questions';
import { SCRUM_QUESTIONS } from './content/scrum-questions';
import { CISM_QUESTIONS } from './content/cism-questions';
import { SECURITY_QUESTIONS } from './content/security-questions';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Animated, KeyboardAvoidingView, Platform } from 'react-native';

const T = {
  bg: '#0a0a0f', card: '#12121f', card2: '#1a1a2e',
  accent: '#ff4757', gold: '#ffd700', green: '#2ed573',
  blue: '#4cc9f0', purple: '#7b2fff', orange: '#ff6b35', red: '#ef233c',
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
];

const MODULES = [
  { id: 1, trackId: "pmp", title: "Project Initiation", icon: "🏁", questions: QUESTIONS.slice(0, 5), color: T.blue, desc: "Charters, scope, and kickoff" },
  { id: 2, trackId: "pmp", title: "Planning and Scheduling", icon: "📅", questions: QUESTIONS.slice(5, 10), color: T.purple, desc: "EVM, WBS, and scheduling" },
  { id: 3, trackId: "pmp", title: "Team and Stakeholders", icon: "👥", questions: QUESTIONS.slice(10, 15), color: T.green, desc: "Leadership, quality, and conflict" },
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
    ],
  },
];

function getRank(xp) {
  if (xp >= 200) return { title: "Master", color: T.gold };
  if (xp >= 100) return { title: "Journeyman", color: T.purple };
  return { title: "Apprentice", color: T.blue };
}

const BADGES = [
  { id: 'first_lesson',  title: 'First Forge',    description: 'Complete your first lesson',  icon: '🔨' },
  { id: 'perfect_score', title: 'Flawless',        description: 'Score 100% on any lesson',    icon: '⭐' },
  { id: 'streak_3',      title: 'On Fire',         description: 'Maintain a 3-day streak',     icon: '🔥' },
  { id: 'streak_7',      title: 'Weekly Warrior',  description: '7-day streak',                icon: '⚡' },
  { id: 'pmp_complete',  title: 'PMP Forged',      description: 'Complete all PMP modules',    icon: '📋' },
  { id: 'aws_complete',  title: 'Cloud Forged',    description: 'Complete all AWS modules',    icon: '☁️' },
  { id: 'all_tracks',    title: 'Master Forger',   description: 'Complete all 5 tracks',       icon: '🏆' },
  { id: 'rank_master',   title: 'Ascended',        description: 'Reach Master rank',           icon: '👑' },
];

function checkBadges(xp, streak, completedModules, lastScore) {
  var earned = [];
  if (completedModules.length >= 1) earned.push('first_lesson');
  if (lastScore === 100) earned.push('perfect_score');
  if (streak >= 3) earned.push('streak_3');
  if (streak >= 7) earned.push('streak_7');
  if ([1, 2, 3].every(function(id) { return completedModules.indexOf(id) !== -1; })) earned.push('pmp_complete');
  if ([4, 5, 6].every(function(id) { return completedModules.indexOf(id) !== -1; })) earned.push('aws_complete');
  if (completedModules.length >= 15) earned.push('all_tracks');
  if (xp >= 200) earned.push('rank_master');
  return earned;
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

function HomeScreen({ xp, streak, onStart, completedModules, moduleXP, onDashboard, onPractice }) {
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

function DashboardScreen({ xp, completedModules, moduleXP, onBack }) {
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

function ProfileScreen({ session, xp, streak, completedModules, moduleXP, onSignOut, badges }) {
  var [email, setEmail] = useState("");
  var [username, setUsername] = useState("Forger");
  var [editing, setEditing] = useState(false);
  var [editValue, setEditValue] = useState("");
  var rank = getRank(xp);
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
      </ScrollView>
    </SafeAreaView>
  );
}

const ONBOARDING_SLIDES = [
  { icon: '⚒️', title: 'Welcome to CertForge', subtitle: 'The certification training dojo. Forge your skills one question at a time.' },
  { icon: '🏆', title: 'Earn XP. Rank Up.', subtitle: 'Answer questions, earn XP, and climb from Apprentice to Journeyman to Master. Every correct answer forges your rank.' },
  { icon: '🎯', title: 'Pick Your Track', subtitle: 'PMP. AWS. CISM. Security+. Scrum. Choose your certification and start forging today.' },
];

function OnboardingScreen({ onComplete }) {
  var [slide, setSlide] = useState(0);
  var isLast = slide === ONBOARDING_SLIDES.length - 1;
  var current = ONBOARDING_SLIDES[slide];
  function handleNext() {
    if (isLast) { onComplete(); } else { setSlide(slide + 1); }
  }
  return (
    <SafeAreaView style={[s.safe, s.center]}>
      <View style={s.onboardingSlide}>
        <Text style={s.onboardingIcon}>{current.icon}</Text>
        <Text style={s.onboardingTitle}>{current.title}</Text>
        <Text style={s.onboardingSubtitle}>{current.subtitle}</Text>
      </View>
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

  async function finishLesson(earned, correct, total) {
    var newXP = xp + earned;
    var score = Math.round(correct / total * 100);
    var newCompletedModules = activeModule.id !== "practice" && completedModules.indexOf(activeModule.id) === -1
      ? completedModules.concat([activeModule.id])
      : completedModules;
    setXP(function(prev) { return prev + earned; });
    if (activeModule.id !== "practice") {
      setCompletedModules(function(prev) { return prev.indexOf(activeModule.id) === -1 ? prev.concat([activeModule.id]) : prev; });
      setModuleXP(function(prev) { return Object.assign({}, prev, { [activeModule.id]: (prev[activeModule.id] || 0) + earned }); });
    }
    setLessonResult({ correct: correct, total: total, xpEarned: earned, moduleName: activeModule.title });
    setScreen("result");

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
  if (!onboardingDone) return <OnboardingScreen onComplete={function() {
    AsyncStorage.setItem('certforge_onboarding_complete', '1');
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
        ? <DashboardScreen xp={xp} completedModules={completedModules} moduleXP={moduleXP} onBack={goHome} />
        : <HomeScreen xp={xp} streak={streak} onStart={startLesson} completedModules={completedModules} moduleXP={moduleXP} onDashboard={function() { setScreen("dashboard"); }} onPractice={startPractice} />
      )}
      {tab === "community" && <CommunityScreen onOpenPost={function(post) { setActivePost(post); setScreen("post_detail"); }} />}
      {tab === "leaderboard" && <LeaderboardScreen />}
      {tab === "profile" && <ProfileScreen session={session} xp={xp} streak={streak} completedModules={completedModules} moduleXP={moduleXP} onSignOut={handleSignOut} badges={badges} />}
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

  practiceBtn: { flexDirection: "row", alignItems: "center", backgroundColor: T.orange + "15", borderRadius: 16, padding: 18, marginTop: 12, borderWidth: 1.5, borderColor: T.orange + "66", gap: 14 },
  practiceBtnIcon: { fontSize: 32 },
  practiceBtnTitle: { fontSize: 16, fontWeight: "800", color: T.orange, marginBottom: 2 },
  practiceBtnSub: { fontSize: 12, color: T.text2 },

  dashHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, backgroundColor: T.bg },
  dashTitle: { fontSize: 17, fontWeight: "800", color: T.text },

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
