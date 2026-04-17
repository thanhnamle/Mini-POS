import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenContainer from '../../../components/ScreenContainer';
import Header from '../../../components/Header';
import SectionCard from '../../../components/SectionCard';
import FormField from '../../../components/FormField';
import ActionButton from '../../../components/ActionButton';
import { createProduct, fetchProducts, updateProduct } from '../../../services/api';
import type { Product } from '../../../types/models';

interface FormState { name: string; category: string; price: string; stock: string; description: string; }
const empty: FormState = { name: '', category: '', price: '', stock: '', description: '' };

export default function ProductEdit() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editing = !!id;
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!editing) return;
    (async () => {
      try {
        setLoading(true);
        const items = await fetchProducts();
        const p = items.find((x) => String(x.productId ?? x.id) === String(id));
        if (p) setForm({
          name: p.name ?? '',
          category: p.category ?? '',
          price: String(p.price ?? ''),
          stock: String(p.stock ?? p.inventory ?? ''),
          description: p.description ?? '',
        });
      } catch (e) { Alert.alert('Could not load', e instanceof Error ? e.message : 'Unknown error'); }
      finally { setLoading(false); }
    })();
  }, [id, editing]);

  const onSave = async () => {
    if (!form.name.trim()) { Alert.alert('Missing', 'Product name is required.'); return; }
    const payload: Product = {
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      description: form.description.trim(),
    };
    try {
      setSaving(true);
      if (editing && id) await updateProduct(id, payload);
      else               await createProduct(payload);
      router.back();
    } catch (e) {
      Alert.alert('Save failed', e instanceof Error ? e.message : 'Unknown error');
    } finally { setSaving(false); }
  };

  return (
    <>
      <Header title={editing ? 'Edit product' : 'New product'} back />
      <ScreenContainer>
        <SectionCard title="Details">
          <FormField label="Name"        value={form.name}        onChangeText={(v) => setForm({ ...form, name: v })}        placeholder="e.g. Hand-poured candle" />
          <FormField label="Category"    value={form.category}    onChangeText={(v) => setForm({ ...form, category: v })}    placeholder="Home, Apparel, Pantry…" />
          <FormField label="Price"       value={form.price}       onChangeText={(v) => setForm({ ...form, price: v })}       placeholder="0.00" keyboardType="decimal-pad" />
          <FormField label="Stock"       value={form.stock}       onChangeText={(v) => setForm({ ...form, stock: v })}       placeholder="0" keyboardType="number-pad" />
          <FormField label="Description" value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} placeholder="Optional notes for staff" multiline />
        </SectionCard>
        <View style={{ height: 8 }} />
        <ActionButton title={editing ? 'Save changes' : 'Create product'} onPress={onSave} loading={saving || loading} />
        <View style={{ height: 12 }} />
        <ActionButton title="Cancel" variant="ghost" onPress={() => router.back()} />
      </ScreenContainer>
    </>
  );
}
