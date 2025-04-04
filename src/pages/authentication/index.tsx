import React, { useState, useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Surface, TextInput, Button, Text } from 'react-native-paper';
import supabase from '@/utils/supabaseClient';

type AuthPageProps = {
  onAuthSuccess: () => void;
};

const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Animate the form when the component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onAuthSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError(null);

    if (!email || !password || !firstName || !lastName) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const { data, error } = await supabase.client.auth.signUp({ email, password });
      if (error) throw error;
      onAuthSuccess();

      if (!data.user?.id) throw new Error('User ID not found');
      const success = await supabase.updateRowInTable('crew', { id: data.user.id, first_name: firstName, last_name: lastName });
      if (!success) throw new Error('Failed to update user information');

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Surface
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#121212',
      }}
    >
      <Animated.View
        style={{
          width: '100%',
          maxWidth: 400,
          padding: 20,
          backgroundColor: '#1E1E1E',
          borderRadius: 12,
          shadowOpacity: 0.4,
          shadowOffset: { width: 0, height: 5 },
          elevation: 10,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: '#E94560',
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
        >
          Welcome Back
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ marginBottom: 10, backgroundColor: '#292929' }}
          theme={{ colors: { primary: '#E94560', text: '#fff' } }}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          style={{ marginBottom: 10, backgroundColor: '#292929' }}
          theme={{ colors: { primary: '#E94560', text: '#fff' } }}
        />

        <Text
          style={{
            textAlign: 'center',
            color: '#E94560',
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 20,
          }}
        >
          Sign Up Addition
        </Text>

        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
          style={{ marginBottom: 10, backgroundColor: '#292929' }}
          theme={{ colors: { primary: '#E94560', text: '#fff' } }}
        />

        <TextInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter your last name"
          style={{ marginBottom: 10, backgroundColor: '#292929' }}
          theme={{ colors: { primary: '#E94560', text: '#fff' } }}
        />

        {error && (
          <Text style={{ color: '#ff4d4d', textAlign: 'center', fontSize: 14, marginBottom: 10 }}>
            {error}
          </Text>
        )}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          style={{
            marginBottom: 10,
            backgroundColor: '#E94560',
            borderRadius: 20,
          }}
          labelStyle={{ fontSize: 16, color: '#fff' }} // Ensure white text
        >
          Login
        </Button>

        <Button
          mode="outlined"
          onPress={handleSignup}
          disabled={loading}
          theme={{ colors: { primary: '#E94560' } }}
          style={{
            borderColor: '#E94560',
            borderWidth: 2,
            borderRadius: 20,
          }}
          labelStyle={{ fontSize: 16, color: '#E94560' }}
        >
          Sign Up
        </Button>

        <Surface>
          <Text
            style={{
              textAlign: 'center',
              color: '#E94560',
              fontSize: 14,
              marginTop: 10,
            }}
          >
            Demo
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: '#E94560',
              fontSize: 14,
              marginTop: 10,
            }}
          >
            Email: test@example.com
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: '#E94560',
              fontSize: 14,
              marginTop: 10,
            }}
          >
            Password: password
          </Text>
        </Surface>
      </Animated.View>
    </Surface>
  );
};

export default AuthPage;