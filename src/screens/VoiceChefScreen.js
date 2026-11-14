
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';

export default function VoiceChefScreen({ route, navigation }) {
    const { recipe } = route.params;

    const instructions = React.useMemo(() => {
        let data = recipe.instructions;

        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch {
                data = [data];
            }
        }

        return Array.isArray(data) ? data : [];
    }, [recipe.instructions]);

    const [currentStep, setCurrentStep] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speakStep = async (stepIndex) => {
        if (!instructions[stepIndex]) return;

        await Speech.stop();

        Speech.speak(
            `Step ${stepIndex + 1}. ${instructions[stepIndex]}`,
            {
                language: 'en-US',
                pitch: 1.0,
                rate: 0.9,
                onStart: () => setIsSpeaking(true),
                onDone: () => setIsSpeaking(false),
                onStopped: () => setIsSpeaking(false),
                onError: () => setIsSpeaking(false),
            }
        );
    };

    useEffect(() => {
        speakStep(currentStep);

        return () => {
            Speech.stop();
        };
    }, [currentStep]);

    const nextStep = () => {
        if (currentStep < instructions.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const previousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const repeatStep = () => {
        speakStep(currentStep);
    };

    const stopSpeaking = async () => {
        await Speech.stop();
        setIsSpeaking(false);
    };

    if (instructions.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    No cooking instructions available.
                </Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.recipeName}>{recipe.name}</Text>

            <Text style={styles.subtitle}>
                Your personal cooking assistant
            </Text>

            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                    STEP {currentStep + 1} OF {instructions.length}
                </Text>

                <View style={styles.progressBackground}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${((currentStep + 1) / instructions.length) * 100
                                    }%`,
                            },
                        ]}
                    />
                </View>
            </View>

            <View style={styles.instructionCard}>
                <Ionicons
                    name="restaurant-outline"
                    size={42}
                    color={colors.primary}
                />

                <Text style={styles.stepTitle}>
                    Step {currentStep + 1}
                </Text>

                <Text style={styles.instructionText}>
                    {instructions[currentStep]}
                </Text>

                <TouchableOpacity
                    style={styles.speakButton}
                    onPress={repeatStep}
                >
                    <Ionicons name="volume-high" size={22} color="#FFFFFF" />
                    <Text style={styles.speakButtonText}>
                        Repeat Instruction
                    </Text>
                </TouchableOpacity>

                {isSpeaking && (
                    <TouchableOpacity
                        style={styles.stopButton}
                        onPress={stopSpeaking}
                    >
                        <Ionicons name="stop-circle-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.speakButtonText}>Stop Reading</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    style={[
                        styles.navigationButton,
                        currentStep === 0 && styles.disabledButton,
                    ]}
                    onPress={previousStep}
                    disabled={currentStep === 0}
                >
                    <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
                    <Text style={styles.navigationText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.navigationButton,
                        currentStep === instructions.length - 1 &&
                        styles.disabledButton,
                    ]}
                    onPress={nextStep}
                    disabled={currentStep === instructions.length - 1}
                >
                    <Text style={styles.navigationText}>Next</Text>
                    <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {currentStep === instructions.length - 1 && (
                <Text style={styles.completedText}>
                    🎉 You've reached the final step!
                </Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: colors.background,
        padding: 22,
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 17,
        color: colors.text,
        marginBottom: 20,
    },
    backText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    recipeName: {
        fontSize: 27,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#777777',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 30,
    },
    progressContainer: {
        marginBottom: 25,
    },
    progressText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 10,
    },
    progressBackground: {
        height: 8,
        backgroundColor: '#E5E5E5',
        borderRadius: 10,
        overflow: 'hidden',
    },
    progressFill: {
        height: 8,
        backgroundColor: colors.primary,
        borderRadius: 10,
    },
    instructionCard: {
        backgroundColor: colors.surface,
        padding: 25,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    stepTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 18,
        marginBottom: 15,
    },
    instructionText: {
        fontSize: 18,
        color: colors.text,
        lineHeight: 29,
        textAlign: 'center',
    },
    speakButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginTop: 28,
        gap: 10,
    },
    stopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#B83232',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginTop: 12,
        gap: 10,
    },
    speakButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
        gap: 15,
    },
    navigationButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 12,
        gap: 5,
    },
    disabledButton: {
        opacity: 0.35,
    },
    navigationText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
    completedText: {
        textAlign: 'center',
        marginTop: 25,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
});
