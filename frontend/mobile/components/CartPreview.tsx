import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../ctx/CartContext';

interface CartPreviewProps {
  visible: boolean;
  onClose: () => void;
}

export default function CartPreview({ visible, onClose }: CartPreviewProps) {
  const router = useRouter();
  const { cart, totalAmount, itemCount, removeFromCart, prepareCheckout } = useCart();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable 
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]} 
          onPress={onClose}
        />
        
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Cart Preview</Text>
              <Text style={styles.modalSub}>REVIEW ITEMS BEFORE CHECKOUT</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#111111" />
            </Pressable>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {cart.length === 0 ? (
              <View style={styles.emptyCart}>
                <Ionicons name="bag-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyText}>Your bag is empty</Text>
              </View>
            ) : (
              cart.map((item, index) => (
                <View key={`${item.id}-${item.selectedSize}-${index}`} style={styles.previewItem}>
                  <View style={[styles.previewItemThumb, { backgroundColor: item.surface }]}>
                    <Ionicons name={item.icon} size={32} color={item.iconColor} />
                  </View>
                  <View style={styles.previewItemInfo}>
                    <Text style={styles.previewItemName}>{item.name}</Text>
                    <Text style={styles.previewItemPrice}>${item.price.toFixed(2)}</Text>
                    <View style={styles.previewItemMeta}>
                      <Text style={styles.previewItemQty}>QTY {item.quantity}</Text>
                      <Text style={styles.previewItemVariant}>SIZE {item.selectedSize}</Text>
                    </View>
                  </View>
                  <Pressable 
                    style={styles.removeItemBtn} 
                    onPress={() => removeFromCart(item.id, item.selectedSize)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#FF4B4B" />
                  </Pressable>
                </View>
              ))
            )}

            {cart.length > 0 && (
              <View style={styles.giftWrapBox}>
                <Ionicons name="gift-outline" size={16} color="#8C8478" />
                <Text style={styles.giftWrapText}>Gift wrap with handwritten note for delivery.</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
                <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
              </View>
              <Text style={styles.taxNote}>Tax included{'\n'}{itemCount} items total</Text>
            </View>

            <Pressable 
              style={[styles.proceedBtn, cart.length === 0 && styles.disabledBtn]}
              disabled={cart.length === 0}
              onPress={() => {
                prepareCheckout();
                onClose();
                router.push('/(shop)/checkout');
              }}
            >
              <Text style={styles.proceedBtnText}>PROCEED TO ORDER</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#F6F6F4',
    borderRadius: 32,
    padding: 32,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -1,
  },
  modalSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8C8478',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EAE6DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: {
    marginBottom: 24,
  },
  emptyCart: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  previewItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  previewItemThumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  previewItemName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 2,
  },
  previewItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  previewItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  previewItemQty: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8C8478',
    backgroundColor: '#EAE6DE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  previewItemVariant: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8C8478',
  },
  removeItemBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  giftWrapBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  giftWrapText: {
    fontSize: 10,
    color: '#8C8478',
    flex: 1,
    lineHeight: 14,
  },
  modalFooter: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#EAE6DE',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8C8478',
    letterSpacing: 1,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111111',
  },
  taxNote: {
    fontSize: 10,
    color: '#8C8478',
    textAlign: 'right',
  },
  proceedBtn: {
    height: 56,
    backgroundColor: '#111111',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  disabledBtn: {
    backgroundColor: '#D1D5DB',
  },
  proceedBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
