import { colors, radii, shadows } from '@/constants/theme';
import { useUser } from '@/providers/AuthProvider';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';

export default function CreatePostScreen() {
    const { isLogged, accessToken, isGuest } = useUser();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [price, setPrice] = useState('');
    const [latitude, setLatitude] = useState<string>('');
    const [longitude, setLongitude] = useState<string>('');
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    // Image states
    const [imageRawBase64, setImageRawBase64] = useState<string | null>(null); // pure base64 sans prefixe
    const [imageMime, setImageMime] = useState<string | null>(null);
    const [imageUri, setImageUri] = useState<string | null>(null); // URI locale (fallback)
    const [imageDataUri, setImageDataUri] = useState<string | null>(null); // data:<mime>;base64,<...>

    const [mapVisible, setMapVisible] = useState(false);
    const [pendingCoord, setPendingCoord] = useState<{ lat: number; lng: number } | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const initialRegion: Region = {
        latitude: 46.7,
        longitude: 2.5,
        latitudeDelta: 6,
        longitudeDelta: 6,
    };

    const onMapPress = (e: MapPressEvent) => {
        const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
        setPendingCoord({ lat, lng });
    };

    const confirmCoord = () => {
        if (pendingCoord) {
            setLatitude(pendingCoord.lat.toFixed(6));
            setLongitude(pendingCoord.lng.toFixed(6));
            setMapVisible(false);
        }
    };

    const pickImage = useCallback(async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
            Alert.alert('Permission', 'Autorisez l\'accès aux images.');
            return;
        }
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            quality: 0.85,
            exif: false,
        });
        if (!res.canceled && res.assets?.length) {
            const asset = res.assets[0];
            if (asset.base64) {
                let cleaned = asset.base64.replace(/\s/g, '');
                // Padding si nécessaire
                while (cleaned.length % 4 !== 0) cleaned += '=';
                const isValid = /^[A-Za-z0-9+/=]+$/.test(cleaned);
                if (!isValid) {
                    Alert.alert('Erreur', 'Encodage base64 invalide.');
                    return;
                }
                const mime = asset.mimeType || 'image/jpeg';
                setImageRawBase64(cleaned);
                setImageMime(mime);
                setImageUri(asset.uri || null);
                setImageDataUri(`data:${mime};base64,${cleaned}`);
            }
        }
    }, []);

    // Nouvelle fonction pour prendre une photo avec la caméra
    const captureImage = useCallback(async () => {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
            Alert.alert('Permission', 'Autorisez l\'accès à la caméra.');
            return;
        }
        const res = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            base64: true,
            quality: 0.85,
        });
        if (!res.canceled && res.assets?.length) {
            const asset = res.assets[0];
            if (asset.base64) {
                let cleaned = asset.base64.replace(/\s/g, '');
                while (cleaned.length % 4 !== 0) cleaned += '=';
                const isValid = /^[A-Za-z0-9+/=]+$/.test(cleaned);
                if (!isValid) {
                    Alert.alert('Erreur', 'Encodage base64 invalide.');
                    return;
                }
                const mime = asset.mimeType || 'image/jpeg';
                setImageRawBase64(cleaned);
                setImageMime(mime);
                setImageUri(asset.uri || null);
                setImageDataUri(`data:${mime};base64,${cleaned}`);
            }
        }
    }, []);

    const removeImage = () => { setImageRawBase64(null); setImageMime(null); setImageUri(null); setImageDataUri(null); };

    const resetForm = () => {
        setTitle(''); setContent(''); setPrice(''); setLatitude(''); setLongitude(''); setContactName(''); setContactPhone('');
        setImageRawBase64(null); setImageMime(null); setImageUri(null); setImageDataUri(null); setPendingCoord(null);
    };

    const prefillAdmin = () => {
        setTitle('Exemple de titre attrayant');
        setContent('Description détaillée du post avec toutes les informations nécessaires pour tester la création.');
        setPrice('199.99');
        const lat = 48.856614; const lng = 2.3522219; // Paris
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        setContactName('Jean Dupont');
        setContactPhone('+33123456789');
        setPendingCoord({ lat, lng });
    };

    const onSubmit = async () => {
        if (!isLogged || !accessToken) { Alert.alert('Non autorisé', 'Connectez-vous.'); return; }
        if (!title || !content || !price || !latitude || !longitude || !contactName || !contactPhone) {
            Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires.');
            return;
        }
        if (submitting) return;
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('title', title);
            fd.append('content', content);
            fd.append('price', price);
            fd.append('latitude', latitude);
            fd.append('longitude', longitude);
            fd.append('contact_name', contactName);
            fd.append('contact_phone', contactPhone);
            if (imageRawBase64 && imageMime && imageDataUri) {
                fd.append('image_base64', imageDataUri);
            }
            await axios.post('https://crudme.mindlens.fr/api/posts', fd, { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' } });
            resetForm();
            // Redirige avec paramètres flash
            router.replace({ pathname: '/(tabs)', params: { flash: 'created', msg: encodeURIComponent('Post créé avec succès') } });
        } catch (e: any) {
            Alert.alert('Erreur', e?.response?.data?.message || 'Création impossible');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.header}>
                    <Text style={styles.headerTitle}>Créer un Post</Text>
                    <Text style={styles.headerSubtitle}>Ajoutez un nouveau contenu</Text>
                </LinearGradient>
                <View style={styles.card}>
                    {isLogged && !isGuest && (
                        <Pressable onPress={prefillAdmin} style={[styles.smallButton, styles.prefillButton]}>
                            <Text style={styles.prefillText}>Préremplir (admin)</Text>
                        </Pressable>
                    )}
                    <Text style={styles.sectionTitle}>Informations</Text>
                    <TextInput style={styles.input} placeholder="Titre *" placeholderTextColor={colors.subText} value={title} onChangeText={setTitle} />
                    <TextInput style={[styles.input, styles.textarea]} placeholder="Contenu *" placeholderTextColor={colors.subText} value={content} onChangeText={setContent} multiline textAlignVertical="top" />
                    <TextInput style={styles.input} placeholder="Prix (€) *" placeholderTextColor={colors.subText} keyboardType="decimal-pad" value={price} onChangeText={setPrice} />

                    <View style={styles.row}> 
                        <TextInput style={[styles.input, styles.coordInput]} placeholder="Latitude *" placeholderTextColor={colors.subText} value={latitude} onChangeText={setLatitude} />
                        <TextInput style={[styles.input, styles.coordInput]} placeholder="Longitude *" placeholderTextColor={colors.subText} value={longitude} onChangeText={setLongitude} />
                    </View>
                    <Pressable onPress={() => setMapVisible(true)} style={styles.outlineButton}><Text style={styles.outlineButtonText}>{latitude && longitude ? 'Modifier la position' : 'Choisir la position sur la carte'}</Text></Pressable>

                    <Text style={styles.sectionTitle}>Contact</Text>
                    <TextInput style={styles.input} placeholder="Nom du contact *" placeholderTextColor={colors.subText} value={contactName} onChangeText={setContactName} />
                    <TextInput style={styles.input} placeholder="Téléphone du contact *" placeholderTextColor={colors.subText} value={contactPhone} onChangeText={setContactPhone} keyboardType="phone-pad" />

                    <Text style={styles.sectionTitle}>Image (optionnel)</Text>
                    {imageRawBase64 ? (
                        <View style={styles.imagePreviewBox}>
                            <View style={styles.imagePreviewInner}>
                                {imageDataUri ? (
                                    <Image
                                        source={{ uri: imageDataUri }}
                                        style={styles.imageReal}
                                        resizeMode="contain"
                                    />
                                ) : (
                                    <View style={styles.imagePreviewPlaceholder} />
                                )}
                                <Text style={styles.imageSelectedText}>Image sélectionnée</Text>
                            </View>
                            <View style={styles.imageButtonsRow}>
                                <Pressable onPress={pickImage} style={[styles.smallButton, styles.primaryButton]}><Text style={styles.smallButtonText}>Galerie</Text></Pressable>
                                <Pressable onPress={captureImage} style={[styles.smallButton, styles.primaryButton]}><Text style={styles.smallButtonText}>Photo</Text></Pressable>
                                <Pressable onPress={removeImage} style={[styles.smallButton, styles.dangerButton]}><Text style={styles.smallButtonText}>Supprimer</Text></Pressable>
                            </View>
                        </View>
                    ) : (
                        // Deux options : galerie ou caméra
                        <View>
                            <Pressable onPress={pickImage} style={styles.dashedBox}><Text style={styles.dashedText}>Choisir une image (galerie)</Text></Pressable>
                            <Pressable onPress={captureImage} style={styles.dashedBox}><Text style={styles.dashedText}>Prendre une photo</Text></Pressable>
                        </View>
                    )}

                    <View style={styles.actionsRow}>
                        <Pressable onPress={onSubmit} disabled={submitting} style={[styles.submitButton, submitting && { opacity: 0.7 }]}><Text style={styles.submitButtonText}>{submitting ? 'Enregistrement...' : 'Enregistrer'}</Text></Pressable>
                        <Pressable onPress={resetForm} style={styles.cancelButton}><Text style={styles.cancelButtonText}>Annuler</Text></Pressable>
                    </View>
                </View>
            </ScrollView>
            <Modal visible={mapVisible} animationType="fade" transparent onRequestClose={() => setMapVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Choisir la position</Text>
                        <MapView style={styles.map} initialRegion={initialRegion} onPress={onMapPress}>
                            {pendingCoord && (
                                <Marker draggable coordinate={{ latitude: pendingCoord.lat, longitude: pendingCoord.lng }} onDragEnd={(e) => setPendingCoord({ lat: e.nativeEvent.coordinate.latitude, lng: e.nativeEvent.coordinate.longitude })} />
                            )}
                        </MapView>
                        <Text style={styles.coordPreview}>{pendingCoord ? `${pendingCoord.lat.toFixed(6)}, ${pendingCoord.lng.toFixed(6)}` : 'Aucune position sélectionnée.'}</Text>
                        <View style={styles.modalButtons}>
                            <Pressable onPress={() => setMapVisible(false)} style={[styles.smallButton, styles.outlineSmall]}><Text style={styles.outlineButtonText}>Annuler</Text></Pressable>
                            <Pressable disabled={!pendingCoord} onPress={confirmCoord} style={[styles.smallButton, !pendingCoord ? { opacity: 0.5 } : styles.primaryButton]}>
                                {!pendingCoord ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.smallButtonText}>Valider</Text>}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { paddingBottom: 80 },
    header: { paddingTop: 120, paddingBottom: 50, paddingHorizontal: 24, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, ...shadows.card },
    headerTitle: { fontSize: 34, fontWeight: '800', color: '#fff', marginBottom: 8 },
    headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
    card: { marginTop: -30, marginHorizontal: 24, backgroundColor: colors.card, borderRadius: radii.lg, padding: 24, borderWidth: 1, borderColor: colors.border, ...shadows.card },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 8, marginBottom: 12, color: colors.text },
    input: { borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', borderRadius: radii.md, padding: 14, marginBottom: 14, fontSize: 15, color: colors.text },
    textarea: { height: 140 },
    row: { flexDirection: 'row', gap: 12 },
    coordInput: { flex: 1 },
    outlineButton: { borderWidth: 1, borderColor: colors.primary, paddingVertical: 12, paddingHorizontal: 16, borderRadius: radii.pill, alignItems: 'center', marginBottom: 8 },
    outlineButtonText: { color: colors.primary, fontWeight: '600' },
    dashedBox: { borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primary, padding: 22, borderRadius: radii.md, alignItems: 'center', marginBottom: 20 },
    dashedText: { color: colors.primary, fontWeight: '600' },
    imagePreviewBox: { marginBottom: 20 },
    imagePreviewInner: { backgroundColor: '#f2f4ff', padding: 30, borderRadius: radii.md, alignItems: 'center' },
    imagePreviewPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, opacity: 0.2, marginBottom: 12 },
    imageReal: { width: '100%', height: 160, marginBottom: 12, borderRadius: 12 },
    imageSelectedText: { color: colors.text, fontWeight: '600' },
    imageButtonsRow: { flexDirection: 'row', gap: 12, marginTop: 12, justifyContent: 'center' },
    smallButton: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: radii.pill },
    primaryButton: { backgroundColor: colors.primary },
    dangerButton: { backgroundColor: colors.danger },
    smallButtonText: { color: '#fff', fontWeight: '600' },
    actionsRow: { flexDirection: 'row', gap: 14, marginTop: 10 },
    submitButton: { flex: 1, backgroundColor: colors.success, paddingVertical: 16, borderRadius: radii.pill, alignItems: 'center' },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    cancelButton: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: radii.pill, backgroundColor: colors.danger, alignItems: 'center' },
    cancelButtonText: { color: '#fff', fontWeight: '600' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#fff', borderRadius: radii.lg, padding: 16, maxHeight: '85%' },
    modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, color: colors.text },
    map: { width: '100%', height: 300, borderRadius: radii.md, marginBottom: 12 },
    coordPreview: { textAlign: 'center', color: colors.subText, marginBottom: 12 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    outlineSmall: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary, borderRadius: radii.pill },
    prefillButton:{ alignSelf:'flex-end', marginBottom:8, backgroundColor: colors.primary, paddingVertical:8, paddingHorizontal:16, borderRadius: radii.pill },
    prefillText:{ color:'#fff', fontWeight:'600', fontSize:12 },
});