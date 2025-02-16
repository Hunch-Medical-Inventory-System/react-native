import React, { useState } from 'react';
import { Surface, TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '@/utils/supabaseClient'; // Import Supabase client

type AuthPageProps = {
  onAuthSuccess: () => void;
};

const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      onAuthSuccess(); // Call onAuthSuccess if authentication is successful
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      onAuthSuccess(); // Call onAuthSuccess if registration is successful
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Surface style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        style={{ marginBottom: 10 }}
      />

      {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}

      <Button onPress={handleLogin} disabled={loading} >login</Button>
      <Button onPress={handleSignup} disabled={loading} >Sign Up</Button>
    </Surface>
  );
};

export default AuthPage;
