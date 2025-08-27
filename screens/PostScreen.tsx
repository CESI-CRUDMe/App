import { colors, radii, shadows } from '@/constants/theme';
import { useUser } from '@/providers/AuthProvider';
import PostType from '@/types/PostType';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function PostScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { accessToken } = useUser();
    const [post, setPost] = useState<PostType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            if (!id) return;
            setLoading(true); setError(null);
            try {
                const res = await axios.get(`https://crudme.mindlens.fr/api/posts/${id}`, { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined });
                let data = res.data;
                let p: any = null;
                if (data && typeof data === 'object') {
                    if (data.post && typeof data.post === 'object') p = data.post; else if (data.data && typeof data.data === 'object') p = data.data; else p = data;
                }
                if (p && !p.id) p.id = id; // fallback
                if (mounted) setPost(p);
            } catch (e: any) {
                if (mounted) setError(e?.response?.data?.message || 'Impossible de charger le post');
            } finally { if (mounted) setLoading(false); }
        };
        load();
        return () => { mounted = false; };
    }, [id, accessToken]);

    // Amélioration parsing coordonnées
    const { coords, imageUri } = useMemo(() => {
        if (!post) return { coords: null as null | { latitude: number; longitude: number }, imageUri: null as string | null };

        // Collecte brute possible depuis différentes clés
        const latCandidate = post.latitude ?? post.lat ?? post?.location?.lat ?? post?.coords?.lat;
        const lonCandidate = post.longitude ?? post.lng ?? post.lon ?? post?.location?.lng ?? post?.location?.lon ?? post?.coords?.lng ?? post?.coords?.lon;

        const parseValue = (val: any): number | null => {
            if (val === null || val === undefined) return null;
            if (typeof val === 'number') return isFinite(val) ? val : null;
            if (typeof val === 'string') {
                const cleaned = val.trim().replace(',', '.');
                const num = parseFloat(cleaned);
                return isFinite(num) ? num : null;
            }
            return null;
        };

        let lat = parseValue(latCandidate);
        let lng = parseValue(lonCandidate);

        // Si inversion probable (ex: lat > 90, lon dans plages latitude)
        if (lat !== null && lng !== null) {
            if ((lat > 90 || lat < -90) && Math.abs(lng) <= 90 && Math.abs(lat) <= 180) {
                const tmp = lat; lat = lng; lng = tmp; // swap
            }
        }

        // Validation finale
        let finalCoords: { latitude: number; longitude: number } | null = null;
        if (lat !== null && lng !== null && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
            finalCoords = { latitude: lat, longitude: lng };
        }

        // Image
        let resolvedImage: string | null = null;
        if (post.image_base64) {
            if (/^data:image\//.test(post.image_base64)) resolvedImage = post.image_base64; else resolvedImage = `data:image/jpeg;base64,${post.image_base64}`;
        }

        return { coords: finalCoords, imageUri: resolvedImage };
    }, [post]);

    if (loading) {
        return (
            <View style={styles.centered}> 
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}> 
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!post) {
        return (
            <View style={styles.centered}> 
                <Text style={styles.errorText}>Post introuvable.</Text>
            </View>
        );
    }

    const created = post.created_at ? new Date(post.created_at).toLocaleString() : null;
    const updated = post.updated_at ? new Date(post.updated_at).toLocaleString() : null;
    

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.card}>
                <Text style={styles.title}>{post.title || `Post #${post.id}`}</Text>
                {post.price && <Text style={styles.price}>{Number(post.price) ? Number(post.price).toFixed(2) + ' €' : post.price}</Text>}
                {imageUri && (
                    <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                )}
                {post.content && <Text style={styles.body}>{post.content}</Text>}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact</Text>
                    <View style={styles.row}><Text style={styles.label}>Nom:</Text><Text style={styles.value}>{post.contact_name || '—'}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Téléphone:</Text><Text style={styles.value}>{post.contact_phone || '—'}</Text></View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Localisation</Text>
                    {coords ? (
                        <MapView style={styles.map} region={{ ...coords, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
                            <Marker coordinate={coords} />
                        </MapView>
                    ) : (
                        <Text style={styles.noCoord}>Aucune coordonnée.</Text>
                    )}
                    {coords && (
                        <Text style={styles.coordText}>{coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}</Text>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Métadonnées</Text>
                    {created && <Text style={styles.meta}>Créé: {created}</Text>}
                    {updated && <Text style={styles.meta}>Mis à jour: {updated}</Text>}
                    <Text style={styles.meta}>ID: {post.id}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 24, paddingBottom: 60 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    loadingText: { marginTop: 12, color: colors.subText, fontWeight: '600' },
    errorText: { color: colors.danger, fontWeight: '600', fontSize: 16 },
    card: { backgroundColor: colors.card, borderRadius: radii.lg, padding: 22, borderWidth: 1, borderColor: colors.border, ...shadows.card },
    title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 6 },
    price: { fontSize: 18, fontWeight: '700', color: colors.success, marginBottom: 14 },
    image: { width: '100%', height: 220, borderRadius: radii.md, marginBottom: 18, backgroundColor: '#f2f4ff' },
    body: { fontSize: 15, lineHeight: 22, color: colors.text, marginBottom: 18 },
    section: { marginBottom: 22 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, color: colors.text },
    row: { flexDirection: 'row', marginBottom: 6 },
    label: { width: 90, color: colors.subText, fontWeight: '600' },
    value: { flex: 1, color: colors.text, fontWeight: '600' },
    map: { width: '100%', height: 220, borderRadius: radii.md, marginBottom: 10 },
    noCoord: { color: colors.subText, fontStyle: 'italic' },
    coordText: { textAlign: 'center', color: colors.primary, fontWeight: '600', marginTop: 4 },
    meta: { color: colors.subText, fontSize: 12, marginTop: 4 },
});