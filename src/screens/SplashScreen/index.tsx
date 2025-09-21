import React, { useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  ImageSourcePropType,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  SharedValue,
} from 'react-native-reanimated';

type Props = {
  onFinish?: () => void;
  bg?: ImageSourcePropType;
};

const useScale = () => {
  const { width, height } = useWindowDimensions();
  const BW = 375;
  const BH = 812;
  const scale = (size: number) => (width / BW) * size;
  const vscale = (size: number) => (height / BH) * size;
  const mscale = (size: number, factor = 0.45) =>
    size + (scale(size) - size) * factor;
  return { scale, vscale, mscale, width, height };
};

const SplashScreen: React.FC<Props> = ({ onFinish, bg }) => {
  const words = useMemo<string[]>(() => ['MY', 'APP'], []);
  const { scale, vscale, mscale, width, height } = useScale();

  // background fade in → hold → fade out
  const bgOpacity = useSharedValue<number>(0);

  // per-word anim values (opacity + rise)
  const wOpacity: SharedValue<number>[] = words.map(() =>
    useSharedValue<number>(0),
  );
  const wTranslate: SharedValue<number>[] = words.map(() =>
    useSharedValue<number>(vscale(10)),
  );

  const bgScale = useSharedValue<number>(1);

  useEffect(() => {
    // bg animation sequence
    bgOpacity.value = withSequence(
      withTiming(1, { duration: 800 }),
      withTiming(1, { duration: 400 }),
      withTiming(0, { duration: 800 }),
    );

    bgScale.value = withTiming(1.06, { duration: 2000 });

    // staggered words
    words.forEach((_, i) => {
      const delay = 200 + i * 250;
      wOpacity[i].value = withDelay(delay, withTiming(1, { duration: 500 }));
      wTranslate[i].value = withDelay(delay, withTiming(0, { duration: 500 }));
    });

    const total = 800 + 400 + 800 + 250; // ~2.25s
    const t = setTimeout(() => onFinish && onFinish(), total);
    return () => clearTimeout(t);
  }, [onFinish, words, vscale, bgOpacity, bgScale, wOpacity, wTranslate]);

  const bgStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
    transform: [{ scale: bgScale.value }],
  }));

  const wordStyles = words.map((_, i) =>
    useAnimatedStyle(() => ({
      opacity: wOpacity[i].value,
      transform: [{ translateY: wTranslate[i].value }],
    })),
  );

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <Animated.Image
        // reanimated's Animated.Image accepts ImageSourcePropType
        source={bg ?? require('../../assets/images/splash-bg.png')}
        style={[StyleSheet.absoluteFill, { width, height }, styles.bg, bgStyle]}
        resizeMode="cover"
      />

      <View style={styles.scrim} />

      <View
        style={[
          styles.titleRow,
          { paddingHorizontal: scale(24), marginBottom: vscale(8) },
        ]}
      >
        {words.map((w, i) => (
          <Animated.Text
            key={w}
            style={[
              styles.title,
              {
                fontSize: mscale(36),
                letterSpacing: scale(0.5),
                marginRight: i === 0 ? scale(6) : 0,
                textShadowRadius: scale(6),
              } as TextStyle,
              wordStyles[i],
            ]}
            allowFontScaling
          >
            {w}
          </Animated.Text>
        ))}
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bg: { transform: [{ scale: 1 }] },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  title: {
    color: '#fff',
    fontWeight:
      (Platform.select({ ios: '800', android: '800', default: '700' }) as TextStyle['fontWeight']) ||
      '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
  },
});
