
import React, { useState, useCallback } from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import {
    addShoppingItem,
    getShoppingList,
    toggleShoppingItem,
    deleteShoppingItem,
    clearPurchasedItems,
} from '../database/shoppingListData';

import colors from '../styles/colors';

export default function ShoppingListScreen() {
    const [items, setItems] = useState([]);
    const [ingredient, setIngredient] = useState('');
    const [loading, setLoading] = useState(true);

    // Load shopping list whenever screen becomes active
    const loadShoppingList = useCallback(async () => {
        try {
            const data = await getShoppingList();
            setItems(data);
        } catch (error) {
            console.log('Shopping list loading error:', error);
            Alert.alert('Error', 'Unable to load shopping list.');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadShoppingList();
        }, [loadShoppingList])
    );

    // Add a new shopping item
    const handleAddItem = async () => {
        if (!ingredient.trim()) {
            Alert.alert('Missing Ingredient', 'Please enter an ingredient.');
            return;
        }

        try {
            await addShoppingItem(ingredient.trim());
            setIngredient('');
            await loadShoppingList();
        } catch (error) {
            console.log('Add item error:', error);
            Alert.alert('Error', 'Unable to add shopping item.');
        }
    };

    // Mark item as purchased
    const handleToggleItem = async (item) => {
        try {
            await toggleShoppingItem(
                item.id,
                item.isPurchased === 1 ? 0 : 1
            );

            await loadShoppingList();
        } catch (error) {
            console.log('Update item error:', error);
            Alert.alert('Error', 'Unable to update shopping item.');
        }
    };

    // Delete an individual item
    const handleDeleteItem = (id) => {
        Alert.alert(
            'Delete Item',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteShoppingItem(id);
                            await loadShoppingList();
                        } catch (error) {
                            Alert.alert('Error', 'Unable to delete item.');
                        }
                    },
                },
            ]
        );
    };

    // Remove all purchased items
    const handleClearPurchased = () => {
        Alert.alert(
            'Clear Purchased Items',
            'Remove all purchased items from your list?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await clearPurchasedItems();
                            await loadShoppingList();
                        } catch (error) {
                            Alert.alert('Error', 'Unable to clear purchased items.');
                        }
                    },
                },
            ]
        );
    };

    const remainingItems = items.filter(
        item => item.isPurchased !== 1
    ).length;

    const purchasedItems = items.filter(
        item => item.isPurchased === 1
    ).length;

    // Shopping list item
    const renderItem = ({ item }) => (
        <View style={styles.itemCard}>
            <TouchableOpacity
                style={styles.checkbox}
                onPress={() => handleToggleItem(item)}
            >
                <Ionicons
                    name={
                        item.isPurchased === 1
                            ? 'checkbox'
                            : 'square-outline'
                    }
                    size={25}
                    color={colors.primary}
                />
            </TouchableOpacity>

            <View style={styles.itemContent}>
                <Text
                    style={[
                        styles.itemText,
                        item.isPurchased === 1 && styles.purchasedText,
                    ]}
                >
                    {item.ingredient}
                </Text>

                {item.recipeName ? (
                    <Text style={styles.recipeName}>
                        From: {item.recipeName}
                    </Text>
                ) : (
                    <Text style={styles.recipeName}>
                        Manually added
                    </Text>
                )}
            </View>

            <TouchableOpacity
                onPress={() => handleDeleteItem(item.id)}
                style={styles.deleteButton}
            >
                <Ionicons
                    name="trash-outline"
                    size={20}
                    color="#E05252"
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Shopping List 🛒</Text>
                <Text style={styles.subtitle}>
                    Keep track of everything you need.
                </Text>
            </View>

            {/* Summary */}
            <View style={styles.summaryCard}>
                <View>
                    <Text style={styles.summaryLabel}>
                        Remaining Items
                    </Text>
                    <Text style={styles.summaryNumber}>
                        {remainingItems}
                    </Text>
                </View>

                <View style={styles.summaryDivider} />

                <View>
                    <Text style={styles.summaryLabel}>
                        Purchased
                    </Text>
                    <Text style={styles.summaryNumber}>
                        {purchasedItems}
                    </Text>
                </View>
            </View>

            {/* Add Item */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add an ingredient..."
                    placeholderTextColor="#999"
                    value={ingredient}
                    onChangeText={setIngredient}
                    onSubmitEditing={handleAddItem}
                    returnKeyType="done"
                />

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddItem}
                >
                    <Ionicons name="add" size={26} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* List Heading */}
            <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>
                    My Ingredients
                </Text>

                {purchasedItems > 0 && (
                    <TouchableOpacity onPress={handleClearPurchased}>
                        <Text style={styles.clearText}>
                            Clear Purchased
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Shopping Items */}
            {loading ? (
                <Text style={styles.emptyText}>
                    Loading shopping list...
                </Text>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons
                                name="cart-outline"
                                size={65}
                                color="#C5C5C5"
                            />

                            <Text style={styles.emptyTitle}>
                                Your shopping list is empty
                            </Text>

                            <Text style={styles.emptyText}>
                                Add ingredients manually or from your favorite recipes.
                            </Text>
                        </View>
                    }
                />
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },

    header: {
        marginTop: 15,
        marginBottom: 20,
    },

    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: colors.text,
    },

    subtitle: {
        fontSize: 14,
        color: '#888',
        marginTop: 6,
    },

    summaryCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 22,
        elevation: 2,
    },

    summaryLabel: {
        color: '#888',
        fontSize: 13,
    },

    summaryNumber: {
        fontSize: 25,
        fontWeight: 'bold',
        color: colors.primary,
        marginTop: 5,
    },

    summaryDivider: {
        width: 1,
        height: 45,
        backgroundColor: colors.border,
    },

    inputContainer: {
        flexDirection: 'row',
        marginBottom: 25,
        gap: 10,
    },

    input: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 15,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
    },

    addButton: {
        width: 52,
        height: 52,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },

    clearText: {
        color: '#E05252',
        fontSize: 13,
        fontWeight: '600',
    },

    listContent: {
        paddingBottom: 25,
        flexGrow: 1,
    },

    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 1,
    },

    checkbox: {
        marginRight: 12,
    },

    itemContent: {
        flex: 1,
    },

    itemText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
    },

    purchasedText: {
        textDecorationLine: 'line-through',
        color: '#999',
    },

    recipeName: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },

    deleteButton: {
        padding: 8,
    },

    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingVertical: 50,
    },

    emptyTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 15,
    },

    emptyText: {
        fontSize: 13,
        color: '#999',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
});
