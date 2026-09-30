import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface SplashScreenProps {
  onFinish: () => void;
  fontMultiplier?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, fontMultiplier = 1 }) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header Title & Greetings */}
        <View style={styles.header}>
          <Text style={[styles.zodiacTitle, { fontSize: 38 * fontMultiplier }]}>Ất Tỵ</Text>
          <Text style={[styles.yearTitle, { fontSize: 30 * fontMultiplier }]}>2025</Text>
          <View style={styles.greetingRow}>
            <Text style={[styles.greetingText, { fontSize: 15 * fontMultiplier }]}>An khang</Text>
            <Text style={styles.greetingDot}>•</Text>
            <Text style={[styles.greetingText, { fontSize: 15 * fontMultiplier }]}>Thịnh vượng</Text>
          </View>
          <Text style={[styles.subGreeting, { fontSize: 14 * fontMultiplier }]}>Vạn sự như ý</Text>
        </View>

        {/* Central Zodiac Artwork (Ất Tỵ) */}
        <View style={styles.artworkContainer}>
          <Svg viewBox="0 0 200 220" style={styles.svgArtwork}>
            <Defs>
              <LinearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#C62828" />
                <Stop offset="50%" stopColor="#D32F2F" />
                <Stop offset="100%" stopColor="#8E0000" />
              </LinearGradient>
              <LinearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#F9A825" />
                <Stop offset="100%" stopColor="#F57F17" />
              </LinearGradient>
            </Defs>

            {/* Background clouds / apricot blossoms */}
            <Circle cx="35" cy="45" r="7" fill="#FFCDD2" opacity={0.8} />
            <Circle cx="28" cy="52" r="5" fill="#E57373" opacity={0.6} />
            <Circle cx="165" cy="65" r="8" fill="#FFCDD2" opacity={0.8} />
            <Circle cx="175" cy="55" r="6" fill="#E57373" opacity={0.7} />

            {/* Stylized Red Golden Snake (Ất Tỵ) */}
            <Path
              d="M100 25 C125 25 140 42 140 60 C140 85 105 95 85 110 C65 125 60 145 75 165 C95 190 145 185 155 160 C145 175 110 175 95 160 C80 145 88 130 105 115 C128 95 155 80 155 55 C155 30 130 15 100 15 C75 15 50 30 50 55 C50 70 60 78 70 78 C80 78 88 70 88 60 C88 45 75 42 70 42 C68 42 66 43 65 44 C72 32 85 25 100 25 Z"
              fill="url(#snakeGrad)"
              stroke="#B71C1C"
              strokeWidth="2"
            />
            {/* Intricate decorative scales / patterns */}
            <Path d="M98 32 Q105 38 112 32" stroke="#FFE082" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <Path d="M115 45 Q122 52 128 46" stroke="#FFE082" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <Path d="M120 62 Q125 70 130 65" stroke="#FFE082" strokeWidth="2" fill="none" strokeLinecap="round" />
            <Path d="M85 125 Q92 132 99 126" stroke="#FFE082" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <Path d="M75 145 Q82 152 89 146" stroke="#FFE082" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <Path d="M105 170 Q115 178 125 172" stroke="#FFE082" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Snake eye */}
            <Circle cx="68" cy="50" r="3.5" fill="#FFE082" />
            <Circle cx="67" cy="50" r="1.5" fill="#212121" />
          </Svg>
        </View>

        {/* Loading Progress Bar & Status */}
        <View style={styles.footer}>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Text style={[styles.loadingText, { fontSize: 13 * fontMultiplier }]}>Đang tải ứng dụng...</Text>

          <TouchableOpacity onPress={onFinish} activeOpacity={0.7} style={styles.skipBtn}>
            <Text style={[styles.skipBtnText, { fontSize: 14 * fontMultiplier }]}>
              Chạm để vào ngay →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  zodiacTitle: {
    fontWeight: '800',
    color: '#9E1B1B',
    letterSpacing: 0.5,
  },
  yearTitle: {
    fontWeight: '800',
    color: '#9E1B1B',
    marginBottom: 8,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingText: {
    color: '#334155',
    fontWeight: '600',
  },
  greetingDot: {
    color: '#9E1B1B',
    fontSize: 16,
  },
  subGreeting: {
    color: '#64748B',
    marginTop: 4,
  },
  artworkContainer: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgArtwork: {
    width: '100%',
    height: '100%',
  },
  footer: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#B3261E',
    borderRadius: 3,
  },
  loadingText: {
    color: '#64748B',
    fontWeight: '500',
    marginTop: 12,
  },
  skipBtn: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipBtnText: {
    color: '#B3261E',
    fontWeight: '700',
  },
});
