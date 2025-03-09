import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Chat, ChatbotState } from "@/types/chatbot";

type ChatData = {
  error: any,
  input: Chat
  response: Chat
}

// Async action for sending message
export const chat = createAsyncThunk(
  "chatbot/chat",
  async (message: string) => {
    let data: ChatData = {
      error: null,
      input: message,
      response: "",
    }
    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({question:message}),
      });
      const result = await response.json();

      if (result.error) data.error = result.error;
      data.response = result.response;
    } catch (error: any) {
      data.error = error
      throw new Error(error as string);
    }
    return data
  }
);

const initialState: ChatbotState = {
  loading: false,
  error: null,
  chatLog: [{type: 1, message: "How can I assist you today?"}],
};

const crewSlice = createSlice({
  name: "crew",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(chat.pending, (state) => {
        state.loading = true;
      })
      .addCase(chat.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.chatLog.push({
          type:0,
          message: action.payload.input
        });
        state.chatLog.push({
          type: 1,
          message: action.payload.response
        });
      })
      .addCase(chat.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default crewSlice.reducer;