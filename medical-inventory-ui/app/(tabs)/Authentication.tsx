import React, { useState } from 'react';
import { TextInput, Button, Text, HelperText, Surface } from 'react-native-paper'; // Import Surface
import { supabase } from '@/app/utils/supabaseClient'; // Adjust the import if needed

const AuthPage = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true); // Toggle between sign up and sign in
  const [errorMessage, setErrorMessage] = useState('');

  // Sign up handler
  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('');
      onAuthSuccess(); // Call the parent function on successful auth
    }
  };

  // Sign in handler
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('');
      onAuthSuccess(); // Call the parent function on successful auth
    }
  };

  return (
    <Surface style={{ flex: 1, justifyContent: 'center', padding: 20, elevation: 4 }}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={{ marginBottom: 10 }}
      />

      {errorMessage ? (
        <HelperText type="error" visible={true}>
          {errorMessage}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        onPress={isSignUp ? handleSignUp : handleSignIn}
        style={{ marginTop: 20 }}
      >
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Button>

      <Button
        mode="text"
        onPress={() => setIsSignUp(!isSignUp)}
        style={{ marginTop: 10 }}
      >
        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </Button>
    </Surface>
  );
};

export default AuthPage;
