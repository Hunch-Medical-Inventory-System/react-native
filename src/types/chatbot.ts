export type Chat = string
export type Message = {
  type: 0 | 1
  message: string
}
export type ChatbotState = {
  loading: boolean;
  error: null;
  chatLog: Message[]
};