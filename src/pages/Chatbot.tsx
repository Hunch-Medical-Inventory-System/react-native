import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store';
import { chat } from '@/store/chatbotSlice';
import type { RootState, AppDispatch } from '@/store';

const Chatbot = () => {

    const dispatch: AppDispatch = useAppDispatch();
    const loading = useSelector((state: RootState) => state.chatbot.loading);
    const error = useSelector((state: RootState) => state.chatbot.error);
    const chatLog = useSelector((state: RootState) => state.chatbot.chatLog);

    const [question, setQuestion] = useState('');

    const askQuestion = async () => {
        if (question.trim() === '') return;
        dispatch(chat(question));
        setQuestion('');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' || 'android' ? 'padding' : 'height'}
            style={styles.container}
        >
            <FlatList
                data={chatLog}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View
                        style={[
                            styles.message,
                            item.type === 0 ? styles.user : styles.bot,
                            index > 0 && chatLog[index - 1].type === item.type
                                ? styles.stacked
                                : null
                        ]}
                    >
                        <Text style={styles.text}>{item.message}</Text>
                    </View>
                )}
                inverted
            />

            {error && <Text>{error}</Text>}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#bbb"
                    value={question}
                    onChangeText={setQuestion}
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={askQuestion}
                    activeOpacity={0.7}
                >
                    <Text style={styles.sendText}>➤ {loading ? '...' : 'Send'}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181818',
        padding: 12,
        justifyContent: 'flex-end',
    },
    message: {
        maxWidth: '80%',
        padding: 14,
        marginVertical: 4,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    user: {
        backgroundColor: '#E94560',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 5,
    },
    bot: {
        backgroundColor: '#2A2A2A',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 5,
    },
    stacked: {
        marginTop: -5,
        borderRadius: 12,
    },
    text: {
        color: '#fff',
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#222',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        padding: 10,
    },
    sendButton: {
        backgroundColor: '#E94560',
        padding: 12,
        borderRadius: 24,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendText: {
        color: '#fff',
        fontSize: 20,
    },
});

export default Chatbot;
