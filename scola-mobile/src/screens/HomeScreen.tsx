import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fetchDailyPlaces, fetchRecentPosts, type Place, type Post } from '../api';
import { CATEGORY_LABEL, REGIONS, colors, radius } from '../config';
import { formatDistance, useNearby, type NearbyPlace } from '../useNearby';
import type { RootNavigation } from '../navigation';

const QUICK: { label: string; icon: keyof typeof Ionicons.glyphMap; path: string }[] = [
  { label: '사우나', icon: 'flame-outline', path: '/search?category=sauna' },
  { label: '찜질방', icon: 'bed-outline', path: '/search?category=jjimjilbang' },
  { label: '목욕탕', icon: 'water-outline', path: '/search?category=bath' },
  { label: '스파', icon: 'sparkles-outline', path: '/search?category=spa' },
  { label: '24시간', icon: 'time-outline', path: '/search?is_24hours=true' },
];

function categoryTags(cats: string[] | undefined) {
  return (cats ?? []).map((c) => CATEGORY_LABEL[c]).filter(Boolean).slice(0, 2);
}

function shortAddress(addr: string | null | undefined) {
  return (addr ?? '').split(' ').slice(0, 3).join(' ');
}

export default function HomeScreen() {
  const nav = useNavigation<RootNavigation>();
  const insets = useSafeAreaInsets();
  const nearby = useNearby();
  const [places, setPlaces] = useState<Place[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [p, q] = await Promise.allSettled([fetchDailyPlaces(), fetchRecentPosts()]);
    if (p.status === 'fulfilled') setPlaces(p.value);
    if (q.status === 'fulfilled') setPosts(q.value);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([load(), nearby.status === 'ready' ? nearby.refresh() : Promise.resolve()]);
    setRefreshing(false);
  };

  const openWeb = (path: string, title: string) => nav.navigate('Web', { path, title });
  const openMap = () => nav.navigate('Tabs', { screen: 'Map' });

  const locationLabel =
    nearby.status === 'ready' && nearby.label ? nearby.label
    : nearby.status === 'locating' ? '위치 확인 중'
    : '내 위치 설정';

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <View style={styles.topRow}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Pressable style={styles.locationPill} onPress={nearby.status === 'ready' ? openMap : nearby.request}>
            <Ionicons name="navigate" size={13} color={colors.white} />
            <Text style={styles.locationText} numberOfLines={1}>{locationLabel}</Text>
          </Pressable>
        </View>
        <Pressable style={styles.search} onPress={() => openWeb('/search', '장소 찾기')}>
          <Ionicons name="search" size={16} color={colors.gray500} />
          <Text style={styles.searchHint}>지역, 시설명, 불한증막, 노천탕</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.quickRow}>
          {QUICK.map((q) => (
            <Pressable key={q.label} style={styles.quick} onPress={() => openWeb(q.path, q.label)}>
              <View style={styles.quickIcon}><Ionicons name={q.icon} size={22} color={colors.primary} /></View>
              <Text style={styles.quickLabel}>{q.label}</Text>
            </Pressable>
          ))}
        </View>

        <Section title="내 주변" onMore={nearby.status === 'ready' ? openMap : undefined} moreLabel="지도에서 보기">
          {nearby.status === 'ready' ? (
            <View style={styles.list}>
              {nearby.places.map((p, i) => (
                <NearbyRow key={p.id} place={p} last={i === nearby.places.length - 1} onPress={() => openWeb(`/place/${p.id}`, p.name)} />
              ))}
            </View>
          ) : nearby.status === 'locating' ? (
            <View style={styles.cta}><ActivityIndicator color={colors.primary} /></View>
          ) : (
            <Pressable style={styles.cta} onPress={nearby.request}>
              <Ionicons name="locate" size={22} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.ctaTitle}>위치를 허용하면 가까운 사우나부터 보여드려요</Text>
                <Text style={styles.ctaSub}>거리순 정렬, 지도 자동 이동</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.gray400} />
            </Pressable>
          )}
        </Section>

        <Section title="이번 주 추천" onMore={() => openWeb('/search', '장소 찾기')}>
          <FlatList
            horizontal
            data={places}
            keyExtractor={(p) => String(p.id)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
            renderItem={({ item }) => <PlaceCard place={item} onPress={() => openWeb(`/place/${item.id}`, item.name)} />}
          />
        </Section>

        <Section title="매거진" onMore={() => openWeb('/posts', '매거진')}>
          <FlatList
            horizontal
            data={posts}
            keyExtractor={(p) => String(p.id)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
            renderItem={({ item }) => (
              <Pressable style={styles.postCard} onPress={() => openWeb(`/posts/${item.slug}`, item.title)}>
                <Image source={{ uri: item.thumbnail ?? undefined }} style={styles.postThumb} />
                <Text style={styles.postTitle} numberOfLines={2}>{item.title}</Text>
              </Pressable>
            )}
          />
        </Section>

        <Section title="지역별 보기">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {REGIONS.map((r) => (
              <Pressable key={r.slug} style={styles.chip} onPress={() => openWeb(`/sauna/${r.slug}`, `${r.name} 사우나·찜질방`)}>
                <Text style={styles.chipText}>{r.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Section>

        <Pressable style={styles.guide} onPress={() => openWeb('/guide', '사우나 즐기는 법')}>
          <View style={{ flex: 1 }}>
            <View style={styles.badge}><Text style={styles.badgeText}>가이드</Text></View>
            <Text style={styles.guideTitle}>사우나, 제대로 즐기는 법</Text>
            <Text style={styles.guideDesc}>온탕·냉탕 순서부터 불한증막 활용법까지</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.white} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

function NearbyRow({ place, last, onPress }: { place: NearbyPlace; last: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.row, !last && styles.rowDivider]} onPress={onPress}>
      <Image source={{ uri: place.thumbnail ?? undefined }} style={styles.rowThumb} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.rowName} numberOfLines={1}>{place.name}</Text>
        <Text style={styles.rowSub} numberOfLines={1}>{shortAddress(place.road_address)}</Text>
        <View style={styles.tags}>
          {categoryTags(place.app_category).map((t) => (
            <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
          ))}
        </View>
      </View>
      <Text style={styles.distance}>{formatDistance(place.distanceKm)}</Text>
    </Pressable>
  );
}

function PlaceCard({ place, onPress }: { place: Place; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: place.thumbnail ?? undefined }} style={styles.cardThumb} />
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>{place.name}</Text>
        <Text style={styles.rowSub} numberOfLines={1}>{shortAddress(place.road_address || place.address)}</Text>
        <View style={[styles.tags, { marginTop: 8 }]}>
          {categoryTags(place.app_category).map((t) => (
            <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
          ))}
          {place.is_24hours && <View style={styles.tag}><Text style={styles.tagText}>24시간</Text></View>}
        </View>
      </View>
    </Pressable>
  );
}

function Section({ title, onMore, moreLabel = '전체보기', children }: { title: string; onMore?: () => void; moreLabel?: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onMore && (
          <Pressable onPress={onMore} hitSlop={8} style={styles.more}>
            <Text style={styles.moreText}>{moreLabel}</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  topBar: { backgroundColor: colors.dark, paddingHorizontal: 16, paddingBottom: 12 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 52 },
  logo: { height: 34, width: 120 },
  locationPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5, maxWidth: 170,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.full, backgroundColor: colors.primary,
  },
  locationText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  search: {
    height: 44, borderRadius: radius.full, backgroundColor: colors.white,
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16,
  },
  searchHint: { fontSize: 14, color: colors.gray500 },

  quickRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20 },
  quick: { alignItems: 'center', gap: 6, width: 56 },
  quickIcon: {
    width: 52, height: 52, borderRadius: radius.lg, backgroundColor: colors.white,
    borderWidth: 2, borderColor: colors.dark, alignItems: 'center', justifyContent: 'center',
  },
  quickLabel: { fontSize: 12, fontWeight: '600', color: colors.dark },

  section: { paddingTop: 28 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: colors.dark, letterSpacing: -0.5 },
  more: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  moreText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  hList: { paddingHorizontal: 20, gap: 12 },

  list: { marginHorizontal: 20, backgroundColor: colors.white, borderWidth: 2, borderColor: colors.dark, borderRadius: radius.lg, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  rowThumb: { width: 60, height: 60, borderRadius: radius.md, backgroundColor: colors.gray100 },
  rowName: { fontSize: 15, fontWeight: '800', color: colors.dark },
  rowSub: { fontSize: 12, color: colors.gray500, marginTop: 2 },
  distance: { fontSize: 13, fontWeight: '700', color: colors.primary },
  cta: {
    marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16,
    backgroundColor: colors.white, borderWidth: 2, borderColor: colors.dark, borderRadius: radius.lg, minHeight: 72,
  },
  ctaTitle: { fontSize: 14, fontWeight: '700', color: colors.dark },
  ctaSub: { fontSize: 12, color: colors.gray500, marginTop: 2 },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, backgroundColor: colors.primaryLight, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.full },
  tagText: { fontSize: 11, fontWeight: '600', color: colors.primary },

  card: { width: 200, backgroundColor: colors.white, borderWidth: 2, borderColor: colors.dark, borderRadius: radius.lg, overflow: 'hidden' },
  cardThumb: { height: 118, backgroundColor: colors.gray100, borderBottomWidth: 2, borderBottomColor: colors.dark },
  cardBody: { padding: 12 },
  cardName: { fontSize: 15, fontWeight: '800', color: colors.dark },

  postCard: { width: 220 },
  postThumb: { width: 220, height: 124, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.dark, backgroundColor: colors.gray100 },
  postTitle: { marginTop: 8, fontSize: 14, fontWeight: '700', color: colors.dark, lineHeight: 20 },

  chips: { paddingHorizontal: 20, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.dark },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.dark },

  guide: {
    marginHorizontal: 20, marginTop: 28, flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.dark, borderRadius: radius.xl, padding: 20,
  },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full, marginBottom: 8 },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  guideTitle: { fontSize: 18, fontWeight: '800', color: colors.white },
  guideDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
});
