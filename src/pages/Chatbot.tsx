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

const App = () => {
    const [messages, setMessages] = useState([
        { id: '1', text: 'Hello! How can I assist you today?', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
        if (input.trim() === '') return;
        setMessages((prev) => [
            { id: Date.now().toString(), text: input, sender: 'user' },
            ...prev
        ]);
        setInput('');
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={styles.container}
        >
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <View
                        style={[
                            styles.message,
                            item.sender === 'user' ? styles.user : styles.bot,
                            index > 0 && messages[index - 1].sender === item.sender
                                ? styles.stacked
                                : null
                        ]}
                    >
                        <Text style={styles.text}>{item.text}</Text>
                    </View>
                )}
                inverted
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#bbb"
                    value={input}
                    onChangeText={setInput}
                />
                <TouchableOpacity 
                    style={styles.sendButton} 
                    onPress={sendMessage}
                    activeOpacity={0.7}
                >
                    <Text style={styles.sendText}>➤</Text>
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

export default App;
