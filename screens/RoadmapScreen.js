import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, StyleSheet } from 'react-native';
import { T } from '../constants/theme';

export default function RoadmapScreen({ track, completedModules, onSelectModule, onBack }) {
  var pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(function() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  function getNodeStatus(mod, idx) {
    if (completedModules.indexOf(mod.id) !== -1) return 'completed';
    if (idx === 0) return 'available';
    var prev = track.modules[idx - 1];
    if (completedModules.indexOf(prev.id) !== -1) return 'available';
    return 'locked';
  }

  function getNodeXP(mod) {
    return mod.questions.reduce(function(a, q) { return a + q.xp; }, 0);
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerIcon}>{track.icon}</Text>
          <Text style={s.headerTitle}>{track.title}</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.subtitle}>Follow the forge path to complete this track</Text>

        {track.modules.map(function(mod, idx) {
          var status = getNodeStatus(mod, idx);
          var isLeft = idx % 2 === 0;
          var xp = getNodeXP(mod);

          return (
            <View key={mod.id} style={s.nodeRow}>
              {!isLeft && <View style={s.nodeSpacer} />}

              <View style={[s.nodeWrapper, isLeft ? s.nodeLeft : s.nodeRight]}>
                {status === 'available' ? (
                  <TouchableOpacity onPress={function() { onSelectModule(mod); }} activeOpacity={0.8}>
                    <Animated.View style={[s.node, s.nodeAvailable, { borderColor: track.color, transform: [{ scale: pulseAnim }] }]}>
                      <Text style={s.nodeIcon}>{mod.icon}</Text>
                    </Animated.View>
                    <Text style={[s.nodeTitle, { color: track.color }]}>{mod.title}</Text>
                    <Text style={s.nodeXP}>+{xp} XP</Text>
                  </TouchableOpacity>
                ) : status === 'completed' ? (
                  <TouchableOpacity onPress={function() { onSelectModule(mod); }} activeOpacity={0.8}>
                    <View style={[s.node, s.nodeCompleted, { backgroundColor: track.color, borderColor: track.color }]}>
                      <Text style={s.nodeIcon}>{mod.icon}</Text>
                    </View>
                    <Text style={[s.nodeTitle, { color: track.color }]}>{mod.title}</Text>
                    <Text style={s.nodeXPDone}>✅ Done</Text>
                  </TouchableOpacity>
                ) : (
                  <View>
                    <View style={[s.node, s.nodeLocked]}>
                      <Text style={s.nodeIcon}>🔒</Text>
                    </View>
                    <Text style={[s.nodeTitle, { color: T.text2 }]}>{mod.title}</Text>
                    <Text style={s.nodeXP}>+{xp} XP</Text>
                  </View>
                )}
              </View>

              {isLeft && <View style={s.nodeSpacer} />}

              {idx < track.modules.length - 1 && (
                <View style={[s.connector, isLeft ? s.connectorLeft : s.connectorRight, { backgroundColor: status === 'completed' ? track.color : T.border }]} />
              )}
            </View>
          );
        })}

        <View style={s.finishNode}>
          <Text style={s.finishIcon}>🏆</Text>
          <Text style={s.finishTitle}>Track Complete</Text>
          <Text style={s.finishSub}>Complete all modules to forge this certification</Text>
        </View>
      </ScrollView>
    </View>
  );
}

var s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 48, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn: { width: 60 },
  backText: { color: T.accent, fontSize: 14, fontWeight: '700' },
  headerCenter: { alignItems: 'center' },
  headerIcon: { fontSize: 28, marginBottom: 2 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: T.text },
  scroll: { padding: 20, paddingBottom: 60 },
  subtitle: { fontSize: 13, color: T.text2, textAlign: 'center', marginBottom: 32 },

  nodeRow: { position: 'relative', flexDirection: 'row', marginBottom: 0, minHeight: 120 },
  nodeWrapper: { width: '45%', alignItems: 'center', paddingVertical: 10 },
  nodeLeft: { alignItems: 'flex-start', paddingLeft: 20 },
  nodeRight: { alignItems: 'flex-end', paddingRight: 20 },
  nodeSpacer: { width: '55%' },

  node: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 3, marginBottom: 8 },
  nodeAvailable: { backgroundColor: T.card, borderWidth: 3 },
  nodeCompleted: { borderWidth: 3 },
  nodeLocked: { backgroundColor: T.card, borderColor: T.border, borderWidth: 2, opacity: 0.5 },
  nodeIcon: { fontSize: 28 },
  nodeTitle: { fontSize: 11, fontWeight: '700', textAlign: 'center', maxWidth: 90, marginBottom: 2 },
  nodeXP: { fontSize: 10, color: T.text2, textAlign: 'center' },
  nodeXPDone: { fontSize: 10, color: T.green, textAlign: 'center' },

  connector: { position: 'absolute', width: 3, height: 60, bottom: -10, left: '50%' },
  connectorLeft: { left: '35%' },
  connectorRight: { left: '65%' },

  finishNode: { alignItems: 'center', marginTop: 24, padding: 24, backgroundColor: T.card, borderRadius: 16, borderWidth: 1, borderColor: T.border },
  finishIcon: { fontSize: 48, marginBottom: 8 },
  finishTitle: { fontSize: 18, fontWeight: '800', color: T.text, marginBottom: 4 },
  finishSub: { fontSize: 12, color: T.text2, textAlign: 'center' },
});
