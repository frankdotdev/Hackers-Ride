import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import Svg, { Rect, Line, Circle, Path } from "react-native-svg";
import { useTheme } from "@/hooks/useTheme";
import { MapPin, Navigation } from "lucide-react-native";

interface Props {
  routeProgress?: number; // 0..1 — position of a moving vehicle marker along the route
  showRoute?: boolean;
  height?: number;
}

const { width: SCREEN_W } = Dimensions.get("window");

// Deterministic pseudo-street grid so the map "reads" as a real city block layout.
const BLOCKS = [
  { x: 20, y: 40, w: 90, h: 70 }, { x: 130, y: 40, w: 70, h: 70 }, { x: 220, y: 40, w: 90, h: 70 },
  { x: 20, y: 130, w: 70, h: 90 }, { x: 110, y: 130, w: 90, h: 60 }, { x: 220, y: 130, w: 90, h: 90 },
  { x: 20, y: 240, w: 90, h: 70 }, { x: 130, y: 220, w: 70, h: 90 }, { x: 220, y: 240, w: 90, h: 70 },
];

export function SimulatedMap({ routeProgress, showRoute, height = 280 }: Props) {
  const t = useTheme();
  const w = SCREEN_W;
  const h = height;

  const pickup = { x: w * 0.22, y: h * 0.68 };
  const dest = { x: w * 0.72, y: h * 0.22 };
  const routeD = `M ${pickup.x} ${pickup.y} C ${pickup.x} ${dest.y}, ${dest.x} ${pickup.y}, ${dest.x} ${dest.y}`;

  const carPos = useRef(new Animated.ValueXY({ x: pickup.x, y: pickup.y })).current;

  useEffect(() => {
    if (routeProgress === undefined) return;
    // simple cubic bezier interpolation for the car marker
    const p = routeProgress;
    const x = (1 - p) ** 3 * pickup.x + 3 * (1 - p) ** 2 * p * pickup.x + 3 * (1 - p) * p ** 2 * dest.x + p ** 3 * dest.x;
    const y = (1 - p) ** 3 * pickup.y + 3 * (1 - p) ** 2 * p * dest.y + 3 * (1 - p) * p ** 2 * pickup.y + p ** 3 * dest.y;
    Animated.timing(carPos, { toValue: { x, y }, duration: 400, useNativeDriver: false }).start();
  }, [routeProgress]);

  return (
    <View style={[styles.container, { height, backgroundColor: t.mapBlock }]}>
      <Svg width={w} height={h}>
        <Rect x={0} y={0} width={w} height={h} fill={t.mapBlock} />
        {BLOCKS.map((b, i) => (
          <Rect key={i} x={(b.x / 330) * w} y={(b.y / 330) * h} width={(b.w / 330) * w} height={(b.h / 330) * h} fill={t.mapRoad} rx={4} />
        ))}
        {/* road grid lines */}
        {[0.18, 0.4, 0.62, 0.85].map((f, i) => (
          <Line key={"v" + i} x1={w * f} y1={0} x2={w * f} y2={h} stroke={t.mapLine} strokeWidth={3} />
        ))}
        {[0.15, 0.38, 0.6, 0.82].map((f, i) => (
          <Line key={"h" + i} x1={0} y1={h * f} x2={w} y2={h * f} stroke={t.mapLine} strokeWidth={3} />
        ))}
        {showRoute && <Path d={routeD} stroke={t.accent} strokeWidth={4} fill="none" strokeDasharray="1,0" />}
        {/* nearby vehicle dots */}
        {[0.35, 0.55, 0.8].map((f, i) => (
          <Circle key={"nv" + i} cx={w * f} cy={h * (0.3 + i * 0.15)} r={4} fill={t.textMuted} />
        ))}
      </Svg>

      <View style={[styles.marker, { left: pickup.x - 12, top: pickup.y - 24 }]}>
        <MapPin size={24} color={t.accent} fill={t.accent} />
      </View>
      {showRoute && (
        <View style={[styles.marker, { left: dest.x - 12, top: dest.y - 24 }]}>
          <MapPin size={24} color={t.text} fill={t.text} />
        </View>
      )}
      {routeProgress !== undefined && (
        <Animated.View
          style={[
            styles.carMarker,
            { transform: carPos.getTranslateTransform(), backgroundColor: t.text },
          ]}
        >
          <Navigation size={14} color="#fff" />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", overflow: "hidden" },
  marker: { position: "absolute" },
  carMarker: {
    position: "absolute",
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -13,
    marginTop: -13,
  },
});
