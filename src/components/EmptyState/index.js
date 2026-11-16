import React from 'react'; import { StyleSheet, Text, View } from 'react-native'; import { colors } from '../../config/theme';
export default function EmptyState({ title, message }) { return <View style={styles.box}><Text style={styles.icon}>🌱</Text><Text style={styles.title}>{title}</Text><Text style={styles.message}>{message}</Text></View>; }
const styles = StyleSheet.create({ box: { alignItems: 'center', padding: 25 }, icon: { fontSize: 38 }, title: { color: colors.ink, fontWeight: '800', fontSize: 16, marginTop: 8 }, message: { color: colors.muted, textAlign: 'center', marginTop: 5 } });
